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
  SwapVert,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Collapse,
  IconButton,
  Slider,
  Stack,
  Tooltip,
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
import { reverseProcessArray } from './processMatrix'

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
  setPixels
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
  setPixels: any
}) => {
  const [tab, setTab] = useState('1')
  const [camMapper, setCamMapper] = useState(false)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getDevices = useStore((state) => state.getDevices)
  const [showPixelGraph, setShowPixelGraph] = useState<boolean>(false)
  const pixelGraphs = useStore((state) => state.pixelGraphs)
  const virtuals = useStore((state) => state.virtuals)
  const infoAlerts = useStore((state) => state.uiPersist.infoAlerts)
  const setInfoAlerts = useStore((state) => state.setInfoAlerts)
  const features = useStore((state) => state.features)

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

    /**
   * Update the pixel-graphs when the virtual changes
   */
    useEffect(() => {
      const handleWebsockets = (e: any) => {
        if (e.detail.id === virtual.id) {
          setPixels(e.detail.pixels)
        }
      }
      if (showPixelGraph && virtual.id) {
        document.addEventListener('visualisation_update', handleWebsockets)
      } else {
        document.removeEventListener('visualisation_update', handleWebsockets)
      }
      return () => {
        document.removeEventListener('visualisation_update', handleWebsockets)
      } // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, [virtuals, pixelGraphs, showPixelGraph, virtual])

  return (
    <Stack
      minWidth={400}
      direction="column"
      spacing={2}
      style={{ marginBottom: '1rem' }}
      p={2}
    >
      <Collapse in={!camMapper}>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{ '& .MuiButton-root': { minWidth: 0 }}}
        >
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            className='step-2d-virtual-three'
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
          </Stack>
          <Stack
            direction="row"
            width={400}
            justifyContent="space-between"
            margin="1rem 0"
            className='step-2d-virtual-four'
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
              <Tooltip title={`${showPixelGraph ? 'Hide' : 'Show'} Pixel Graph`} className='step-2d-virtual-two'>
                <Button
                  // disabled={features.matrix_cam}            
                  onClick={() => {
                    setShowPixelGraph(!showPixelGraph)
                  }}
                >{showPixelGraph ? <Stop /> : <PlayArrow />}
                </Button>
              </Tooltip>
              <Tooltip title={'Load / Reset'} >
                <Button onClick={() => { setM(reverseProcessArray(virtual.segments, colN)) }}>
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
          <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: '0 !important' }} className='step-2d-virtual-six'>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                icon={<PanTool />}
                iconPosition="start"
                label="DND-Canvas"
                value="1"
              />
              <Tab
                icon={<ControlCamera />}
                iconPosition="start"
                label="DND-Pixels"
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ padding: 0 }}>
            <Collapse in={infoAlerts.camera}>
              <Alert severity="info" sx={{ width: '100%' }} onClose={() => {
              setInfoAlerts('camera', false)
            }}>
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
          <TabPanel value="2">
            <Collapse in={infoAlerts.pixelMode} sx={{ marginTop: '0 !important' }}>
              <Alert severity="info" sx={{ width: '100%' }} onClose={()=> setInfoAlerts('pixelMode', false)}>
                <strong>DND-Pixels Mode</strong>
                <ul style={{ padding: '0 1rem' }}>
                  <li>move pixels individually with your mouse</li>
                </ul>
              </Alert>
            </Collapse>
          </TabPanel>
        </TabContext>
        {move ? (
          <Box>
            <Box className='step-2d-virtual-five'>
              <Tab
                icon={<ControlCamera />}
                iconPosition="start"
                label="Move Group"
                value
              />
            </Box>
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
          <Collapse in={infoAlerts.matrixGroups}>
            <Alert severity="info" sx={{ width: 400, marginTop: 2 }} onClose={() => {
              setInfoAlerts('matrixGroups', false)
            }}>
              <strong>
                Right-Click an element to move a group.
                <br />
                Groups can only be moved with the UI buttons
              </strong>
            </Alert>
          </Collapse>
        )}
      </Collapse>
      {features.matrix_cam && <Button sx={{ alignItems: 'center', textTransform: 'none'}} onClick={()=> {
        getDevices()
        setCamMapper(!camMapper)}
        }>
        <EmergencyRecording sx={{ marginRight: 1}} />{camMapper ? 'Exit CameraMapper' : 'Map Pixels via Camera'}
      </Button>}
      <Collapse in={camMapper}>
       {camMapper && <Webcam rowN={rowN} colN={colN} />}
      </Collapse>
    </Stack>
  )
}
export default MControls
