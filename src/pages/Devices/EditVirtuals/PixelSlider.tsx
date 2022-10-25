import { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';
import useStore from '../../../store/useStore';

const PixelSlider = ({ s, handleRangeSegment }: any) => {
  const getDevices = useStore((state) => state.getDevices);
  const devices = useStore((state) => state.devices);

  const [range, setRange] = useState([s[1], s[2]]);

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  useEffect(() => {
    setRange([s[1], s[2]]);
  }, [s]);

  if (!devices[s[0]]) {
    return null;
  }

  const pixelRange = [s[1], s[2]];

  const handleChange = (_event: any, newValue: any) => {
    if (newValue !== pixelRange) {
      handleRangeSegment(newValue[0], newValue[1]);
    }
  };

  const marks = [
    { value: 0, label: 0 },
    {
      value: devices[s[0]].config.pixel_count - 1,
      label: devices[s[0]].config.pixel_count - 1,
    },
  ];

  return (
    <Slider
      value={range}
      marks={marks}
      min={0}
      max={devices[s[0]].config.pixel_count - 1}
      onChange={(_event: any, n: any) => setRange(n)}
      onChangeCommitted={handleChange}
      aria-labelledby="range-slider"
      valueLabelDisplay="auto"
    />
  );
};

export default PixelSlider;
