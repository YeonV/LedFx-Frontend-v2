import { useState, useEffect, useCallback } from 'react'
import { compareVersions } from 'compare-versions'
import {
  getAndroidAbi,
  downloadAndInstallApk,
  isAndroidApp,
  canInstallPackages
} from './android.bridge'
import pkg from '../../../package.json'

interface AndroidUpdateConfig {
  repoOwner?: string
  repoName?: string
  enabled?: boolean
}

/**
 * Latest release tag, cached for the lifetime of the page.
 *
 * Several components use this hook (App, About, the FireTV bar) and each mount
 * used to fire its own request at GitHub's unauthenticated API. One lookup per
 * app launch is plenty - the "Re-check" button passes force to bypass it.
 */
let cachedTag: string | null = null
let inflight: Promise<string | null> | null = null

/**
 * Split a tag into its release version and build number: v2.1.6-b21 -> 2.1.6, 21.
 *
 * The build number has to be compared numerically. Treating the whole string as
 * a semver prerelease would order b9 above b10, since that comparison is
 * lexical.
 */
const versionParts = (version: string): { base: string; build: number } => {
  const [base, build] = version.replace(/^v/, '').split('-b')
  // No -b suffix means a final release, which outranks every beta of the same
  // base - 2.1.6 is newer than 2.1.6-b21, not older.
  return { base, build: build === undefined ? Infinity : parseInt(build, 10) }
}

/** Standard comparator: positive when `a` is the newer build. */
const compareTags = (a: string, b: string): number => {
  const left = versionParts(a)
  const right = versionParts(b)
  const base = compareVersions(left.base, right.base)
  if (base !== 0) return base
  // Subtracting would yield NaN when both are final releases (Infinity).
  if (left.build === right.build) return 0
  return left.build < right.build ? -1 : 1
}

/** Whether `tag` describes a newer build than the running one. */
const isNewer = (tag: string, currentVersion: string): boolean =>
  compareTags(tag, currentVersion) > 0

const fetchLatestTag = (
  repoOwner: string,
  repoName: string,
  force: boolean
): Promise<string | null> => {
  if (!force && cachedTag !== null) return Promise.resolve(cachedTag)
  if (!force && inflight) return inflight

  const request = (async () => {
    // Deliberately not /releases/latest: that endpoint skips pre-releases, and
    // every Android beta so far has been one - it answers "b19" to a phone
    // already running b21. The list endpoint includes them, but orders by
    // created_at rather than version, so pick the newest tag ourselves.
    const res = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/releases?per_page=30`
    )
    if (!res.ok) {
      console.error(`Failed to fetch latest APK version: ${res.status}`)
      return null
    }
    const releases = await res.json()
    const tags = (Array.isArray(releases) ? releases : [])
      .filter((release) => !release.draft && typeof release.tag_name === 'string')
      .map((release) => release.tag_name as string)
    if (!tags.length) return null

    cachedTag = tags.reduce((best, tag) => (compareTags(tag, best) > 0 ? tag : best))
    return cachedTag
  })()

  inflight = request
  request
    .catch(() => undefined)
    .then(() => {
      if (inflight === request) inflight = null
    })
  return request
}

export const useAndroidUpdateChecker = ({
  repoOwner = 'YeonV',
  repoName = 'LedFx-Builds',
  enabled = true
}: AndroidUpdateConfig = {}) => {
  const [latestVersion, setLatestVersion] = useState<string | null>(null)
  const currentVersion = pkg.version
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [checking, setChecking] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [needsInstallPermission, setNeedsInstallPermission] = useState(false)

  // Exposed as well as run on mount, so a "Check for Update" button can
  // re-query rather than only reporting whatever was fetched at mount.
  // Pass force to bypass the per-launch cache.
  const checkForUpdate = useCallback(
    async (force = false) => {
      if (!isAndroidApp()) return
      setChecking(true)
      try {
        const tagName = await fetchLatestTag(repoOwner, repoName, force)
        if (!tagName) return
        setLatestVersion(tagName)
        setUpdateAvailable(isNewer(tagName, currentVersion))
      } catch (error) {
        console.error('Error checking for APK update:', error)
      } finally {
        setChecking(false)
      }
    },
    [repoOwner, repoName, currentVersion]
  )

  useEffect(() => {
    if (!enabled || !isAndroidApp()) return
    checkForUpdate()
  }, [enabled, checkForUpdate])

  // While waiting on the grant the user is in the Android settings app. On
  // return the native side resumes the download by itself, so pick that up
  // instead of leaving a stale "allow install" prompt on screen.
  useEffect(() => {
    if (!needsInstallPermission) return undefined

    const recheck = () => {
      if (document.visibilityState !== 'visible') return
      if (!canInstallPackages()) return
      setNeedsInstallPermission(false)
      setDownloading(true)
      setTimeout(() => setDownloading(false), 30000)
    }

    document.addEventListener('visibilitychange', recheck)
    window.addEventListener('focus', recheck)
    return () => {
      document.removeEventListener('visibilitychange', recheck)
      window.removeEventListener('focus', recheck)
    }
  }, [needsInstallPermission])

  const handleUpdate = () => {
    if (!latestVersion) return
    let abi = getAndroidAbi()
    if (abi === 'unknown') {
      console.error('Cannot determine CPU architecture')
      abi = 'armeabi-v7a'
    }
    const apkUrl = `https://github.com/${repoOwner}/${repoName}/releases/download/${latestVersion}/LedFx_CC-${latestVersion}--android-${abi}-release.apk`

    // Without the "Install unknown apps" grant the native side sends the user
    // to settings and resumes on return, so don't show a download spinner that
    // would sit there for 30s while they are in a different app.
    if (!canInstallPackages()) {
      setNeedsInstallPermission(true)
      downloadAndInstallApk(apkUrl)
      return
    }

    setNeedsInstallPermission(false)
    setDownloading(true)
    downloadAndInstallApk(apkUrl)

    // Reset downloading state after a delay (download happens in background)
    setTimeout(() => setDownloading(false), 30000)
  }

  return {
    currentVersion,
    latestVersion,
    updateAvailable,
    checking,
    downloading,
    /** True when the update was deferred pending the install-unknown-apps grant. */
    needsInstallPermission,
    /** Re-query the latest release; runs on mount too. */
    checkForUpdate,
    handleUpdate
  }
}
