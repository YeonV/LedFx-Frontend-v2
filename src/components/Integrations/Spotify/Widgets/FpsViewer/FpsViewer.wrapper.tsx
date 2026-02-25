import { useTheme } from '@mui/material'
import useStore from '../../../../../store/useStore'
import { useFireTvStore } from '../../../../FireTv/useFireTvStore'
import FpsViewer from './FpsViewer'

const FpsViewerWrapper = () => {
  const fpsViewer = useStore((state) => state.ui.fpsViewer)
  const fireTvBarHeight = useFireTvStore((state) => state.barHeight)
  const theme = useTheme()

  return (
    <FpsViewer
      open={fpsViewer}
      bottom={60 + fireTvBarHeight}
      left={5}
      color={theme.palette.primary.main}
    />
  )
}

export default FpsViewerWrapper
