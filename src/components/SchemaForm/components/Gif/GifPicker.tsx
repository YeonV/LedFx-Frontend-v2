import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { Box, IconButton, DialogActions, Divider, useTheme, Button } from '@mui/material'
import { Gif, Image } from '@mui/icons-material'
import useStore from '../../../../store/useStore'
import SceneImage from '../../../../pages/Scenes/ScenesImage'

type PickerMode = 'animated' | 'static' | 'both'

interface GifPickerProps {
  onChange: (_url: string) => void
  mode?: PickerMode
  value?: string
}

const GifPicker: React.FC<GifPickerProps> = ({ onChange, mode = 'animated', value }: any) => {
  const theme = useTheme()
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(false)
  const [selectedGif, setSelectedGif] = useState<string | null>(null)

  const assets = useStore((state) => state.assets)
  const assetsFixed = useStore((state) => state.assetsFixed)
  const cacheStats = useStore((state) => state.cacheStats)
  const getAssetsFixed = useStore((state) => state.getAssetsFixed)
  const getCacheStats = useStore((state) => state.getCacheStats)

  useEffect(() => {
    if (open) {
      getAssetsFixed()
      getCacheStats()
    }
  }, [open, getAssetsFixed, getCacheStats])

  // Filter assets based on mode
  const filterByMode = (asset: any) => {
    if (mode === 'animated') return asset.is_animated
    if (mode === 'static') return !asset.is_animated
    return true // 'both' mode
  }

  const gifsBuiltin = assetsFixed.filter(filterByMode)
  const gifsUser = assets.filter(filterByMode)

  // For cached assets, filter by mode
  const gifsCached = (cacheStats?.entries || [])
    .filter((entry) => {
      const isImage = entry.content_type?.startsWith('image/')
      if (!isImage) return false

      // If backend provides is_animated field (from enhanced metadata), use it
      if (entry.is_animated !== undefined) {
        if (mode === 'animated') return entry.is_animated
        if (mode === 'static') return !entry.is_animated
        return true // 'both' mode
      }

      // Fallback: infer from content_type if metadata not available
      const isAnimated =
        entry.content_type === 'image/gif' ||
        (entry.content_type === 'image/webp' && entry.url.includes('.webp'))

      if (mode === 'animated') return isAnimated
      if (mode === 'static') return !isAnimated
      return true // 'both' mode
    })
    // Add default metadata for entries missing it (until backend is updated)
    .map((entry) => ({
      url: entry.url,
      cached_at: entry.cached_at,
      last_accessed: entry.last_accessed,
      access_count: entry.access_count,
      file_size: entry.file_size,
      content_type: entry.content_type,
      width: entry.width || 0,
      height: entry.height || 0,
      format: entry.format || null,
      n_frames: entry.n_frames || 1,
      is_animated: entry.is_animated || false
    }))

  // UI text based on mode
  const getTitle = () => {
    if (mode === 'static') return 'Image Picker'
    if (mode === 'both') return 'Image Picker'
    return 'GIF Picker'
  }

  const getPlaceholder = () => {
    if (mode === 'static') return 'Filter images...'
    if (mode === 'both') return 'Filter images...'
    return 'Filter GIFs...'
  }

  const handleClickOpen = () => {
    // Initialize selection from current value when opening
    setSelectedGif(value || null)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }


  return (
    <>
      <IconButton
        onClick={handleClickOpen}
        sx={{
          color: theme.palette.mode === 'light' ? '#000' : '#fff',
          '&:hover': {
            color: theme.palette.primary.main
          }
        }}
      >
        {mode === 'animated' ? <Gif /> : <Image />}
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{getTitle()}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            sx={{ marginBottom: '20px', minWidth: '522px' }}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={getPlaceholder()}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mb: 1 }}>
            {gifsUser
              .filter((gif) => gif.path.toLowerCase().includes(filter.toLowerCase()))
              .map((gif, i) => {
                const gifUrl = gif.path
                return (
                  <Box
                    key={gif.path}
                    onClick={() => {
                      if (selectedGif !== gifUrl) {
                        setSelectedGif(gifUrl)
                        onChange(gif.path)
                      } else {
                        setSelectedGif(null)
                      }
                    }}
                    tabIndex={i + 1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleClose()
                      }
                    }}
                    sx={{
                      borderRadius: 1,
                      border: '2px solid',
                      cursor: 'pointer',
                      borderColor: selectedGif === gifUrl ? theme.palette.primary.main : 'gray'
                    }}
                  >
                    <SceneImage
                      iconName={`image:file:///${gif.path}`}
                      thumbnail
                      title={`Source: User Asset\nPath: ${gif.path}\nSize: ${gif.width}x${gif.height}${gif.is_animated ? `\nFrames: ${gif.n_frames}` : ''}`}
                      sx={{
                        width: 100,
                        height: 60,
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                )
              })}
          </Box>
          {gifsCached.length > 0 && (
            <>
              <Divider sx={{ margin: '16px 0' }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {gifsCached
                  .filter((cached) => cached.url.toLowerCase().includes(filter.toLowerCase()))
                  .map((cached, i) => {
                    const gifUrl = cached.url
                    const displayUrl = gifUrl.length > 60 
                      ? `${gifUrl.substring(0, 30)}...${gifUrl.substring(gifUrl.length - 27)}`
                      : gifUrl
                    return (
                      <Box
                        key={cached.url}
                        onClick={() => {
                          if (selectedGif !== gifUrl) {
                            setSelectedGif(gifUrl)
                            onChange(gifUrl)
                          } else {
                            setSelectedGif(null)
                          }
                        }}
                        tabIndex={gifsUser.length + i + 1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleClose()
                          }
                        }}
                        sx={{
                          borderRadius: 1,
                          border: '2px solid',
                          cursor: 'pointer',
                          borderColor: selectedGif === gifUrl ? theme.palette.primary.main : 'gray'
                        }}
                      >
                        <SceneImage
                          iconName={`image:${cached.url}`}
                          thumbnail
                          title={`Source: Cached\nURL: ${displayUrl}\nSize: ${cached.width}x${cached.height}${cached.is_animated ? `\nFrames: ${cached.n_frames}` : ''}`}
                          sx={{
                            width: 100,
                            height: 60,
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    )
                  })}
              </Box>
            </>
          )}
          <Divider sx={{ margin: '16px 0' }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {gifsBuiltin
              .filter((gif) => gif.path.toLowerCase().includes(filter.toLowerCase()))
              .map((gif, i) => {
                const gifUrl = `builtin://${gif.path}`
                return (
                  <Box
                    key={gif.path}
                    onClick={() => {
                      if (selectedGif !== gifUrl) {
                        setSelectedGif(gifUrl)
                        onChange(gifUrl)
                      } else {
                        setSelectedGif(null)
                      }
                    }}
                    tabIndex={gifsUser.length + gifsCached.length + i + 1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleClose()
                      }
                    }}
                    sx={{
                      borderRadius: 1,
                      border: '2px solid',
                      cursor: 'pointer',
                      borderColor: selectedGif === gifUrl ? theme.palette.primary.main : 'gray'
                    }}
                  >
                    <SceneImage
                      iconName={`image:builtin://${gif.path}`}
                      thumbnail                      title={`Source: Built-in\nPath: ${gif.path}\nSize: ${gif.width}x${gif.height}${gif.is_animated ? `\nFrames: ${gif.n_frames}` : ''}`}                      sx={{
                        width: 100,
                        height: 60,
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                )
              })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default GifPicker
