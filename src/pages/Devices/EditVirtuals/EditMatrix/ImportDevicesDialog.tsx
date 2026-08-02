import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material'
import { UnknownDevice } from './importMatrix'

const ImportDevicesDialog = ({
  unknown,
  busy,
  onCreate,
  onCancel
}: {
  unknown: UnknownDevice[] | null
  busy: boolean
  onCreate: () => void
  onCancel: () => void
}) => {
  if (!unknown || unknown.length === 0) return null

  const blocked = unknown.filter((device) => !device.creatable)
  // Creating only some of them still leaves a layout the backend will reject,
  // so the offer is all or nothing.
  const canCreateAll = blocked.length === 0

  return (
    <Dialog open onClose={busy ? undefined : onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Unknown devices in this layout</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          This layout uses {unknown.length === 1 ? 'a device' : 'devices'} that {'don’t'} exist in
          LedFx. Saving it as-is would be rejected outright and the matrix would revert, so it{' '}
          {unknown.length === 1 ? 'has' : 'have'} to be resolved first.
        </DialogContentText>

        <List dense disablePadding>
          {unknown.map((device) => (
            <ListItem key={device.deviceId} disableGutters>
              <ListItemText
                primary={device.deviceId}
                secondary={
                  device.creatable
                    ? `Would be created as a dummy device with ${device.pixelCount} pixel${device.pixelCount === 1 ? '' : 's'}`
                    : 'Cannot be created - LedFx would rename this id'
                }
                slotProps={{ primary: { fontFamily: 'monospace' } }}
              />
            </ListItem>
          ))}
        </List>

        {canCreateAll ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            Dummy devices output nothing. They hold the layout together until you point those pixels
            at real hardware. LedFx also creates a virtual for each one.
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              LedFx builds a device id from its name, so ids containing <code>.</code> or{' '}
              <code>_</code> come back different - <code>{blocked[0].deviceId}</code> would become{' '}
              <code>{blocked[0].deviceId.replace(/[^a-zA-Z0-9]+/g, '-')}</code>. Rename{' '}
              {blocked.length === 1 ? 'it' : 'them'} in Matrix Studio using only letters, numbers
              and hyphens, then import again.
            </Typography>
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={busy}>
          Discard import
        </Button>
        <Button onClick={onCreate} variant="contained" disabled={!canCreateAll || busy}>
          {busy ? 'Creating…' : 'Create devices & import'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportDevicesDialog
