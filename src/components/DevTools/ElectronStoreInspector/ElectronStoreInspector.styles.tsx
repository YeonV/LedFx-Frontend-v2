import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  Widget: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 16,
    width: 700,
    maxWidth: '95vw',
    maxHeight: '90vh',
    margin: '0',
    position: 'relative',
    zIndex: 1,
    backgroundColor: '#2229',
    backdropFilter: 'blur(40px)',
    display: 'flex',
    flexDirection: 'column',
    '& > div:last-child': {
      overflowY: 'auto',
      maxHeight: 'calc(90vh - 50px)'
    },
    '@media (max-width: 720px)': {
      '&&': {
        width: '95vw'
      }
    }
  }
}))

export default useStyles
