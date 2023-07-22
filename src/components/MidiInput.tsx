/* eslint-disable no-console */
import { useEffect } from 'react'
import { WebMidi, Input } from 'webmidi'
import useStore from '../store/useStore'

const MIDIListener = () => {
  const scenes = useStore((state) => state.scenes)
  const activateScene = useStore((state) => state.activateScene)

  useEffect(() => {
    const handleMidiEvent = (input: Input, event: any) => {
      const midiInput = `${input.name} Note: ${event.note.identifier} buttonNumber: ${event.note.number}`
      // Doubleched Launchpad on backend and no impact implementing the below. Backend LED launchpad will take preference.
      const output = WebMidi.getOutputByName(input.name)
      Object.keys(scenes).forEach((key) => {
        const scene = scenes[key]
        if (midiInput === String(scene.scene_midiactivate)) {
          activateScene(key)
        } else {
          output.send([0xb0, 0x00, 0x00])
        }
      })
    }

    const handleMidiInput = (input: Input) => {
      input.addListener('noteon', (event: any) => {
        handleMidiEvent(input, event)
      })
    }

    WebMidi.enable({
      callback: (err: any) => {
        if (err) {
          console.error('WebMidi could not be enabled:', err)
        } else {
          const { inputs } = WebMidi
          if (inputs.length > 0) {
            inputs.forEach((input) => {
              handleMidiInput(input)
            })
          }
        }
      },
    })

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
            const scene = scenes[key]
            if (scene.name === scene_id) {
              const inputName =
                scene.scene_midiactivate.split(' Note:')[0] ||
                '2- Launchpad S 16'
              const buttonNumber = parseInt(
                scene.scene_midiactivate.split('buttonNumber: ')[1],
                10
              )
              const output = WebMidi.getOutputByName(inputName)

              if (output) {
                output.send([0xb0, 0x00, 0x00])

                if (!Number.isNaN(buttonNumber)) {
                  output.send([0x90, buttonNumber, 60])
                }
              } else {
                console.error('Output device not found/Not defined:', inputName)
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
