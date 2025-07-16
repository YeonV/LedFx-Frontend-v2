import { EmergencyRecording } from '@mui/icons-material'
import { Button, Collapse, Stack } from '@mui/material'
import { useEffect, useState } from 'react'

import useStore from '../../../../../store/useStore'
import Webcam from '../../../../../components/Webcam/Webcam'
import GroupControls from './GroupControls'
import LayoutTools from './LayoutTools'
import DimensionSliders from './DimensionSliders'
import DnDModeTabs from './DnDModeTabs'
import { useMatrixEditorContext } from '../MatrixEditorContext'

const MControls = ({ virtual }: { virtual: any }) => {
  const [camMapper, setCamMapper] = useState(false)
  const getDevices = useStore((state) => state.getDevices)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const graphs = useStore((state) => state.graphs)
  const graphsMulti = useStore((state) => state.graphsMulti)
  const virtuals = useStore((state) => state.virtuals)
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)
  const features = useStore((state) => state.features)

  const { rowN, colN, showPixelGraph, uniqueGroups } = useMatrixEditorContext()

  useEffect(() => {
    if (virtual.id && showPixelGraph) {
      setPixelGraphs([virtual.id])
    } else {
      setPixelGraphs([])
    }
    return () => {
      if (graphs && graphsMulti) {
        setPixelGraphs(
          Object.keys(virtuals)
            .filter((v) =>
              showComplex
                ? v
                : !(v.endsWith('-mask') || v.endsWith('-foreground') || v.endsWith('-background'))
            )
            .filter((v) => (showGaps ? v : !v.startsWith('gap-')))
        )
      }
    }
  }, [
    virtual.id,
    showPixelGraph,
    setPixelGraphs,
    graphs,
    graphsMulti,
    virtuals,
    showComplex,
    showGaps
  ])

  return (
    <Stack minWidth={400} direction="column" spacing={2} style={{ marginBottom: '1rem' }} p={2}>
      <Collapse in={!camMapper}>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{ '& .MuiButton-root': { minWidth: 0 } }}
        >
          <DimensionSliders virtual={virtual} />
          <LayoutTools virtual={virtual} />
        </Stack>
        <DnDModeTabs />
        {uniqueGroups.length > 0 && <GroupControls />}
      </Collapse>
      {features.matrix_cam && (
        <Button
          sx={{ alignItems: 'center', textTransform: 'none' }}
          className="step-2d-virtual-cam-toggle"
          onClick={() => {
            getDevices()
            setCamMapper(!camMapper)
          }}
        >
          <EmergencyRecording sx={{ marginRight: 1 }} />
          {camMapper ? 'Exit CameraMapper' : 'Map Pixels via Camera'}
        </Button>
      )}
      <Collapse in={camMapper}>{camMapper && <Webcam rowN={rowN} colN={colN} />}</Collapse>
    </Stack>
  )
}
export default MControls
