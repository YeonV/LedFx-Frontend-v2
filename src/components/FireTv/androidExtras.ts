import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import useStore from '../../store/useStore'
import { loadInstanceSource } from '../SchemaForm/useInstanceOptions'
import { isAndroidApp, isNowPlayingAddonInstalled } from './android.bridge'
import pkg from '../../../package.json'

/**
 * Wording for the two optional Android extras: the Now Playing addon and the
 * root audio module.
 *
 * Kept in one place so the setup assistant, the Settings row and the Settings
 * tile describe them the same way.
 */
export const ANDROID_EXTRAS = {
  title: 'Android extras',
  addon: {
    title: 'Now Playing Addon',
    body: 'Shows the track playing on this phone and colours your virtuals from its cover art.',
    guide:
      'Install via adb, or: pause Play Protect, install, then App info › ⋮ › Allow restricted settings, and grant notification access.',
    guideLines: [
      ['via adb:', 'adb install …'],
      [
        'or:',
        'pause Play Protect › install › App info › ⋮ › Allow restricted settings › grant notification access'
      ]
    ] as [string, string][],
    installed: 'Installed',
    download: 'Download addon'
  },
  rootModule: {
    title: 'Root Audio Module',
    body: 'Latency-free capture of everything this phone plays. Rooted phones only.',
    guide: 'Flash the zip in KernelSU or Magisk, then reboot.',
    active: 'Active',
    download: 'Download module'
  }
}

const REPO = 'YeonV/LedFx-Builds'
const TAG = `v${pkg.version}`
const RELEASE_PAGE = `https://github.com/${REPO}/releases/tag/${TAG}`

export interface AndroidExtrasUrls {
  addon: string
  rootModule: string
}

const FALLBACK: AndroidExtrasUrls = { addon: RELEASE_PAGE, rootModule: RELEASE_PAGE }

/**
 * Direct download links for this build's addon APK and root module zip.
 *
 * Looked up from this build's own release, not /releases/latest: a prerelease
 * user needs the addon and module that match the APK they run. The addon's file
 * name carries its own version, so it is matched by prefix rather than built.
 * Anything that fails falls back to the release page.
 */
let resolved: Promise<AndroidExtrasUrls> | null = null

const resolveUrls = (): Promise<AndroidExtrasUrls> => {
  if (resolved) return resolved
  resolved = (async () => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3000)
    try {
      const res = await fetch(`https://api.github.com/repos/${REPO}/releases/tags/${TAG}`, {
        signal: controller.signal
      })
      if (!res.ok) return FALLBACK
      const release = await res.json()
      const assets: { name: string; browser_download_url: string }[] = Array.isArray(
        release?.assets
      )
        ? release.assets
        : []
      const find = (test: (_name: string) => boolean) =>
        assets.find((a) => test(a.name))?.browser_download_url || RELEASE_PAGE
      return {
        addon: find((n) => n.startsWith('LedFx_NowPlaying_Addon') && n.endsWith('.apk')),
        rootModule: find((n) => n.endsWith('android-root-audio-module.zip'))
      }
    } catch {
      return FALLBACK
    } finally {
      clearTimeout(timer)
    }
  })()
  return resolved
}

export const useAndroidExtrasUrls = (): AndroidExtrasUrls => {
  const [urls, setUrls] = useState<AndroidExtrasUrls>(FALLBACK)
  useEffect(() => {
    if (!isAndroidApp()) return undefined
    let live = true
    resolveUrls().then((u) => {
      if (live) setUrls(u)
    })
    return () => {
      live = false
    }
  }, [])
  return urls
}

/**
 * Whether the addon is installed, re-read whenever the app comes back to the
 * foreground - installing it means leaving LedFx for the browser and the
 * installer. null when the APK cannot tell (no bridge method).
 */
export const useNowPlayingAddonInstalled = (): boolean | null => {
  const [installed, setInstalled] = useState(isNowPlayingAddonInstalled)
  useEffect(() => {
    const recheck = () => {
      if (document.visibilityState === 'visible') setInstalled(isNowPlayingAddonInstalled())
    }
    document.addEventListener('visibilitychange', recheck)
    return () => document.removeEventListener('visibilitychange', recheck)
  }, [])
  return installed
}

/**
 * Whether the root audio module is active.
 *
 * The core lists "System Audio (root)" only once Android has granted LedFx
 * CAPTURE_AUDIO_OUTPUT, which only the module provides. null until the device
 * list has loaded.
 */
export const useRootAudioActive = (): boolean | null => {
  const { audioDevices, loaded } = useStore(
    useShallow((state) => ({
      audioDevices: state.audioDevices,
      loaded: state.instanceLoaded.audio_devices
    }))
  )
  useEffect(() => {
    loadInstanceSource('audio_devices')
  }, [])
  if (!loaded) return null
  return Object.values(audioDevices || {}).some((name) => name.includes('System Audio (root)'))
}
