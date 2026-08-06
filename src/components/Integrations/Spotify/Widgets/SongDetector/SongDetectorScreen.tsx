import React from 'react'
import {
  Typography,
  Toolbar,
  AppBar,
  Dialog,
  Button,
  useTheme,
  Box,
  Container,
  Slide
} from '@mui/material'
import type { TransitionProps } from '@mui/material/transitions'
import { NavigateBefore } from '@mui/icons-material'
import isElectron from 'is-electron'
import useEditVirtualsStyles from '../../../../../pages/Devices/EditVirtuals/EditVirtuals.styles'
import useStore from '../../../../../store/useStore'
import SongDetectorContent from './SongDetectorContent'

/**
 * A real transition, not a bare div.
 *
 * MUI's Modal only unmounts and lifts its body scroll-lock once the transition
 * reports onExited. A plain div never does, so closing this screen left the
 * modal mounted with `overflow: hidden` still on the body - the whole app
 * could no longer be scrolled until a reload.
 */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...(props as any)} />
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
            Now Playing
          </Typography>
          {/* On a phone the player's action icons move up here instead of
              floating over the artwork and colliding with long track names.
              The player fills this via a portal, so the toggles keep their
              state where it already lives. */}
          <Box id="now-playing-toolbar-actions" sx={{ ml: 'auto', display: 'flex' }} />
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          height: 'calc(100vh - 32px)',
          // Matches the gap between the cards below, so the player does not sit
          // welded to the app bar.
          paddingTop: { xs: 2, sm: 0 },
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
