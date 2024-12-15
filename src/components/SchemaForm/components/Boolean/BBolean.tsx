import { Switch, Checkbox, Button, Typography } from '@mui/material'
import BladeFrame from '../BladeFrame'
import { BBooleanProps } from './BBoolean.props'

/**
 * ## Boolean
 * ### render as `switch`,`checkbox` or `button`
 */
const BBoolean = ({
  index,
  required,
  style,
  type = 'switch',
  onChange,
  defaultValue,
  value,
  title = '',
  description = '',
  hideDesc = false
}: BBooleanProps) => {
  switch (type) {
    case 'switch':
      return (
        <BladeFrame
          index={index}
          required={required}
          style={style}
          title={title}
        >
          <Switch
            defaultValue={defaultValue || value}
            checked={value}
            onChange={onChange}
            name={title}
            color="primary"
          />
          {!hideDesc && description ? (
            <Typography variant="body2" className="MuiFormHelperText-root">
              {description}{' '}
            </Typography>
          ) : null}
        </BladeFrame>
      )
    case 'checkbox':
      return (
        <BladeFrame index={index} title={title}>
          <Checkbox
            defaultValue={defaultValue || value}
            checked={value}
            onChange={onChange}
            name={title}
            color="primary"
          />
        </BladeFrame>
      )
    case 'button':
      return (
        <Button
          color="primary"
          variant={value ? 'contained' : 'outlined'}
          onClick={onChange}
        >
          {title}
        </Button>
      )

    default:
      return <div>unset</div>
  }
}

export default BBoolean
