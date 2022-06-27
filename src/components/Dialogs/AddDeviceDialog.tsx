/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-unused-expressions */
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  Button,
  Divider,
} from '@material-ui/core';
import useStore from '../../store/useStore';
import BladeSchemaForm from '../SchemaForm/SchemaForm/SchemaForm';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minWidth: '200px',
    padding: '16px 1.2rem 6px 1.2rem',
    border: '1px solid #999',
    borderRadius: '10px',
    position: 'relative',
    margin: '1rem 0',
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 580px)': {
      width: '100%',
      margin: '0.5rem 0',
    },
    '& > label': {
      top: '-0.7rem',
      display: 'flex',
      alignItems: 'center',
      left: '1rem',
      padding: '0 0.3rem',
      position: 'absolute',
      fontVariant: 'all-small-caps',
      fontSize: '0.9rem',
      letterSpacing: '0.1rem',
      backgroundColor: theme.palette.background.paper,
      boxSizing: 'border-box',
    },
  },
}));

const AddDeviceDialog = () => {
  const classes = useStyles();

  const getDevices = useStore((state) => state.getDevices);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const addDevice = useStore((state) => state.addDevice);
  const updateDevice = useStore((state) => state.updateDevice);
  const devices = useStore((state) => state.devices);
  const open = useStore((state) => state.dialogs.addDevice?.open || false);
  const deviceId = useStore((state) => state.dialogs.addDevice?.edit || false);
  const initial = devices[deviceId] || { type: '', config: {} };

  const setDialogOpenAddDevice = useStore(
    (state) => state.setDialogOpenAddDevice
  );

  const deviceTypes = useStore((state) => state.schemas?.devices);
  const showSnackbar = useStore((state) => state.ui.showSnackbar);
  const [deviceType, setDeviceType] = useState('');
  const [model, setModel] = useState({});

  const currentSchema = deviceType ? deviceTypes[deviceType].schema : {};

  const handleClose = () => {
    setDialogOpenAddDevice(false);
  };
  const handleAddDevice = () => {
    const cleanedModel = Object.fromEntries(
      Object.entries(model).filter(([_, v]) => v !== '')
    );
    const defaultModel = {} as any;

    for (const key in currentSchema.properties) {
      currentSchema.properties[key].default !== undefined
        ? (defaultModel[key] = currentSchema.properties[key].default)
        : undefined;
    }

    const valid = currentSchema.required.every((val: string) =>
      Object.keys({ ...defaultModel, ...cleanedModel }).includes(val)
    );

    if (!valid) {
      showSnackbar('warning', 'Please fill in all required fields.');
    } else if (
      initial.config &&
      Object.keys(initial.config).length === 0 &&
      initial.config.constructor === Object
    ) {
      // console.log("ADDING");
      addDevice({
        type: deviceType,
        config: { ...defaultModel, ...cleanedModel },
      }).then((res) => {
        if (res !== 'failed') {
          setDialogOpenAddDevice(false);
          getDevices();
          getVirtuals();
        }
      });
    } else {
      // console.log("EDITING");
      updateDevice(deviceId, { ...model }).then((res) => {
        if (res !== 'failed') {
          setDialogOpenAddDevice(false);
          getDevices();
          getVirtuals();
        }
      });
    }
  };
  const handleTypeChange = (value: string, init = {}) => {
    setDeviceType(value);
    setModel(init);
  };
  const handleModelChange = (config: any) => {
    setModel({ ...model, ...config });
  };

  useEffect(() => {
    handleTypeChange(initial.type, initial.config);
  }, [initial.type]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {initial.config &&
        Object.keys(initial.config).length === 0 &&
        initial.config.constructor === Object
          ? `Add ${deviceType.toUpperCase()} Device`
          : `${deviceType.toUpperCase()} Config`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a device to LedFx, please first select the type of device you
          wish to add then provide the necessary configuration.
        </DialogContentText>
        <div className={classes.wrapper}>
          <label>Device Type</label>
          <Select
            label="Type"
            disabled={
              !(
                initial.config &&
                Object.keys(initial.config).length === 0 &&
                initial.config.constructor === Object
              )
            }
            style={{ flexGrow: 1 }}
            disableUnderline
            value={deviceType}
            onChange={(e: any) => handleTypeChange(e.target.value)}
          >
            {deviceTypes &&
              Object.keys(deviceTypes).map((item, i) => (
                <MenuItem key={i} value={item}>
                  {item}
                </MenuItem>
              ))}
          </Select>
        </div>
        <Divider style={{ marginBottom: '1rem' }} />
        {model && (
          <BladeSchemaForm
            schema={currentSchema}
            model={model}
            onModelChange={handleModelChange}
            hideToggle={!deviceType}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddDevice} color="primary">
          {initial.config &&
          Object.keys(initial.config).length === 0 &&
          initial.config.constructor === Object
            ? 'Add'
            : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDeviceDialog;
