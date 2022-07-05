/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable import/no-unresolved */
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { ListItemIcon, MenuItem } from '@material-ui/core';
import { MenuBook } from '@material-ui/icons';
// import { API } from '@stoplight/elements';
import { TransitionProps } from '@material-ui/core/transitions';
import useStyles from './Doc.styles';
import '@stoplight/elements/styles.min.css';
// import configApiYaml from './configApiYaml';

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

type Props = { _?: never; className?: any; onClick?: any; children?: any };

const MuiMenuItem = React.forwardRef<HTMLLIElement, Props>((props, ref) => {
  const { children } = props;
  return (
    <MenuItem ref={ref} {...props}>
      {children}
    </MenuItem>
  );
});

function FrameWrapper() {
  const ref = React.useRef<any>();
  const [height, setHeight] = React.useState('0px');
  const onLoad = () => {
    setHeight(`${ref.current.contentWindow.document.body.scrollHeight}px`);
  };
  return (
    <iframe
      title="docs"
      ref={ref}
      onLoad={onLoad}
      id="myFrame"
      src="https://yeonv.github.io/LedFx-Frontend-v2/docs/"
      width="100%"
      height={height}
      scrolling="no"
      frameBorder="0"
      style={{
        maxWidth: 640,
        width: '100%',
        overflow: 'auto',
      }}
    />
  );
}

export default function Doc({
  icon = <MenuBook />,
  startIcon,
  label = '',
  type,
  className,
  color = 'default',
  variant = 'contained',
  onClick = () => {},
  innerKey,
}: any) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {type === 'menuItem' ? (
        <MuiMenuItem
          key={innerKey}
          className={className}
          onClick={(e: any) => {
            e.preventDefault();
            onClick(e);
            handleClickOpen();
          }}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          {label}
        </MuiMenuItem>
      ) : (
        <Button
          variant={variant}
          startIcon={startIcon}
          color={color}
          onClick={(e: any) => {
            onClick(e);
            handleClickOpen();
          }}
          size="small"
          className={className}
        >
          {label}
          {!startIcon && icon}
        </Button>
      )}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Button
              autoFocus
              color="primary"
              variant="contained"
              startIcon={<NavigateBeforeIcon />}
              onClick={handleClose}
              style={{ marginRight: '1rem' }}
            >
              back
            </Button>
            <Typography variant="h6" className={classes.title}>
              Documentation
            </Typography>
          </Toolbar>
        </AppBar>
        {FrameWrapper()}
        {/* <API apiDescriptionUrl={"https://raw.githubusercontent.com/LedFx/ledfx_rewrite/main/api/openapi.yml"} /> */}
        {/* <API
          apiDescriptionDocument={configApiYaml}
          basePath="LedFx-Frontend-v2/docs"
          logo="https://github.com/LedFx/LedFx/raw/main/icons/discord.png"
          router='memory'
        /> */}
      </Dialog>
    </>
  );
}
