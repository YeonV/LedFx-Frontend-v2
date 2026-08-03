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
  const checkForUpdate = useCallback(async () => {
    if (!isAndroidApp()) return
    setChecking(true)
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`
      )
      if (!res.ok) {
        console.error(`Failed to fetch latest APK version: ${res.status}`)
        return
      }

      const release = await res.json()
      const tagName = release.tag_name as string
      setLatestVersion(tagName)

      const latest = tagName.replace('v', '')
      const current = currentVersion

      const isUpdateAvailable =
        latest.includes('-b') && current.includes('-b')
          ? compareVersions(latest.split('-b')[1], current.split('-b')[1]) === 1
          : compareVersions(latest, current) === 1

      setUpdateAvailable(isUpdateAvailable)
    } catch (error) {
      console.error('Error checking for APK update:', error)
    } finally {
      setChecking(false)
    }
  }, [repoOwner, repoName, currentVersion])

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
