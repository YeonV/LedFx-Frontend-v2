import { Box, useTheme } from '@mui/material'
import { FpsView } from 'react-fps'
import useStore from '../store/useStore'

const FpsViewer = () => {
  const theme = useTheme()
  const fpsViewer = useStore((state) => state.ui.fpsViewer)
  return (
    fpsViewer && (
      <Box
        sx={{
          '& > div': {
            backgroundColor: '#000 !important',
            color: '#ffffff !important',
            border: '1px solid #999 !important'
          },
          '& > div > div': {
            overflow: 'hidden'
          },
          '& > div > div > div': {
            backgroundColor: theme.palette.primary.main + ' !important',
            overflow: 'hidden'
          }
        }}
      >
        <FpsView width={240} height={180} left={5} top={'calc(100% - 270px)'} />
      </Box>
    )
  )
}

export default FpsViewer
