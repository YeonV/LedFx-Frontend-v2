import { useTheme, Stack } from '@mui/material'
import BladeFrame from '../../components/SchemaForm/components/BladeFrame'
import DbRow from './DbRow'
import useStore from '../../store/useStore'
import { Device, Virtual } from '../../api/ledfx.types'

const DbStats = () => {
  const theme = useTheme()
  const config = useStore((state) => state.config)
  const devices = useStore((state) => state.devices)
  const virtuals = useStore((state) => state.virtuals)
  const scenes = useStore((state) => state.scenes)

  const filterDevDevices = (obj: Record<string, Device | Virtual>) =>
    Object.keys(obj).filter(
      (key) =>
        !key.startsWith('gap-') &&
        !key.endsWith('-mask') &&
        !key.endsWith('-foreground') &&
        !key.endsWith('-background')
    )
  const devicesOnline = filterDevDevices(devices).filter(
    (d) => devices[d].online
  )
  const virtualsReal = filterDevDevices(virtuals).filter(
    (d) => !virtuals[d].is_device
  )

  const pixelTotalOnline = filterDevDevices(devices)
    .map((d) => devices[d].online && devices[d].config.pixel_count)
    .reduce((a, b) => (a || 0) + (b || 0), 0)

  const pixelTotal = filterDevDevices(devices)
    .map((d) => devices[d].config.pixel_count)
    .reduce((a, b) => (a || 0) + (b || 0), 0)

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
      title="Stats"
    >
      <Stack width="100%">
        <DbRow left="Pixels:" right={`${pixelTotalOnline} / ${pixelTotal}`} />
        <DbRow
          left="Devices:"
          right={`${Object.keys(devicesOnline).length} / ${
            Object.keys(devices).length
          }`}
        />
        <DbRow left="Virtuals:" right={String(virtualsReal.length)} />
        <DbRow left="Scenes:" right={String(Object.keys(scenes).length)} />
        <DbRow
          left="User Colors:"
          right={String(
            Object.keys(config.user_colors).length +
              Object.keys(config.user_gradients).length
          )}
        />
        <DbRow
          left="User Presets:"
          right={String(
            Object.values(config.user_presets).length // eslint-disable-next-line
              ? Object.values(config.user_presets).map((e: any) => Object.keys(e).length).reduce((a: number, b: number) => a + b, 0)
              : 0
          )}
        />
      </Stack>
    </BladeFrame>
  )
}

export default DbStats
