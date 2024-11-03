import { Box } from '@mui/material'

const MWrapper = ({ children, move }: any) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection:
          window.screen.orientation.type.split('-')[0] === 'landscape'
            ? 'row'
            : 'column',
        maxHeight: 'calc(100vh - 64px)',
        height: '100%',
        '& .react-transform-wrapper': {
          // flexGrow: 1,
          overflow: move ? 'auto' : 'hidden',
          height: '100%',
          width: '100%',
        }
      }}
    >
      {children}
    </Box>
  )
}

export default MWrapper
