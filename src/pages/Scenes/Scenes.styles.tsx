import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  root: {
    // Same rule as the device card, so both pages size their cards alike.
    margin: '0.5rem',
    minWidth: '230px',
    maxWidth: '400px',
    width: '100%'
  },
  sceneTitle: {
    fontSize: '1.1rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  '@media (max-width: 410px)': {
    root: {
      margin: '0.25rem 0'
    }
  },
  '@media (max-width: 580px)': {
    sceneTitle: {
      fontSize: '1rem',
      cursor: 'default'
    }
  },
  media: {
    height: 140
  },
  iconMedia: {
    height: 140,
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto',
    fontSize: 100,
    '& > span:before': {
      position: 'relative'
    }
  },
  iconMediaList: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto',
    fontSize: 50,
    '& > span:before': {
      position: 'relative'
    }
  }
})

export default useStyles
