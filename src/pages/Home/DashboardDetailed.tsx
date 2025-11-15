import { useEffect } from 'react'
import { Stack } from '@mui/material'
import useStore from '../../store/useStore'
import DbLinks from './DbLinks'
import DbStats from './DbStats'
import DbConfig from './DbConfig'
import DbGlobalActions from './DbGlobalActions'
import DbScenes from './DbScenes'
import DbScenesPL from './DbScenesPL'
import DbDevices from './DbDevices'
import DbScenesBackendPL from './DbScenesBackendPL'

const DashboardDetailed = () => {
  const getScenes = useStore((state) => state.getScenes)
  const features = useStore((state) => state.features)

  useEffect(() => {
    getScenes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="Content">
      <Stack spacing={[0, 0, 2, 2, 2]} alignItems="center" marginBottom={5}>
        <Stack direction="row" gap={2}>
          <Stack>
            <DbScenes />
            <DbScenesPL />
            {features.scenePlaylistBackend && <DbScenesBackendPL />}
          </Stack>
          <DbDevices />
          <Stack>
            <DbGlobalActions />
            <DbLinks />
            <DbStats />
            <DbConfig />
          </Stack>
        </Stack>
        {/* <MelbankGraph key="fft" graphId="1" /> */}
      </Stack>
    </div>
  )
}

export default DashboardDetailed
