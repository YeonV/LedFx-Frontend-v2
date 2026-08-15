import { Alert, Button, Snackbar } from '@mui/material'
import useStore from '../../store/useStore'

interface AndroidUpdateBannerProps {
  latestVersion: string | null
  updateAvailable: boolean
  downloading: boolean
  needsInstallPermission: boolean
  handleUpdate: () => void
}

/**
 * Tells the user an update exists, and installs it in one tap.
 *
 * Until this existed an available update was only visible to someone who
 * happened to open Settings > About, which meant in practice nobody found out.
 *
 * Deliberately does not auto-hide: a notification that disappears after two
 * seconds is not a notification. Dismissal is recorded against the specific
 * release instead, so it stays quiet for that version and speaks up for the
 * next one.
 */
export default function AndroidUpdateBanner({
  latestVersion,
  updateAvailable,
  downloading,
  needsInstallPermission,
  handleUpdate
}: AndroidUpdateBannerProps) {
  const dismissed = useStore((state) => state.androidUpdateDismissed)
  const setDismissed = useStore((state) => state.setAndroidUpdateDismissed)

  const open = updateAvailable && !!latestVersion && dismissed !== latestVersion

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ mb: 8 }}
    >
      <Alert
        severity={needsInstallPermission ? 'warning' : 'info'}
        variant="filled"
        action={
          <>
            <Button
              color="inherit"
              size="small"
              onClick={handleUpdate}
              disabled={downloading}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {downloading
                ? 'Downloading…'
                : needsInstallPermission
                  ? 'Allow, then return'
                  : 'Install'}
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={() => setDismissed(latestVersion)}
              disabled={downloading}
            >
              Later
            </Button>
          </>
        }
      >
        LedFx {latestVersion} is available
      </Alert>
    </Snackbar>
  )
}
