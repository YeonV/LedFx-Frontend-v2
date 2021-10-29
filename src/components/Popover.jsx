import React, { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PopoverOriginal from '@material-ui/core/Popover';
import { Typography, Button, MenuItem, ListItemIcon, } from '@material-ui/core';
import { Delete, Close, Check } from '@material-ui/icons';
import { useLongPress } from 'use-long-press';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function Popover({
  onConfirm,
  confirmDisabled,
  confirmContent,
  onSingleClick = () => {},
  onDoubleClick,
  openOnDoubleClick = false,
  openOnLongPress = false,
  variant = 'contained',
  color = 'secondary',
  label,
  text = 'Are you sure?',
  direction = 'left',
  vertical = 'center',
  anchorOrigin,
  transformOrigin,
  size = 'small',
  icon = <Delete />,
  content,
  footer,
  className,
  startIcon,
  noIcon = false,
  style = {},
  disabled = false,
  popoverStyle,
  wrapperStyle,
  type,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openPopover = (event) => {
    setAnchorEl(event.currentTarget || event.target)
  };
  const handleClose = () => {
    setAnchorEl(null)
  };
  const longPress = useLongPress((e) => openPopover(e), {
    onCancel: e => {
      onSingleClick && onSingleClick()
    },
    treshhold: 1000,
    captureEvent: true,
  });
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div style={{ display: 'initial', ...wrapperStyle }}>
      {type === 'menuItem'
        ? <MenuItem className={className} onClick={(e) => { e.preventDefault(); onSingleClick(e); openPopover(e)}}>
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          {label}
        </MenuItem>
        : openOnLongPress
        ? <Button
          aria-describedby={id}
          variant={variant}
          color={color}
          size={size}
          className={className}
          style={style}
          startIcon={!noIcon && startIcon}
          disabled={disabled}
          {...longPress}
        >
          {label}
          {!startIcon && !noIcon && icon}
        </Button>
        : <Button
          aria-describedby={id}
          variant={variant}
          color={color}
          onClick={(e) => {
            e.preventDefault()
            !openOnDoubleClick && openPopover(e)
            onSingleClick && onSingleClick(e)
          }}
          size={size}
          className={className}
          style={style}
          startIcon={!noIcon && startIcon}
          disabled={disabled}
          onDoubleClick={(e) => {
            e.preventDefault()
            openOnDoubleClick && openPopover(e)
            onDoubleClick && onDoubleClick(e)
          }}
        >
          {label}
          {!startIcon && !noIcon && icon}
        </Button>}
      <PopoverOriginal
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin || {
          vertical: vertical,
          horizontal: direction,
        }}
        transformOrigin={transformOrigin || {
          vertical: vertical,
          horizontal: direction === 'center' ? 'center' : 'right',
        }}
      >
        <div style={{ display: 'flex', ...popoverStyle }}>
          {content ? content : <Typography className={classes.typography}>{text}</Typography>}
          
          <Button
            disabled={confirmDisabled}
            aria-describedby={id}
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault()
              onConfirm();
              setAnchorEl(null);
            }}
          >
            {confirmContent ? confirmContent : <Check />}
            
          </Button>
          <Button
            aria-describedby={id}
            variant="outlined"
            color="default"
            onClick={(e) => {
              e.preventDefault()
              setAnchorEl(null);
            }}
          >
            <Close />
          </Button>
        </div>
        {footer}
      </PopoverOriginal>
    </div>
  );
}
