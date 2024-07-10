import {
  ArrowBack,
  ArrowDownward,
  ArrowForward,
  ArrowUpward,
  Cancel,
  ControlCamera,
  PanTool,
  Rotate90DegreesCw,
  Save,
  SwapHoriz,
  SwapVert
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  // Collapse,
  IconButton,
  Slider,
  Stack,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Ledfx } from '../../../../api/ledfx'
import Popover from '../../../../components/Popover/Popover'
import { transpose } from '../../../../utils/helpers'
import { MCell } from './M.utils'
import { processArray } from './processMatrix'
import moveSelectedGroupUp from './Actions/moveSelectedGroupUp'
import moveSelectedGroupLeft from './Actions/moveSelectedGroupLeft'
import moveSelectedGroupRight from './Actions/moveSelectedGroupRight'
import moveSelectedGroupDown from './Actions/moveSelectedGroupDown'
import useStore from '../../../../store/useStore'
import Webcam from '../../../../components/Webcam/Webcam'
// import useStore from '../../../../store/useStore'

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
  setError
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
}) => {
  // const infoAlerts = useStore((state) => state.ui.infoAlerts)
  // const setInfoAlerts = useStore((state) => state.ui.setInfoAlerts)
  const [tab, setTab] = useState('1')
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getDevices = useStore((state) => state.getDevices)
  const features = useStore((state) => state.features)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === '1') setDnd(false)
    if (newValue === '2') setDnd(true)
    setTab(newValue)
  }

  useEffect(() => {
    if (dnd && tab !== '2') setTab('2')
    if (!dnd && tab !== '1') setTab('1')
  }, [dnd])

  return (
    <Stack
      minWidth={400}
      direction="column"
      spacing={2}
      style={{ marginBottom: '1rem', marginRight: '1rem' }}
      p={2}
    >
      {/* {infoAlerts.matrix && (
        <Collapse in={infoAlerts.matrix}>
          <Alert
            severity="info"
            sx={{ width: 400, marginBottom: 2 }}
            onClose={() => {
              setInfoAlerts('matrix', false)
            }}
          >
            <strong>Concept Draft</strong>
            <ul style={{ padding: '0 1rem' }}>
              <li>Use Mousewheel to Zoom</li>
              <li>Use left-click with drag&drop to move around</li>
              <li>Use right-click to assign Pixels</li>
            </ul>
          </Alert>
        </Collapse>
      )} */}
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Stack direction="row" width={400} justifyContent="space-between">
          <Typography width={100} variant="body1">
            Rows:
          </Typography>
          <Box width={250}>
            <Slider
              min={1}
              max={50}
              value={rowN}
              onChange={(e, newRowNumber) =>
                typeof newRowNumber === 'number' && setRowNumber(newRowNumber)
              }
            />
          </Box>
          {rowN}
        </Stack>
        <Stack direction="row" width={400} justifyContent="space-between">
          <Typography width={100} variant="body1">
            Columns:
          </Typography>
          <Box width={250}>
            <Slider
              min={1}
              max={50}
              value={colN}
              onChange={(e, newColNumber) =>
                typeof newColNumber === 'number' && setColNumber(newColNumber)
              }
            />
          </Box>
          {colN}
        </Stack>
        <Stack
          direction="row"
          width={400}
          justifyContent="space-between"
          margin="1rem 0"
        >
          <Stack direction="row" justifyContent="flex-start">
            <Button
              style={{ marginRight: 8 }}
              onClick={() => setM(transpose(m))}
            >
              <Rotate90DegreesCw />
            </Button>
            <Button
              style={{ marginRight: 8 }}
              onClick={() => {
                const toReverse = JSON.parse(JSON.stringify(m))
                setM(toReverse.reverse())
              }}
            >
              <SwapVert />
            </Button>
            <Button
              style={{ marginRight: 32 }}
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
          </Stack>
          <Stack direction="row" justifyContent="flex-start">
            <Popover
              style={{ marginRight: 8 }}
              color="inherit"
              variant="outlined"
              onConfirm={() => {
                setM(Array(rowN).fill(Array(colN).fill(MCell)))
              }}
            />

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
              startIcon={<Save />}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Box>
        <Tab
          icon={<ControlCamera />}
          iconPosition="start"
          label="Move Group"
          value
        />
      </Box>
      {move ? (
        <Box>
          <Stack
            direction="column"
            spacing={0}
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              onClick={() =>
                moveSelectedGroupUp({
                  m,
                  rowN,
                  colN,
                  selectedGroup,
                  setError,
                  setM
                })
              }
            >
              <ArrowUpward />
            </IconButton>
            <Stack direction="row" spacing={0} justifyContent="center">
              <IconButton
                onClick={() =>
                  moveSelectedGroupLeft({
                    m,
                    rowN,
                    colN,
                    selectedGroup,
                    setM
                  })
                }
              >
                <ArrowBack />
              </IconButton>
              <IconButton onClick={() => setMove(false)}>
                <Cancel />
              </IconButton>
              <IconButton
                onClick={() =>
                  moveSelectedGroupRight({
                    m,
                    rowN,
                    colN,
                    selectedGroup,
                    setM
                  })
                }
              >
                <ArrowForward />
              </IconButton>
            </Stack>
            <IconButton
              onClick={() =>
                moveSelectedGroupDown({
                  m,
                  rowN,
                  colN,
                  selectedGroup,
                  setError,
                  setM
                })
              }
            >
              <ArrowDownward />
            </IconButton>
          </Stack>
        </Box>
      ) : (
        <Alert severity="info" sx={{ width: 400, marginBottom: 2 }}>
          <strong>
            Right-Click an element to move a group.
            <br />
            Groups can only be moved with the UI buttons
          </strong>
        </Alert>
      )}
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              icon={<PanTool />}
              iconPosition="start"
              label="Canvas"
              value="1"
            />
            <Tab
              icon={<ControlCamera />}
              iconPosition="start"
              label="DND"
              value="2"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Alert severity="info" sx={{ width: 340, marginBottom: 2 }}>
            <strong>Canvas Mode</strong>
            <ul style={{ padding: '0 1rem' }}>
              <li>Use Mousewheel to Zoom</li>
              <li>Use left-click with drag&drop to move around</li>
              <li>Use right-click to:</li>
              <ul>
                <li>assign pixel or pixel-group</li>
                <li>edit a pixel</li>
                <li>clear a pixel</li>
                <li>move a pixel-group</li>
              </ul>
              <li>Enter DND mode to move pixels individually</li>
            </ul>
          </Alert>
        </TabPanel>
        <TabPanel value="2">
          <Alert severity="info" sx={{ width: 340, marginBottom: 2 }}>
            <strong>DND Mode</strong>
            <ul style={{ padding: '0 1rem' }}>
              <li>move pixels individually with your mouse</li>
            </ul>
          </Alert>
        </TabPanel>
      </TabContext>
      {features.matrix_cam && <Webcam rowN={rowN} colN={colN} />}
    </Stack>
  )
}
export default MControls
