/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  MenuItem,
  Select,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import useStore from '../../store/useStore';
import BladeFrame from '../SchemaForm/components/BladeFrame';

function ConfirmationDialogRaw(props: any) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  delete other.deviceList;
  return (
    <Dialog
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Select a device</DialogTitle>
      <DialogContent dividers>
        <BladeFrame full>
          <Select
            disableUnderline
            value={value}
            style={{ width: '100%' }}
            onChange={handleChange}
          >
            {Object.keys(props.deviceList).map((device) => (
              <MenuItem
                value={props.deviceList[device].id}
                key={props.deviceList[device].id}
              >
                {props.deviceList[device].config.name}
              </MenuItem>
            ))}
          </Select>
        </BladeFrame>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  config: PropTypes.any,
  classes: PropTypes.any,
  id: PropTypes.string,
  keepMounted: PropTypes.bool,
  deviceList: PropTypes.any,
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '1rem auto',
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: '80%',
    maxHeight: 435,
  },
}));

export default function ConfirmationDialog({
  virtual,
  config = {},
}: {
  virtual: any;
  config?: any;
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const deviceList = useStore((state) => state.devices) || {};
  const updateVirtualSegments = useStore(
    (state) => state.updateVirtualSegments
  );
  const getVirtuals = useStore((state) => state.getVirtuals);

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue: string) => {
    setOpen(false);
    if (newValue) {
      const device = {
        ...deviceList[
          Object.keys(deviceList).find((d) => deviceList[d].id === newValue) ||
            0
        ],
      };
      if (device && device.config) {
        const temp = [
          ...virtual.segments,
          [device.id, 0, device.config.pixel_count - 1, false],
        ];
        const test = temp.filter((t) => t.length === 4);
        updateVirtualSegments(virtual.id, test).then(() => getVirtuals());
      }
    }
  };

  return (
    <div className={classes.root}>
      {deviceList && Object.keys(deviceList).length > 0 ? (
        <>
          <Button
            variant="contained"
            color="primary"
            aria-label="Add"
            endIcon={<AddCircleIcon />}
            onClick={handleClickListItem}
            role="listitem"
          >
            ADD SEGMENT
          </Button>

          <ConfirmationDialogRaw
            classes={{
              paper: classes.paper,
            }}
            config={config}
            id="ringtone-menu"
            keepMounted
            open={open}
            onClose={handleClose}
            value=""
            // value={deviceList[0].id}
            deviceList={deviceList}
          />
        </>
      ) : null}
    </div>
  );
}
