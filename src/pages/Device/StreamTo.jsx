import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import WifiIcon from '@mui/icons-material/Wifi';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import useStore from '../../utils/apiStore';
import BladeFrame from '../../components/SchemaForm/components/BladeFrame';
import BladeIcon from '../../components/Icons/BladeIcon';
import { Button, CardActions, Chip, OutlinedInput, Select } from '@material-ui/core';
import { Box } from '@mui/system';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
  card: { width: '100%', maxWidth: '540px', marginBottom: '1rem' },
}));

const StreamToCard = ({ virtual, virtuals, style }) => {
  const classes = useStyles();
  const streamingToDevices = useStore((state) => state.streamingToDevices);
  const setStreamingToDevices = useStore((state) => state.setStreamingToDevices);

  const [streamingTo, setStreamingTo] = React.useState(streamingToDevices.indexOf(virtual.id) === -1 ? [virtual.id] : streamingToDevices);
  const setVirtualEffect = useStore((state) => state.setVirtualEffect);
  const getVirtuals = useStore((state) => state.getVirtuals);

  const handleEffectConfig = (virtual_id, config, selectedType) =>   setVirtualEffect(
    virtual_id,
    {
      virtId: virtual_id,
      type: selectedType,
      config: config,
      active: true
    }
  ).then(() => getVirtuals());



  const handleToggle = (value) => {
    const currentIndex = streamingTo.indexOf(value);
    const newStreamingDevices = [...streamingTo];

    if (currentIndex === -1) {
      newStreamingDevices.push(value);
    } else {
      newStreamingDevices.splice(currentIndex, 1);
    }

    setStreamingTo(newStreamingDevices);
    setStreamingToDevices(newStreamingDevices)
  };

  const handleCopy = () => {
    streamingTo.map(e=>handleEffectConfig(e, virtuals[virtual.id]?.effect.config, virtuals[virtual.id]?.effect.type))
  }

  return (
    <Card variant="outlined" className={`${classes.card} step-device-two`} style={style}>
      <CardHeader title="Copy To" subheader="Copy current effect configurations other Devices" style={{ paddingBottom: 11 }} />
      <CardContent className={classes.content}>
        <FormControl style={{ margin: 10, width: "100%" }}>
          <InputLabel id="demo-multiple-chip-label" style={{ margin: '-7px 0 0 14px' }}>Select device(s) to copy to</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={streamingTo}
            onChange={(e, b) => console.log(e, b.props.value) || handleToggle(b.props.value)}
            input={<OutlinedInput id="select-multiple-chip" label="Select device(s) to copy to" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {Object.keys(virtuals).map((name) => (
              <MenuItem
                key={name}
                value={name}
              // style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* <List
          sx={{ width: '100%' }}
        >
          {Object.keys(virtuals).map(v =>
            <ListItem style={{ color: 'fff' }}>
              <ListItemIcon >
                <BladeIcon
                  style={{ position: 'relative' }}
                  colorIndicator={true}
                  name={virtuals && virtuals[v] && virtuals[v].config && virtuals[v].config.icon_name && virtuals[v].config.icon_name} 
                />
              </ListItemIcon>
              <ListItemText id="switch-list-label-wifi" primary={v} />
              <Switch
                color={"primary"}
                edge="end"
                onChange={handleToggle(v)}
                streamingTo={streamingTo.indexOf(v) !== -1}
                inputProps={{
                  'aria-labelledby': `switch-list-label-${v}`,
                }}
              />
            </ListItem>
          )}

        </List> */}
        <Button variant={"outlined"} onClick={()=>handleCopy()} style={{
          alignSelf: "flex-start",
          margin: "10px 0"
        }}>
          Copy
        </Button>
      </CardContent>


    </Card>
  );
};

export default StreamToCard;
