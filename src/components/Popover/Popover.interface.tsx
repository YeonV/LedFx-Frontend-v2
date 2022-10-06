import { PopoverProps as PopoverOriginalProps } from '@material-ui/core/Popover';
import { Delete } from '@material-ui/icons';

export interface PopoverProps {
  /**
   * Render as [Button](https://mui.com/api/button/) or [MenuItem](https://mui.com/api/menu-item/) <br />
   * examples: [Button](https://mui.com/components/buttons/), [MenuItem](https://mui.com/components/menu-item/)
   */
  type?: 'menuItem' | 'button' | 'fab';
  /**
   * Set the [variant](https://mui.com/components/buttons/#basic-button)
   */
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  /**
   * Set the [color](https://mui.com/components/buttons/#color)
   */
  color?: 'inherit' | 'secondary' | 'default' | 'primary' | undefined;
  /**
   * Set the [size](https://mui.com/components/buttons/#sizes)
   */
  size?: 'small' | 'medium' | 'large' | undefined;
  /**
   * Should the popup open on doubleclick? Ignored if openOnLongPress is `true`
   */
  openOnDoubleClick?: boolean;
  /**
   * Should the popup open on longpress? (openOnDoubleClick gets ignored if set)
   */
  openOnLongPress?: boolean;
  /**
   * Set Popover [position](https://mui.com/components/popover/#anchor-playground)
   */
  vertical?: number | 'center' | 'bottom' | 'top';
  /**
   * Set Popover [position](https://mui.com/components/popover/#anchor-playground)
   */
  horizontal?: number | 'center' | 'left' | 'right';
  /**
   * Set Popover [position](https://mui.com/components/popover/#anchor-playground)
   */
  anchorOrigin?: PopoverOriginalProps['anchorOrigin'];
  /**
   * Set Popover [position](https://mui.com/components/popover/#anchor-playground)
   */
  transformOrigin?: PopoverOriginalProps['transformOrigin'];
  /**
   * Function to call when confirm is clicked
   */
  onConfirm?: (e: any) => typeof e;
  /**
   * Function to call when button is clicked
   */
  onSingleClick?: (e: any) => typeof e;
  /**
   * Function to call when button is doubleclicked
   */
  onDoubleClick?: (e: any) => typeof e;
  /**
   * Remove Icon
   */
  noIcon?: boolean;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * flag indicator
   */
  confirmDisabled?: boolean;
  /**
   * flag indicator
   */
  confirmContent?: any;
  /**
   * Text to show in the popup
   */
  text?: string;
  /**
   * [Label](https://mui.com/components/buttons/#buttons-with-icons-and-label)
   */
  label?: string | undefined;
  /**
   * [startIcon](https://mui.com/components/buttons/#buttons-with-icons-and-label)
   */
  startIcon?: React.ReactNode;
  /**
   * [Icon](https://mui.com/components/material-icons/)
   */
  icon?: React.ReactNode;
  /**
   * Content
   */
  content?: React.ReactNode;
  /**
   * Footer
   */
  footer?: React.ReactNode;
  /**
   * JSX className
   */
  className?: string;
  /**
   * JSX style
   */
  style?: Record<string, unknown>;
  /**
   * JSX style
   */
  popoverStyle?: Record<string, unknown>;
  /**
   * JSX style
   */
  wrapperStyle?: Record<string, unknown>;
}

export const PopoverDefaults: PopoverProps = {
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
