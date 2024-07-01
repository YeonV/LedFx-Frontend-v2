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
        maxHeight: '90vh',
        '& .react-transform-wrapper': {
          // flexGrow: 1,
          overflow: move ? 'auto' : 'hidden'
        }
      }}
    >
      {children}
    </Box>
  )
}

export default MWrapper
