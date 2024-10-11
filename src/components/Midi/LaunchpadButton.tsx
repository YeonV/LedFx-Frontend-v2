import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { darken, DialogContent, Divider, IconButton, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import LpColorPicker from './LpColorPicker'
import Assign from '../Gamepad/Assign'
import useStore from '../../store/useStore'
import { Autorenew, Save } from '@mui/icons-material'
import { MidiDevices } from '../../utils/MidiDevices/MidiDevices'
import ColorTypePicker from './ColorTypePicker'

const LaunchpadButton = ({
    uiButtonNumber,
    active,
    borderless,
    bgColor,
    children,
    hidden,
    showMidiLogs,
    ...props
}: {
    hidden?: boolean
    uiButtonNumber: number
    children: React.ReactNode
    active?: boolean
    borderless?: boolean
    bgColor?: string
    showMidiLogs?: boolean
}) => {
  // console.log(bgColor)
  const [open, setOpen] = useState(false)
  const midiMapping = useStore((state) => state.midiMapping)
  const midiEvent = useStore((state) => state.midiEvent)
  const midiType = useStore((state) => state.midiType)
  const midiModel = useStore((state) => state.midiModel)
  const getColorFromValue = useStore((state) => state.getColorFromValue)
  const initMidi = useStore((state) => state.initMidi)
  const setMidiMapping = useStore((state) => state.setMidiMapping)
  const midiSceneInactiveColor = useStore((state) => state.midiColors.sceneInactiveColor)
  const midiSceneActiveColor = useStore((state) => state.midiColors.sceneActiveColor)
  const midiCommandColor = useStore((state) => state.midiColors.commandColor)
  const midiSceneInactiveType = useStore((state) => state.midiColors.sceneInactiveType)
  const midiSceneActiveType = useStore((state) => state.midiColors.sceneActiveType)
  const midiCommandType = useStore((state) => state.midiColors.commandType)
  const setFeatures = useStore((state) => state.setFeatures)
  const togglePause = useStore((state) => state.togglePause)
  const global_brightness = useStore((state) => state.config.global_brightness)
  const glBrightness = useRef(global_brightness)
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

  const setSmartBarOpen = useStore(
    (state) => state.ui.bars && state.ui.setSmartBarOpen
  )
  const setScene = (e: string) => {
    activateScene(e)
    if (scenes[e]?.scene_puturl && scenes[e]?.scene_payload)
      captivateScene(scenes[e]?.scene_puturl, scenes[e]?.scene_payload)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const currentMapping = midiMapping[0][uiButtonNumber] || {};
  
  const [midiButtonNumber, setMidiButtonNumber] = useState(currentMapping.buttonNumber || 0)
  const [midiRecord, setMidiRecord] = useState(false)
  
  const lp = MidiDevices[midiType][midiModel]
  const isRgb = 'rgb' in lp.fn
  function handleButtonPress(command: string, payload?: any) {
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

  const handleColorSelect = (type: string, color: string | number) => {
    setMidiMapping({
      ...midiMapping,
      0: {
        ...midiMapping,
        [uiButtonNumber]: {
          ...currentMapping,
          [type]: color,
        },
      },
    });
  };

  useEffect(() => {
    if (midiRecord && midiEvent.button > -1) {
        setMidiButtonNumber(midiEvent.button)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midiEvent.button])

  return (
    <div style={{ visibility: hidden ? 'hidden' : 'visible'}}>
        <Button
            variant="outlined"
            onClick={() => currentMapping.command && currentMapping.command !== '' && currentMapping.command !== 'none' && handleButtonPress(currentMapping.command, currentMapping.payload)}
            onContextMenu={(e) => {
                e.preventDefault()
                handleClickOpen()                
            }} 
            sx={{ 
                width: 70,
                height: 70,
                borderRadius: 1,
                borderColor: active ? 'orange' : '#ccc',
                borderStyle: 'solid',
                borderWidth: borderless ? 0 : 1,
                color: active ? 'orange' : '#ccc',
                bgcolor: bgColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': {
                    backgroundColor: darken((bgColor || '#ffffff'), 0.2),
                  },
            }}
            {...props}
        >
        {children}
      </Button>
      <Dialog onClose={handleClose} open={open} 
        PaperProps={{
          sx: {            
            width: 400
          }
        }}>
        <DialogTitle>Edit Launchpad Button {uiButtonNumber}</DialogTitle>
        <DialogContent>
            <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                <Typography>MIDI Button</Typography>
                <Stack direction={'row'}>
                    <IconButton onClick={() => {
                        setMidiMapping({...midiMapping, 0: {...midiMapping[0], [uiButtonNumber]: {...currentMapping, buttonNumber: midiButtonNumber}}})
                        setMidiRecord(!midiRecord)
                    }}>{midiRecord ? <Save /> : <Autorenew />}</IconButton>
                    <TextField disabled value={midiButtonNumber} sx={{ width: 70 }} size='small' />
                </Stack>
            </Stack>
            <Assign
                type={'midi'}
                compact={false}
                padIndex={0}
                mapping={midiMapping}
                setMapping={setMidiMapping}
                pressed={false}
                index={`${uiButtonNumber}`}
                key={`${uiButtonNumber}`}
            />
            <Divider sx={{ mb: 2.5, mt: 1.5}} />
            <Stack direction={'column'} spacing={1} mt={1}>
              <Typography variant='h6'>Button Color</Typography>
              {currentMapping.command === 'scene' ? (
                <>
                  <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>Scene inactive</Typography>
                    <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                      <ColorTypePicker
                        value={currentMapping.typeSceneInactive || midiSceneInactiveType || '90'}
                        onChange={(e) => handleColorSelect('typeSceneInactive', e.target.value)}
                        isRgb={isRgb}
                      />
                      <LpColorPicker
                        type={currentMapping.typeSceneInactive || midiSceneInactiveType}
                        defaultColor={isRgb && (currentMapping.colorSceneInactive || midiSceneInactiveColor).startsWith('rgb') ? currentMapping.colorSceneInactive || midiSceneInactiveColor : getColorFromValue((currentMapping.colorSceneInactive || midiSceneInactiveColor))}
                        onColorSelect={(color) => handleColorSelect('colorSceneInactive', color)}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>Scene active</Typography>
                    <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                      <ColorTypePicker
                        value={currentMapping.typeSceneActive || midiSceneActiveType || '90'}
                        onChange={(e) => handleColorSelect('typeSceneActive', e.target.value)}
                        isRgb={isRgb}
                      />
                      <LpColorPicker
                        type={currentMapping.typeSceneActive || midiSceneActiveType}
                        defaultColor={isRgb && (currentMapping.colorSceneActive || midiSceneActiveColor).startsWith('rgb') ? currentMapping.colorSceneActive || midiSceneActiveColor : getColorFromValue((currentMapping.colorSceneActive || midiSceneActiveColor))}
                        onColorSelect={(color) => handleColorSelect('colorSceneActive', color)}
                      />
                    </Stack>
                  </Stack>
                </>
              ) : (
                <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                  <ColorTypePicker
                    value={currentMapping.typeCommand || midiCommandType || '90'}
                    onChange={(e) => handleColorSelect('typeCommand', e.target.value)}
                    isRgb={isRgb}
                  />
                  <LpColorPicker
                    type={currentMapping.typeCommand || midiCommandType}
                    midiButtonNumber={midiButtonNumber}
                    defaultColor={isRgb && (currentMapping.colorCommand || midiCommandColor).startsWith('rgb') ? currentMapping.colorCommand || midiCommandColor : getColorFromValue((currentMapping.colorCommand || midiCommandColor))}
                    onColorSelect={(color) => handleColorSelect('colorCommand', color)}
                  />
                </Stack>
              )}
            </Stack>
            <Stack direction={'row'} justifyContent={'flex-end'} spacing={1} mt={5}>
                <Button onClick={() => handleClose()}>
                    Cancel
                </Button>
                <Button onClick={() => {
                    initMidi()
                    handleClose()
                }}>
                    Save
                </Button>
            </Stack>
        </DialogContent>
        </Dialog>
    </div>
  )
}

export default LaunchpadButton