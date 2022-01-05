import React from 'react';
import {
  Typography, Button, MenuItem, ListItemIcon, Popover as PopoverOriginal,
} from '@material-ui/core';
import { Delete, Close, Check } from '@material-ui/icons';
import { useLongPress } from 'use-long-press';
import { PopoverProps, PopoverDefaults } from './Popover.interface';
import useStyles from './Popover.styles';

const Popover = ({
  onConfirm,
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
  popoverStyle,
  wrapperStyle,
  type = 'button',
}: PopoverProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openPopover = (event:any) => {
    // eslint-disable-next-line
    setAnchorEl(() => event.currentTarget || event.target)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const longPress = useLongPress((e) => openPopover(e), {
    onCancel: (e) => {
      if (onSingleClick) onSingleClick(e);
    },
    threshold: 1000,
    captureEvent: true,
  });
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div style={{ display: 'initial', ...wrapperStyle }}>
      {type === 'menuItem'
        ? (
          <MenuItem
            className={className}
            onClick={(e) => {
              e.preventDefault();
              if (onSingleClick) onSingleClick(e);
              openPopover(e);
            }}
          >
            <ListItemIcon>
              {icon}
            </ListItemIcon>
            {label}
          </MenuItem>
        )
        : openOnLongPress
          ? (
            <Button
              aria-describedby={id}
              variant={variant}
              color={color}
              size={size}
              className={className}
              style={style}
              startIcon={!noIcon && startIcon}
              disabled={disabled}
              // eslint-disable-next-line
              {...longPress}
            >
              {label}
              {!startIcon && !noIcon && icon}
            </Button>
          )
          : (
            <Button
              aria-describedby={id}
              variant={variant}
              color={color}
              onClick={(e) => {
                e.preventDefault();
                if (!openOnDoubleClick) openPopover(e);
                if (onSingleClick) onSingleClick(e);
              }}
              size={size}
              className={className}
              style={style}
              startIcon={!noIcon && startIcon}
              disabled={disabled}
              onDoubleClick={(e) => {
                e.preventDefault();
                if (openOnDoubleClick) openPopover(e);
                if (onDoubleClick) onDoubleClick(e);
              }}
            >
              {label}
              {!startIcon && !noIcon && icon}
            </Button>
          )}
      <PopoverOriginal
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin || {
          vertical,
          horizontal,
        }}
        transformOrigin={transformOrigin || {
          vertical,
          horizontal: horizontal === 'center' ? 'center' : 'right',
        }}
      >
        <div style={{ display: 'flex', ...popoverStyle }}>
          {content || <Typography className={classes.typography}>{text}</Typography>}
          <Button
            disabled={confirmDisabled}
            aria-describedby={id}
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              if (onConfirm) onConfirm(e);
              setAnchorEl(null);
            }}
          >
            {confirmContent || <Check />}

          </Button>
          <Button
            aria-describedby={id}
            variant="outlined"
            color="default"
            onClick={(e) => {
              e.preventDefault();
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
};

Popover.defaultProps = PopoverDefaults;

export default Popover;
