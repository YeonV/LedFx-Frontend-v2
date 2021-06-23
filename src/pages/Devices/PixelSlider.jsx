import { useEffect, useState } from "react";
import Slider from "@material-ui/core/Slider";
import useStore from "../../utils/apiStore";

const PixelSlider = ({ s, i, virtual, handleRangeSegment }) => {
  const getDevices = useStore((state) => state.getDevices);
  const devices = useStore((state) => state.devices);

  const [range, setRange] = useState([s[1], s[2]]);

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  if (!devices[s[0]]) {
    return <></>;
  }

  const pixelRange = [s[1], s[2]];

  const handleChange = (event, newValue) => {
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
      // defaultValue={pixelRange}
      value={range}
      marks={marks}
      min={0}
      max={devices[s[0]].config.pixel_count - 1}
      onChange={(e, n) => setRange(n)}
      onChangeCommitted={handleChange}
      aria-labelledby="range-slider"
      valueLabelDisplay="auto"
    />
  );
};

export default PixelSlider;
