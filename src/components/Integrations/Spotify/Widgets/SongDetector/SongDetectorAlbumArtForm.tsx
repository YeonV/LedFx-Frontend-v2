import { useCallback, useEffect, useRef, useState } from 'react'
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
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const thumbnailPath = useStore((state) => state.thumbnailPath)

  const [gradientVirtuals, setGradientVirtuals] = useState<string[]>([])
  const [imageVirtuals, setImageVirtuals] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [albumArtUrl, setAlbumArtUrl] = useState<string>('')
  const [gradients, setGradients] = useState<string[]>([])
  const [selectedGradient, setSelectedGradient] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const prevColorsRef = useRef<string>('')
  const prevAlbumArtRef = useRef<string>('')

  // Image effect configuration
  const [imageConfig, setImageConfig] = useState({
    background_brightness: 1,
    background_color: '#000000',
    blur: 0,
    brightness: 1,
    clip: false,
    flip_horizontal: false,
    flip_vertical: false,
    min_size: 1
  })

  // Use thumbnail path from store - trigger re-render when song changes
  useEffect(() => {
    if (thumbnailPath) {
      // Convert Windows path to file:// URL with timestamp to force reload
      const normalizedPath = thumbnailPath.replace(/\\/g, '/')
      const timestamp = new Date().getTime()
      const fileUrl = `file:///${normalizedPath}?t=${timestamp}`
      setAlbumArtUrl(fileUrl)
      // Reset colors and gradients for new song
      setColors([])
      setGradients([])
      setSelectedGradient(null)
    }
  }, [thumbnailPath, currentTrack])

  // Helper: Calculate color distance (Euclidean distance in RGB space)
  const colorDistance = (hex1: string, hex2: string): number => {
    const rgb1 = {
      r: parseInt(hex1.slice(1, 3), 16),
      g: parseInt(hex1.slice(3, 5), 16),
      b: parseInt(hex1.slice(5, 7), 16)
    }
    const rgb2 = {
      r: parseInt(hex2.slice(1, 3), 16),
      g: parseInt(hex2.slice(3, 5), 16),
      b: parseInt(hex2.slice(5, 7), 16)
    }
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2)
    )
  }

  // Helper: Filter similar colors
  const filterSimilarColors = useCallback((colorList: string[], threshold = 50): string[] => {
    const filtered: string[] = []
    for (const color of colorList) {
      if (filtered.every((c) => colorDistance(c, color) > threshold)) {
        filtered.push(color)
      }
    }
    return filtered
  }, [])

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
        setIsActive(false)
      } else {
        setIsActive(true)
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
      getVirtuals
    ]
  )

  // Extract colors from album art
  useEffect(() => {
    if (!albumArtUrl) return

    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = albumArtUrl

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      const colorMap: { [key: string]: number } = {}

      // Sample every 10th pixel for performance
      for (let i = 0; i < data.length; i += 40) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]

        if (a < 128) continue // Skip transparent pixels

        // Skip near-black and near-white colors
        if (r + g + b < 50 || r + g + b > 700) continue

        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
        colorMap[hex] = (colorMap[hex] || 0) + 1
      }

      // Sort by frequency
      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => color)

      // Filter similar colors and take top colors
      const uniqueColors = filterSimilarColors(sortedColors, 50).slice(0, 8)
      setColors(uniqueColors)
    }

    img.onerror = () => {
      console.error('Failed to load album art from:', albumArtUrl)
    }
  }, [albumArtUrl, filterSimilarColors])

  // Generate multiple gradient variations from colors
  useEffect(() => {
    if (colors.length < 2) return

    const createGradient = (colorSet: string[]) => {
      const stops = colorSet.map((color, idx) => `${color} ${(idx / (colorSet.length - 1)) * 100}%`)
      return `linear-gradient(90deg, ${stops.join(', ')})`
    }

    const generatedGradients: string[] = []

    // Gradient 1: All colors
    generatedGradients.push(createGradient(colors))

    // Gradient 2: Every other color
    if (colors.length >= 4) {
      generatedGradients.push(createGradient(colors.filter((_, i) => i % 2 === 0)))
    }

    // Gradient 3: First half
    if (colors.length >= 4) {
      generatedGradients.push(createGradient(colors.slice(0, Math.ceil(colors.length / 2))))
    }

    // Gradient 4: Second half
    if (colors.length >= 4) {
      generatedGradients.push(createGradient(colors.slice(Math.floor(colors.length / 2))))
    }

    // Gradient 5: Reversed
    generatedGradients.push(createGradient([...colors].reverse()))

    // Gradient 6: First and last 2 colors
    if (colors.length >= 4) {
      const firstTwo = colors.slice(0, 2)
      const lastTwo = colors.slice(-2)
      generatedGradients.push(createGradient([...firstTwo, ...lastTwo]))
    }

    setGradients(generatedGradients)

    // Auto-select first gradient if none selected
    if (selectedGradient === null && generatedGradients.length > 0) {
      setSelectedGradient(0)
    }

    // Auto-reapply gradient when song changes (if currently active)
    const colorsKey = colors.join(',')
    if (
      colorsKey !== prevColorsRef.current &&
      isActive &&
      selectedGradient !== null &&
      gradientVirtuals.length > 0 &&
      generatedGradients[selectedGradient]
    ) {
      Ledfx('/api/effects', 'PUT', {
        action: 'apply_global',
        gradient: generatedGradients[selectedGradient],
        virtuals: gradientVirtuals
      }).then(() => getVirtuals())
    }
    prevColorsRef.current = colorsKey
  }, [colors, isActive, selectedGradient, gradientVirtuals, getVirtuals])

  // Auto-reapply image when song changes (if currently active)
  useEffect(() => {
    if (
      albumArtUrl &&
      albumArtUrl !== prevAlbumArtRef.current &&
      isActive &&
      imageVirtuals.length > 0 &&
      thumbnailPath
    ) {
      Ledfx('/api/effects', 'PUT', {
        action: 'apply_global_effect',
        type: 'imagespin',
        config: {
          image_source: 'current_album_art.jpg',
          ...imageConfig
        },
        virtuals: imageVirtuals
      }).then(() => getVirtuals())
    }
    prevAlbumArtRef.current = albumArtUrl
  }, [albumArtUrl, isActive, imageVirtuals, thumbnailPath, imageConfig, getVirtuals])

  const handleGradientVirtualChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    // Remove from image virtuals if present
    setImageVirtuals(imageVirtuals.filter((v) => !selected.includes(v)))
    setGradientVirtuals(selected)
  }

  const handleImageVirtualChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    // Remove from gradient virtuals if present
    setGradientVirtuals(gradientVirtuals.filter((v) => !selected.includes(v)))
    setImageVirtuals(selected)
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
                        onClick={() => setSelectedGradient(idx)}
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
              {colors.length > 0 && (
                <BladeFrame title="Extracted Colors">
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {colors.map((color, idx) => (
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
                          typeof v === 'number' && setImageConfig({ ...imageConfig, brightness: v })
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
                          setImageConfig({ ...imageConfig, background_brightness: v })
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
                          typeof v === 'number' && setImageConfig({ ...imageConfig, blur: v })
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
                          typeof v === 'number' && setImageConfig({ ...imageConfig, min_size: v })
                        }
                      />
                    </Box>
                  </Stack>

                  <GradientPicker
                    isGradient={false}
                    colors={colors}
                    title="BG Color"
                    pickerBgColor={imageConfig.background_color}
                    sendColorToVirtuals={(v: string) =>
                      setImageConfig({ ...imageConfig, background_color: v })
                    }
                  />

                  <Stack direction="row" spacing={1} justifyContent="space-around">
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Clip</Typography>
                      <Switch
                        checked={imageConfig.clip}
                        onChange={(_e, b) => setImageConfig({ ...imageConfig, clip: b })}
                        color="primary"
                      />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Flip H</Typography>
                      <Switch
                        checked={imageConfig.flip_horizontal}
                        onChange={(_e, b) => setImageConfig({ ...imageConfig, flip_horizontal: b })}
                        color="primary"
                      />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Flip V</Typography>
                      <Switch
                        checked={imageConfig.flip_vertical}
                        onChange={(_e, b) => setImageConfig({ ...imageConfig, flip_vertical: b })}
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
              colors.length === 0
            }
          >
            Apply Once
          </Button>
          <Button
            variant="contained"
            color={isActive ? 'secondary' : 'primary'}
            fullWidth
            onClick={() => (isActive ? setIsActive(false) : applyBoth(false))}
            disabled={
              (gradientVirtuals.length === 0 && imageVirtuals.length === 0) ||
              (gradientVirtuals.length > 0 && selectedGradient === null) ||
              colors.length === 0
            }
          >
            {isActive ? 'Stop Auto' : 'Apply Auto'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default SongDetectorAlbumArtForm
