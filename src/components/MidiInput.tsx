import { useEffect } from 'react'
import { WebMidi, Input, NoteMessageEvent } from 'webmidi'

import useStore from '../store/useStore'

const MIDIListener = () => {
  const scenes = useStore((state) => state.scenes)
  const activateScene = useStore((state) => state.activateScene)

  // const handleActivateScene = (e: string) => {
  //   if (scenes[e]?.scene_midiactivate) activateScene(e)
  // }

  useEffect(() => {
    const handleMidiEvent = (input: Input, event: NoteMessageEvent) => {
      console.log(`${input.name}: Note: ${event.note.identifier}`)

      Object.keys(scenes).forEach((sceneKey) => {
        const scene = scenes[sceneKey]
        // console.log(scene)
        if (
          scene.scene_midiactivate ===
          `${input.name}: Note: ${event.note.identifier}`
        ) {
          console.log('get here?')
          activateScene(sceneKey)
          console.log('get here? 2')
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
                // console.log(`${input.name}: Note: ${event.note.identifier}`)
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
