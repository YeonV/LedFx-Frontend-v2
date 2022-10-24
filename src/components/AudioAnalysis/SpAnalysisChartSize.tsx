import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@mui/material/Slider';

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
  },
  input: {
    width: 120,
  },
});

export default function ChartSize({ value, handleSizeSliderChange }: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography id="input-slider" gutterBottom>
        Zoom
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            defaultValue={value}
            step={100}
            max={20000}
            min={300}
            sx={{ color: '#fff' }}
            valueLabelDisplay="auto"
            // onChange={handleSizeSliderChange}
            onChangeCommitted={handleSizeSliderChange}
            aria-labelledby="chart-size-slider"
          />
        </Grid>
      </Grid>
    </div>
  );
}
