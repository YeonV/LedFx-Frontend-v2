import { canInstallPackages, requestInstallPermission } from './android.bridge'

/**
 * Wording for the update opt-in, shared by the two places that can ask.
 *
 * The setup assistant asks in context while someone is being onboarded;
 * AndroidUpdateConsentDialog catches everyone the assistant never runs for
 * (upgrades keep their persisted `intro: false`). Same question either way, so
 * the copy lives here rather than being written out twice.
 */
export const UPDATE_CONSENT = {
  title: 'Keep LedFx up to date?',
  body: 'LedFx can check for new versions and install them for you. Android will ask you to allow installing apps from LedFx.',
  footnote: 'Either way you can change this later under Settings › About.',
  decline: 'Not now',
  accept: 'Enable updates'
}

/**
 * Send the user to the install-unknown-apps screen, but only if the grant is
 * actually missing - it survives reinstalls, so re-asking someone who already
 * allowed it is pure friction.
 */
export const requestUpdateGrantIfNeeded = (): void => {
  if (!canInstallPackages()) requestInstallPermission()
}
