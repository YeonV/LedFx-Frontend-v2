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
import { ArrowBackIos, Save } from '@mui/icons-material'
import { Divider, IconButton, Stack, Typography, useTheme } from '@mui/material'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import { download } from '../../utils/helpers'
import useStore from '../../store/useStore'

interface OrderListDialogProps {
  mode?: 'dialog' | 'drawer'
  variant?: 'menuitem' | 'button'
  onOpen?: () => void
}

const OrderListDialog: FC<OrderListDialogProps> = ({
  mode = 'dialog',
  variant = 'menuitem',
  onOpen
}) => {
  const virtualOrder = useStore((state) => state.virtualOrder)
  const setVirtualOrder = useStore((state) => state.setVirtualOrder)
  const showSnackbar = useStore((state) => state.ui.showSnackbar)

  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const handleClickOpen = () => {
    setOpen(true)
    if (onOpen) {
      onOpen()
    }
  }
  console.log('virtualOrder', virtualOrder)
  const handleClose = () => {
    setOpen(false)
  }
  const handleSave = () => {
    download({ virtualOrder }, 'DeviceOrder.json', 'application/json')
    setOpen(false)
  }

  const fileChanged = async (e: any) => {
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], 'UTF-8')
    fileReader.onload = (ev: any) => {
      const newOrder = JSON.parse(ev.target.result).virtualOrder
      if (!newOrder) {
        showSnackbar('error', 'Invalid order file')
        return
      }
      const oldVirtIds = virtualOrder.map((o: any) => o.virtId)
      const newVirtIds = newOrder.map((o: any) => o.virtId)
      if (
        newOrder.length === virtualOrder.length &&
        oldVirtIds.sort().join(',') === newVirtIds.sort().join(',')
      ) {
        setVirtualOrder(newOrder)
        setOpen(false)
        showSnackbar('success', 'Order updated')
      } else {
        showSnackbar('warning', 'order file does not match')
      }
    }
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
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                height: 56,
                background: theme.palette.mode === 'dark' ? '#0005' : ''
              }}
            >
              <Button onClick={handleClose} color="inherit" variant="text">
                <ArrowBackIos />
              </Button>
              <Typography variant="h6" ml={0.5}>
                Change Order
              </Typography>
              <IconButton sx={{ ml: 5 }} onClick={handleSave}>
                <Save />
              </IconButton>
              <IconButton>
                <input
                  hidden
                  accept="application/json"
                  id="contained-button-file"
                  type="file"
                  onChange={(e) => fileChanged(e)}
                />
                <label
                  htmlFor="contained-button-file"
                  style={{ width: '100%', flexBasis: '49%' }}
                >
                  <BladeIcon sx={{ pt: 0.4 }} name="mdi:folder-open" />
                </label>
              </IconButton>
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
