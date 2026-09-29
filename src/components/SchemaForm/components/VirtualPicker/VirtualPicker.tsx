import { MenuItem, Select } from '@mui/material'
import { useInstanceLoaded, useInstanceOptions } from '../../useInstanceOptions'
import { unlistedLabel } from '../../fields'
import useStore from '../../../../store/useStore'
import BladeFrame from '../BladeFrame'

const VirtualPicker = ({
  title,
  value,
  showAll,
  onChange,
  defaultValue
}: {
  title?: string
  value?: string
  showAll?: boolean
  /** The schema default: a "none" value (radial's 'unknown'), shown blank, never unavailable */
  defaultValue?: string
  onChange?: (value: string) => void
}) => {
  const virtuals = useStore((state) => state.virtuals)
  useInstanceOptions('virtuals') // loads them
  const loaded = useInstanceLoaded('virtuals')
  const complex = ['mask', 'foreground', 'background']
  // device-backed virtuals only; a layer may still point at one this hides (automagic's
  // `<name>-mask`), which then gets its own entry below
  const listed = Object.keys(virtuals).filter((v) =>
    showAll
      ? true
      : typeof virtuals[v].is_device === 'string' &&
        virtuals[v].is_device !== '' &&
        v &&
        !complex.some((c) => v.endsWith(c)) &&
        !v.startsWith('gap-')
  )
  return (
    <BladeFrame
      title={title}
      style={{
        margin: '0.5rem 0',
        flexBasis: '100%',
        width: 'unset'
      }}
    >
      <Select
        onChange={(e: any) => {
          const c = e.target.value
          return onChange && onChange(c)
        }}
        value={value ?? ''}
        fullWidth
        disableUnderline
      >
        {value && !listed.includes(value) && (
          <MenuItem value={value}>
            {unlistedLabel(value, virtuals[value]?.config?.name, defaultValue, loaded)}
          </MenuItem>
        )}
        {listed.map((v) => {
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
