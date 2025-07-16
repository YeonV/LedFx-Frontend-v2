import {
  Loop,
  PlayArrow,
  Rotate90DegreesCw,
  Save,
  Stop,
  SwapHoriz,
  SwapVert
} from '@mui/icons-material'
import { Box, Button, Stack, Tooltip } from '@mui/material'
import { Ledfx } from '../../../../../api/ledfx'
import Popover from '../../../../../components/Popover/Popover'
import { transpose } from '../../../../../utils/helpers'
import { MCell } from '../M.utils'
import { processArray, reverseProcessArray } from '../processMatrix'
import useStore from '../../../../../store/useStore'
import { useMatrixEditorContext } from '../MatrixEditorContext'

const LayoutTools = ({ virtual }: { virtual: any }) => {
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getDevices = useStore((state) => state.getDevices)
  const { rowN, colN, m, setM, showPixelGraph, setPixelGroups, setShowPixelGraph } =
    useMatrixEditorContext()
  return (
    <Stack
      direction="row"
      width={400}
      justifyContent="space-between"
      margin="1rem 0"
      className="step-2d-virtual-four"
      spacing={1}
    >
      <Stack direction="row" justifyContent="flex-start" spacing={0.5}>
        <Tooltip title={'Rotate 90°'}>
          <Button onClick={() => setM(transpose(m))}>
            <Rotate90DegreesCw />
          </Button>
        </Tooltip>
        <Tooltip title={'Swap Vertically'}>
          <Button
            onClick={() => {
              const toReverse = JSON.parse(JSON.stringify(m))
              setM(toReverse.reverse())
            }}
          >
            <SwapVert />
          </Button>
        </Tooltip>
        <Tooltip title={'Swap Horizontally'}>
          <Button
            onClick={() => {
              const toReverse = JSON.parse(JSON.stringify(m))
              for (let index = 0; index < toReverse.length; index += 1) {
                toReverse[index] = toReverse[index].reverse()
              }
              setM(toReverse)
            }}
          >
            <SwapHoriz />
          </Button>
        </Tooltip>
      </Stack>
      <Stack direction="row" justifyContent="flex-start" spacing={0.5}>
        <Tooltip
          title={`${showPixelGraph ? 'Hide' : 'Show'} Pixel Graph`}
          className="step-2d-virtual-two"
        >
          <Button
            // disabled={features.matrix_cam}
            onClick={() => {
              setShowPixelGraph(!showPixelGraph)
            }}
          >
            {showPixelGraph ? <Stop /> : <PlayArrow />}
          </Button>
        </Tooltip>
        <Tooltip title={'Reset'}>
          <Button
            onClick={() => {
              setM(reverseProcessArray(virtual.segments, colN))
            }}
          >
            <Loop />
          </Button>
        </Tooltip>
        <Tooltip title={'Clear'}>
          <Box>
            <Popover
              color="inherit"
              variant="outlined"
              onConfirm={() => {
                setM(Array(rowN).fill(Array(colN).fill(MCell)))
                setPixelGroups(0)
              }}
            />
          </Box>
        </Tooltip>
        <Tooltip title={'Save'}>
          <Button
            onClick={() => {
              Ledfx(`/api/virtuals/${virtual.id}`, 'POST', {
                segments: processArray(m.flat(), virtual.id)
              }).then(() => {
                getVirtuals()
                getDevices()
              })
            }}
            onContextMenu={(e) => {
              e.preventDefault()
              Ledfx(`/api/virtuals/${virtual.id}`, 'POST', {
                segments: processArray(m.flat(), virtual.id),
                matrix: m
              })
            }}
          >
            <Save />
          </Button>
        </Tooltip>
      </Stack>
    </Stack>
  )
}
export default LayoutTools
