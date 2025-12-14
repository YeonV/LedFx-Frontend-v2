import React, { useState, FC, useCallback, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {
  Box,
  Button,
  DialogActions,
  IconButton,
  Slider,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Colorize, ArrowLeft, ArrowRight } from '@mui/icons-material'
import useStore from '../../../../store/useStore'
import GifFrame from './GifFrame'

// interface Gif {
//   name: string
//   url: string
// }

interface GifFramePickerProps {
  onChange: (_url: string) => void
  model: any
}

const GifFramePicker: FC<GifFramePickerProps> = ({ onChange, model }: GifFramePickerProps) => {
  const [open, setOpen] = useState(false)
  const [imageData, setImageData] = useState<string[]>([])
  const getGifFrames = useStore((state) => state.getGifFrames)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [loadedImageLocation, setLoadedImageLocation] = useState<string | null>(null)
  const [workingBeatFrames, setWorkingBeatFrames] = useState<string>('')

  const handleClickOpen = async () => {
    // Initialize working state from model when opening
    setWorkingBeatFrames(model.beat_frames || '')
    
    // Only fetch frames if not loaded or if image_location changed
    if (!loadedImageLocation || loadedImageLocation !== model.image_location) {
      if (model.image_location) {
        const result = await getGifFrames(model.image_location)
        setImageData(result.frames)
        setLoadedImageLocation(model.image_location)
        setCurrentFrame(0) // Reset to first frame when loading new GIF
      }
    }
    setOpen(true)
  }

  const handleClose = () => {
    // Write the final state on close
    onChange(workingBeatFrames)
    setOpen(false)
  }

  return (
    <>
      <Button onClick={handleClickOpen} sx={{ alignSelf: 'center' }}>
        <Colorize />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: '960px', maxWidth: 'unset' } }}
      >
        <DialogTitle>GIF Frame Picker</DialogTitle>
        <DialogContent sx={{ minWidth: 332, width: '100%' }}>
          {imageData && (
            <>
              {false && (
                <TextField
                  disabled
                  label="Selected Beat Frames"
                  value={model.beat_frames}
                  onChange={(e) => onChange(e.target.value)}
                  sx={{ margin: '20px 0', minWidth: '522px' }}
                />
              )}
              <Box>
                <Typography variant="h6" color="GrayText" align="center" mb={1}>
                  Click on image to select/deselect
                </Typography>
              </Box>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <GifFrame image={imageData[currentFrame - 1]} />
                <GifFrame
                  image={imageData[currentFrame]}
                  selected={workingBeatFrames.split(' ').filter(Boolean).includes(currentFrame.toString())}
                  onClick={() => {
                    const currentFrames = workingBeatFrames.split(' ').filter(Boolean)
                    let output = ''
                    if (currentFrames.includes(currentFrame.toString())) {
                      output = currentFrames
                        .filter((b: string) => b !== currentFrame.toString())
                        .join(' ')
                    } else {
                      output = [...currentFrames, currentFrame.toString()]
                        .sort((a: string, b: string) => parseInt(a, 10) - parseInt(b, 10))
                        .join(' ')
                    }
                    setWorkingBeatFrames(output)
                    onChange(output)
                  }}
                />
                <GifFrame image={imageData[currentFrame + 1]} />
              </div>
              <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                <IconButton
                  onClick={() => setCurrentFrame(currentFrame - 1)}
                  disabled={currentFrame === 0}
                >
                  <ArrowLeft />
                </IconButton>
                <Typography variant="h5" align="center" mt={1}>
                  {currentFrame}
                </Typography>
                <IconButton
                  size="large"
                  onClick={() => setCurrentFrame(currentFrame + 1)}
                  disabled={currentFrame === imageData.length - 1}
                >
                  <ArrowRight fontSize="inherit" />
                </IconButton>
              </Stack>

              <Box sx={{ maxWidth: 860, mt: 2, ml: 3 }}>
                <Slider
                  value={currentFrame}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                  step={1}
                  marks={workingBeatFrames.split(' ').filter(Boolean).map((b: string) => ({
                    value: parseInt(b, 10),
                    label: b
                  }))}
                  min={0}
                  max={imageData.length - 1 || 0}
                  onChange={(e, v) => {
                    setCurrentFrame(v as number)
                    // onChange(imageData[v as number])
                  }}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setWorkingBeatFrames('')
              onChange('')
            }}
          >
            Clear Beat Frames
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default GifFramePicker
