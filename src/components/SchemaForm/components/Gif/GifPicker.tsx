import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { Box, Button, DialogActions, Divider, useTheme } from '@mui/material'
import { Gif } from '@mui/icons-material'
import useStore from '../../../../store/useStore'
import SceneImage from '../../../../pages/Scenes/ScenesImage'

interface GifPickerProps {
  onChange: (_url: string) => void
}

const GifPicker: React.FC<GifPickerProps> = ({ onChange }: any) => {
  const theme = useTheme()
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(false)
  const [selectedGif, setSelectedGif] = useState<string | null>(null)

  const assets = useStore((state) => state.assets)
  const assetsFixed = useStore((state) => state.assetsFixed)
  const getAssetsFixed = useStore((state) => state.getAssetsFixed)

  useEffect(() => {
    if (open) {
      getAssetsFixed()
    }
  }, [open, getAssetsFixed])

  const gifsBuiltin = assetsFixed.filter((asset) => asset.is_animated)
  const gifsUser = assets.filter((asset) => asset.is_animated)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  console.log(gifsUser)
  return (
    <>
      <Button onClick={handleClickOpen} sx={{ alignSelf: 'center' }}>
        <Gif />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>GIF Picker</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            sx={{ marginBottom: '20px', minWidth: '522px' }}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter GIFs..."
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mb: 1 }}>
            {gifsUser
              .filter((gif) => gif.path.toLowerCase().includes(filter.toLowerCase()))
              .map((gif, i) => {
                const gifUrl = `file:///${gif.path}`
                return (
                  <Box
                    key={gif.path}
                    onClick={() => {
                      if (selectedGif !== gifUrl) {
                        setSelectedGif(gifUrl)
                      } else {
                        setSelectedGif(null)
                      }
                      onChange(gifUrl)
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
                      } else {
                        setSelectedGif(null)
                      }
                      onChange(gifUrl)
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
                      iconName={`image:builtin://${gif.path}`}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default GifPicker
