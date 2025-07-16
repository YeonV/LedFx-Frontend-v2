import { AdsClick, ControlCamera, Gamepad, InfoOutlined, Mouse, PanTool } from '@mui/icons-material'
import {
  Alert,
  Box,
  Collapse,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { IMCell } from '../M.utils'
import useStore from '../../../../../store/useStore'
import BladeIcon from '../../../../../components/Icons/BladeIcon/BladeIcon'
import { useMatrixEditorContext } from '../MatrixEditorContext'

const DnDModeTabs = () => {
  const { m, dnd, dndMode, setDndMode, setDnd, selectedGroup, setSelectedGroup } =
    useMatrixEditorContext()
  const [tab, setTab] = useState('1')
  const infoAlerts = useStore((state) => state.uiPersist.infoAlerts)
  const setInfoAlerts = useStore((state) => state.setInfoAlerts)

  const uniqueGroups = useMemo(() => {
    const groups = new Set<string>()
    m.flat().forEach((cell: IMCell) => {
      if (
        cell.group &&
        typeof cell.group === 'string' &&
        cell.group !== '' &&
        cell.group !== '0-0'
      ) {
        groups.add(cell.group)
      }
    })
    return Array.from(groups)
  }, [m])

  useEffect(() => {
    setInfoAlerts('groupMode', true)
  }, [])
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === '1') {
      setDnd(false)
      setDndMode('pixel')
    }
    if (newValue === '2') {
      setDnd(true)
      setDndMode('pixel')
    }
    if (newValue === '3') {
      setDnd(true)
      setDndMode('group')
    }
    setTab(newValue)
  }

  useEffect(() => {
    if (dnd === false) {
      setTab('1')
    } else {
      if (dndMode === 'pixel') {
        setTab('2')
      } else if (dndMode === 'group') {
        setTab('3')
      }
    }
  }, [dnd, dndMode])

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
            sx={{ flexBasis: '32%', minHeight: 0, height: 40 }}
            icon={<PanTool />}
            iconPosition="start"
            label="Pan"
            value="1"
          />
          <Tab
            disabled={!uniqueGroups || uniqueGroups.length === 0}
            sx={{ flexBasis: '33%', minHeight: 0, height: 40 }}
            icon={<BladeIcon name="mdi:led-outline" />}
            iconPosition="start"
            label="Move Pixel"
            value="2"
          />
          <Tab
            disabled={!uniqueGroups || uniqueGroups.length === 0}
            sx={{ flexBasis: '35%', minHeight: 0, height: 40 }}
            icon={<BladeIcon name="mdi:led-strip-variant" sx={{ mr: 1 }} />}
            iconPosition="start"
            label="Move Group"
            value="3"
          />
        </TabList>
      </Box>
      <TabPanel value="1" sx={{ padding: 0, pt: 2 }}>
        <Collapse in={infoAlerts.camera}>
          <Alert
            severity="info"
            sx={{
              width: '100%',
              position: 'relative',
              '& .MuiAlert-icon': {
                position: 'absolute',
                top: 11,
                left: 14
              },
              '& .MuiAlert-action': {
                position: 'absolute',
                top: 11,
                right: 20
              }
            }}
            onClose={() => {
              setInfoAlerts('camera', false)
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ mb: 4, pl: 3.7 }}>
                Pan & Inspect Mode
              </Typography>
              <Stack spacing={2}>
                {/* --- Zoom Row --- */}
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid size={{ xs: 4 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Mouse />
                      <Typography variant="body1">
                        <strong>Zoom</strong>
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      Use your Mouse Wheel to zoom in and out.
                    </Typography>
                  </Grid>
                </Grid>
                {/* --- Pan Row --- */}
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid size={{ xs: 4 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PanTool />
                      <Typography variant="body1">
                        <strong>Pan</strong>
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      Click & Drag with the Left Mouse Button to move around.
                    </Typography>
                  </Grid>
                </Grid>
                {/* --- Quick Actions Row --- */}
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid size={{ xs: 4 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AdsClick />
                      <Typography variant="body1">
                        <strong>Actions</strong>
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      Right-Click any cell for more options.
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Alert>
        </Collapse>
      </TabPanel>

      {uniqueGroups.length > 0 && (
        <TabPanel value="2" sx={{ padding: 0, pt: 2 }}>
          <Collapse in={infoAlerts.pixelMode}>
            <Alert
              severity="info"
              sx={{
                width: '100%',
                position: 'relative',
                '& .MuiAlert-icon': {
                  position: 'absolute',
                  top: 11,
                  left: 14
                },
                '& .MuiAlert-action': {
                  position: 'absolute',
                  top: 11,
                  right: 20
                }
              }}
              onClose={() => setInfoAlerts('pixelMode', false)}
            >
              <Box>
                <Typography variant="h6" sx={{ mb: 4, pl: 3.7 }}>
                  Pixel Drag Mode
                </Typography>
                <Stack spacing={2}>
                  {/* --- Move Pixel Row --- */}
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid size={{ xs: 4 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ControlCamera />
                        <Typography variant="body1">
                          <strong>MovePixel</strong>
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        Drag & Drop a single pixel onto any empty cell.
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* --- Quick Actions Row --- */}
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid size={{ xs: 4 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AdsClick />
                        <Typography variant="body1">
                          <strong>Actions</strong>
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        Right-Click is still available for editing.
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* --- Info Row --- */}
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid size={{ xs: 4 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <InfoOutlined />
                        <Typography variant="body1">
                          <strong>Precision</strong>
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        <em>Pan & Zoom are disabled in this mode.</em>
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Box>
            </Alert>
          </Collapse>
        </TabPanel>
      )}
      {uniqueGroups.length > 0 && (
        <TabPanel value="3" sx={{ padding: 0, pt: 2 }}>
          <Collapse in={infoAlerts.groupMode}>
            <Alert
              severity="info"
              sx={{
                width: '100%',
                position: 'relative',
                '& .MuiAlert-icon': {
                  position: 'absolute',
                  top: 11,
                  left: 14
                },
                '& .MuiAlert-action': {
                  position: 'absolute',
                  top: 11,
                  right: 20
                }
              }}
              onClose={() => setInfoAlerts('groupMode', false)}
            >
              <Box>
                <Typography variant="h6" sx={{ mb: 4, pl: 3.7 }}>
                  Group Drag Mode
                </Typography>
                <Stack spacing={2}>
                  {/* --- Move Group Row --- */}
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid size={{ xs: 4 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ControlCamera />
                        <Typography variant="body1">
                          <strong>MoveGroup</strong>
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        Drag any pixel to move its entire group.
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* --- Manual Nudge Row --- */}
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid size={{ xs: 4 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Gamepad />
                        <Typography variant="body1">
                          <strong>Manual</strong>
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        Use the Gamepad icon in the action bar for precise, one-cell adjustments.
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* --- Quick Actions Row --- */}
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid size={{ xs: 4 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AdsClick />
                        <Typography variant="body1">
                          <strong>Actions</strong>
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        Right-Click is always available.
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Box>
            </Alert>
          </Collapse>
        </TabPanel>
      )}
    </TabContext>
  )
}
export default DnDModeTabs
