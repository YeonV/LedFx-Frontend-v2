import { FC, useState } from 'react'
import Sort from '@mui/icons-material/Sort'
import OrderList from './OrderList'
import { ArrowBackIos, ArrowDownward, ArrowUpward, Save } from '@mui/icons-material'
import {
  Divider,
  IconButton,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  MenuItem,
  ListItemIcon,
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
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
  const clientOrder = useStore((state) => state.clientOrder)
  const setClientOrder = useStore((state) => state.setClientOrder)
  const virtuals = useStore((state) => state.virtuals)
  const devices = useStore((state) => state.devices)
  const clients = useStore((state) => state.clients)
  const showSnackbar = useStore((state) => state.ui.showSnackbar)
  const layout = useStore((state) => state.uiPersist.layout)
  const setLayout = useStore((state) => state.setLayout)

  const [open, setOpen] = useState(false)
  const [sortField, setSortField] = useState<{ [key: string]: string | null }>({
    virtuals: null,
    clients: null
  })
  const [sortDirection, setSortDirection] = useState<{ [key: string]: 'asc' | 'desc' }>({
    virtuals: 'asc',
    clients: 'asc'
  })

  const renderSortButtons = (type: 'virtuals' | 'clients') => (
    <Stack direction="row" spacing={1} p={1} useFlexGap flexWrap="wrap">
      <Button
        size="small"
        variant={sortField[type] === 'name' ? 'contained' : 'text'}
        onClick={() => handleSort(type, 'name')}
        endIcon={
          sortField[type] === 'name' &&
          (sortDirection[type] === 'asc' ? <ArrowUpward /> : <ArrowDownward />)
        }
      >
        Name
      </Button>
      <Button
        size="small"
        variant={sortField[type] === 'type' ? 'contained' : 'text'}
        onClick={() => handleSort(type, 'type')}
        endIcon={
          sortField[type] === 'type' &&
          (sortDirection[type] === 'asc' ? <ArrowUpward /> : <ArrowDownward />)
        }
      >
        Type
      </Button>
      {type === 'virtuals' && (
        <>
          <Button
            size="small"
            variant={sortField[type] === 'dim' ? 'contained' : 'text'}
            onClick={() => handleSort(type, 'dim')}
            endIcon={
              sortField[type] === 'dim' &&
              (sortDirection[type] === 'asc' ? <ArrowUpward /> : <ArrowDownward />)
            }
          >
            1D/2D
          </Button>
          <Button
            size="small"
            variant={sortField[type] === 'pixels' ? 'contained' : 'text'}
            onClick={() => handleSort(type, 'pixels')}
            endIcon={
              sortField[type] === 'pixels' &&
              (sortDirection[type] === 'asc' ? <ArrowUpward /> : <ArrowDownward />)
            }
          >
            Pixels
          </Button>
        </>
      )}
    </Stack>
  )

  const renderLayoutSettings = () => (
    <Stack spacing={2} p={2}>
      <FormControlLabel
        control={
          <Switch
            checked={layout.separate2DDevices}
            onChange={(e) => setLayout('separate2DDevices', e.target.checked)}
          />
        }
        label="Separate 2D Devices"
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body2">Section Width</Typography>
        <ToggleButtonGroup
          size="small"
          value={layout.sectionWidth}
          exclusive
          onChange={(_, val) => val && setLayout('sectionWidth', val)}
        >
          <ToggleButton value="420px">S</ToggleButton>
          <ToggleButton value="870px">M</ToggleButton>
          <ToggleButton value="1320px">L</ToggleButton>
          <ToggleButton value="100%">Full</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body2">Section Direction</Typography>
        <ToggleButtonGroup
          size="small"
          value={layout.sectionDirection}
          exclusive
          onChange={(_, val) => val && setLayout('sectionDirection', val)}
        >
          <ToggleButton value="column">Column</ToggleButton>
          <ToggleButton value="row">Row</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body2">Item Direction</Typography>
        <ToggleButtonGroup
          size="small"
          value={layout.itemDirection}
          exclusive
          onChange={(_, val) => val && setLayout('itemDirection', val)}
        >
          <ToggleButton value="column">Column</ToggleButton>
          <ToggleButton value="row">Row</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  )

  const handleSort = (type: 'virtuals' | 'clients', field: string) => {
    let newDirection: 'asc' | 'desc' = 'asc'
    if (sortField[type] === field) {
      newDirection = sortDirection[type] === 'asc' ? 'desc' : 'asc'
    }
    setSortField((prev) => ({ ...prev, [type]: field }))
    setSortDirection((prev) => ({ ...prev, [type]: newDirection }))

    const orderSource = type === 'virtuals' ? virtualOrder : clientOrder
    const setOrderSource = type === 'virtuals' ? setVirtualOrder : setClientOrder

    const sortedOrder = [...orderSource].sort((a, b) => {
      let valA: any, valB: any

      if (type === 'virtuals') {
        const vA = virtuals[a.virtId]
        const vB = virtuals[b.virtId]
        if (!vA || !vB) return 0

        switch (field) {
          case 'name':
            valA = vA.config.name.toLowerCase()
            valB = vB.config.name.toLowerCase()
            break
          case 'type':
            valA = vA.is_device
              ? (devices[vA.is_device as string]?.type || 'device').toLowerCase()
              : 'virtual'
            valB = vB.is_device
              ? (devices[vB.is_device as string]?.type || 'device').toLowerCase()
              : 'virtual'
            break
          case 'dim':
            valA = (vA.config.rows || 1) > 1 ? '2D' : '1D'
            valB = (vB.config.rows || 1) > 1 ? '2D' : '1D'
            break
          case 'pixels':
            valA = vA.pixel_count
            valB = vB.pixel_count
            break
          default:
            return 0
        }
      } else {
        const cA = clients[a.virtId]
        const cB = clients[b.virtId]
        if (!cA || !cB) return 0

        switch (field) {
          case 'name':
            valA = cA.name.toLowerCase()
            valB = cB.name.toLowerCase()
            break
          case 'type':
            valA = cA.type.toLowerCase()
            valB = cB.type.toLowerCase()
            break
          default:
            return 0
        }
      }

      if (valA < valB) return newDirection === 'asc' ? -1 : 1
      if (valA > valB) return newDirection === 'asc' ? 1 : -1
      return 0
    })

    setOrderSource(sortedOrder.map((item, index) => ({ ...item, order: index })))
  }

  const handleClickOpen = () => {
    setOpen(true)
    if (onOpen) {
      onOpen()
    }
  }

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
          Adjust Layout
        </MenuItem>
      ) : (
        <Button onClick={handleClickOpen} startIcon={<Sort />}>
          Adjust Layout
        </Button>
      )}
      {mode === 'drawer' ? (
        <Drawer anchor="right" open={open} onClose={handleClose}>
          <div style={{ width: 320 }}>
            <Stack
              direction="row"
              alignItems="center"
              sx={(theme) => ({
                height: 56,
                background: '',

                ...theme.applyStyles('dark', {
                  background: '#0005'
                })
              })}
            >
              <Button onClick={handleClose} color="inherit" variant="text">
                <ArrowBackIos />
              </Button>
              <Typography variant="h6" ml={0.5}>
                Adjust Layout
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
                <label htmlFor="contained-button-file" style={{ width: '100%', flexBasis: '49%' }}>
                  <BladeIcon sx={{ pt: 0.4, cursor: 'pointer' }} name="mdi:folder-open" />
                </label>
              </IconButton>
            </Stack>
            <Divider />
            {renderLayoutSettings()}
            <Divider />
            <Typography variant="overline" sx={{ px: 2, pt: 1, display: 'block' }}>
              {layout.separate2DDevices ? '1D Devices' : 'Devices'}
            </Typography>
            {renderSortButtons('virtuals')}
            <Divider />
            <OrderList type="virtuals" dimFilter={layout.separate2DDevices ? '1D' : undefined} />
            {layout.separate2DDevices && (
              <>
                <Divider />
                <Typography variant="overline" sx={{ px: 2, pt: 1, display: 'block' }}>
                  2D Devices
                </Typography>
                {renderSortButtons('virtuals')}
                <Divider />
                <OrderList type="virtuals" dimFilter="2D" />
              </>
            )}
            <Divider />
            <Typography variant="overline" sx={{ px: 2, pt: 1, display: 'block' }}>
              Visualizers
            </Typography>
            {renderSortButtons('clients')}
            <Divider />
            <OrderList type="clients" />
          </div>
        </Drawer>
      ) : (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Adjust Layout</DialogTitle>
          <DialogContent>
            {renderLayoutSettings()}
            <Divider />
            <Typography variant="overline" sx={{ pt: 1, display: 'block' }}>
              {layout.separate2DDevices ? '1D Devices' : 'Devices'}
            </Typography>
            {renderSortButtons('virtuals')}
            <Divider />
            <OrderList type="virtuals" dimFilter={layout.separate2DDevices ? '1D' : undefined} />
            {layout.separate2DDevices && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="overline" sx={{ pt: 1, display: 'block' }}>
                  2D Devices
                </Typography>
                {renderSortButtons('virtuals')}
                <Divider />
                <OrderList type="virtuals" dimFilter="2D" />
              </>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="overline" sx={{ pt: 1, display: 'block' }}>
              Visualizers
            </Typography>
            {renderSortButtons('clients')}
            <Divider />
            <OrderList type="clients" />
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
