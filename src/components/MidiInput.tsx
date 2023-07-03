/* eslint-disable no-console */
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
      const buttonNumber = event.note.number
      console.log(midiInput)
      Object.keys(scenes).forEach((key) => {
        const scene = scenes[key] as { scene_midiactivate: number }
        if (midiInput === String(scene.scene_midiactivate)) {
          activateScene(key)
          const output = WebMidi.getOutputByName(inputName)
          if (output) {
            // Reset all LEDs to off
            output.send([0xb0, 0x00, 0x00])
            // Set the LED of the pressed button to on
            output.send([0x90, buttonNumber, 60])
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
