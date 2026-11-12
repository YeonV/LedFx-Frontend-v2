import { InfoRounded } from '@mui/icons-material'
import { FormHelperText } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ReactElement, ReactNode } from 'react'
import Tooltip from './Tooltip'

const Root = styled('div')(({ theme }) => ({
  minWidth: '23.5%',
  padding: '16px 1.2rem 6px 1.2rem',
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: '10px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  height: 'auto',
  margin: '0.5rem 0',
  '@media (max-width: 580px)': {
    width: '100% !important',
    margin: '0.5rem 0'
  },
  '& > label': {
    top: '-0.75rem',
    display: 'flex',
    alignItems: 'center',
    left: '1rem',
    padding: '0 0.3rem',
    position: 'absolute',
    fontVariant: 'all-small-caps',
    fontSize: '0.9rem',
    letterSpacing: '0.1rem',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,
    boxSizing: 'border-box'
  }
}))

interface BladeFrameProps {
  title?: string
  index?: number
  children?: any
  full?: boolean
  style?: any
  required?: boolean
  variant?: 'outlined' | 'contained' | 'inherit'
  className?: string | undefined
  disabled?: boolean
  labelStyle?: any
  onClick?: any | undefined
  tooltip?: ReactNode
  /** validation message shown under the field */
  error?: string
  /** id of that message: the input names it in aria-describedby (see errorAria) */
  errorId?: string
}

/** The aria props that tie an input to its error caption (BladeFrame's `errorId`). */
export const errorAria = (errorId: string, error?: string) =>
  error ? { 'aria-invalid': true, 'aria-describedby': errorId } : {}

const BladeFrame = ({
  index = undefined,
  title = undefined,
  children = undefined,
  full = false,
  style = {
    width: 'unset',
    order: 0
  },
  required = false,
  variant = 'outlined',
  className = undefined,
  disabled = undefined,
  labelStyle = undefined,
  onClick = undefined,
  tooltip = undefined,
  error = undefined,
  errorId = undefined
}: BladeFrameProps): ReactElement<any, any> => {
  return variant === 'outlined' ? (
    <Root
      className={className || ''}
      style={{
        ...style,
        width: full ? '100%' : style.width,
        ...(error ? { flexWrap: 'wrap' } : {})
      }}
      onClick={onClick}
    >
      <label
        style={{ ...labelStyle }}
        className={`MuiFormLabel-root${disabled ? ' Mui-disabled' : ''}  step-effect-${index}`}
      >
        {title}
        {required ? '*' : ''}
        {tooltip ? (
          <Tooltip sx={{ ml: 1, mr: 0.5 }} title={tooltip} arrow placement="top">
            <InfoRounded fontSize="small" />
          </Tooltip>
        ) : null}
      </label>
      {children}
      {error && (
        <FormHelperText id={errorId} error sx={{ flexBasis: '100%', m: 0 }}>
          {error}
        </FormHelperText>
      )}
    </Root>
  ) : (
    children
  )
}

export default BladeFrame
