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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from '@mui/material'
import { DeveloperBoard, Devices, PlayArrow, Stop } from '@mui/icons-material'

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
  getOptionValue,
  engine,
  onEngineChange,
  engineAvailable = true
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
  /** Omit for rows the core cannot drive - no switch is then rendered. */
  engine?: 'browser' | 'core'
  onEngineChange?: (engine: 'browser' | 'core') => void
  engineAvailable?: boolean
}) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, mb: 1, mt: 1 }}>
    <FormControl fullWidth size="small">
      <InputLabel shrink>{label}</InputLabel>
      <Select
        multiple
        size="small"
        value={value}
        onChange={onChange}
        // notched is forced to match the forced-shrink InputLabel: without it
        // an empty selection leaves the outline closed, striking through the label.
        input={<OutlinedInput label={label} size="small" notched />}
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
    {engine && onEngineChange && (
      <ToggleButtonGroup
        size="small"
        exclusive
        value={engine}
        onChange={(_e, next) => next && onEngineChange(next)}
        sx={{ height: 40, '& .MuiToggleButton-root': { px: 1, py: 0 } }}
      >
        <ToggleButton value="browser">
          <Tooltip title="Applied by this client. Stops when the tab closes.">
            <Devices fontSize="small" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="core" disabled={!engineAvailable}>
          <Tooltip
            title={
              engineAvailable
                ? 'Applied by LedFx core. Shared by all clients and keeps running with no browser open.'
                : 'Now Playing service unavailable on this core'
            }
          >
            <DeveloperBoard fontSize="small" />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    )}
    <Tooltip title={isActive ? 'Stop Auto' : 'Start Auto'}>
      {/* Never disable while running - the user must always be able to stop. */}
      <span>
        <IconButton
          size="small"
          onClick={onToggle}
          disabled={disabled && !isActive}
          sx={{
            color: isActive ? 'success.main' : 'primary.main'
          }}
        >
          {isActive ? <Stop /> : <PlayArrow />}
        </IconButton>
      </span>
    </Tooltip>
  </Stack>
)

export default AutoApplySelector
