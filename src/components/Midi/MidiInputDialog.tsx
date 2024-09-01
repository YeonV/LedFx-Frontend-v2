import { Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material'
import { useState } from 'react'
import useStore from '../../store/useStore'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import LaunchpadButtonMap from './LaunchpadButtonMap'

const MidiInputDialog = () => {
  const midiEvent = useStore((state) => state.midiEvent)
  const [open, setOpen] = useState<boolean>(false)

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
            maxWidth: 'min(95vw, 1200px)',
            minWidth: 'min(95vw, 750px)',
            width: '100%'
          }
        }}
      >
        <DialogTitle display="flex" alignItems="center">
            <BladeIcon name="mdi:midi" style={{ marginRight: '1rem'}} /> {/\((.*?)\)/.exec(midiEvent.name)?.[1]} Input Configuration
        </DialogTitle>
        <DialogContent>
            <LaunchpadButtonMap />
        
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MidiInputDialog
