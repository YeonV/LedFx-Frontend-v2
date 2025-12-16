import { Menu as MenuIcon, ChevronLeft } from '@mui/icons-material'
import { Box, IconButton, Button, useTheme } from '@mui/material'

import { ios } from '../../../utils/helpers'

const LeftButtons = (pathname: any, history: any, open?: boolean, handleLeftBarOpen?: any) => {
  const theme = useTheme()

  if (
    (pathname.split('/').length === 3 && pathname.split('/')[1] === 'device') ||
    (pathname.split('/').length === 3 && pathname.split('/')[1] === 'graph') ||
    pathname === '/Settings'
  ) {
    if (ios) {
      return (
        <IconButton size="large" color="inherit" onClick={() => history(-1)}>
          <ChevronLeft sx={{ fontSize: 32 }} />
        </IconButton>
      )
    }
    return (
      <Button
        size="large"
        variant="text"
        color="inherit"
        startIcon={<ChevronLeft />}
        onClick={() => history(-1)}
        sx={{ mt: 0.9 }}
      >
        Back
      </Button>
    )
  }
  if (!open) {
    if (ios) {
      return (
        <Box
          style={{
            backgroundImage: 'url(/icon.png)',
            marginTop: 10,
            width: 32,
            height: 32,
            backgroundSize: 'contain'
          }}
          onClick={handleLeftBarOpen}
        />
      )
    }
    return (
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleLeftBarOpen}
        edge="start"
        sx={{ marginRight: theme.spacing(2), top: 8 }}
        className="step-three"
      >
        <MenuIcon />
      </IconButton>
    )
  }
  return null
}

export default LeftButtons
