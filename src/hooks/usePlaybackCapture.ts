import { useEffect, useRef, useState } from 'react'
import { Ledfx } from '../api/ledfx'
import { supportsPlaybackCapture, requestPlaybackCapture } from '../components/FireTv/android.bridge'

/**
 * Android's Playback Capture (system audio) consent state and actions -
 * shared between Settings > Audio and the setup wizard, since both need to
 * offer the same Allow/Revoke flow.
 *
 * State comes from the backend (GET /api/android/playback_capture), not the
 * Android JS bridge's hasPlaybackCapture(). That check runs in the Activity
 * process and reads PythonService's static consent fields there - but only
 * PythonService's own broadcast receiver, running in the separate
 * :service_ledfx process, ever sets them. Android does not share static
 * state across process boundaries, so the bridge check can never reflect
 * reality; it reads a copy that is never written. The real
 * AndroidPlaybackCapture object lives entirely in the service process, so
 * the backend endpoint asks it directly instead.
 */
export const usePlaybackCapture = () => {
  const captureSupported = supportsPlaybackCapture()
  const [captureActive, setCaptureActive] = useState(false)
  const capturePollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchCaptureState = async (): Promise<boolean> => {
    try {
      const resp = await Ledfx('/api/android/playback_capture', 'GET', undefined, false)
      return !!resp?.active
    } catch {
      return false
    }
  }

  // Backstop poll, used both on mount and after requesting: the consent
  // dialog has no callback into the WebView (approval crosses to the service
  // process out of band), and consent may already have existed from an
  // earlier session before this hook ever mounted, with no native focus
  // transition since to trigger a recheck.
  const pollCaptureState = () => {
    if (capturePollRef.current) clearInterval(capturePollRef.current)
    let tries = 0
    capturePollRef.current = setInterval(async () => {
      tries += 1
      const active = await fetchCaptureState()
      if (active || tries > 20) {
        setCaptureActive(active)
        if (capturePollRef.current) clearInterval(capturePollRef.current)
        capturePollRef.current = null
      }
    }, 1000)
  }

  useEffect(() => {
    if (!captureSupported) return undefined
    fetchCaptureState().then(setCaptureActive)
    pollCaptureState()
    const recheck = () => fetchCaptureState().then(setCaptureActive)
    window.addEventListener('focus', recheck)
    return () => {
      window.removeEventListener('focus', recheck)
      if (capturePollRef.current) clearInterval(capturePollRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captureSupported])

  const handleRequestCapture = () => {
    requestPlaybackCapture()
    // Focus alone is not always enough - on some launchers the WebView never
    // loses it. Poll briefly as a backstop, then give up rather than spin.
    pollCaptureState()
  }

  const handleRevokeCapture = async () => {
    // Ends the real MediaProjection session (see the endpoint's own
    // docstring) - the system clears its own status-bar indicator as a
    // direct consequence, not because of anything this does locally.
    await Ledfx('/api/android/playback_capture', 'DELETE', undefined, false)
    setCaptureActive(false)
  }

  return { captureSupported, captureActive, handleRequestCapture, handleRevokeCapture }
}
