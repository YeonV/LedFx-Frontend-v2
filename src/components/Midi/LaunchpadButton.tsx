import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import {
  darken,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import LpColorPicker from './LpColorPicker'
import Assign from '../Gamepad/Assign'
import useStore from '../../store/useStore'
import { Autorenew, Save } from '@mui/icons-material'
import { IMidiDevice, MidiDevices } from '../../utils/MidiDevices/MidiDevices'
import ColorTypePicker from './ColorTypePicker'
import { executeCommand } from '../../utils/commandHandler'

const LaunchpadButton = ({
  uiButtonNumber,
  active,
  borderless,
  bgColor,
  children,
  hidden,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
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

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const currentMapping = midiMapping[0][uiButtonNumber] || {}

  const [midiButtonNumber, setMidiButtonNumber] = useState(currentMapping.buttonNumber || 0)
  const [midiRecord, setMidiRecord] = useState(false)

  const lp = MidiDevices[midiType][midiModel] as IMidiDevice
  const isRgb = 'rgb' in lp.fn

  const handleColorSelect = (type: string, color: string | number) => {
    setMidiMapping({
      ...midiMapping,
      0: {
        ...midiMapping[0],
        [uiButtonNumber]: {
          ...currentMapping,
          [type]: color
        }
      }
    })
  }

  useEffect(() => {
    if (midiRecord && midiEvent.button > -1) {
      setMidiButtonNumber(midiEvent.button)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midiEvent.button])

  //  const [row, col] = uiButtonNumber.toString().split('').map(Number)

  return (
    <div style={{ visibility: hidden ? 'hidden' : 'visible' }}>
      <Button
        variant="outlined"
        onMouseDownCapture={(e) => {
          if (e.button !== 0) {
            return
          }
          if (
            currentMapping.command &&
            currentMapping.command !== '' &&
            currentMapping.command !== 'none'
          ) {
            return executeCommand(currentMapping.command, currentMapping.payload)
          }
        }}
        onMouseUpCapture={() => {
          // console.log('mouseup', currentMapping.payload)
          if (
            typeof currentMapping.payload?.fallback === 'boolean' &&
            currentMapping.payload?.fallback === true
          ) {
            executeCommand('effect-fallback', currentMapping.payload)
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          handleClickOpen()
        }}
        sx={[
          {
            width: 70,
            height: 70,
            borderRadius: 1,

            borderStyle: 'solid',
            bgcolor: bgColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            '&:hover': {
              backgroundColor: darken(bgColor || '#ffffff', 0.2)
            }
          },
          active
            ? {
                borderColor: 'orange'
              }
            : {
                borderColor: '#ccc'
              },
          borderless
            ? {
                borderWidth: 0
              }
            : {
                borderWidth: 1
              },
          active
            ? {
                color: 'orange'
              }
            : {
                color: '#ccc'
              }
        ]}
        {...props}
      >
        {children}
      </Button>
      <Dialog
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: {
            width: 400
          }
        }}
      >
        <DialogTitle>Edit Launchpad Button {uiButtonNumber}</DialogTitle>
        <DialogContent>
          <Stack
            direction={'row'}
            spacing={2}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography>MIDI Button</Typography>
            <Stack direction={'row'}>
              <IconButton
                onClick={() => {
                  setMidiMapping({
                    ...midiMapping,
                    0: {
                      ...midiMapping[0],
                      [uiButtonNumber]: {
                        ...currentMapping,
                        buttonNumber: midiButtonNumber
                      }
                    }
                  })
                  setMidiRecord(!midiRecord)
                }}
              >
                {midiRecord ? <Save /> : <Autorenew />}
              </IconButton>
              <TextField disabled value={midiButtonNumber} sx={{ width: 70 }} size="small" />
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
          <Divider sx={{ mb: 2.5, mt: 1.5 }} />
          <Stack direction={'column'} spacing={1} mt={1}>
            <Typography variant="h6">Button Color</Typography>
            {currentMapping.command === 'scene' ? (
              <>
                <Stack
                  direction={'row'}
                  spacing={2}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography>Scene inactive</Typography>
                  <Stack
                    direction={'row'}
                    spacing={2}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <ColorTypePicker
                      value={currentMapping.typeSceneInactive || midiSceneInactiveType || '90'}
                      onChange={(e) => handleColorSelect('typeSceneInactive', e.target.value)}
                      isRgb={isRgb}
                    />
                    <LpColorPicker
                      type={currentMapping.typeSceneInactive || midiSceneInactiveType}
                      defaultColor={
                        isRgb &&
                        (currentMapping.colorSceneInactive || midiSceneInactiveColor).startsWith(
                          'rgb'
                        )
                          ? currentMapping.colorSceneInactive || midiSceneInactiveColor
                          : getColorFromValue(
                              currentMapping.colorSceneInactive || midiSceneInactiveColor
                            )
                      }
                      onColorSelect={(color) => handleColorSelect('colorSceneInactive', color)}
                    />
                  </Stack>
                </Stack>
                <Stack
                  direction={'row'}
                  spacing={2}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography>Scene active</Typography>
                  <Stack
                    direction={'row'}
                    spacing={2}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <ColorTypePicker
                      value={currentMapping.typeSceneActive || midiSceneActiveType || '90'}
                      onChange={(e) => handleColorSelect('typeSceneActive', e.target.value)}
                      isRgb={isRgb}
                    />
                    <LpColorPicker
                      type={currentMapping.typeSceneActive || midiSceneActiveType}
                      defaultColor={
                        isRgb &&
                        (currentMapping.colorSceneActive || midiSceneActiveColor).startsWith('rgb')
                          ? currentMapping.colorSceneActive || midiSceneActiveColor
                          : getColorFromValue(
                              currentMapping.colorSceneActive || midiSceneActiveColor
                            )
                      }
                      onColorSelect={(color) => handleColorSelect('colorSceneActive', color)}
                    />
                  </Stack>
                </Stack>
              </>
            ) : (
              <Stack
                direction={'row'}
                spacing={2}
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <ColorTypePicker
                  value={currentMapping.typeCommand || midiCommandType || '90'}
                  onChange={(e) => handleColorSelect('typeCommand', e.target.value)}
                  isRgb={isRgb}
                />
                <LpColorPicker
                  type={currentMapping.typeCommand || midiCommandType}
                  midiButtonNumber={midiButtonNumber}
                  defaultColor={
                    isRgb && (currentMapping.colorCommand || midiCommandColor).startsWith('rgb')
                      ? currentMapping.colorCommand || midiCommandColor
                      : getColorFromValue(currentMapping.colorCommand || midiCommandColor)
                  }
                  onColorSelect={(color) => handleColorSelect('colorCommand', color)}
                />
              </Stack>
            )}
          </Stack>
          <Stack direction={'row'} justifyContent={'flex-end'} spacing={1} mt={5}>
            <Button onClick={() => handleClose()}>Cancel</Button>
            <Button
              onClick={() => {
                initMidi()
                handleClose()
              }}
            >
              Save
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LaunchpadButton
