import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
import useStore from '../../store/useStore'
import ClientManagementCard from '../../pages/Settings/ClientManagement'

const ClientManagementDialog = () => {
  const open = useStore((state) => state.dialogs.clientManagement?.open || false)
  const setDialogOpenClientManagement = useStore((state) => state.setDialogOpenClientManagement)

  const handleClose = () => {
    setDialogOpenClientManagement(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Client Management
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ClientManagementCard />
      </DialogContent>
    </Dialog>
  )
}

export default ClientManagementDialog
