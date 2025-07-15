import { EmergencyRecording } from '@mui/icons-material'
import { Button, Collapse, Stack } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

import { IMCell } from '../M.utils'
import useStore from '../../../../../store/useStore'
import Webcam from '../../../../../components/Webcam/Webcam'
import GroupControls from './GroupControls'
import LayoutTools from './LayoutTools'
import DimensionSliders from './DimensionSliders'
import DnDModeTabs from './DnDModeTabs'

const MControls = ({
  rowN,
  colN,
  setRowNumber,
  setColNumber,
  virtual,
  m,
  setM,
  move,
  dnd,
  setMove,
  setDnd,
  selectedGroup,
  setError,
  showPixelGraph,
  setPixelGroups,
  setSelectedGroup,
  setShowPixelGraph
}: {
  rowN: number
  colN: number
  setRowNumber: any
  setColNumber: any
  virtual: any
  m: any
  setM: any
  move: boolean
  dnd: boolean
  setMove: any
  setDnd: any
  selectedGroup: string
  setError: any
  showPixelGraph?: boolean
  pixelGroups?: any
  setPixelGroups?: any
  setShowPixelGraph: (_show: boolean) => void
  setSelectedGroup: any
}) => {
  const [camMapper, setCamMapper] = useState(false)
  const getDevices = useStore((state) => state.getDevices)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const graphs = useStore((state) => state.graphs)
  const graphsMulti = useStore((state) => state.graphsMulti)
  const virtuals = useStore((state) => state.virtuals)
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)
  const features = useStore((state) => state.features)

  const uniqueGroups = useMemo(() => {
    const groups = new Set<string>()
    m.flat().forEach((cell: IMCell) => {
      if (cell.group && typeof cell.group === 'string' && cell.group !== '0-0') {
        groups.add(cell.group)
      }
    })
    return Array.from(groups)
  }, [m])

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
          <DimensionSliders
            rowN={rowN}
            colN={colN}
            setRowNumber={setRowNumber}
            setColNumber={setColNumber}
            virtual={virtual}
            m={m}
          />
          <LayoutTools
            rowN={rowN}
            colN={colN}
            m={m}
            setM={setM}
            virtual={virtual}
            setPixelGroups={setPixelGroups}
            showPixelGraph={showPixelGraph}
            setShowPixelGraph={setShowPixelGraph}
          />
        </Stack>
        <DnDModeTabs
          m={m}
          setM={setM}
          move={move}
          setMove={setMove}
          dnd={dnd}
          setDnd={setDnd}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
        {uniqueGroups.length > 0 && (
          <GroupControls
            m={m}
            rowN={rowN}
            colN={colN}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            setM={setM}
            setError={setError}
          />
        )}
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
