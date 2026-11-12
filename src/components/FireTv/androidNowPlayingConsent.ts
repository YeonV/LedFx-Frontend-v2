import { hasNotificationAccess, isAndroidApp, requestNotificationAccess } from './android.bridge'

/**
 * Wording for the Now Playing opt-in on Android.
 *
 * Kept beside the update consent copy for the same reason: the setup assistant
 * asks in context, and anywhere else that needs to ask should use the same
 * words rather than inventing its own.
 */
export const NOW_PLAYING_CONSENT = {
  title: 'Show what you are playing?',
  body: "LedFx can read the track playing on this phone and colour your virtuals from its cover art. Android's next screen warns about reading notifications: that is simply how it hands over the media session.",
  footnote: 'Either way you can change this later under Settings › Now Playing.',
  decline: 'Not now',
  accept: 'Enable Now Playing'
}

/**
 * Should the setup assistant offer this step at all?
 *
 * Only on the Android app, and only while the grant is missing - Android keeps
 * it across updates, so re-asking someone who already allowed it is pure
 * friction.
 */
export const shouldAskForNowPlaying = (): boolean => isAndroidApp() && !hasNotificationAccess()

let armedReturn: (() => void) | null = null

/**
 * Switch Now Playing on only once it can work.
 *
 * Off Android, or with the grant already given, `enable` runs at once.
 * Otherwise the user is sent to the notification-access screen first, and
 * `enable` runs when they come back - once, and only if they granted access;
 * `onDenied` runs if they came back without it.
 *
 * "Coming back" is the page turning visible after that screen hid it. One
 * request arms one return: the listener ignores everything until the page was
 * hidden, removes itself on the first return, and a new request replaces it,
 * so switching apps later never switches anything on.
 */
export const enableNowPlayingWhenGranted = (enable: () => void, onDenied?: () => void): void => {
  if (!isAndroidApp() || hasNotificationAccess()) {
    enable()
    return
  }
  if (armedReturn) document.removeEventListener('visibilitychange', armedReturn)
  let left = false
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      left = true
      return
    }
    if (!left) return
    document.removeEventListener('visibilitychange', onVisibilityChange)
    armedReturn = null
    if (hasNotificationAccess()) enable()
    else onDenied?.()
  }
  armedReturn = onVisibilityChange
  document.addEventListener('visibilitychange', onVisibilityChange)
  requestNotificationAccess()
}
