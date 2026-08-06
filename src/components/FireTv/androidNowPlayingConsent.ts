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

/**
 * Send the user to the notification-access screen, but only if the grant is
 * actually missing.
 */
export const requestNowPlayingGrantIfNeeded = (): void => {
  if (!hasNotificationAccess()) requestNotificationAccess()
}
