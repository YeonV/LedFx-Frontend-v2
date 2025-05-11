import { MenuItem, Select } from '@mui/material'
import useStore from '../../../../store/useStore'
import BladeFrame from '../BladeFrame'

const VirtualPicker = ({
  title,
  id,
  model,
  hide,
  handleEffectConfig
}: {
  title: string
  id: string
  model: Record<string, unknown>
  hide?: boolean
  handleEffectConfig?: (_config: Record<string, unknown>) => void
}) => {
  const virtuals = useStore((state) => state.virtuals)

  if (hide) return null

  return (
    <BladeFrame
      title={title}
      key={id}
      required
      style={{
        margin: '0.5rem 0',
        flexBasis: '49%',
        width: 'unset'
      }}
    >
      <Select
        onChange={(e: any) => {
          const c: Record<string, unknown> = {}
          c[id] = e.target.value
          return handleEffectConfig && handleEffectConfig(c)
        }}
        value={model[id]}
        fullWidth
        disableUnderline
      >
        {Object.keys(virtuals)
          .filter(
            (v) => typeof virtuals[v].is_device === 'string' && virtuals[v].is_device !== '' && v
          )
          .map((v) => {
            return (
              <MenuItem key={virtuals[v].id} value={virtuals[v].id}>
                {virtuals[v].config.name}
              </MenuItem>
            )
          })}
      </Select>
    </BladeFrame>
  )
}

export default VirtualPicker
