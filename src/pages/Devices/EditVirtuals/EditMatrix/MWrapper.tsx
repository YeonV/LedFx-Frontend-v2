import { Box } from '@mui/material'

const MWrapper = ({ children, move }: any) => {
  return (
    <Box
      sx={[
        {
          padding: 0,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          maxHeight: 'calc(100vh - 64px)',
          height: '100%',

          '& .react-transform-wrapper': {
            height: '100%',
            width: '100%'
          }
        },
        window.screen.orientation.type.split('-')[0] === 'landscape'
          ? {
              flexDirection: 'row'
            }
          : {
              flexDirection: 'column'
            },
        move
          ? {
              '& .react-transform-wrapper': {
                overflow: 'auto'
              }
            }
          : {
              '& .react-transform-wrapper': {
                overflow: 'hidden'
              }
            }
      ]}
    >
      {children}
    </Box>
  )
}

export default MWrapper
