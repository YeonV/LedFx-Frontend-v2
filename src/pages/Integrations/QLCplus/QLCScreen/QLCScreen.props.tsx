import React from 'react';
import { Settings } from '@mui/icons-material';
import { TransitionProps } from '@material-ui/core/transitions';
import { MenuItem, Slide } from '@material-ui/core';

export interface QLCScreenProps {
  icon: React.ReactElement;
  startIcon: React.ReactElement;
  label: string;
  type: string;
  className: string;
  color: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
  variant: 'outlined' | 'text' | 'contained' | undefined;
  innerKey: string;
  disabled: boolean;
  size: 'small' | 'medium' | 'large' | undefined;
}

export const QLCScreenDefaultProps = {
  icon: <Settings />,
  startIcon: undefined,
  label: '',
  type: 'button',
  className: undefined,
  color: 'default',
  variant: 'contained',
  innerKey: undefined,
  disabled: false,
  size: 'small',
};

export const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

Transition.defaultProps = {
  children: <div>loading</div>,
};

export const MuiMenuItem = React.forwardRef(
  (props: any, ref: React.Ref<unknown>) => {
    return <MenuItem ref={ref} {...props} />;
  }
);
