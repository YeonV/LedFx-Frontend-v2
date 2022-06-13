import { MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BladeFrame from '../../components/SchemaForm/components/BladeFrame';
import useStore from '../../store/useStore';

const useStyles = makeStyles(() => ({
  select: {
    '& div.MuiSelect-select': {
      padding: '6px 0',
    },
  },
}));

const ClientAudioCard = ({ style }: any) => {
  const classes = useStyles();
  const clientDevice = useStore((state) => state.clientDevice);
  const clientDevices = useStore((state) => state.clientDevices);
  const setClientDevice = useStore((state) => state.setClientDevice);
  const webAudName = useStore((state) => state.webAudName);

  return (
    clientDevices && (
      <BladeFrame
        style={{ order: 0, ...style }}
        full
        title={`${webAudName}: Audio Device`}
        className={classes.select}
      >
        <Select
          variant="standard"
          disableUnderline
          value={clientDevice || clientDevices[0].deviceId}
          style={{ width: '100%' }}
          onChange={(e) => {
            setClientDevice(e.target.value);
          }}
        >
          {clientDevices
            .filter((cd: any) => cd.kind === 'audioinput')
            .map((d: any, i: number) => (
              <MenuItem key={i} value={d.deviceId}>
                {d.label}
              </MenuItem>
            ))}
        </Select>
      </BladeFrame>
    )
  );
};

export default ClientAudioCard;
