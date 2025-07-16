import { Box, Collapse, Stack } from '@mui/material'
import { useEffect, useState } from 'react'

import useStore from '../../../../../store/useStore'
import DnDModeTabs from './DnDModeTabs'
import { useMatrixEditorContext } from '../MatrixEditorContext'
import MActionBar from './MActionBar'

const MControls = ({ virtual }: { virtual: any }) => {
  const [camMapper, setCamMapper] = useState(false)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const graphs = useStore((state) => state.graphs)
  const graphsMulti = useStore((state) => state.graphsMulti)
  const virtuals = useStore((state) => state.virtuals)
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)

  const { showPixelGraph } = useMatrixEditorContext()

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
    <Stack width={480} height={'100%'} direction="column" spacing={2} p={0}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
        <Collapse in={!camMapper}>
          <DnDModeTabs />
        </Collapse>
      </Box>
      <MActionBar virtual={virtual} camMapper={camMapper} setCamMapper={setCamMapper} />
    </Stack>
  )
}
export default MControls
