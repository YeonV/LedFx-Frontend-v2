import { useState, useEffect } from 'react'
import { Box, Grid, Paper, Typography, Popover, Button, useTheme } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { darken } from '@mui/material/styles'
import { IColor, lpColors, sortColorsByHSL, zeroPadHex } from './lpColors'

interface LpColorPickerProps {
  onColorSelect?: (color: string) => void
  defaultColor?: IColor | string
}

const LpColorPicker = ({ onColorSelect, defaultColor }: LpColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState<IColor | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()

  useEffect(() => {
    if (defaultColor && lpColors[defaultColor as IColor]) {
      setSelectedColor(defaultColor as IColor)
    }
  }, [defaultColor])

  const handleColorClick = (color: IColor) => {
    setSelectedColor(color)
    if (onColorSelect) {
      onColorSelect(zeroPadHex(lpColors[color]))
    }
    setAnchorEl(null)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const sortedColors = sortColorsByHSL(Object.keys(lpColors) as IColor[])
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
          height: 32,
          alignItems: 'center',
          backgroundColor: selectedColor || defaultColor,
          color: theme.palette.getContrastText((selectedColor || defaultColor || '#000000') as string),
          '&:hover': {
            backgroundColor: darken(selectedColor || defaultColor || '#ffffff', 0.2),
          },
        }}
      >
        {selectedColor ? zeroPadHex(lpColors[selectedColor]) : ''}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 1, width: 200 }}>
          <Grid container spacing={1}>
            {sortedColors.map((color: IColor) => (
              <Grid item xs={3} key={color}>
                <Paper
                  sx={{
                    backgroundColor: color,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: selectedColor === color ? '2px solid black' : 'none',
                  }}
                  onClick={() => handleColorClick(color)}
                >
                  <Typography variant="caption" sx={{ color: theme.palette.getContrastText(color as string) }}>
                    {zeroPadHex(lpColors[color])}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </Box>
  )
}

export default LpColorPicker
