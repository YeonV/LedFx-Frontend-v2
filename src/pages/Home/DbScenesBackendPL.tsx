import { useTheme, Stack } from '@mui/material'
import BladeFrame from '../../components/SchemaForm/components/BladeFrame'
import BackendPlaylist from '../Scenes/BackendPlaylist'

const DbScenesBackendPL = () => {
  const theme = useTheme()

  return (
    <BladeFrame
      labelStyle={{
        background: theme.palette.background.default,
        color: theme.palette.primary.main
      }}
      style={{
        borderColor: theme.palette.primary.main,
        padding: 20,
        minWidth: 280
      }}
      title="Scenes Playlist (Core)"
    >
      <Stack width="100%">
        <BackendPlaylist maxWidth={388} />
      </Stack>
    </BladeFrame>
  )
}

export default DbScenesBackendPL
