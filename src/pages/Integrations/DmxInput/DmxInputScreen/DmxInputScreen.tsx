import React, { useEffect } from 'react'
import { Typography, Toolbar, AppBar, Dialog, Button, Box } from '@mui/material'
import { Settings, NavigateBefore } from '@mui/icons-material'
import isElectron from 'is-electron'
import { DmxInputScreenProps, MuiMenuItem, Transition } from './DmxInputScreen.props'
import useEditVirtualsStyles from '../../../Devices/EditVirtuals/EditVirtuals.styles'
import useStore from '../../../../store/useStore'
import DmxMappingTable from '../../../../components/Integrations/DmxInput/DmxMappingTable'
import DialogAddDmxMapping from '../../../../components/Integrations/DmxInput/DialogAddDmxMapping'
import DmxLiveMonitor from '../../../../components/Integrations/DmxInput/DmxLiveMonitor'

export default function DmxInputScreen({
  integrationId,
  icon = <Settings />,
  startIcon,
  label = '',
  type,
  className,
  color = 'primary',
  variant = 'contained',
  innerKey,
  disabled = false,
  size = 'small'
}: DmxInputScreenProps) {
  const classes = useEditVirtualsStyles()
  const [open, setOpen] = React.useState(false)
  const platform = useStore((state) => state.platform)
  const getDmxInput = useStore((state) => state.getDmxInput)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useEffect(() => {
    if (open && integrationId) {
      getDmxInput(integrationId)
    }
  }, [open, integrationId, getDmxInput])

  return (
    <>
      {type === 'menuItem' ? (
        <MuiMenuItem
          key={innerKey}
          className={className}
          onClick={(e: any) => {
            e.preventDefault()
            handleClickOpen()
          }}
        >
          {icon}
          {label}
        </MuiMenuItem>
      ) : (
        <Button
          variant={variant}
          startIcon={startIcon}
          color={color}
          onClick={handleClickOpen}
          size={size}
          disabled={disabled}
          className={className}
          aria-label={label || 'DMX Input settings'}
        >
          {label}
          {!startIcon && icon}
        </Button>
      )}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            paddingTop: isElectron() && platform !== 'darwin' ? '32px' : 0
          }
        }}
      >
        <AppBar enableColorOnDark className={classes.appBar}>
          <Toolbar>
            <Button
              autoFocus
              color="primary"
              variant="contained"
              startIcon={<NavigateBefore />}
              onClick={handleClose}
              style={{ marginRight: '1rem' }}
            >
              back
            </Button>
            <Typography variant="h6" className={classes.title}>
              DMX Input Mappings
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ margin: '1rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <DialogAddDmxMapping integrationId={integrationId} />
          </Box>
          <DmxMappingTable integrationId={integrationId} />
          <Box sx={{ mt: 3 }}>
            <DmxLiveMonitor integrationId={integrationId} open={open} />
          </Box>
          <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
            Map DMX channels (e.g. from SoundSwitch via Art-Net) to venue color overrides, live
            colour passthrough, or DMX wash fixtures. Use the live monitor below to learn which
            channel a button or fader uses.
          </Typography>
        </Box>
      </Dialog>
    </>
  )
}
