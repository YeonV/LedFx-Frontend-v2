import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PopoverOriginal, { PopoverProps as PopoverOriginalProps } from '@material-ui/core/Popover';
import {
  Typography, Button, MenuItem, ListItemIcon,
} from '@material-ui/core';
import { Delete, Close, Check } from '@material-ui/icons';
import { useLongPress } from 'use-long-press';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

interface PopoverProps {
  /**
  * onChange function for the given model
  */
  onConfirm?: (e: any) => typeof e,
  /**
  * onChange function for the given model
  */
  onSingleClick?: (e: any) => typeof e,
  /**
  * onChange function for the given model
  */
  onDoubleClick?: (e: any) => typeof e,
  /**
   * flag indicator
   */
  openOnDoubleClick?: boolean,
  /**
   * flag indicator
   */
  openOnLongPress?: boolean,
  /**
   * flag indicator
   */
  noIcon?: boolean,
  /**
   * flag indicator
   */
  disabled?: boolean,
  /**
   * flag indicator
   */
  confirmDisabled?: boolean,
  /**
   * flag indicator
   */
  confirmContent?: boolean,

  /**
   * JSX className
   */
  variant?: 'text' | 'outlined' | 'contained' | undefined,
  /**
   * JSX className
   */
  color?: 'inherit' | 'secondary' | 'default' | 'primary' | undefined,
  /**
   * JSX className
   */
  vertical?: number | 'center' | 'bottom' | 'top',
  /**
   * JSX className
   */
  horizontal?: number | 'center' | 'left' | 'right',
  /**
   * JSX className
   */
  size?: 'small' | 'medium' | 'large' | undefined,
  /**
   * JSX className
   */
  anchorOrigin?: PopoverOriginalProps['anchorOrigin'],
  /**
   * JSX className
   */
  transformOrigin?: PopoverOriginalProps['transformOrigin'],
  /**
   * JSX className
   */
  text?: string,
  /**
   * JSX className
   */
  label?: string | undefined,
  /**
   * JSX className
   */
  startIcon?: React.ReactNode,
  /**
   * JSX className
   */
  icon?: React.ReactNode,
  /**
   * JSX className
   */
  content?: React.ReactNode,
  /**
   * JSX className
   */
  footer?: React.ReactNode,

  /**
   * JSX className
   */
  className?: string,
  /**
   * JSX style
   */
  style?: Record<string, unknown>,
  /**
   * JSX style
   */
  popoverStyle?: Record<string, unknown>,
  /**
   * JSX style
   */
  wrapperStyle?: Record<string, unknown>,
  /**
   * JSX style
   */
  type?: 'menuItem' | 'button',
}

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

Popover.defaultProps = {
  onConfirm: undefined,
  confirmDisabled: undefined,
  confirmContent: undefined,
  onSingleClick: undefined,
  onDoubleClick: undefined,
  openOnDoubleClick: false,
  openOnLongPress: false,
  noIcon: false,
  disabled: false,
  variant: 'contained',
  color: 'secondary',
  vertical: 'center',
  horizontal: 'left',
  size: 'small',
  text: 'Are you sure?',
  label: undefined,
  anchorOrigin: undefined,
  transformOrigin: undefined,
  startIcon: undefined,
  icon: <Delete />,
  content: undefined,
  footer: undefined,
  className: undefined,
  style: {},
  popoverStyle: undefined,
  wrapperStyle: undefined,
  type: 'button',
};

export default Popover;
