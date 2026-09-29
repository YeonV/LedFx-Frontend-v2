import { useId } from 'react'
import { Switch, Checkbox, Button, Typography } from '@mui/material'
import BladeFrame, { errorAria } from '../BladeFrame'
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
  hideDesc = false,
  error
}: BBooleanProps) => {
  const errorId = useId()
  const aria = errorAria(errorId, error)
  switch (type) {
    case 'switch':
      return (
        <BladeFrame
          index={index}
          required={required}
          style={style}
          title={title}
          error={error}
          errorId={errorId}
        >
          <Switch
            defaultValue={defaultValue || value}
            checked={value}
            onChange={onChange}
            name={title}
            color="primary"
            slotProps={{ input: aria }}
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
        <BladeFrame index={index} title={title} error={error} errorId={errorId}>
          <Checkbox
            defaultValue={defaultValue || value}
            checked={value}
            onChange={onChange}
            name={title}
            color="primary"
            slotProps={{ input: aria }}
          />
        </BladeFrame>
      )
    case 'button':
      return (
        <Button color="primary" variant={value ? 'contained' : 'outlined'} onClick={onChange}>
          {title}
        </Button>
      )

    default:
      return <div>unset</div>
  }
}

export default BBoolean
