import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { getOverlapping } from "../../../utils/helpers";
import useStore from '../../../utils/apiStore';

import AddSegmentDialog from '../../../components/Dialogs/_AddSegmentDialog';
import Segment from './Segment';
import { useEditVirtualsStyles } from './EditVirtuals.styles'
import { ListItemIcon, MenuItem } from '@material-ui/core';
import { Settings } from '@material-ui/icons';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MuiMenuItem = React.forwardRef((props, ref) => {
  return <MenuItem  ref={ref} {...props} />;
});

export default function FullScreenDialog({
  virtual,
  icon = <Settings />,
  startIcon,
  label = '',
  type,
  className,
  color = 'default',
  variant = 'contained',
  onClick = () => {},
  innerKey,
}) {
  const classes = useEditVirtualsStyles();
  const showSnackbar = useStore((state) => state.showSnackbar);
  const getDevices = useStore((state) => state.getDevices);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    const output = getOverlapping(virtual.segments);
    const overlap = Object.keys(output).find(k => output[k].overlap);
    if (overlap) {
      showSnackbar({
        message: `Overlapping in ${overlap} detected! Please Check your config`,
        messageType: 'warning'
      })
    } else {
      setOpen(false);
    }
  };


  useEffect(() => {
    getDevices()
  }, [getDevices])

  return virtual && virtual.config ? (
    <>
      {type === 'menuItem'
        ? <MuiMenuItem key={innerKey} className={className} onClick={(e) => { e.preventDefault(); onClick(e); handleClickOpen(e)}}>
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          {label}
        </MuiMenuItem>
        : <Button
          variant={variant}
          startIcon={startIcon}
          color={color}
          onClick={(e)=>{onClick(e); handleClickOpen(e);}}
          size="small"
          className={className}
        >
          {label}
          {!startIcon && icon}
        </Button>
      }
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
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
              {virtual.config.name}{' '}
            </Typography>
          </Toolbar>
        </AppBar>

        <div className={classes.segmentTitle}>
          <Typography variant="caption">Segments-Settings</Typography>
        </div>
        {virtual.segments.length > 0 &&
          virtual.segments.map((s, i) => (
            <Segment s={s} i={i} key={i} virtual={virtual} segments={virtual.segments} />
          ))}
        <div className={classes.segmentButtonWrapper}>
          <AddSegmentDialog virtual={virtual} />
        </div>
      </Dialog>
    </>
  ) : (<></>);
}
