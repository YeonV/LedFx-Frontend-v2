import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import useStore from '../../utils/apiStore';
import BladeSchemaFormNew from "../../components/SchemaForm/BladeSchemaFormNew";

const useStyles = makeStyles({
    form: {
        display: 'flex',
    },
});

const AudioCard = ({ }) => {
    const classes = useStyles();
    // const getAudioInputs = useStore((state) => state.getAudioInputs)
    // const setAudioInput = useStore((state) => state.setAudioInput)
    const setSystemConfig = useStore((state) => state.setSystemConfig)
    const getSystemConfig = useStore((state) => state.getSystemConfig)
    const devices = useStore((state) => state?.settings?.audio_inputs?.devices)
    const schema = useStore((state) => state?.schemas?.audio?.schema)
    const active_device_index = useStore((state) => state?.settings?.audio_inputs?.active_device_index)
    const model = useStore((state) => state?.config?.audio)


    useEffect(() => {
        getSystemConfig();
    }, []);

    return (devices && Object.entries(devices).length > 0) ? (
        <>
            {/* <FormControl className={`${classes.form} step-settings-one`}>
                <InputLabel id="audio-input-select-label">Audio Input Device</InputLabel>
                <Select
                    labelId="audio-input-select-label"
                    id="audio-input-select"
                    value={active_device_index}
                    onChange={(e) => setAudioInput(e.target.value).then(() => getAudioInputs())}
                >
                    {Object.entries(devices).map((e, i) =>
                        <MenuItem key={i} value={e[0]}>
                            {e[1]}{e[1].length > 30 && '...'}
                        </MenuItem>
                    )}
                </Select>
            </FormControl> */}

            <BladeSchemaFormNew
                schema={schema}
                model={model}
                onModelChange={(e) => {
                    setSystemConfig({
                        config: {
                            audio: e
                        }
                    }).then(() => getSystemConfig())
                    }}
            />

        </>
    ) : (<></>)
};

export default AudioCard;
