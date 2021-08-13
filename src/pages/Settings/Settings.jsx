import { useEffect, useState } from 'react';
import useStore from '../../utils/apiStore';
import { deleteFrontendConfig, download } from '../../utils/helpers';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider, Input, Card, CardHeader, CardContent, Slider } from '@material-ui/core';
import { CloudUpload, CloudDownload,PowerSettingsNew, Delete, Refresh } from '@material-ui/icons';
import useSliderStyles from '../../components/SchemaForm/BladeSlider.styles';
import PopoverSure from '../../components/Popover';
import AudioCard from './AudioCard';
import WledCard from './WledCard';
import Webaudio from './Webaudio';

const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionButton: {
    marginTop: '0.5rem',
    width: '100%',
    borderColor: theme.palette.grey[400]
  },
  card: {
    maxWidth: '540px',
    margin: '0 auto', // mobile
  },
  '@media (max-width: 580px)': {
    card: {
      maxWidth: '97vw',
      margin: '0 auto',
    },
  },
}));

const Settings = () => {
  const classes = useStyles();
  const sliderClasses = useSliderStyles();
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const setSystemConfig = useStore((state) => state.setSystemConfig);
  const deleteSystemConfig = useStore((state) => state.deleteSystemConfig);
  const importSystemConfig = useStore((state) => state.importSystemConfig);
  const shutdown = useStore((state) => state.shutdown);
  const restart = useStore((state) => state.restart);
  const config = useStore((state) => state.config);
  const [fps, setFps] = useState(30)
  const [pixelLength, setPixelLength] = useState(50)
  const configDownload = async () => {
    const newConfig = { ...config, ...{ ledfx_presets: undefined } }
    download(
      newConfig,
      'config.json',
      'application/json',
    );
  };

  const configDelete = async () => {
    deleteFrontendConfig();
    deleteSystemConfig().then(() => window.location = window.location.href)
  }

  const fileChanged = async (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      importSystemConfig(e.target.result).then(() => (window.location = window.location.href));
    };
  }

  const setSystemSetting = (setting, value) => {
    setSystemConfig({ config: { [setting]: value } }).then(() => getSystemConfig());
  }

  const marks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 15,
      label: '15',
    },
    {
      value: 30,
      label: '30',
    },
    {
      value: 45,
      label: '45',
    },
    {
      value: 60,
      label: '60',
    },
  ];

  const marksPixelLength = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 100,
      label: '100',
    },
    {
      value: 150,
      label: '150',
    },
    {
      value: 200,
      label: '200',
    },
    {
      value: 250,
      label: '250',
    },
    {
      value: 300,
      label: '300',
    },
  ];

  useEffect(() => {    
      if (typeof config.visualisation_fps === 'number') {
        setFps(config.visualisation_fps)
      }
      if (typeof config.visualisation_maxlen === 'number') {
        setPixelLength(config.visualisation_maxlen)
      }    
  }, [config]);

  useEffect(() => {
    getSystemConfig()
  }, []);

  return (
    <>
      <Card className={classes.card} style={{ marginBottom: '2rem' }}>
        <CardHeader title="General" subheader="Configure LedFx-Settings" />
        <CardContent className={classes.content}>
          <AudioCard className={'step-settings-one'} />

          <Divider style={{ margin: '1rem 0' }} />
          {config.visualisation_fps && (<>
            <div className={`${sliderClasses.wrapper} step-settings-two`} style={{ order: 'unset', width: "100%" }}>
              <label>Frontend FPS</label>
              <Slider
                value={fps}
                marks={marks}
                step={1}
                valueLabelDisplay="auto"
                min={1}
                max={60}
                onChangeCommitted={(e, val) => setSystemSetting("visualisation_fps", val)}
                onChange={(e, val) => {
                  setFps(val);
                }}
              />
              <Input
                disableUnderline
                className={sliderClasses.input}
                value={fps}
                margin="dense"
                onChange={(e, val) => {
                  setFps(val);
                }}
                onBlur={(e, val) => setSystemSetting("visualisation_fps", val)}
                inputProps={{
                  min: 1,
                  max: 60,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </div>

            <div className={`${sliderClasses.wrapper} step-settings-three`} style={{ order: 'unset', width: "100%" }}>
              <label>Frontend max Pixel Length</label>
              <Slider
                value={pixelLength}
                marks={marksPixelLength}
                step={1}
                valueLabelDisplay="auto"
                min={1}
                max={300}
                onChangeCommitted={(e, val) => setSystemSetting("visualisation_maxlen", val)}
                onChange={(e, val) => {
                  setPixelLength(val);
                }}
              />
              <Input
                disableUnderline
                className={sliderClasses.input}
                value={pixelLength}
                margin="dense"
                onChange={(e, val) => {
                  setPixelLength(val);
                }}
                onBlur={(e, val) => setSystemSetting("visualisation_maxlen", val)}
                inputProps={{
                  min: 1,
                  max: 300,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </div>

          </>)}
          <Divider style={{ margin: '1rem 0' }} />
          <div className={'step-settings-four'}>
            <Button
              size="small"
              startIcon={<CloudUpload />}
              variant="outlined"
              className={classes.actionButton}
              style={{ marginTop: '1.5rem' }}
              onClick={configDownload}
            >
              Export Config
            </Button>
            <PopoverSure
              startIcon={<Delete />}
              label="Reset Config"
              size="small"
              variant="outlined"
              color="inherit"
              className={classes.actionButton}
              onConfirm={configDelete}
              direction="center"
              vertical="top"
            />
            <input
              hidden
              accept="application/json"
              id="contained-button-file"
              type="file"
              onChange={(e) => fileChanged(e)}
            />
            <label htmlFor="contained-button-file">
              <Button
                component="span"
                size="small"
                startIcon={<CloudDownload />}
                variant="outlined"
                className={classes.actionButton}
              >
                Import Config
              </Button>
            </label>
            <Button
              size="small"
              startIcon={<Refresh />}
              variant="outlined"
              className={classes.actionButton}
              onClick={restart}

            >
              Restart LedFx
            </Button>

            <Button
              size="small"
              startIcon={<PowerSettingsNew />}
              variant="outlined"
              className={classes.actionButton}
              onClick={shutdown}
            >
              Shutdown
            </Button>
          </div>
        </CardContent>
      </Card>
      {(parseInt(window.localStorage.getItem('BladeMod')) > 10) &&
        <WledCard className={`${classes.card} step-settings-five`} />
      }
      {(parseInt(window.localStorage.getItem('BladeMod')) > 10) &&
        <Webaudio className={classes.card} />
      }
    </>
  );
};

export default Settings;
