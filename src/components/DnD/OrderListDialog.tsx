import { FC, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Sort from '@mui/icons-material/Sort'
import OrderList from './OrderList'
import { ArrowBackIos } from '@mui/icons-material'
import { Divider, Stack, Typography, useTheme } from '@mui/material'

interface OrderListDialogProps {
  mode?: 'dialog' | 'drawer'
  variant?: 'menuitem' | 'button'
  onOpen?: () => void
}

const OrderListDialog: FC<OrderListDialogProps> = ({ mode = 'dialog', variant = 'menuitem', onOpen }) => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const handleClickOpen = () => {
    setOpen(true)
    if (onOpen) {
      onOpen()
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      {variant === 'menuitem' ? (
        <MenuItem onClick={handleClickOpen}>
          <ListItemIcon>
            <Sort />
          </ListItemIcon>
          Change Order
        </MenuItem>
      ) : (
        <Button onClick={handleClickOpen} startIcon={<Sort />}>
          Open Order List
        </Button>
      )}
      {mode === 'drawer' ? (
        <Drawer anchor="right" open={open} onClose={handleClose}>
          <div style={{ width: 320 }}>
            <Stack direction="row" alignItems="center" sx={{ height: 56, background: theme.palette.mode === 'dark' ? '#0005' : '' }}>
            <Button onClick={handleClose} color="inherit" variant='text'>
              <ArrowBackIos />
            </Button>
            <Typography variant='h6' ml={0.5}>Change Order</Typography>
            </Stack>
            <Divider />
            <OrderList />
          </div>
        </Drawer>
      ) : (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Change Order</DialogTitle>
          <DialogContent>
            <OrderList />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              ok
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default OrderListDialog
