import { useEffect, useState, useContext, useCallback, useRef } from 'react'
import {
  Box,
  Stack,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  Button
} from '@mui/material'
import useStore from '../../../../../store/useStore'
import { SpotifyStateContext, SpStateContext } from '../../SpotifyProvider'
import { Ledfx } from '../../../../../api/ledfx'

const SpAlbumArtForm = () => {
  const virtuals = useStore((state) => state.virtuals)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const spotifyCtx = useContext(SpotifyStateContext)
  const spCtx = useContext(SpStateContext)

  const gradientVirtuals = useStore((state) => state.spotify.spotifyAlbumArtGradientVirtuals)
  const imageVirtuals = useStore((state) => state.spotify.spotifyAlbumArtImageVirtuals)
  const setGradientVirtuals = useStore((state) => state.setSpotifyAlbumArtGradientVirtuals)
  const setImageVirtuals = useStore((state) => state.setSpotifyAlbumArtImageVirtuals)

  const [colors, setColors] = useState<string[]>([])
  const [albumArtUrl, setAlbumArtUrl] = useState<string>('')
  const [gradients, setGradients] = useState<string[]>([])
  const [selectedGradient, setSelectedGradient] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const prevColorsRef = useRef<string>('')
  const prevAlbumArtRef = useRef<string>('')

  // Get album art URL
  useEffect(() => {
    const url =
      spotifyCtx?.track_window?.current_track?.album.images[0]?.url ||
      spCtx?.item?.album?.images[0]?.url ||
      ''
    setAlbumArtUrl(url)
  }, [spotifyCtx, spCtx])

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
  const filterSimilarColors = (colorList: string[], threshold = 50): string[] => {
    const filtered: string[] = []
    for (const color of colorList) {
      const isSimilar = filtered.some((c) => colorDistance(c, color) < threshold)
      if (!isSimilar) {
        filtered.push(color)
      }
    }
    return filtered
  }

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

      if (albumArtUrl && imageVirtuals.length > 0) {
        promises.push(
          Ledfx('/api/effects', 'PUT', {
            action: 'apply_global_effect',
            type: 'imagespin',
            config: {
              image_source: albumArtUrl,
              min_size: 1
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
    [selectedGradient, gradientVirtuals, gradients, albumArtUrl, imageVirtuals, getVirtuals]
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
      const pixels = imageData.data

      // Sample colors from image (extract dominant colors)
      const colorMap = new Map<string, number>()
      const saturatedColors = new Map<string, number>() // Separate tracking for saturated colors
      const step = 5 // Sample even more pixels for better diversity

      for (let i = 0; i < pixels.length; i += 4 * step) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        const a = pixels[i + 3]

        // Skip transparent pixels
        if (a < 128) continue

        // Calculate saturation and brightness
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const saturation = max === 0 ? 0 : (max - min) / max

        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`

        // Track all colors
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1)

        // Separately track highly saturated colors with lower threshold
        if (saturation > 0.3) {
          saturatedColors.set(hex, (saturatedColors.get(hex) || 0) + 1)
        }
      }

      // Get top regular colors
      const topColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 200)
        .map((entry) => entry[0])

      // Get ALL saturated colors (ensure we capture even less frequent vibrant colors)
      const topSaturated = Array.from(saturatedColors.entries())
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0]) // Get ALL saturated colors, not just top 100

      // Combine both, prioritizing saturated colors
      const combined = Array.from(new Set([...topSaturated, ...topColors]))

      // Filter out similar colors with dynamic threshold
      // Start with tighter threshold for more distinct colors, loosen if needed
      let uniqueColors = filterSimilarColors(combined, 40)
      if (uniqueColors.length < 4) {
        uniqueColors = filterSimilarColors(combined, 50)
      }
      if (uniqueColors.length < 3) {
        uniqueColors = filterSimilarColors(combined, 60)
      }
      if (uniqueColors.length < 2) {
        uniqueColors = filterSimilarColors(combined, 75)
      }

      // Take fewer colors for more distinct palette (4-6 typically)
      setColors(uniqueColors.slice(0, 6))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumArtUrl])

  // Generate multiple gradient variations from colors
  useEffect(() => {
    if (colors.length < 2) return

    const createGradient = (colorSet: string[]) => {
      const stops = colorSet.map((color, index) => {
        const hex = color.replace('#', '')
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        const percentage = ((index / (colorSet.length - 1)) * 100).toFixed(0)
        return `rgb(${r}, ${g}, ${b}) ${percentage}%`
      })
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
      generatedGradients.push(
        createGradient([colors[0], colors[1], colors[colors.length - 2], colors[colors.length - 1]])
      )
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
      // Directly call API without toggling isActive
      const payload: any = {
        action: 'apply_global',
        gradient: generatedGradients[selectedGradient],
        virtuals: gradientVirtuals
      }
      Ledfx('/api/effects', 'PUT', payload).then(() => getVirtuals())
    }
    prevColorsRef.current = colorsKey
  }, [colors, isActive, selectedGradient, gradientVirtuals, getVirtuals])

  // Auto-reapply image when song changes (if currently active)
  useEffect(() => {
    if (
      albumArtUrl &&
      albumArtUrl !== prevAlbumArtRef.current &&
      isActive &&
      imageVirtuals.length > 0
    ) {
      // Directly call API without toggling isActive
      const payload: any = {
        action: 'apply_global_effect',
        type: 'imagespin',
        config: {
          image_source: albumArtUrl,
          min_size: 1
        },
        virtuals: imageVirtuals
      }
      Ledfx('/api/effects', 'PUT', payload).then(() => getVirtuals())
    }
    prevAlbumArtRef.current = albumArtUrl
  }, [albumArtUrl, isActive, imageVirtuals, getVirtuals])

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
    <Stack spacing={2} maxWidth={300}>
      {/* Album Art */}
      {albumArtUrl && (
        <Box
          component="img"
          src={albumArtUrl}
          alt="Album Art"
          sx={{ maxHeight: 300, objectFit: 'contain', borderRadius: 1 }}
        />
      )}

      {/* Extracted Colors */}
      {colors.length > 0 && (
        <Box>
          <Box sx={{ mb: 1, fontWeight: 'bold' }}>Extracted Colors:</Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {colors.map((color, index) => (
              <Box
                key={index}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: color,
                  borderRadius: 1,
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer'
                }}
                title={color}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Generated Gradients */}
      {gradients.length > 0 && (
        <Box>
          <Box sx={{ mb: 1, fontWeight: 'bold' }}>Generated Gradients:</Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {gradients.map((gradient, index) => (
              <Box
                key={index}
                sx={{
                  width: 140,
                  height: 30,
                  background: gradient,
                  borderRadius: '10px',
                  border: selectedGradient === index ? '2px solid #fff' : '1px solid #fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selectedGradient === index ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
                title="Click to select"
                onClick={() => setSelectedGradient(index)}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Gradient Virtual Selection */}
      <Box>
        <Box sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 'bold' }}>Send Gradient To:</Box>
        <Select
          multiple
          fullWidth
          value={gradientVirtuals}
          onChange={handleGradientVirtualChange}
          input={<OutlinedInput />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {Object.keys(virtuals).map((vId) => (
            <MenuItem key={vId} value={vId} disabled={imageVirtuals.includes(vId)}>
              <Checkbox checked={gradientVirtuals.indexOf(vId) > -1} />
              <ListItemText primary={vId} />
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Image Virtual Selection */}
      <Box>
        <Box sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 'bold' }}>Send Image To:</Box>
        <Select
          multiple
          fullWidth
          value={imageVirtuals}
          onChange={handleImageVirtualChange}
          input={<OutlinedInput />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {Object.keys(virtuals).map((vId) => (
            <MenuItem key={vId} value={vId} disabled={gradientVirtuals.includes(vId)}>
              <Checkbox checked={imageVirtuals.indexOf(vId) > -1} />
              <ListItemText primary={vId} />
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Action Buttons */}
      {((selectedGradient !== null && gradientVirtuals.length > 0) ||
        (albumArtUrl && imageVirtuals.length > 0)) && (
        <Stack direction="row" spacing={1}>
          <Button
            fullWidth
            variant="contained"
            color={isActive ? 'primary' : 'inherit'}
            onClick={() => {
              if (isActive) {
                setIsActive(false)
              } else {
                applyBoth(false)
              }
            }}
          >
            {isActive ? 'Stop' : 'Play'}
          </Button>
          <Button fullWidth variant="outlined" onClick={() => applyBoth(true)}>
            Test Once
          </Button>
        </Stack>
      )}
    </Stack>
  )
}

export default SpAlbumArtForm
