import { Fab, Tooltip } from '@mui/material'
import { OpenInFull } from '@mui/icons-material'
import useStore from '../../../../../store/useStore'

const SongDetectorScreenFab = () => {
  const setSd = useStore((state) => state.ui.setSd)
  const setSdPlus = useStore((state) => state.ui.setSdPlus)
  const setSongDetectorScreenOpen = useStore((state) => state.ui.setSongDetectorScreenOpen)

  const handleClick = () => {
    setSd(false) // Close floating widget
    setSdPlus(false) // Close Plus floating widget
    setSongDetectorScreenOpen(true) // Open full-screen dialog
  }

  return (
    <Tooltip title="Open Full Screen">
      <Fab
        size="small"
        color="primary"
        onClick={handleClick}
        sx={{ width: 40, height: 40, minHeight: 40 }}
      >
        <OpenInFull />
      </Fab>
    </Tooltip>
  )
}

export default SongDetectorScreenFab
