import { MenuItem, Select } from '@mui/material'
import useStore from '../../../../store/useStore'
import BladeFrame from '../BladeFrame'

const VirtualPicker = ({
  title,
  value,
  showAll,
  onChange
}: {
  title?: string
  value?: string
  showAll?: boolean
  onChange?: (value: string) => void
}) => {
  const virtuals = useStore((state) => state.virtuals)
  const complex = ['mask', 'foreground', 'background']
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
        value={value}
        fullWidth
        disableUnderline
      >
        {Object.keys(virtuals)
          .filter((v) =>
            showAll
              ? true
              : typeof virtuals[v].is_device === 'string' &&
                virtuals[v].is_device !== '' &&
                v &&
                !complex.some((c) => v.endsWith(c)) &&
                !v.startsWith('gap-')
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
