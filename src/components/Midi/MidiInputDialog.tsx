import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  BottomNavigationAction,
  useTheme
} from '@mui/material'
import { useState } from 'react'
import useStore from '../../store/useStore'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import LaunchpadButtonMap from './LaunchpadButtonMap'
import { SettingsInputComponent } from '@mui/icons-material'

const MidiInputDialog = ({ variant = 'iconbutton' }: { variant?: 'iconbutton' | 'navitem' }) => {
  const theme = useTheme()
  const midiInput = useStore((state) => state.midiInput)
  const [fullScreen, setFullScreen] = useState(false)
  const [open, setOpen] = useState<boolean>(false)
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const toggleSidebar = () => setSideBarOpen(!sideBarOpen)

  return (
    <>
      {variant === 'iconbutton' && (
        <div style={{ alignSelf: 'center' }}>
          <Tooltip title="MIDI Input Configuration">
            <IconButton onClick={() => setOpen(true)}>
              <BladeIcon name="mdi:midi" />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {variant === 'navitem' && (
        <BottomNavigationAction
          label="MIDI"
          value="/MIDI"
          icon={<SettingsInputComponent />}
          onClick={() => setOpen(true)}
          sx={{
            pt: 0,
            '& .MuiBottomNavigationAction-label': {
              opacity: 1
            }
          }}
          style={open ? { color: theme.palette.primary.main } : {}}
        />
      )}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            maxWidth: fullScreen ? 'unset' : sideBarOpen ? 'min(95vw, 1060px)' : 'min(95vw, 742px)',
            minWidth: sideBarOpen ? 'min(95vw, 750px)' : 'min(95vw, 542px)',
            width: '100%'
          }
        }}
      >
        {!fullScreen && (
          <DialogTitle display="flex" alignItems="center">
            <BladeIcon name="mdi:midi" style={{ marginRight: '1rem' }} />{' '}
            {/\((.*?)\)/.exec(midiInput)?.[1]} Input Configuration
          </DialogTitle>
        )}
        <DialogContent
          sx={[
            fullScreen
              ? {
                  padding: 0
                }
              : {
                  padding: ''
                }
          ]}
        >
          <LaunchpadButtonMap
            fullScreen={fullScreen}
            setFullScreen={setFullScreen}
            sideBarOpen={sideBarOpen}
            toggleSidebar={toggleSidebar}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MidiInputDialog
