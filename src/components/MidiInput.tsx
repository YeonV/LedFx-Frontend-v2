import { useEffect } from 'react'
import { WebMidi, Input, NoteMessageEvent } from 'webmidi'
import useStore from '../store/useStore'

const MIDIListener = () => {
  const scenes = useStore((state) => state.scenes)
  const activateScene = useStore((state) => state.activateScene)

  useEffect(() => {
    const handleMidiEvent = (input: Input, event: NoteMessageEvent) => {
      const midiInput = `${input.name} Note: ${event.note.identifier}`
      const inputName = input.name
      const pitch = event.note.number
      console.log(midiInput)

      Object.keys(scenes).forEach((key) => {
        const scene = scenes[key] as { scene_midiactivate: number }
        if (midiInput === String(scene.scene_midiactivate)) {
          activateScene(key)
          const output = WebMidi.getOutputByName(inputName)
          if (output) {
            output.playNote(pitch, {
              duration: 500,
              attack: 0,
              release: 0,
            })
            // Send MIDI message
            output.sendControlChange(0x0, 127) // Turn on the LED light
            console.log('MIDI LED light turned on')
          } else {
            console.error('Output device not found')
          }
        }
      })
    }

    WebMidi.enable({
      callback: (err: Error) => {
        if (err) {
          console.error('WebMidi could not be enabled:', err)
        } else {
          const { inputs } = WebMidi
          if (inputs.length > 0) {
            inputs.forEach((input: Input) => {
              input.addListener('noteon', (event: NoteMessageEvent) => {
                handleMidiEvent(input, event)
              })
            })
          }
        }
      },
    })
  }, [])

  return null
}

export default MIDIListener
