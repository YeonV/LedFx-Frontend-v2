import { useState, useEffect } from 'react'
import {
  Box,
  Grid2 as Grid,
  Paper,
  Typography,
  Popover,
  Button,
  useTheme
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { darken } from '@mui/material/styles'
import {
  IColor,
  rgbValues,
  sortColorsByHSL,
  zeroPadHex
} from '../../utils/MidiDevices/colorHelper'
import useStore from '../../store/useStore'
import { MidiDevices } from '../../utils/MidiDevices/MidiDevices'
import ReactGPicker from 'react-gcolor-picker'
import { WebMidi } from 'webmidi'

interface LpColorPickerProps {
  onColorSelect: (_color: string) => void
  defaultColor?: IColor | string
  midiButtonNumber?: number
  type: string
  height?: number
}

const LpColorPicker = ({
  onColorSelect,
  defaultColor,
  midiButtonNumber,
  type = '90',
  height = 32
}: LpColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState<IColor | string | null>(
    null
  )
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const midiOutput = useStore((state) => state.midiOutput)
  const midiType = useStore((state) => state.midiType)
  const midiModel = useStore((state) => state.midiModel)
  const colors = MidiDevices[midiType][midiModel].colors
  const getColorFromValue = useStore((state) => state.getColorFromValue)
  const output =
    WebMidi.enabled &&
    (midiOutput !== ''
      ? WebMidi.getOutputByName(midiOutput)
      : WebMidi.outputs[1])
  const lp = MidiDevices[midiType][midiModel]
  const isRgb = 'rgb' in lp.fn

  useEffect(() => {
    if (isRgb && defaultColor?.startsWith('rgb')) {
      setSelectedColor(defaultColor as string)
    } else {
      if (defaultColor && colors[defaultColor as keyof typeof colors]) {
        setSelectedColor(defaultColor as IColor)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultColor])

  const handleColorClick = (color: IColor) => {
    setSelectedColor(color)
    if (onColorSelect) {
      onColorSelect(
        isRgb && color.startsWith('rgb')
          ? color
          : zeroPadHex(colors[color as keyof typeof colors])
      )
    }
    setAnchorEl(null)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    if (isRgb && selectedColor?.startsWith('rgb')) {
      handleColorClick(selectedColor as string)
    }
    setAnchorEl(null)
  }
  const sortedColors = sortColorsByHSL(Object.keys(colors) as IColor[])
  const open = Boolean(anchorEl)
  const id = open ? 'color-popover' : undefined

  return (
    <Box>
      <Button
        endIcon={<ArrowDropDownIcon />}
        onClick={handleClick}
        sx={{
          display: 'flex',
          pr: 0,
          height,
          alignItems: 'center',
          backgroundColor: selectedColor || defaultColor,
          color: theme.palette.getContrastText(
            (selectedColor || defaultColor || '#000000') as string
          ),
          '&:hover': {
            backgroundColor: darken(
              selectedColor || defaultColor || '#ffffff',
              0.2
            )
          }
        }}
      >
        {isRgb && selectedColor?.startsWith('rgb')
          ? ''
          : selectedColor
            ? zeroPadHex(colors[selectedColor as keyof typeof colors])
            : zeroPadHex((colors as any)[defaultColor || '#FF0000']) || ''}
        {/* : zeroPadHex(((colors as any)[(defaultColor || '#FF0000')]).toString(16).toUpperCase())  || ''} */}
      </Button>
      {/* <LpRgbColorPicker value={selectedColor || defaultColor || '#000000'} onChange={onColorSelect} /> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Box
          sx={[
            {
              overflowY: 'auto',
              p: 1
            },
            isRgb
              ? {
                  maxHeight: 700
                }
              : {
                  maxHeight: 300
                },
            isRgb
              ? {
                  width: 283
                }
              : {
                  width: 200
                }
          ]}
        >
          {isRgb && type === 'rgb' ? (
            <ReactGPicker
              format="rgb"
              showAlpha={false}
              debounceMS={8}
              defaultColors={Object.keys(lp.colors)}
              value={
                isRgb
                  ? defaultColor || '#FF0000'
                  : getColorFromValue(defaultColor || '#FF0000') || '#FF0000'
              }
              onChange={(color: string) => {
                setSelectedColor(color)
                const [r, g, b] = rgbValues(color) || [255, 0, 0]
                if (output && 'rgb' in lp.fn && lp.fn.rgb && midiButtonNumber) {
                  output.send(lp.fn.rgb(midiButtonNumber, r, g, b))
                }
              }}
            />
          ) : (
            <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 1, width: 200 }}>
              <Grid container spacing={1}>
                {sortedColors.map((color: IColor) => (
                  <Grid key={color} size={3}>
                    <Paper
                      sx={[
                        {
                          backgroundColor: color,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        },
                        selectedColor === color
                          ? {
                              border: '2px solid black'
                            }
                          : {
                              border: 'none'
                            }
                      ]}
                      onClick={() => handleColorClick(color)}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.getContrastText(color as string)
                        }}
                      >
                        {zeroPadHex(colors[color as keyof typeof colors])}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default LpColorPicker
