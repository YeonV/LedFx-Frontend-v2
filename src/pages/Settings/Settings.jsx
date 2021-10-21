import { useEffect, useState } from 'react';
import useStore from '../../utils/apiStore';
import { deleteFrontendConfig, download } from '../../utils/helpers';
import { makeStyles, styled } from '@material-ui/core/styles';
import { Button,  Input,  Slider, Accordion, AccordionSummary, Typography, AccordionDetails, Switch, TextField } from '@material-ui/core';
import { CloudUpload, CloudDownload, PowerSettingsNew, Delete, Refresh, ExpandMore, Info } from '@material-ui/icons';
import useSliderStyles from '../../components/SchemaForm/BladeSlider.styles';
import PopoverSure from '../../components/Popover';
import AudioCard from './AudioCard';
import WledCard from './WledCard';
import Webaudio from './Webaudio';
import ClientAudioCard from './ClientAudioCard';
import { useLongPress } from 'use-long-press';
import AboutDialog from '../../components/Dialogs/AboutDialog';

const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    '&>div': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }
  },
  settingsRow: {
    order: 'unset',
    width: "100%",
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    height: 40,
    '&>label': {
      marginRight: '1rem',
      width: 100
    }
  },
  actionButton: {
    marginTop: '0.5rem',
    flexBasis: '49%',
    width: '100%',
    borderColor: '#444'
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
  audioCard: {
    '& > div > div:not(:last-child)': {
      '@media (max-width: 580px)': {
        width: '48% !important',
        minWidth: 'unset'
      },
    },
  }
}));

const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#eeeeee' : '#eeeeee',
  height: 2,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    marginTop: '-10px',
    boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
      },
    },
  },
  '& .MuiSlider-valueLabel': {
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
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
}));

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 50,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary,
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));


const Settings = () => {
  const classes = useStyles();
  const sliderClasses = useSliderStyles();
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const getFullConfig = useStore((state) => state.getFullConfig);
  const setSystemConfig = useStore((state) => state.setSystemConfig);
  const deleteSystemConfig = useStore((state) => state.deleteSystemConfig);
  const importSystemConfig = useStore((state) => state.importSystemConfig);
  const viewMode = useStore((state) => state.viewMode);
  const setViewMode = useStore((state) => state.setViewMode);
  const shutdown = useStore((state) => state.shutdown);
  const restart = useStore((state) => state.restart);
  const config = useStore((state) => state.config);
  const graphs = useStore((state) => state.graphs);
  const toggleGraphs = useStore((state) => state.toggleGraphs);

  const [fps, setFps] = useState(30)
  const [pixelLength, setPixelLength] = useState(50)
  const configDownload = async () => {

    getFullConfig().then((newConfig) => download(
      newConfig,
      'config.json',
      'application/json',
    ))

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

  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(false);
  const [dev, setDev] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  const longPress = useLongPress((e) => viewMode === 'expert' && setDev(true), {
    treshhold: 1000,
    captureEvent: true,
  });

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
      <div className={classes.card}>
        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography>General</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={'step-settings-four'} style={{ display: 'flex', justifyContent: 'space-between'}}>
              <div style={{ flex: '0 0 49%'}}>
                <Button
                  size="small"
                  startIcon={<CloudUpload />}
                  variant="outlined"
                  className={classes.actionButton}
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
                  wrapperStyle={{
                    marginTop: '0.5rem',
                    flexBasis: '49%',
                  }}
                />
                <input
                  hidden
                  accept="application/json"
                  id="contained-button-file"
                  type="file"
                  onChange={(e) => fileChanged(e)}
                />
                <label htmlFor="contained-button-file" style={{ width: '100%', flexBasis: '49%' }}>
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
              </div>
              <div style={{ flex: '0 0 49%'}}>
                <AboutDialog startIcon={<Info />} className={classes.actionButton}>
                  About
                </AboutDialog>
                <Button
                  size="small"
                  startIcon={<Refresh />}
                  variant="outlined"
                  className={classes.actionButton}
                  onClick={restart}

                >
                  Restart
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
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Audio Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              {(parseInt(window.localStorage.getItem('BladeMod')) > 10) &&
                <Webaudio style={{ position: 'absolute', right: '3.5rem', top: '0.3rem' }} />
              }
              <ClientAudioCard />
              <AudioCard className={`${classes.audioCard} step-settings-one`} />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>UI Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ width: '100%' }}>

              <div className={`${classes.settingsRow} step-settings-three `}>
                <label>Show Graphs</label>
                <IOSSwitch checked={graphs} onChange={(e) => toggleGraphs()} />
              </div>

              <div className={`${classes.settingsRow} step-settings-x `}>
                <label {...longPress}>Expert Mode</label>
                <IOSSwitch checked={viewMode !== 'user'} onChange={(e) => viewMode === 'user' ? setViewMode("expert") : setViewMode("user")} />
              </div>

              {(dev || viewMode === 'dev') && <div className={`${classes.settingsRow} step-settings-x `}>
                <label>Dev Mode</label>
                <Input
                  disableUnderline
                  style={{
                    marginLeft: '1rem',
                    backgroundColor: 'rgb(57, 57, 61)',
                    paddingLeft: '0.5rem',
                    borderRadius: '5px',
                    paddingTop: '3px',
                    width: 50
                  }}
                  margin="dense"
                  onBlur={(e) => {
                    if (e.target.value === 'clear') { setViewMode('user'); window.localStorage.setItem('ledfx-theme', "Dark"); window.localStorage.setItem('BladeMod', 0); window.location.reload() }
                    if (e.target.value === 'dev') { setViewMode('dev'); window.localStorage.setItem('BladeMod', 11) }
                    if (e.target.value.startsWith('theme:')) { window.localStorage.setItem('ledfx-theme', e.target.value.replace('theme:', '')); window.location.reload() }
                  }}
                />
              </div>}

              {config.visualisation_fps && (<>
                {/* <div className={`${sliderClasses.wrapper} step-settings-two`} style={{ order: 'unset', width: "100%" }}> */}
                <div className={`${classes.settingsRow} step-settings-two`}>
                  <label>Frontend FPS</label>
                  <div style={{ flexGrow: 1 }}>
                    <IOSSlider
                      value={fps}
                      // marks={marks}
                      // marks
                      // color=""
                      step={1}
                      // valueLabelDisplay="auto"
                      min={1}
                      max={60}
                      size="medium"
                      onChangeCommitted={(e, val) => setSystemSetting("visualisation_fps", val)}
                      onChange={(e, val) => {
                        setFps(val);
                      }}
                    />
                  </div>
                  <Input
                    disableUnderline
                    className={sliderClasses.input}
                    style={{ width: 50 }}
                    value={fps}
                    margin="dense"
                    onFocus={() => setActive(true)}
                    onChange={(e, val) => {
                      setFps(val);
                    }}
                    onBlur={(e, val) => { setSystemSetting("visualisation_fps", val) }}
                    inputProps={{
                      min: 1,
                      max: 60,
                      type: 'number',
                      'aria-labelledby': 'input-slider',
                    }}
                  />
                </div>

                <div className={`${classes.settingsRow} step-settings-three `}>
                  <label>Frontend Pixels</label>
                  <div style={{ flexGrow: 1 }}>
                    <IOSSlider
                      value={pixelLength}
                      // marks={marksPixelLength}
                      step={1}
                      valueLabelDisplay="auto"
                      min={1}
                      max={300}
                      onChangeCommitted={(e, val) => setSystemSetting("visualisation_maxlen", val)}
                      onChange={(e, val) => {
                        setPixelLength(val);
                      }}
                    />
                  </div>
                  <Input
                    disableUnderline
                    className={sliderClasses.input}
                    value={pixelLength}
                    style={{ width: 50 }}
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
            </div>
          </AccordionDetails>
        </Accordion>

        {((parseInt(window.localStorage.getItem('BladeMod')) > 10) || viewMode === 'dev') &&
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel4a-content"
              id="panel4a-header"
            >
              <Typography>WLED Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <WledCard className={`${classes.card} step-settings-five`} />
              </div>
            </AccordionDetails>
          </Accordion>}
      </div>
    </>
  );
};

export default Settings;
