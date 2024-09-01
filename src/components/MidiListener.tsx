import { useEffect, useState } from 'react'
import { WebMidi, Input } from 'webmidi'
import useStore from '../store/useStore'

function setAllButtonsToBlack(output: WebMidi.MIDIOutput) {
  for (let i = 0; i < 81; i++) {
    output?.send([0x90, i, 0]);
  }
}

const MIDIListener = () => {
  const togglePause = useStore((state) => state.togglePause)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const setSystemSetting = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value })
  }
  const oneShotAll = useStore((state) => state.oneShotAll)
  const toggleScenePLplay = useStore((state) => state.toggleScenePLplay)
  const [bright, setBright] = useState(1)
  const scenes = useStore((state) => state.scenes)
  const activateScene = useStore((state) => state.activateScene)
  const captivateScene = useStore((state) => state.captivateScene)
  const smartBarPadOpen = useStore(
    (state) => state.ui.bars && state.ui.bars.smartBarPad.open
  )
  const setSmartBarPadOpen = useStore(
    (state) => state.ui.bars && state.ui.setSmartBarPadOpen
  )
  const setScene = (e: string) => {
    activateScene(e)
    if (scenes[e]?.scene_puturl && scenes[e]?.scene_payload)
      captivateScene(scenes[e]?.scene_puturl, scenes[e]?.scene_payload)
  }
  const setMidiEvent = useStore((state) => state.setMidiEvent)
  const setMidiInputs = useStore((state) => state.setMidiInputs)
  const setMidiOutputs = useStore((state) => state.setMidiOutputs)
  const midiInput = useStore((state) => state.midiInput)
  const midiOutput = useStore((state) => state.midiOutput)
  const midiMapping = useStore((state) => state.midiMapping)
  const midiEvent = useStore((state) => state.midiEvent)
  
  const setMidiMapping = useStore((state) => state.setMidiMapping)

  const sceneDialogOpen = useStore(
    (state) => state.dialogs.addScene.sceneKey !== ''
  )

  function handleButtonPress(command: string, payload?: any) {
    if (command === 'scene' && payload?.scene) {
      setScene(payload.scene);
    } else if (command === 'smartbar') {
      setSmartBarPadOpen(!smartBarPadOpen);
    } else if (command === 'play/pause') {
      togglePause();
    } else if (command === 'brightness-up') {
      setSystemSetting(
        'global_brightness',
        1
      );
      setBright(Math.min(bright + 0.1, 1))
    } else if (command === 'brightness-down') {
      setSystemSetting(
        'global_brightness',
        0.3
      )
      setBright(Math.max(bright - 0.2, 0))
    } else if (command === 'scene-playlist') {
      toggleScenePLplay();
    } else if (command === 'one-shot') {
      oneShotAll(
        payload?.color || '#0dbedc',
        payload?.ramp || 10,
        payload?.hold || 200,
        payload?.fade || 2000
      );
    }
  }

  useEffect(() => {
    // const handleMidiEvent = (input: Input, event: any) => {
    //   const midiInput = `${input.name} Note: ${event.note.identifier} buttonNumber: ${event.note.number}`
    //   setMidiEvent({
    //     name: input.name,
    //     note: event.note.identifier,
    //     button: event.note.number
    //   })

    //   // console.log(input, event)
    //   const output = WebMidi.getOutputByName(input.name)
    //   Object.keys(scenes).forEach((key) => {
    //     const scene = scenes[key]
    //     if (midiInput === String(scene.scene_midiactivate)) {
    //       if (!sceneDialogOpen) activateScene(key)
    //       localStorage.setItem('midiDeviceName', input.name) // Store MIDI device name
    //     } else if (!sceneDialogOpen) output?.send([0xb0, 0x00, 0x00])
    //   })
    // }

    const handleMidiInput = (input: Input) => {
      input.addListener('noteon', (event: any) => {
        if (!event.note || (midiEvent.button === event.note.number && midiEvent.name === input.name && midiEvent.note === event.note.identifier) || midiInput !== input.name) return
        // console.log('Note On:', event)
        setMidiEvent({
          name: input.name,
          note: event.note.identifier,
          button: event.note.number
        })
        // console.log('MIDI Mapping:', midiMapping, event.note.number)
        if (midiMapping[0][event.note.number]?.command !== undefined) {
          handleButtonPress(midiMapping[0][event.note.number]?.command!, midiMapping[0][event.note.number].payload)
        }
      })

      input.addListener('noteoff', (event: any) => {
        if (midiInput !== input.name) return
        // console.log('Note Off:', event)
        setMidiEvent({
          name: '',
          note: '',
          button: -1
        })
      })
      input.addListener('controlchange', (event: any) => {
        console.log('Control Change:', event.controller.number)
        if (event.controller.number === midiEvent.button && midiEvent.name === input.name) return
        if (event.value === 1) {
          setMidiEvent({
            name: input.name,
            note: 'CTRL',
            button: event.controller.number
          })
          if (midiMapping[0][event.controller.number]?.command !== undefined) {
            handleButtonPress(midiMapping[0][event.controller.number]?.command!, midiMapping[0][event.controller.number].payload)
          }
        } else {
          setMidiEvent({
            name: '',
            note: '',
            button: -1
          })
        }
      })
    }

    WebMidi.enable({
      callback: (err: any) => {
        if (err) {
          console.error('WebMidi could not be enabled:', err)
        } else {
          const { inputs, outputs } = WebMidi
          setMidiInputs(inputs.map((input) => input.name))
          setMidiOutputs(outputs.map((output) => output.name))          
          // console.log('WebMidi enabled:', inputs, outputs)
          if (inputs.length > 0) {
            inputs.forEach((input) => {
              handleMidiInput(input)
            })
          }
        }
      }
    })


    const handleWebsockets = (event: any) => {
      // console.log('Websocket Event:', event)
      const output = WebMidi.getOutputByName(midiOutput)
      // output?.send([0x90, 31, 30])
      if (output) setAllButtonsToBlack(output as any)
      // if (output) sendHexColorToLaunchpad(output as any, 91, "255")
      // if (output) {
      //   output.send([0x90, 91, 0])
      //   output.send([0x90, 92, 0])
      //   output.send([0x90, 94, 0])
      // }
      console.log(midiMapping)
      Object.entries(midiMapping[0]).forEach(([key, value]) => {
        if (value.command !== 'scene' && value.command !== 'none') {
          if (output) {
            output.send([0x90, parseInt(key), 99])
          }
        } else if (value.command === 'scene') {
          if (output) {
            output.send([0x90, parseInt(key), 60])
          }
        }
      })
      
      try {
        if (event.type === 'scene_activated') {
          const { scene_id } = event.detail
          Object.keys(scenes).forEach((key) => {
            const scene = scenes[key]
            // console.log('Scene:', scene)
            const buttonNumber = parseInt(
              scene.scene_midiactivate.split('buttonNumber: ')[1],
              10
            )
            if (key === scene_id) {
              // console.log('Output:', output)
              if (output) {
                output?.send([0xb0, 0x00, 0x00])
                // console.log('Button Number:', buttonNumber)
                if (!Number.isNaN(buttonNumber)) {
                  output?.send([0x90, buttonNumber, 30])
                }
              } else {
                console.error('No MIDI output devices found')
              }
            } else {
              if (output) {
                output?.send([0xb0, 0x00, 0x00])
                // console.log('Button Number:', buttonNumber)
                if (!Number.isNaN(buttonNumber)) {
                  output?.send([0x90, buttonNumber, 60])
                }
              } else {
                console.error('No MIDI output devices found')
              }
            }            
          })
        }
      } catch (error) {
        console.error('Error parsing websocket message:', error)
      }
    }
    // webSocket.addEventListener('open', handleOpen)
    document.addEventListener('scene_activated', handleWebsockets)
    return () => {
      document.removeEventListener('scene_activated', handleWebsockets)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes, sceneDialogOpen])

  // init midiMapping from scenes
  useEffect(() => {
    const mapping = {...midiMapping}
    Object.keys(scenes).forEach((key) => {
      const scene = scenes[key]
      if (!scene.scene_midiactivate) return
      const buttonNumber = parseInt(
        scene.scene_midiactivate.split('buttonNumber: ')[1],
        10
      )
      // console.log('Button Number:', buttonNumber) 
      mapping[0] = {
        ...mapping[0],
        [buttonNumber]: {
          command: 'scene',
          payload: { scene: key }
        }
      }
    })
    // console.log('MIDI Mapping:', mapping)
    setMidiMapping(mapping)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes])

  return null
}

export default MIDIListener
