import useStore from '../../store/useStore'
import { isAndroidApp } from './android.bridge'
import { useAndroidUpdateChecker } from './useAndroidUpdateChecker'
import AndroidUpdateConsentDialog from './AndroidUpdateConsentDialog'
import AndroidUpdateBanner from './AndroidUpdateBanner'

/**
 * App-level owner of the Android update flow: asks for consent once, checks
 * once per launch, and surfaces the result.
 *
 * Mounted from App so the check no longer depends on someone opening Settings.
 */
export default function AndroidUpdater() {
  const onAndroid = isAndroidApp()
  const androidUpdates = useStore((state) => state.androidUpdates)
  const intro = useStore((state) => state.intro)
  const devices = useStore((state) => state.devices)

  // IntroDialog renders on exactly this condition, and it asks for consent in
  // context as part of the walkthrough. Only step in when it will not run -
  // which is every upgrade, since `intro` is already false in persisted state.
  const assistantWillAsk = intro || Object.keys(devices).length === 0
  const askConsent = onAndroid && androidUpdates === 'unset' && !assistantWillAsk

  const android = useAndroidUpdateChecker({
    enabled: onAndroid && androidUpdates === 'enabled'
  })

  if (!onAndroid) return null

  return (
    <>
      {askConsent && <AndroidUpdateConsentDialog />}
      <AndroidUpdateBanner
        latestVersion={android.latestVersion}
        updateAvailable={android.updateAvailable}
        downloading={android.downloading}
        needsInstallPermission={android.needsInstallPermission}
        handleUpdate={android.handleUpdate}
      />
    </>
  )
}
