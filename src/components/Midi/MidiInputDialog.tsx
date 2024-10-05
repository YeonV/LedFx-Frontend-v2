import { Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material'
import { useState } from 'react'
import useStore from '../../store/useStore'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import LaunchpadButtonMap from './LaunchpadButtonMap'

const MidiInputDialog = () => {
  const midiInput = useStore((state) => state.midiInput)
  const [open, setOpen] = useState<boolean>(false)
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const toggleSidebar = () => setSideBarOpen(!sideBarOpen)

  return (
    <div style={{ alignSelf: 'center' }}>
      <Tooltip title="MIDI Input Configuration">
        <IconButton onClick={() => setOpen(true)}>
            <BladeIcon name="mdi:midi" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            maxWidth: sideBarOpen ? 'min(95vw, 1060px)' : 'min(95vw, 742px)',
            minWidth: sideBarOpen ? 'min(95vw, 750px)': 'min(95vw, 542px)',
            width: '100%'
          }
        }}
      >
        <DialogTitle display="flex" alignItems="center">
            <BladeIcon name="mdi:midi" style={{ marginRight: '1rem'}} /> {/\((.*?)\)/.exec(midiInput)?.[1]} Input Configuration
        </DialogTitle>
        <DialogContent>
            <LaunchpadButtonMap sideBarOpen={sideBarOpen} toggleSidebar={toggleSidebar} />        
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MidiInputDialog