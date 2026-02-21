import {
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Tooltip
} from '@mui/material'
import { PlayArrow, Stop } from '@mui/icons-material'

// Reusable selector/toggle component
const AutoApplySelector = ({
  label,
  options,
  value,
  onChange,
  isActive,
  onToggle,
  disabled,
  renderValue,
  getOptionLabel,
  getOptionValue
}: {
  label: string
  options: any[]
  value: string[]
  onChange: (event: any) => void
  isActive: boolean
  onToggle: () => void
  disabled: boolean
  renderValue?: (selected: string[]) => string
  getOptionLabel?: (option: any) => string
  getOptionValue?: (option: any) => string
}) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, mb: 2, mt: 1 }}>
    <FormControl fullWidth>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={renderValue || ((selected) => selected.join(', '))}
      >
        {options.map((option) => {
          const optionValue = getOptionValue ? getOptionValue(option) : option
          const optionLabel = getOptionLabel ? getOptionLabel(option) : option
          return (
            <MenuItem key={optionValue} value={optionValue}>
              <Checkbox checked={value.includes(optionValue)} />
              <ListItemText primary={optionLabel} />
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
    <Tooltip title={isActive ? 'Stop Auto' : 'Start Auto'}>
      <IconButton
        onClick={onToggle}
        disabled={disabled}
        sx={{
          color: isActive ? 'success.main' : 'primary.main',
          py: 2
        }}
      >
        {isActive ? <Stop /> : <PlayArrow />}
      </IconButton>
    </Tooltip>
  </Stack>
)

export default AutoApplySelector
