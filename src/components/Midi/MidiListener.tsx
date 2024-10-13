import { useEffect, useRef, useState } from 'react'
import { WebMidi, Input, Output } from 'webmidi'
import { MidiDevices } from '../../utils/MidiDevices/MidiDevices'
import { sendMidiMessageHelper } from '../../utils/MidiDevices/colorHelper'
import useStore from '../../store/useStore'

const MIDIListener = () => {
  const [bright, setBright] = useState(1)
  const midiInitialized = useStore((state) => state.midiInitialized)
  const scenes = useStore((state) => state.scenes)
  const midiSceneInactiveColor = useStore((state) => state.midiColors.sceneInactiveColor)
  const midiSceneActiveColor = useStore((state) => state.midiColors.sceneActiveColor)
  const commandColor = useStore((state) => state.midiColors.commandColor)
  const midiType = useStore((state) => state.midiType)
  const midiModel = useStore((state) => state.midiModel)
  const recentScenes = useStore((state) => state.recentScenes)
  const midiInput = useStore((state) => state.midiInput)
  const midiOutput = useStore((state) => state.midiOutput)
  const midiMapping = useStore((state) => state.midiMapping)
  const blockMidiHandler = useStore((state) => state.blockMidiHandler)
  const midiEvent = useStore((state) => state.midiEvent)
  const global_brightness = useStore((state) => state.config.global_brightness)
  const glBrightness = useRef(global_brightness)
  const setFeatures = useStore((state) => state.setFeatures)
  const togglePause = useStore((state) => state.togglePause)
  const getUiBtnNo = useStore((state) => state.getUiBtnNo)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const oneShotAll = useStore((state) => state.oneShotAll)
  const toggleScenePLplay = useStore((state) => state.toggleScenePLplay)
  const activateScene = useStore((state) => state.activateScene)
  const captivateScene = useStore((state) => state.captivateScene)
  const setSmartBarOpen = useStore((state) => state.ui.bars && state.ui.setSmartBarOpen)
  const setMidiEvent = useStore((state) => state.setMidiEvent)
  const setMidiInputs = useStore((state) => state.setMidiInputs)
  const setMidiOutputs = useStore((state) => state.setMidiOutputs)
  const setMidiInput = useStore((state) => state.setMidiInput)
  const setMidiOutput = useStore((state) => state.setMidiOutput)
  const setMidiMapping = useStore((state) => state.setMidiMapping)  

  const sceneDialogOpen = useStore((state) => state.dialogs.addScene.sceneKey !== '')
  const lp = MidiDevices[midiType][midiModel]
  const fn = lp.fn
  
  const setSystemSetting = (setting: string, value: any) => { setSystemConfig({ [setting]: value }) }

  const setScene = (e: string) => {
    activateScene(e)
    if (scenes[e]?.scene_puturl && scenes[e]?.scene_payload)
      captivateScene(scenes[e]?.scene_puturl, scenes[e]?.scene_payload)
  }
  

  function handleButtonPress(command: string, payload?: any) {
    if (blockMidiHandler) return
    if (command === 'scene' && payload?.scene) {
      setScene(payload.scene)
    } else if (command === 'smartbar') {
      setSmartBarOpen(!useStore.getState().ui.bars.smartBar.open)
    } else if (command === 'play/pause') {
      togglePause()
    } else if (command === 'brightness-up') {
      setSystemSetting(
        'global_brightness',
        Math.min(glBrightness.current + 0.1, 1).toFixed(2)
      )
      glBrightness.current = Math.min(glBrightness.current + 0.1, 1)
      setBright(Math.min(bright + 0.1, 1))
    } else if (command === 'brightness-down') {
      setSystemSetting(
        'global_brightness',
        Math.max(glBrightness.current - 0.1, 0).toFixed(2)
      )
      glBrightness.current = Math.min(glBrightness.current - 0.1, 1)
      setBright(Math.max(bright - 0.1, 0))
    } else if (command === 'scene-playlist') {
      toggleScenePLplay()
    } else if (command === 'one-shot') {
      oneShotAll(
        payload?.color || '#0dbedc',
        payload?.ramp || 10,
        payload?.holdType !== 'release' ? (payload?.hold || 200) : 10000,
        payload?.fade || 2000
      )
    } else if (command === 'copy-to') {
      setFeatures('streamto', !useStore.getState().features.streamto)
    } else if (command === 'transitions') {
      setFeatures('transitions', !useStore.getState().features.transitions)
    } else if (command === 'frequencies') {
      setFeatures('frequencies', !useStore.getState().features.frequencies)
    }
  }

  const getMappingByButtonNumber = (buttonNumber: number) => {
    return Object.values(midiMapping[0]).find(mapping => mapping.buttonNumber === buttonNumber)
  }

  const initLeds = (output: Output) => {
    if (!output) return
  
    Object.entries(midiMapping[0]).forEach(([key, value]) => {
      const buttonNumber = value.buttonNumber
      if (buttonNumber === -1) return
  
      const sendMidiMessage = (color: string, typeCommand: string) => {
        // console.log(1,'color',color, typeCommand, lp.globalColors.commandType)
        sendMidiMessageHelper(fn, output, buttonNumber, color, typeCommand, false)
      }
  
      try {
        if (value.command !== 'scene' && value.command && value.command !== 'none') {
          const color = value.colorCommand || commandColor
          // console.log(1,'color',color, value.typeCommand, lp.globalColors.commandType)
          sendMidiMessage(color, color.startsWith('rgb') ? 'rgb': value.typeCommand || lp.globalColors.commandType)
        } else if (value.command === 'scene') {
          const colorActive = value.colorSceneActive || midiSceneActiveColor
          const colorInactive = value.colorSceneInactive || midiSceneInactiveColor
          const isActiveScene = value.payload?.scene === recentScenes
          const color = isActiveScene ? colorActive : colorInactive
          const typeCommand = isActiveScene ? value.typeSceneActive : value.typeSceneInactive
          sendMidiMessage(color, typeCommand || lp.globalColors.commandType)
        }
      } catch (error) {
        console.error('Error sending MIDI message:', error)
      }
    })
  }  
  
  useEffect(() => {
    const handleMidiInput = (input: Input) => {
      if (!input || input.name !== midiInput) return
  
      input.removeListener('noteon')
      input.removeListener('noteoff')
      input.removeListener('controlchange')
  
      input.addListener('noteon', (event: any) => handleNoteOn(event, input))
      input.addListener('noteoff', (event: any) => handleNoteOff(event, input))
      input.addListener('controlchange', (event: any) => handleControlChange(event, input))
    }
  
    const handleNoteOn = (event: any, input: Input) => {
      if (!event.note || (midiEvent.button === event.note.number && midiEvent.name === input.name && midiEvent.note === event.note.identifier)) return
  
      setMidiEvent({
        name: input.name,
        note: event.note.identifier,
        button: event.note.number
      })
  
      const mapping = getMappingByButtonNumber(event.note.number)
      if (mapping?.command !== undefined) {
        handleButtonPress(mapping.command, mapping.payload)
      }
    }
  
    const handleNoteOff = (event: any, input: Input) => {
      const mapping = getMappingByButtonNumber(event.note.number)
      if (mapping?.command === 'one-shot' && mapping?.payload?.holdType === 'release') {
        oneShotAll(
          mapping.payload?.color || '#0dbedc',
          mapping.payload?.ramp || 10,
          1,
          mapping.payload?.fade || 220
        )
      }
      if (midiInput !== input.name) return
      setMidiEvent({
        name: '',
        note: '',
        button: -1
      })
    }
  
    const handleControlChange = (event: any, input: Input) => {
      if (event.controller.number === midiEvent.button && midiEvent.name === input.name) return
      if (event.value === 1) {
        setMidiEvent({
          name: input.name,
          note: 'CTRL',
          button: event.controller.number
        })
  
        const mapping = getMappingByButtonNumber(event.controller.number)
        if (mapping?.command !== undefined) {
          handleButtonPress(mapping.command, mapping.payload)
        }
      } else {
        setMidiEvent({
          name: '',
          note: '',
          button: -1
        })
      }
    }
  
    const enableWebMidi = () => {
      WebMidi.enable({
        sysex: true,
        callback: (err: any) => {
          if (err) {
            console.error('WebMidi could not be enabled:', err)
            alert('Please re-grant MIDI permissions to use this feature.')
          } else {
            const { inputs, outputs } = WebMidi
            setMidiInputs(inputs.map((input) => input.name))
            setMidiOutputs(outputs.map((output) => output.name))
            if (midiInput === '') setMidiInput(inputs[inputs.length - 1]?.name)
            if (midiOutput === '') setMidiOutput(outputs[inputs.length - 1]?.name)
            const output = outputs[inputs.length - 1]
            const lp = MidiDevices[midiType][midiModel].fn
  
            Object.entries(midiMapping[0]).forEach(([key, value]) => {
              const buttonNumber = value.buttonNumber
              if (!value.command || value.command === 'none' || buttonNumber === -1) {
                if (output && buttonNumber !== -1) {
                  try {
                    output.send(lp.ledOff(buttonNumber))
                  } catch (error) {
                    console.error('Error sending MIDI message:', error)
                  }
                }
                return
              }
            })
  
            if (inputs.length > 0) {
              inputs.forEach((input) => {
                handleMidiInput(input)
              })
            }
  
            initLeds(output)
          }
        }
      })
    }
  
    const handleWebsockets = (event: any) => {
      const output = WebMidi.getOutputByName(midiOutput)
      try {
        if (event.type === 'scene_activated') {
          const { scene_id } = event.detail
          Object.keys(scenes).forEach((key) => {
            const scene = scenes[key]
            const buttonNumber = parseInt(scene.scene_midiactivate?.split('buttonNumber: ')[1], 10)
            const uiButtonNumber = getUiBtnNo(buttonNumber)
            const value = uiButtonNumber && midiMapping[0][uiButtonNumber]
            if (!value || value.command !== 'scene') return
            if (key === scene_id) {
              sendSceneMidiMessage(output, buttonNumber, value, true)
            } else {
              sendSceneMidiMessage(output, buttonNumber, value, false)
            }
          })
        }
      } catch (error) {
        console.error('Error parsing websocket message:', error)
      }
    }
  
    const sendSceneMidiMessage = (output: any, buttonNumber: number, value: any, isActive: boolean) => {
      const color = isActive ? (value.colorSceneActive || midiSceneActiveColor || lp.globalColors.sceneActiveColor) : (value.colorSceneInactive || midiSceneInactiveColor || lp.globalColors.sceneInactiveColor)
      const typeCommand = isActive ? (value.typeSceneActive || lp.globalColors.sceneActiveType) : (value.typeSceneInactive || lp.globalColors.sceneInactiveType)
      sendMidiMessageHelper(fn, output, buttonNumber, color, typeCommand, isActive)
    }      
  
    enableWebMidi()
    document.addEventListener('scene_activated', handleWebsockets)
  
    return () => {
      document.removeEventListener('scene_activated', handleWebsockets)
    }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes, sceneDialogOpen, midiInitialized])  


  // init midiMapping from scenes
  useEffect(() => {
    const mapping = {...midiMapping}
    Object.keys(scenes).forEach((key) => {
      const scene = scenes[key]
      if (!scene.scene_midiactivate) return
      const buttonNumber = parseInt(scene.scene_midiactivate.split('buttonNumber: ')[1], 10)
      const uiButtonNumber = getUiBtnNo(buttonNumber) || -1
      mapping[0] = {
        ...mapping[0],
        [uiButtonNumber]: {
          ...mapping[0][uiButtonNumber],
          command: 'scene',
          payload: { scene: key },
          buttonNumber: buttonNumber
        }
      }
    })
    setMidiMapping(mapping)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes])

  return null
}

export default MIDIListener
