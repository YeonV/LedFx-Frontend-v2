import {
  ArrowBack,
  ArrowDownward,
  ArrowForward,
  ArrowUpward,
  Cancel,
  ControlCamera,
  EmergencyRecording,
  Loop,
  PanTool,
  PlayArrow,
  Rotate90DegreesCw,
  Save,
  Stop,
  SwapHoriz,
  SwapVert
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Ledfx } from '../../../../api/ledfx'
import Popover from '../../../../components/Popover/Popover'
import { transpose } from '../../../../utils/helpers'
import { IMCell, MCell } from './M.utils'
import { processArray, reverseProcessArray } from './processMatrix'
import moveSelectedGroupUp from './Actions/moveSelectedGroupUp'
import moveSelectedGroupLeft from './Actions/moveSelectedGroupLeft'
import moveSelectedGroupRight from './Actions/moveSelectedGroupRight'
import moveSelectedGroupDown from './Actions/moveSelectedGroupDown'
import useStore from '../../../../store/useStore'
import Webcam from '../../../../components/Webcam/Webcam'
import BladeIcon from '../../../../components/Icons/BladeIcon/BladeIcon'

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
  pixelGroups,
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
  console.log(pixelGroups)
  const [tab, setTab] = useState('1')
  const [camMapper, setCamMapper] = useState(false)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getDevices = useStore((state) => state.getDevices)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const graphs = useStore((state) => state.graphs)
  const graphsMulti = useStore((state) => state.graphsMulti)
  const virtuals = useStore((state) => state.virtuals)
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)

  const addVirtual = useStore((state) => state.addVirtual)
  const infoAlerts = useStore((state) => state.uiPersist.infoAlerts)
  const setInfoAlerts = useStore((state) => state.setInfoAlerts)
  const features = useStore((state) => state.features)
  const virtual2dLimit = useStore((state) => state.ui.virtual2dLimit)

  const uniqueGroups = useMemo(() => {
    const groups = new Set<string>()
    m.flat().forEach((cell: IMCell) => {
      if (cell.group && typeof cell.group === 'string' && cell.group !== '0-0') {
        groups.add(cell.group)
      }
    })
    return Array.from(groups)
  }, [m])

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === '1') setDnd(false)
    if (newValue === '2') setDnd(true)
    setTab(newValue)
  }

  useEffect(() => {
    if (dnd && tab !== '2') setTab('2')
    if (!dnd && tab !== '1') setTab('1')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dnd])

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

  useEffect(() => {
    if (selectedGroup && !uniqueGroups.includes(selectedGroup)) {
      setSelectedGroup('')
    }
    if (!uniqueGroups || uniqueGroups.length === 0) {
      setDnd(false)
      setTab('1')
    }
  }, [selectedGroup, uniqueGroups, setSelectedGroup, setDnd])

  return (
    <Stack minWidth={400} direction="column" spacing={2} style={{ marginBottom: '1rem' }} p={2}>
      <Collapse in={!camMapper}>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{ '& .MuiButton-root': { minWidth: 0 } }}
        >
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            className="step-2d-virtual-three"
          >
            <Stack direction="row" width={400} justifyContent="space-between">
              <Typography width={100} variant="body1">
                Rows:
              </Typography>
              <Box width={250}>
                <Slider
                  min={1}
                  max={virtual2dLimit}
                  value={rowN}
                  onChange={(e, newRowNumber) =>
                    typeof newRowNumber === 'number' && setRowNumber(newRowNumber)
                  }
                  onChangeCommitted={(e, newRowNumber) => {
                    if (typeof newRowNumber === 'number') {
                      addVirtual({
                        id: virtual.id,
                        config: { rows: newRowNumber }
                      })
                        .then(() => {
                          getVirtuals()
                          getDevices()
                        })
                        .then(() => {
                          Ledfx(`/api/virtuals/${virtual.id}`, 'POST', {
                            segments: processArray(m.flat(), virtual.id)
                          }).then(() => {
                            getVirtuals()
                            getDevices()
                          })
                        })
                    }
                  }}
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
                  max={virtual2dLimit}
                  value={colN}
                  onChange={(e, newColNumber) =>
                    typeof newColNumber === 'number' && setColNumber(newColNumber)
                  }
                  onChangeCommitted={() => {
                    Ledfx(`/api/virtuals/${virtual.id}`, 'POST', {
                      segments: processArray(m.flat(), virtual.id)
                    }).then(() => {
                      getVirtuals()
                      getDevices()
                    })
                  }}
                />
              </Box>
              {colN}
            </Stack>
          </Stack>
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
        </Stack>

        <TabContext value={tab}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              marginTop: '0 !important'
            }}
            className="step-2d-virtual-six"
          >
            <TabList onChange={handleChange} aria-label="DND Mode Tabs">
              <Tab
                sx={{ flexBasis: '50%', minHeight: 0, height: 40 }}
                icon={<PanTool />}
                iconPosition="start"
                label="DND-Canvas"
                value="1"
              />
              <Tab
                disabled={!uniqueGroups || uniqueGroups.length === 0}
                sx={{ flexBasis: '50%', minHeight: 0, height: 40 }}
                icon={<ControlCamera />}
                iconPosition="start"
                label="DND-Pixels"
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ padding: 0, pt: 2 }}>
            <Collapse in={infoAlerts.camera}>
              <Alert
                severity="info"
                sx={{ width: '100%' }}
                onClose={() => {
                  setInfoAlerts('camera', false)
                }}
              >
                <strong>DND-Canvas Mode</strong>
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
                  <li>Enter DND-Pixels mode to move pixels individually</li>
                </ul>
              </Alert>
            </Collapse>
          </TabPanel>

          {uniqueGroups.length > 0 && (
            <TabPanel value="2" sx={{ padding: 0, pt: 2 }}>
              <Collapse in={infoAlerts.pixelMode}>
                <Alert
                  severity="info"
                  sx={{ width: '100%' }}
                  onClose={() => setInfoAlerts('pixelMode', false)}
                >
                  <strong>DND-{move ? 'Group' : 'Pixel'} Mode</strong>
                  <ul style={{ padding: '0 1rem' }}>
                    <li>move {move ? 'groups' : 'pixels individually'} with your mouse</li>
                  </ul>
                </Alert>
              </Collapse>
              <ToggleButtonGroup
                sx={{ width: '100%' }}
                color="primary"
                value={move ? 'group' : 'pixel'}
                exclusive
                onChange={() => setMove(!move)}
                aria-label="Move Mode"
              >
                <ToggleButton value="pixel" sx={{ flex: 1 }}>
                  <BladeIcon name="mdi:led-outline" sx={{ mr: 1 }} />
                  Pixel
                </ToggleButton>
                <ToggleButton value="group" sx={{ flex: 1 }}>
                  <BladeIcon name="mdi:led-strip-variant" sx={{ mr: 1 }} />
                  Group
                </ToggleButton>
              </ToggleButtonGroup>
            </TabPanel>
          )}
        </TabContext>
        {uniqueGroups.length > 0 && (
          <Box>
            <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
              <InputLabel id="group-select-label">Move Group</InputLabel>
              <Select
                variant="outlined"
                labelId="group-select-label"
                id="group-select"
                value={selectedGroup || ''}
                label="Move Group"
                onChange={(e) => setSelectedGroup(e.target.value as string)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {uniqueGroups.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group} {/* You could format this later if you want, e.g., "Group 1" */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="column" spacing={0} alignItems="center" justifyContent="center">
              <IconButton
                disabled={!selectedGroup}
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
                  disabled={!selectedGroup}
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
                <IconButton disabled={!selectedGroup} onClick={() => setSelectedGroup('')}>
                  <Cancel />
                </IconButton>
                <IconButton
                  disabled={!selectedGroup}
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
                disabled={!selectedGroup}
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
