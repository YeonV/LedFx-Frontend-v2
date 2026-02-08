import { useCallback } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  Stack,
  Switch,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { ExpandMore, PlayArrow, Stop } from '@mui/icons-material'
import GradientPicker from '../../../../SchemaForm/components/GradientPicker/GradientPicker'
import useStore from '../../../../../store/useStore'
import BladeFrame from '../../../../SchemaForm/components/BladeFrame'
import { Ledfx } from '../../../../../api/ledfx'

const SongDetectorAlbumArtForm = ({ preview = true }: { preview?: boolean }) => {
  const theme = useTheme()
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
  const albumArtCacheBuster = useStore((state) => state.albumArtCacheBuster)

  // Compute album art URL using backend API endpoint
  const albumArtUrl = thumbnailPath
    ? `${window.localStorage.getItem('ledfx-host')}/api/assets/download?path=${thumbnailPath.replace('/assets/', '')}&cb=${albumArtCacheBuster}`
    : ''

  const applyGradient = useCallback(async () => {
    if (selectedGradient !== null && gradientVirtuals.length > 0) {
      await Ledfx('/api/effects', 'PUT', {
        action: 'apply_global',
        gradient: gradients[selectedGradient],
        virtuals: gradientVirtuals
      })
      getVirtuals()
    }
  }, [selectedGradient, gradientVirtuals, gradients, getVirtuals])

  const applyImage = useCallback(async () => {
    if (albumArtUrl && imageVirtuals.length > 0 && thumbnailPath) {
      await Ledfx('/api/effects', 'PUT', {
        action: 'apply_global_effect',
        type: 'imagespin',
        config: {
          image_source: 'current_album_art.jpg',
          ...imageConfig
        },
        virtuals: imageVirtuals
      })
      getVirtuals()
    }
  }, [albumArtUrl, imageVirtuals, thumbnailPath, imageConfig, getVirtuals])

  const toggleGradientAutoApply = useCallback(() => {
    if (gradientAutoApply) {
      setGradientAutoApply(false)
    } else {
      applyGradient()
      setGradientAutoApply(true)
    }
  }, [gradientAutoApply, setGradientAutoApply, applyGradient])

  const toggleImageAutoApply = useCallback(() => {
    if (imageAutoApply) {
      setImageAutoApply(false)
    } else {
      applyImage()
      setImageAutoApply(true)
    }
  }, [imageAutoApply, setImageAutoApply, applyImage])

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
        {albumArtUrl && preview && (
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
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ width: '100%' }}>
                    {gradients.map((gradient, idx) => (
                      <Box
                        key={idx}
                        onClick={() => setSelectedGradientGlobal(idx)}
                        sx={{
                          flex: 1,
                          minWidth: 60,
                          height: 40,
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
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ width: '100%' }}>
                    {extractedColors.map((color: string, idx: number) => (
                      <Box
                        key={idx}
                        sx={{
                          flex: 1,
                          minWidth: 40,
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
                <Stack direction="column" spacing={2} flex={1} pt={2}>
                  <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                    <BladeFrame title="Brightness" style={{ flex: 1 }}>
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
                    </BladeFrame>
                    <BladeFrame title="BG Brightness" style={{ flex: 1 }}>
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
                    </BladeFrame>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                    <BladeFrame title="Blur" style={{ flex: 1 }}>
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
                    </BladeFrame>
                    <BladeFrame title="Min Size" style={{ flex: 1 }}>
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
                    </BladeFrame>
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

                  <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                    <BladeFrame style={{ flex: 1 }} title="Clip">
                      <Switch
                        checked={imageConfig.clip}
                        onChange={(_e, b) => setImageConfigGlobal({ ...imageConfig, clip: b })}
                        color="primary"
                      />
                    </BladeFrame>
                    <BladeFrame style={{ flex: 1 }} title="Flip H">
                      <Switch
                        checked={imageConfig.flip_horizontal}
                        onChange={(_e, b) =>
                          setImageConfigGlobal({ ...imageConfig, flip_horizontal: b })
                        }
                        color="primary"
                      />
                    </BladeFrame>
                    <BladeFrame style={{ flex: 1 }} title="Flip V">
                      <Switch
                        checked={imageConfig.flip_vertical}
                        onChange={(_e, b) =>
                          setImageConfigGlobal({ ...imageConfig, flip_vertical: b })
                        }
                        color="primary"
                      />
                    </BladeFrame>
                  </Stack>
                </Stack>
              </BladeFrame>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Virtual Device Selectors */}
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction={'column'}
          spacing={2}
          sx={{
            backgroundColor: theme.palette.background.paper,
            pt: 2,
            pr: 1,
            pb: 1,
            pl: 1,
            borderRadius: 1
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
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
            <Tooltip title={gradientAutoApply ? 'Stop Auto' : 'Start Auto'}>
              <IconButton
                onClick={toggleGradientAutoApply}
                disabled={
                  gradientVirtuals.length === 0 ||
                  selectedGradient === null ||
                  extractedColors.length === 0
                }
                sx={{
                  color: gradientAutoApply ? 'success.main' : 'primary.main'
                }}
              >
                {gradientAutoApply ? <Stop /> : <PlayArrow />}
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
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
            <Tooltip title={imageAutoApply ? 'Stop Auto' : 'Start Auto'}>
              <IconButton
                onClick={toggleImageAutoApply}
                disabled={imageVirtuals.length === 0 || extractedColors.length === 0}
                sx={{
                  color: imageAutoApply ? 'success.main' : 'primary.main'
                }}
              >
                {imageAutoApply ? <Stop /> : <PlayArrow />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default SongDetectorAlbumArtForm
