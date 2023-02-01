import { useState } from 'react';
import { Button, IconButton, Slider, Stack, useTheme } from '@mui/material';
import { Brightness7, PauseOutlined, PlayArrow } from '@mui/icons-material';
// import { SettingsSlider } from '../pages/Settings/SettingsComponents';
import useStore from '../store/useStore';

const GlobalActionBar = ({
  className,
  sx,
  height,
  type,
}: {
  className?: any;
  sx?: any;
  height?: number;
  type?: 'button' | 'icon' | 'indicator';
}) => {
  const theme = useTheme();
  const [globalBrightness, setGlobalBrightness] = useState(100);

  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const setSystemConfig = useStore((state) => state.setSystemConfig);

  const setSystemSetting = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig());
  };

  const paused = useStore((state) => state.paused);
  const togglePause = useStore((state) => state.togglePause);

  return (
    <Stack
      className={className}
      direction="row"
      sx={{ minWidth: 250, alignItems: 'center', ...sx }}
    >
      {type === 'icon' ? (
        <IconButton
          color="inherit"
          aria-label="play-pause"
          onClick={() => {
            togglePause();
          }}
          style={{
            margin: '0 8px 0 0',
          }}
        >
          {paused ? <PlayArrow /> : <PauseOutlined />}
        </IconButton>
      ) : type === 'button' ? (
        <Button
          variant="contained"
          color="primary"
          aria-label="play-pause"
          sx={{ borderRadius: 3 }}
          onClick={() => {
            togglePause();
          }}
          style={{
            margin: '0 16px 0 0',
          }}
        >
          {paused ? <PlayArrow /> : <PauseOutlined />}
        </Button>
      ) : (
        // <BladeIcon name="Brightness7" />
        <Brightness7 sx={{ ml: 2, mr: 2 }} />
      )}

      <Slider
        sx={{
          height,
          display: 'flex',
          color: 'inherit',
          p: 0,
          '& .MuiSlider-thumb': {
            height: 20,
            width: 20,
            opacity: 0,
          },
          '& .MuiSliderValueLabel ': {
            fontSize: 12,
            fontWeight: 'normal',
            top: -6,
            backgroundColor: 'unset',
            color: theme.palette.text.primary,
            '&:before': {
              display: 'none',
            },
            '& *': {
              background: 'transparent',
              color: theme.palette.mode === 'dark' ? '#fff' : '#000',
            },
          },
        }}
        valueLabelDisplay="on"
        value={globalBrightness}
        step={1}
        min={0}
        max={100}
        onChangeCommitted={(_e: any, val: any) =>
          setSystemSetting('global_brightness', val / 100)
        }
        onChange={(_e: any, val: any) => {
          setGlobalBrightness(val);
        }}
      />
    </Stack>
  );
};

GlobalActionBar.defaultProps = {
  className: undefined,
  sx: undefined,
  height: 15,
  type: 'icon',
};

export default GlobalActionBar;
