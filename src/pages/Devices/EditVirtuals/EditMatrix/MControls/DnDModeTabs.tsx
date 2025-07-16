import { ControlCamera, PanTool } from '@mui/icons-material'
import { Alert, Box, Collapse, ToggleButton, ToggleButtonGroup } from '@mui/material'
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
  const { m, move, dnd, setMove, setDnd, selectedGroup, setSelectedGroup } =
    useMatrixEditorContext()
  const [tab, setTab] = useState('1')
  const infoAlerts = useStore((state) => state.uiPersist.infoAlerts)
  const setInfoAlerts = useStore((state) => state.setInfoAlerts)

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
  )
}
export default DnDModeTabs
