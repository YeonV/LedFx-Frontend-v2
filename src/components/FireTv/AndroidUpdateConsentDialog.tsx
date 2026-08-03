import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'
import { SystemUpdate } from '@mui/icons-material'
import useStore from '../../store/useStore'
import { UPDATE_CONSENT, requestUpdateGrantIfNeeded } from './androidUpdateConsent'

/**
 * Asks for the update opt-in outside the setup assistant.
 *
 * The assistant only opens for a fresh profile, so on an in-place upgrade
 * nobody would ever be asked and the feature would stay dark forever. Rendering
 * is decided by AndroidUpdater, which only mounts this when the assistant is
 * not going to ask.
 */
export default function AndroidUpdateConsentDialog() {
  const setAndroidUpdates = useStore((state) => state.setAndroidUpdates)

  const accept = () => {
    setAndroidUpdates('enabled')
    requestUpdateGrantIfNeeded()
  }

  return (
    // No onClose: a stray backdrop tap should not silently answer a question
    // that is only ever asked once. Both buttons are harmless and visible.
    <Dialog open maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SystemUpdate />
        {UPDATE_CONSENT.title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">{UPDATE_CONSENT.body}</Typography>
        <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
          {UPDATE_CONSENT.footnote}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAndroidUpdates('declined')}>{UPDATE_CONSENT.decline}</Button>
        <Button variant="contained" onClick={accept}>
          {UPDATE_CONSENT.accept}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
