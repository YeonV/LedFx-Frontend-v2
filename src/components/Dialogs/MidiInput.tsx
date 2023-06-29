import { useEffect, useState } from 'react'
import { TextField, Typography } from '@mui/material'
import { WebMidi, Input, NoteMessageEvent } from 'webmidi'

import useStore from '../../store/useStore'

const MIDIListener = () => {
  const [midiInput, setMidiInput] = useState('')
  const [assignedKeys, setAssignedKeys] = useState([])

  const getScenes = useStore((state) => state.getScenes)
  const activateScene = useStore((state) => state.activateScene)

  const assignMidiKey = (key: string) => {
    // Check if the midi key has already been assigned
    const isKeyAssigned = assignedKeys.includes(key)
    if (isKeyAssigned) {
      console.log('Cannot assign MIDI key that has already been assigned')
      return
    }

    // Assign the midi key
    setAssignedKeys((prevKeys) => [...prevKeys, key])
  }

  useEffect(() => {
    WebMidi.enable({
      callback(err: Error) {
        if (err) {
          console.log('WebMidi could not be enabled:', err)
        } else {
          // Get all input devices
          const { inputs } = WebMidi

          if (inputs.length > 0) {
            // Listen for MIDI messages on all channels and all input devices
            inputs.forEach((input: Input) =>
              input.addListener('noteon', (event: NoteMessageEvent) => {
                console.log(
                  `MIDI note on from ${input.name}: Note: ${event.note.identifier}`
                ) // Display which input device the midi note came from, note identifier
                setMidiInput(`${input.name} Note: ${event.note.identifier}`) // Set the latest note on in state

                // Assign the MIDI key
                assignMidiKey(event.note.identifier)

                // Activate the scene if the assigned key is pressed
                if (getScenes()[event.note.identifier]?.scene_midiactivate) {
                  activateScene(event.note.identifier)
                }
              })
            )
          }
        }
      },
    })
  }, [])

  return (
    <>
      {/* Display all input devices */}
      {WebMidi.inputs.length > 0 ? (
        <Typography variant="subtitle1" gutterBottom>
          MIDI Device/s detected. Press a MIDI button to assign to this scene.
        </Typography>
      ) : (
        <Typography color="error">No MIDI input devices found</Typography>
      )}
      {/* Display latest MIDI note on */}
      {midiInput && (
        <TextField
          margin="dense"
          id="latest_note_on"
          label="MIDI Note to activate scene"
          type="text"
          value={midiInput}
          fullWidth
          disabled
        />
      )}
    </>
  )
}

export default MIDIListener
