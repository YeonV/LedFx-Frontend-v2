import { useCallback } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  Stack,
  Switch,
  Typography
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import GradientPicker from '../../../../SchemaForm/components/GradientPicker/GradientPicker'
import useStore from '../../../../../store/useStore'
import BladeFrame from '../../../../SchemaForm/components/BladeFrame'
import { Ledfx } from '../../../../../api/ledfx'

const SongDetectorAlbumArtForm = () => {
  const virtuals = useStore((state) => state.virtuals)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const thumbnailPath = useStore((state) => state.thumbnailPath)

  // Use global state for gradient and image auto-apply
  const gradientVirtualsGlobal = useStore((state) => state.gradientVirtuals)
  const imageVirtualsGlobal = useStore((state) => state.imageVirtuals)
  const selectedGradientGlobal = useStore((state) => state.selectedGradient)
  const gradientsGlobal = useStore((state) => state.gradients)
  const extractedColors = useStore((state) => state.extractedColors)
  const gradientAutoApply = useStore((state) => state.gradientAutoApply)
  const imageAutoApply = useStore((state) => state.imageAutoApply)
  const imageConfigGlobal = useStore((state) => state.imageConfig)

  const setGradientVirtualsGlobal = useStore((state) => state.setGradientVirtuals)
  const setImageVirtualsGlobal = useStore((state) => state.setImageVirtuals)
  const setSelectedGradientGlobal = useStore((state) => state.setSelectedGradient)
  const setGradientAutoApply = useStore((state) => state.setGradientAutoApply)
  const setImageAutoApply = useStore((state) => state.setImageAutoApply)
  const setImageConfigGlobal = useStore((state) => state.setImageConfig)

  // Use global state directly
  const gradientVirtuals = gradientVirtualsGlobal
  const imageVirtuals = imageVirtualsGlobal
  const selectedGradient = selectedGradientGlobal
  const gradients = gradientsGlobal
  const imageConfig = imageConfigGlobal

  // Compute album art URL for display purposes
  const albumArtUrl = thumbnailPath
    ? `file:///${thumbnailPath.replace(/\\/g, '/')}?t=${new Date().getTime()}`
    : ''

  const applyBoth = useCallback(
    async (once: boolean = false) => {
      const promises: Promise<any>[] = []

      if (selectedGradient !== null && gradientVirtuals.length > 0) {
        promises.push(
          Ledfx('/api/effects', 'PUT', {
            action: 'apply_global',
            gradient: gradients[selectedGradient],
            virtuals: gradientVirtuals
          })
        )
      }

      if (albumArtUrl && imageVirtuals.length > 0 && thumbnailPath) {
        promises.push(
          Ledfx('/api/effects', 'PUT', {
            action: 'apply_global_effect',
            type: 'imagespin',
            config: {
              image_source: 'current_album_art.jpg',
              ...imageConfig
            },
            virtuals: imageVirtuals
          })
        )
      }

      await Promise.all(promises)
      getVirtuals()

      if (once) {
        setGradientAutoApply(false)
        setImageAutoApply(false)
      } else {
        setGradientAutoApply(true)
        setImageAutoApply(true)
      }
    },
    [
      selectedGradient,
      gradientVirtuals,
      gradients,
      albumArtUrl,
      imageVirtuals,
      thumbnailPath,
      imageConfig,
      getVirtuals,
      setGradientAutoApply,
      setImageAutoApply
    ]
  )

  const handleGradientVirtualChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    // Remove from image virtuals if present
    setImageVirtualsGlobal(imageVirtuals.filter((v) => !selected.includes(v)))
    setGradientVirtualsGlobal(selected)
  }

  const handleImageVirtualChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    // Remove from gradient virtuals if present
    setGradientVirtualsGlobal(gradientVirtuals.filter((v) => !selected.includes(v)))
    setImageVirtualsGlobal(selected)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="column" spacing={2} sx={{ flex: 1, display: 'flex' }}>
        {/* Album Art Thumbnail */}
        {albumArtUrl && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Box
              component="img"
              src={albumArtUrl}
              alt="Album Art"
              sx={{
                maxWidth: 200,
                maxHeight: 200,
                borderRadius: 2,
                boxShadow: 3
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </Box>
        )}

        {/* Gradient Preview and Selection */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Album Art Configuration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="column" spacing={2}>
              {gradients.length > 0 && (
                <BladeFrame title="Gradient Options">
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {gradients.map((gradient, idx) => (
                      <Box
                        key={idx}
                        onClick={() => setSelectedGradientGlobal(idx)}
                        sx={{
                          width: 60,
                          height: 60,
                          background: gradient,
                          borderRadius: 1,
                          cursor: 'pointer',
                          border: selectedGradient === idx ? '3px solid white' : '1px solid gray',
                          transition: 'border 0.2s'
                        }}
                      />
                    ))}
                  </Stack>
                </BladeFrame>
              )}

              {/* Color Palette Display */}
              {extractedColors.length > 0 && (
                <BladeFrame title="Extracted Colors">
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {extractedColors.map((color: string, idx: number) => (
                      <Box
                        key={idx}
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: color,
                          borderRadius: 1,
                          border: '1px solid gray'
                        }}
                        title={color}
                      />
                    ))}
                  </Stack>
                </BladeFrame>
              )}

              {/* Image Effect Configuration */}
              <BladeFrame title="Image Effect Settings">
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <Box sx={{ width: '50%' }}>
                      <Typography variant="caption" gutterBottom>
                        Brightness
                      </Typography>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        valueLabelDisplay="auto"
                        value={imageConfig.brightness}
                        onChange={(_e, v) =>
                          typeof v === 'number' &&
                          setImageConfigGlobal({ ...imageConfig, brightness: v })
                        }
                      />
                    </Box>
                    <Box sx={{ width: '50%' }}>
                      <Typography variant="caption" gutterBottom>
                        BG Brightness
                      </Typography>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        valueLabelDisplay="auto"
                        value={imageConfig.background_brightness}
                        onChange={(_e, v) =>
                          typeof v === 'number' &&
                          setImageConfigGlobal({ ...imageConfig, background_brightness: v })
                        }
                      />
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Box sx={{ width: '50%' }}>
                      <Typography variant="caption" gutterBottom>
                        Blur
                      </Typography>
                      <Slider
                        min={0}
                        max={10}
                        step={0.1}
                        valueLabelDisplay="auto"
                        value={imageConfig.blur}
                        onChange={(_e, v) =>
                          typeof v === 'number' && setImageConfigGlobal({ ...imageConfig, blur: v })
                        }
                      />
                    </Box>
                    <Box sx={{ width: '50%' }}>
                      <Typography variant="caption" gutterBottom>
                        Min Size
                      </Typography>
                      <Slider
                        min={1}
                        max={100}
                        step={1}
                        valueLabelDisplay="auto"
                        value={imageConfig.min_size}
                        onChange={(_e, v) =>
                          typeof v === 'number' &&
                          setImageConfigGlobal({ ...imageConfig, min_size: v })
                        }
                      />
                    </Box>
                  </Stack>

                  <GradientPicker
                    isGradient={false}
                    colors={extractedColors}
                    title="BG Color"
                    pickerBgColor={imageConfig.background_color}
                    sendColorToVirtuals={(v: string) =>
                      setImageConfigGlobal({ ...imageConfig, background_color: v })
                    }
                  />

                  <Stack direction="row" spacing={1} justifyContent="space-around">
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Clip</Typography>
                      <Switch
                        checked={imageConfig.clip}
                        onChange={(_e, b) => setImageConfigGlobal({ ...imageConfig, clip: b })}
                        color="primary"
                      />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Flip H</Typography>
                      <Switch
                        checked={imageConfig.flip_horizontal}
                        onChange={(_e, b) =>
                          setImageConfigGlobal({ ...imageConfig, flip_horizontal: b })
                        }
                        color="primary"
                      />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Flip V</Typography>
                      <Switch
                        checked={imageConfig.flip_vertical}
                        onChange={(_e, b) =>
                          setImageConfigGlobal({ ...imageConfig, flip_vertical: b })
                        }
                        color="primary"
                      />
                    </Box>
                  </Stack>
                </Stack>
              </BladeFrame>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Virtual Device Selectors */}
        <Box sx={{ flexGrow: 1 }} />
        <FormControl fullWidth>
          <InputLabel>Gradient Virtuals</InputLabel>
          <Select
            multiple
            value={gradientVirtuals}
            onChange={handleGradientVirtualChange}
            input={<OutlinedInput label="Gradient Virtuals" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {Object.keys(virtuals).map((vId) => (
              <MenuItem key={vId} value={vId}>
                <Checkbox checked={gradientVirtuals.includes(vId)} />
                <ListItemText primary={vId} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Image Virtuals</InputLabel>
          <Select
            multiple
            value={imageVirtuals}
            onChange={handleImageVirtualChange}
            input={<OutlinedInput label="Image Virtuals" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {Object.keys(virtuals).map((vId) => (
              <MenuItem key={vId} value={vId}>
                <Checkbox checked={imageVirtuals.includes(vId)} />
                <ListItemText primary={vId} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Apply Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => applyBoth(true)}
            disabled={
              (gradientVirtuals.length === 0 && imageVirtuals.length === 0) ||
              (gradientVirtuals.length > 0 && selectedGradient === null) ||
              extractedColors.length === 0
            }
          >
            Apply Once
          </Button>
          <Button
            variant="contained"
            color={gradientAutoApply || imageAutoApply ? 'secondary' : 'primary'}
            fullWidth
            onClick={() => {
              if (gradientAutoApply || imageAutoApply) {
                setGradientAutoApply(false)
                setImageAutoApply(false)
              } else {
                applyBoth(false)
              }
            }}
            disabled={
              (gradientVirtuals.length === 0 && imageVirtuals.length === 0) ||
              (gradientVirtuals.length > 0 && selectedGradient === null) ||
              extractedColors.length === 0
            }
          >
            {gradientAutoApply || imageAutoApply ? 'Stop Auto' : 'Apply Auto'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default SongDetectorAlbumArtForm
