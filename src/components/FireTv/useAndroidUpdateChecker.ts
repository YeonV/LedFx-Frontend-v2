import { useState, useEffect } from 'react'
import { compareVersions } from 'compare-versions'
import { getAndroidAbi, downloadAndInstallApk, isAndroidApp } from './android.bridge'
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

  useEffect(() => {
    if (!enabled || !isAndroidApp()) return

    const checkForUpdate = async () => {
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
    }

    checkForUpdate()
  }, [enabled, repoOwner, repoName, currentVersion])

  const handleUpdate = () => {
    if (!latestVersion) return

    const abi = getAndroidAbi()
    if (abi === 'unknown') {
      console.error('Cannot determine CPU architecture')
      return
    }

    // Build download URL
    // Format: https://github.com/YeonV/LedFx-Builds/releases/download/v2.1.3-b12/LedFx_CC-v2.1.3-b12--android-armeabi-v7a-release.apk
    const apkUrl = `https://github.com/${repoOwner}/${repoName}/releases/download/${latestVersion}/LedFx_CC-${latestVersion}--android-${abi}-release.apk`

    console.log(`Downloading APK from: ${apkUrl}`)
    setDownloading(true)
    downloadAndInstallApk(apkUrl)

    // Reset downloading state after a delay (download happens in background)
    setTimeout(() => setDownloading(false), 3000)
  }

  return {
    currentVersion,
    latestVersion,
    updateAvailable,
    checking,
    downloading,
    handleUpdate
  }
}
