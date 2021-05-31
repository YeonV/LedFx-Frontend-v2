import {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import useStore from '../../utils/apiStore';


const useStyles = makeStyles({
    form: {
        display: 'flex',
    },
});

const AudioCard = ({  }) => {
    const classes = useStyles();
    
    const getAudioInputs = useStore((state) => state.getAudioInputs)
    const setAudioInput = useStore((state) => state.setAudioInput)
    const devices = useStore((state) => state.settings && state.settings.audio_inputs && state.settings.audio_inputs.devices)
    const active_device_index = useStore((state)=>state.settings && state.settings.audio_inputs && state.settings.audio_inputs.active_device_index)
    const handleAudioSelected = e => setAudioInput(e.target.value).then(()=>getAudioInputs());
    
    useEffect(() => {
      getAudioInputs();      
    }, [getAudioInputs]);


    return devices ?
      (Object.entries(devices).length > 0 ? (
        <FormControl className={classes.form} >
            <InputLabel id="audio-input-select-label">Audio Input Device</InputLabel>
            <Select
                labelId="audio-input-select-label"
                id="audio-input-select"
                value={active_device_index}
                onChange={(e) => handleAudioSelected(e)}
            >
                {Object.entries(devices).map((e,i)=>
                    <MenuItem key={i} value={e[0]}>
                        {e[1]}{e[1].length > 30 && '...' }
                    </MenuItem>
                )}
            </Select>
        </FormControl>
    ) : (
            <Card>
                <CardHeader title="Audio Input" subheader="Select an audio source for LedFx" />
                <CardContent>
                    <FormControl  className={classes.form}>
                        <InputLabel id="audio-input-select-label">Current Device</InputLabel>
                        <Select
                            labelId="audio-input-select-label"
                            id="audio-input-select"
                            value={active_device_index}
                            onChange={(e)=>handleAudioSelected(e)}
                        >
                          {Object.entries(devices).map((e,i)=>
                              <MenuItem key={i} value={e[0]}>
                                  {e[1]}{e[1].length > 30 && '...' }
                              </MenuItem>
                          )}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>
        )) : (<></>);
};

export default AudioCard;
