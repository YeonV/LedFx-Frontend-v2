import { MenuItem, Select } from '@material-ui/core';
import BladeFrame from '../../components/SchemaForm/BladeFrame';
import useStore from '../../utils/apiStore';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    select: {
        '& div.MuiSelect-select': {
            padding: '6px 0',
        }
    },
}));

const ClientAudioCard = ({ style }) => {
    const classes = useStyles()
    const clientDevice = useStore((state) => state.clientDevice)
    const clientDevices = useStore((state) => state.clientDevices)
    const setClientDevice = useStore((state) => state.setClientDevice)
    const webAudName = useStore((state) => state.webAudName)

    return clientDevices && <BladeFrame style={{ order: 0, ...style }} full={true} title={`${webAudName}: Audio Device`} className={classes.select}>
        <Select
            variant="standard"
            disableUnderline
            value={clientDevice || clientDevices[0].deviceId}
            style={{ width: '100%' }}
            onChange={(e) => { setClientDevice(e.target.value) }}
        >
            {clientDevices.filter(cd => cd.kind === 'audioinput').map((d, i) =>
                <MenuItem key={i} value={d.deviceId}>
                    {d.label}
                </MenuItem>
            )}

        </Select>
    </BladeFrame>
};

export default ClientAudioCard;
