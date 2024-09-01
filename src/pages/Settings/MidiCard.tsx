import { useEffect } from 'react'
import useStore from '../../store/useStore'
import BladeFrame from '../../components/SchemaForm/components/BladeFrame'
import { MenuItem, Select, Stack } from '@mui/material'
import MidiInputDialog from '../../components/Midi/MidiInputDialog'

const MidiCard = ({ className }: any) => {
  const midiInputs = useStore((state) => state.midiInputs)
  const midiOutputs = useStore((state) => state.midiOutputs)
  const midiInput = useStore((state) => state.midiInput)
  const midiOutput = useStore((state) => state.midiOutput)
  const setMidiInput = useStore((state) => state.setMidiInput)
  const setMidiOutput = useStore((state) => state.setMidiOutput)
  const getSystemConfig = useStore((state) => state.getSystemConfig)

  // console.log(midiInputs, midiOutputs)

  useEffect(() => {
    getSystemConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={className}>
      <Stack direction={'row'} spacing={2}>
      <BladeFrame
      title={'Input Device'}
      full
      style={{ marginBottom: '1rem' }}
    >
      <Select
      fullWidth
      disableUnderline
        value={midiInput}
        onChange={(e: any) => setMidiInput(e.target.value)}
      >
        {midiInputs.map((item: any, i: number) => (
            <MenuItem key={`${i}-${i}`} value={item}>
              {item}
            </MenuItem>
          ))}
      </Select>
    </BladeFrame>
    <MidiInputDialog />
    </Stack>
    <BladeFrame
      title={'Output Device'}
      full
    >
      <Select
      disableUnderline
      fullWidth
        value={midiOutput}
        onChange={(e: any) => setMidiOutput(e.target.value)}
      >
        {midiOutputs.map((item: any, i: number) => (
            <MenuItem key={`${i}-${i}`} value={item}>
              {item}
            </MenuItem>
          ))}
      </Select>
    </BladeFrame>
    </div>
  )
}

export default MidiCard
