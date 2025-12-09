import { useState, useEffect } from 'react'
import { IconButton, Menu, MenuItem, Typography, useTheme } from '@mui/material'
import { Image } from '@mui/icons-material'
import useStore from '../../store/useStore'
import SceneImage from '../../pages/Scenes/ScenesImage'

interface AssetPickerProps {
  value: string
  onChange: (filename: string) => void
}

const AssetPicker = ({ value, onChange }: AssetPickerProps) => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const assets = useStore((state) => state.assets)
  const getAssets = useStore((state) => state.getAssets)
  const open = Boolean(anchorEl)

  useEffect(() => {
    if (open) {
      getAssets()
    }
  }, [open, getAssets])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (filename: string) => {
    onChange(filename)
    handleClose()
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: theme.palette.mode === 'light' ? '#000' : '#fff',
          '&:hover': {
            color: theme.palette.primary.main
          }
        }}
      >
        <Image />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: 300
          }
        }}
      >
        {assets.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2">No assets available</Typography>
          </MenuItem>
        ) : (
          assets.map((asset) => (
            <MenuItem
              key={asset.filename}
              onClick={() => handleSelect(asset.path)}
              selected={value === asset.path}
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center'
              }}
            >
              <SceneImage
                iconName={`image:file:///${asset.path}`}
                sx={{
                  width: 40,
                  height: 40,
                  objectFit: 'cover',
                  borderRadius: 1
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {asset.filename}
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  )
}

export default AssetPicker
