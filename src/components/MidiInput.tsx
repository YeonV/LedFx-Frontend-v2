/* eslint-disable no-console */
import { useEffect } from 'react'
import { WebMidi, Input, NoteMessageEvent } from 'webmidi'
import useStore from '../store/useStore'

const MIDIListener = () => {
  const scenes = useStore((state) => state.scenes)
  const activateScene = useStore((state) => state.activateScene)

  useEffect(() => {
    const handleMidiEvent = (input: Input, event: NoteMessageEvent) => {
      const midiInput = `${input.name} Note: ${event.note.identifier} buttonNumber: ${event.note.number}`
      const inputName = '2- Launchpad S 16'
      const output = WebMidi.getOutputByName(inputName)

      if (output) {
        // Reset all LEDs to off
        output.send([0xb0, 0x00, 0x00])
      } else {
        console.error('Output device not found')
      }

      Object.keys(scenes).forEach((key) => {
        const scene = scenes[key] as { scene_midiactivate: string }

        if (midiInput === String(scene.scene_midiactivate)) {
          activateScene(key)

          if (output) {
            // Set the LED of the pressed button to on
            const buttonNumber = parseInt(
              scene.scene_midiactivate.split(':')[1].trim(),
              10
            )
            output.send([0x90, buttonNumber, 60])
          } else {
            console.error('Output device not found')
          }
        }
      })
    }

    const handleMidiInput = (input: Input) => {
      input.addListener('noteon', (event: NoteMessageEvent) => {
        handleMidiEvent(input, event)
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
              handleMidiInput(input)
            })
          }
        }
      },
    })

    // Websocket setup
    const webSocket = new WebSocket('ws://localhost:8888/api/websocket')
    webSocket.addEventListener('open', () => {
      const message = JSON.stringify({
        event_type: 'scene_activated',
        id: 100,
        type: 'subscribe_event',
      })
      webSocket.send(message)
    })

    webSocket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'event' && data.event_type === 'scene_activated') {
          const { scene_id } = data
          Object.keys(scenes).forEach((key) => {
            const scene = scenes[key] as {
              name: any
              scene_midiactivate: string
            }
            console.log(scene)
            if (scene.name === scene_id) {
              const inputName = '2- Launchpad S 16'
              const buttonNumber = 113
              console.log(buttonNumber)
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
      } catch (error) {
        console.error('Error parsing websocket message:', error)
      }
    })
  }, [])

  return null
}

export default MIDIListener
