import { useEffect } from 'react'
import { WebMidi, Input, NoteMessageEvent } from 'webmidi'
import useStore from '../store/useStore'

const MIDIListener = () => {
  const scenes = useStore((state) => state.scenes)
  const activateScene = useStore((state) => state.activateScene)

  useEffect(() => {
    const handleMidiEvent = (input: Input, event: NoteMessageEvent) => {
      const midiInput = `${input.name} Note: ${event.note.identifier}`

      console.log(`${input.name}: Note: ${event.note.identifier}`)

      Object.keys(scenes).forEach((key) => {
        const scene = scenes[key]
        // Debug only:
        // console.log(
        //   `if "${midiInput}" matches "${scene.scene_midiactivate}" than activateScene (${key})`
        // )
        if (midiInput === scene.scene_midiactivate) {
          activateScene(key)
        }
      })
    }

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
                handleMidiEvent(input, event)
                // console.log(`${input.name}: Note: ${event.note.identifier}`);
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
