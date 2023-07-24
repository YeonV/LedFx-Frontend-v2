/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import { useTheme, Stack, Box } from '@mui/material'
import { useState } from 'react'
import BladeFrame from '../../components/SchemaForm/components/BladeFrame'
import DbButton from './DbButton'
import GlobalActionBar from '../../components/GlobalActionBar'
import useStore from '../../store/useStore'
import { deleteFrontendConfig, sleep } from '../../utils/helpers'
import Popover from '../../components/Popover/Popover'
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon'

const DbGlobalActions = () => {
  const theme = useTheme()
  const [scanning, setScanning] = useState(-1)
  const paused = useStore((state) => state.paused)
  const togglePause = useStore((state) => state.togglePause)
  const scanForDevices = useStore((state) => state.scanForDevices)
  const getDevices = useStore((state) => state.getDevices)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const setSystemConfig = useStore((state) => state.setSystemConfig)

  const onSystemSettingsChange = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig())
  }

  const handleScan = () => {
    setScanning(0)
    scanForDevices()
      .then(async () => {
        for (let sec = 1; sec <= 30; sec++) {
          await sleep(1000).then(() => {
            getDevices()
            getVirtuals()
            setScanning(sec)
          })
        }
      })
      .then(() => {
        setScanning(-1)
      })
  }

  return (
    <BladeFrame
      labelStyle={{
        background: theme.palette.background.default,
        color: theme.palette.primary.main
      }}
      style={{ borderColor: theme.palette.primary.main, paddingLeft: 10 }}
      title="Global Actions"
    >
      <Stack width="100%">
        <GlobalActionBar type="indicator" />
        <div style={{ height: 10 }} />
        <DbButton
          onClick={() => togglePause()}
          icon={paused ? 'PlayArrow' : 'PauseOutlined'}
          text="Play"
        />
        <Popover
          noIcon
          variant="text"
          color="inherit"
          style={{ padding: '11px', marginLeft: '0rem', flex: 1 }}
          wrapperStyle={{ display: 'flex' }}
          onConfirm={() => {
            onSystemSettingsChange('create_segments', true)
            handleScan()
          }}
          onCancel={() => {
            onSystemSettingsChange('create_segments', false)
            handleScan()
          }}
          text="Import Segments?"
        >
          <Box
            sx={{
              fontSize: 15,
              width: '100%',
              display: 'flex',
              textTransform: 'none',
              alignItems: 'center',
              '& .MuiButton-startIcon': {
                mr: 3
              }
            }}
          >
            <BladeIcon
              name="wled"
              style={{
                marginTop: -4,
                marginRight: 18,
                marginLeft: 4
              }}
            />
            <span style={{ fontSize: '0.8125rem', lineHeight: '1.75' }}>
              {scanning > -1
                ? `Scanning ${Math.round((scanning / 30) * 100)}%`
                : 'Scan for WLED devices'}
            </span>
          </Box>
        </Popover>
        <DbButton
          onClick={() => deleteFrontendConfig()}
          icon="Delete"
          text="Delete Client Data"
        />
      </Stack>
    </BladeFrame>
  )
}

export default DbGlobalActions
