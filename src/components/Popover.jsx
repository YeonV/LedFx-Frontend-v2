import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PopoverOriginal from '@material-ui/core/Popover';
import { Typography, Button, } from '@material-ui/core';
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
  onSingleClick,
  onDoubleClick,
  openOnDoubleClick = false,
  openOnLongPress = false,
  variant = 'contained',
  color = 'secondary',
  label,
  text = 'Are you sure?',
  direction = 'left',
  vertical = 'center',
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
      console.log('click')
      onSingleClick && onSingleClick()
    },
    treshhold: 1000,
    captureEvent: true,
  });
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div style={{ display: 'initial' }}>
      {openOnLongPress
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
            console.log("click")
            !openOnDoubleClick && openPopover(e)
            onSingleClick && onSingleClick(e)
          }}
          size={size}
          className={className}
          style={style}
          startIcon={!noIcon && startIcon}
          disabled={disabled}
          onDoubleClick={(e) => {
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
        anchorOrigin={{
          vertical: vertical,
          horizontal: direction,
        }}
        transformOrigin={{
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
            onClick={() => {
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
            onClick={() => {
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
