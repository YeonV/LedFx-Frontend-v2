import { useState } from 'react'

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import ListSubheader from '@mui/material/ListSubheader'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material'
import useStyles from './DropDown.styles'
import {
  EffectDropDownDefaultProps,
  EffectDropDownProps
} from './DropDown.props'

const EffectDropDown = ({
  value,
  onChange,
  groups,
  showFilter,
  title
}: EffectDropDownProps) => {
  const classes = useStyles()
  const theme = useTheme()
  const [formats, setFormats] = useState(
    () => groups && Object.keys(groups).map((c) => c || [])
  )

  const handleFormat = (_: any, newFormats: any) => {
    setFormats(newFormats)
  }

  return (
    <FormControl
      className={`${classes.FormRow} step-device-one`}
      style={{ borderColor: theme.palette.divider }}
    >
      <InputLabel
        htmlFor="groupsed-select"
        sx={{
          p: '0 10px !important',
          background: theme.palette.background.paper
        }}
      >
        {title}
      </InputLabel>
      <Select
        value={value}
        onChange={onChange}
        id="groupsed-select"
        className={classes.FormSelect}
        sx={{ pb: '5px', pt: '0 !important' }}
      >
        <MenuItem value="" disabled>
          <em>None</em>
        </MenuItem>
        {groups &&
          Object.keys(groups).map(
            (c) =>
              formats &&
              formats.indexOf(c) !== -1 && [
                <ListSubheader
                  className={classes.FormListHeaders}
                  color="primary"
                  sx={{ background: theme.palette.secondary.main }}
                >
                  {c}
                </ListSubheader>,
                groups[c].map((e: any) => (
                  <MenuItem className={classes.FormListItem} value={e.id}>
                    {e.name}
                  </MenuItem>
                ))
              ]
          )}
      </Select>
      {showFilter && (
        <ToggleButtonGroup
          value={formats}
          onChange={handleFormat}
          aria-label="text formatting"
          className={classes.FormToggleWrapper}
        >
          {groups &&
            Object.keys(groups).map((c, i) => (
              <ToggleButton
                className={classes.FormToggle}
                key={i}
                value={c}
                aria-label={c}
              >
                {c}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
      )}
    </FormControl>
  )
}
EffectDropDown.defaultProps = EffectDropDownDefaultProps

export default EffectDropDown
