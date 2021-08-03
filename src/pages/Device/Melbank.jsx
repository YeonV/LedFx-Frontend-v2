import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import useStore from "../../utils/apiStore";
import Slider from '@material-ui/core/Slider';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import { InputAdornment, TextField } from '@material-ui/core';

const log13 = (x) => Math.log(x) / Math.log(13);
const logIt = (x) => 3700.0 * log13(1 + x / 200.0);
const hzIt = (x) => 200.0 * 13 ** (x / 3700.0) - 200.0;

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
  formControl: {
    marginRight: theme.spacing(3),
  },
  card: {
    width: '100%',
    maxWidth: '540px',
    '@media (max-width: 580px)': {
      maxWidth: '97vw',
      margin: '0 auto',
    },
  },
}));


const MelbankCard = ({ virtual }) => {
  const classes = useStyles();
  const addVirtual = useStore((state) => state.addVirtual);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const config = useStore((state) => state.config);

  const [value, setValue] = useState([logIt(virtual.config.frequency_min),logIt(virtual.config.frequency_max)]);

  const freq_max = config.melbanks.max_frequencies.map(f => ({
    value: f,
    label: `${f > 1000 ? f / 1000 : f}kHz`,
  }));

  const freq_min = {
    value: config.melbanks.min_frequency,
    label: `${config.melbanks.min_frequency}kHz`,
  }
  const marks = [freq_min, ...freq_max]
 
  const convertedMarks = marks.map((m) => ({
    value: logIt(m.value),
    label: m.label,
  }));

  const handleChange = (event, newValue) => {
    const copy = [...newValue];
    convertedMarks.forEach((m, i) => {
      if (Math.abs(newValue[0] - m.value) < 100) {
        copy[0] = m.value;
      }
      if (Math.abs(newValue[1] - m.value) < 100) {
        copy[1] = m.value;
      }
    });
    setValue(copy);
  };

  return (
    <Card variant="outlined" className={classes.card}>
      <CardHeader
        title="Frequency Range"
        subheader="Adjust the audio range used for this strip"
      />
      <CardContent className={classes.content}>
        <div style={{ padding: '0 25px', width: '100%' }}>
          <Slider
            value={[value[0], value[1]]}
            aria-labelledby="discrete-slider-custom"
            step={0.001}
            valueLabelDisplay="auto"
            marks={convertedMarks}
            min={logIt(config.melbanks.min_frequency)}
            max={logIt(config.melbanks.max_frequencies[config.melbanks.max_frequencies.length -1])}
            onChange={handleChange}
            ValueLabelComponent={ValueLabelComponent}
            onChangeCommitted={(e, val) => {
              // Backend cannot do partial updates yet, sending whole config
              addVirtual({
                id: virtual.id,
                config: {
                  ...virtual.config,
                  frequency_min: Math.round(hzIt(value[0])),
                  frequency_max: Math.round(hzIt(value[1]))
                }
              }).then(()=>getVirtuals())
            }}
          />
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ maxWidth: '120px' }}>
              <TextField
                id="min"
                label="Min"
                type="number"
                InputLabelProps={{
                  shrink: true,                  
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Hz</InputAdornment>
                }}
                inputProps={{
                  style: { textAlign: 'right',  }
                }}
                value={Math.round(hzIt(value[0])) < 5 ? value[0] : Math.round(hzIt(value[0]))}
                variant="outlined"
                onChange={(e, n) => {
                  setValue([logIt(e.target.value), value[1]]);
                }}
              />
            </div>
            <div style={{ maxWidth: '120px' }}>
              <TextField
                id="max"
                label="Max"
                type="number"
                
                value={Math.round(hzIt(value[1])) > 20001 ? value[1] : Math.round(hzIt(value[1]))}
                onChange={(e, n) => {
                  setValue([value[0], logIt(e.target.value)]);
                }}
                InputLabelProps={{
                  shrink: true,                  
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Hz</InputAdornment>
                }}
                variant="outlined"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={`${Math.round(hzIt(value))} Hz`}
    >
      {children}
    </Tooltip>
  );
}

export default MelbankCard;
