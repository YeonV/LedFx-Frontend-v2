import React from 'react'
import {
  Typography,
  Toolbar,
  AppBar,
  Dialog,
  Button,
  useTheme,
  Box,
  Container
} from '@mui/material'
import { NavigateBefore } from '@mui/icons-material'
import isElectron from 'is-electron'
import useEditVirtualsStyles from '../../../../../pages/Devices/EditVirtuals/EditVirtuals.styles'
import useStore from '../../../../../store/useStore'
import SongDetectorContent from './SongDetectorContent'

const Transition = React.forwardRef(function Transition(props: any, ref: React.Ref<unknown>) {
  return <div ref={ref} {...props} />
})

export default function SongDetectorScreen() {
  const classes = useEditVirtualsStyles()
  const theme = useTheme()
  const open = useStore((state) => state.ui.songDetectorScreenOpen)
  const setOpen = useStore((state) => state.ui.setSongDetectorScreenOpen)
  const platform = useStore((state) => state.platform)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      slots={{ transition: Transition }}
      slotProps={{
        paper: {
          sx: {
            marginTop: isElectron() && platform !== 'darwin' ? '32px' : 0
          }
        }
      }}
    >
      <AppBar enableColorOnDark className={classes.appBar} color="default">
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
            Song Detector Plus
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          height: 'calc(100vh - 32px)',
          paddingTop: '1rem',
          paddingBottom: '3rem',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Container maxWidth="lg">
          <SongDetectorContent />
        </Container>
      </Box>
    </Dialog>
  )
}
