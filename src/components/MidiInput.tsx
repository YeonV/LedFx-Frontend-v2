import { useEffect, useState } from 'react'
import { WebMidi, Input, NoteMessageEvent } from 'webmidi'

import useStore from '../store/useStore'

const MIDIListener = () => {
  const [assignedKeys, setAssignedKeys] = useState<string[]>([])

  const scenes = useStore((state) => state.scenes)
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
                )
                assignMidiKey(event.note.identifier)
                // Activate the scene if the assigned key is pressed
                if (scenes?.scene_midiactivate) {
                  activateScene('blade-scene')
                }
              })
            )
          }
        }
      },
    })
  }, [])

  return null
}

export default MIDIListener
