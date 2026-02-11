import { CircularProgress } from '@mui/material'
import useStore from '../../store/useStore'
import VisualizerDevWidget from './VisualizerDevWidget'

const VisualizerDevWidgetYZ = () => {
  const visualizerInitialized = useStore((state) => state.ui.visualizerInitialized)

  if (!visualizerInitialized) {
    return <CircularProgress />
  }

  return <VisualizerDevWidget />
}

export default VisualizerDevWidgetYZ
