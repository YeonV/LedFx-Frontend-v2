import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  BottomNavigationAction,
  useTheme,
  Stack,
  Typography
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
  const midiOpen = useStore((state) => state.midiOpen)
  const setMidiOpen = useStore((state) => state.setMidiOpen)
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const toggleSidebar = () => setSideBarOpen(!sideBarOpen)

  return (
    <>
      {variant === 'iconbutton' && (
        <div style={{ alignSelf: 'center' }}>
          <Tooltip title="MIDI Input Configuration">
            <IconButton onClick={() => setMidiOpen(true)}>
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
          onClick={() => setMidiOpen(true)}
          sx={{
            pt: 0,
            '& .MuiBottomNavigationAction-label': {
              opacity: 1
            }
          }}
          style={midiOpen ? { color: theme.palette.primary.main } : {}}
        />
      )}
      <Dialog
        fullScreen={fullScreen}
        open={midiOpen}
        onClose={() => setMidiOpen(false)}
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
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={'space-between'}
              sx={{ width: '100%' }}
            >
              <span>
                <BladeIcon name="mdi:midi" style={{ marginRight: '1rem' }} />{' '}
                {/\((.*?)\)/.exec(midiInput)?.[1]} Input Configuration
              </span>
              {(!midiInput || midiInput === '') && (
                <Typography variant="body2" color="text.secondary">
                  No MIDI device selected. Running in "Virtual MIDI Mode"
                </Typography>
              )}
            </Stack>
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
