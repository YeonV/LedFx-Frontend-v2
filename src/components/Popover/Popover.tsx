import { ReactElement, useEffect, useState } from 'react'
import {
  Typography,
  Button,
  MenuItem,
  ListItemIcon,
  Popover as PopoverOriginal,
  useTheme,
  Fab,
  IconButton
} from '@mui/material'
import { Delete, Close, Check } from '@mui/icons-material'
import { useLongPress } from 'use-long-press'
import { PopoverProps } from './Popover.interface'

const Popover = ({
  onConfirm,
  onCancel,
  confirmDisabled,
  confirmContent,
  onSingleClick,
  onDoubleClick,
  openOnDoubleClick = false,
  openOnLongPress = false,
  noIcon = false,
  disabled = false,
  variant = 'contained',
  color = 'secondary',
  vertical = 'center',
  horizontal = 'left',
  size = 'small',
  text = 'Are you sure?',
  label = undefined,
  anchorOrigin,
  transformOrigin,
  startIcon,
  icon = <Delete />,
  content,
  footer,
  className,
  style = {},
  sx,
  sxButton,
  popoverStyle,
  wrapperStyle,
  type = 'button',
  open = false,
  onOpenChange, // Add this new prop
  children
}: PopoverProps): ReactElement<any, any> => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const openPopover = (event: any) => {
    setAnchorEl(() => event.currentTarget || event.target)
    onOpenChange?.(true) // Notify parent
  }
  const handleClose = () => {
    setAnchorEl(null)
    onOpenChange?.(false) // Notify parent
  }
  const longPress = useLongPress((e) => openPopover(e), {
    onCancel: (e) => {
      if (onSingleClick) onSingleClick(e)
    },
    threshold: 1000,
    captureEvent: true
  })
  const opened = Boolean(anchorEl)
  const id = opened ? 'simple-popover' : undefined

  useEffect(() => {
    if (!open) {
      setAnchorEl(null)
    }
  }, [open])

  return (
    <div
      style={{ display: 'initial', margin: 0, ...wrapperStyle }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {type === 'menuItem' ? (
        <MenuItem
          className={className}
          onClick={(e) => {
            e.preventDefault()
            if (onSingleClick) onSingleClick(e)
            openPopover(e)
          }}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          {label}
        </MenuItem>
      ) : openOnLongPress ? (
        type === 'button' ? (
          <Button
            aria-describedby={id}
            variant={variant}
            color={color}
            size={size}
            className={className}
            style={style}
            sx={sxButton}
            startIcon={!noIcon && startIcon}
            disabled={disabled}
            // eslint-disable-next-line
                {...longPress}
          >
            {label}
            {!startIcon && !noIcon && icon}
          </Button>
        ) : (
          <Fab
            aria-label="clear-data"
            {...longPress}
            disabled={disabled}
            style={{
              margin: '8px',
              ...style
            }}
            sx={{
              color: theme.palette.primary.contrastText,
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.light
              }
            }}
          >
            {!startIcon && !noIcon && icon}
          </Fab>
        )
      ) : type === 'button' ? (
        <Button
          aria-describedby={id}
          variant={variant}
          color={color}
          onClick={(e) => {
            e.preventDefault()
            if (!openOnDoubleClick) openPopover(e)
            if (onSingleClick) onSingleClick(e)
          }}
          size={size}
          className={className}
          style={style}
          sx={{
            ...sxButton
            // color: theme.palette.mode === 'light' ? '#000' : '#fff',
            // bgcolor: 'transparent',
            // '&:hover': {
            //   color: theme.palette.mode === 'light' ? '#fff' : '#000',
            //   bgcolor: theme.palette.primary.main
            // }
          }}
          startIcon={!noIcon && startIcon}
          disabled={disabled}
          onDoubleClick={(e) => {
            e.preventDefault()
            if (openOnDoubleClick) openPopover(e)
            if (onDoubleClick) onDoubleClick(e)
          }}
        >
          {label}
          {!startIcon && !noIcon && icon}
          {children}
        </Button>
      ) : type === 'iconbutton' ? (
        <IconButton
          color={color}
          style={style}
          onClick={(e) => openPopover(e)}
          disabled={disabled}
          sx={sx}
        >
          {!startIcon && !noIcon && icon}
        </IconButton>
      ) : (
        <Fab
          aria-label="clear-data"
          onClick={(e) => {
            e.preventDefault()
            if (!openOnDoubleClick) openPopover(e)
            if (onSingleClick) onSingleClick(e)
          }}
          onDoubleClick={(e) => {
            e.preventDefault()
            if (openOnDoubleClick) openPopover(e)
            if (onDoubleClick) onDoubleClick(e)
          }}
          disabled={disabled}
          style={{
            margin: '8px'
          }}
          sx={{
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.light
            },
            ...sx
          }}
        >
          {!startIcon && !noIcon && icon}
          {children}
        </Fab>
      )}
      <PopoverOriginal
        id={id}
        open={opened}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={
          anchorOrigin || {
            vertical,
            horizontal
          }
        }
        transformOrigin={
          transformOrigin || {
            vertical,
            horizontal: horizontal === 'center' ? 'center' : 'right'
          }
        }
      >
        <div style={{ display: 'flex', ...popoverStyle }}>
          {content || <Typography sx={{ padding: theme.spacing(2) }}>{text}</Typography>}
          <Button
            disabled={confirmDisabled}
            aria-describedby={id}
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault()
              if (onConfirm) onConfirm(e)
              handleClose() // Use handleClose instead of setAnchorEl(null)
            }}
          >
            {confirmContent || <Check />}
          </Button>
          <Button
            aria-describedby={id}
            color="primary"
            onClick={(e) => {
              e.preventDefault()
              if (onCancel) onCancel(e)
              handleClose() // Use handleClose instead of setAnchorEl(null)
            }}
          >
            <Close />
          </Button>
        </div>
        {footer}
      </PopoverOriginal>
    </div>
  )
}

export default Popover
