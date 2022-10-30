/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Input } from '@material-ui/core';
import { useLongPress } from 'use-long-press';
import { Divider } from '@mui/material';
import useStore from '../../store/useStore';
import useSliderStyles from '../../components/SchemaForm/components/Number/BladeSlider.styles';
import {
  useStyles,
  SettingsSlider,
  SettingsSwitch,
} from './SettingsComponents';

const UICard = () => {
  const classes = useStyles();
  const sliderClasses = useSliderStyles();

  const config = useStore((state) => state.config);
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const setSystemConfig = useStore((state) => state.setSystemConfig);
  const viewMode = useStore((state) => state.viewMode);
  const setViewMode = useStore((state) => state.setViewMode);
  const graphs = useStore((state) => state.graphs);
  const toggleGraphs = useStore((state) => state.toggleGraphs);
  const graphsMulti = useStore((state) => state.graphsMulti);
  const toggleGraphsMulti = useStore((state) => state.toggleGraphsMulti);
  const setFeatures = useStore((state) => state.setFeatures);
  const showFeatures = useStore((state) => state.showFeatures);
  const setShowFeatures = useStore((state) => state.setShowFeatures);
  const features = useStore((state) => state.features);

  const [fps, setFps] = useState(30);
  const [pixelLength, setPixelLength] = useState(50);
  const [_active, setActive] = useState(false);

  const longPress = useLongPress(
    () => viewMode === 'expert' && setFeatures('dev', true),
    {
      threshold: 1000,
      captureEvent: true,
    }
  );

  const setSystemSetting = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig());
  };

  useEffect(() => {
    if (typeof config.visualisation_fps === 'number') {
      setFps(config.visualisation_fps);
    }
    if (typeof config.visualisation_maxlen === 'number') {
      setPixelLength(config.visualisation_maxlen);
    }
  }, [config]);

  useEffect(() => {
    getSystemConfig();
  }, []);

  return (
    <div style={{ width: '100%' }}>

      <div className={`${classes.settingsRow} step-settings-x `}>
        <label>Show Graphs (eats performance)</label>
        <SettingsSwitch checked={graphs} onChange={() => toggleGraphs()} />
      </div>
      {config.visualisation_fps && graphs && (
        <>
          <Divider sx={{ m: '0.25rem 0 0.5rem 0'}} />
          <div className={`${classes.settingsRow} step-settings-x `}>
            <label>Also on Devices page</label>
            <SettingsSwitch checked={graphsMulti} onChange={() => toggleGraphsMulti()} />
          </div>
          <div className={`${classes.settingsRow} slider step-settings-two`}>
            <label>Frontend FPS</label>
            <div style={{ flexGrow: 1 }}>
              <SettingsSlider
                value={fps}
                // marks={marks}
                // marks
                // color=""
                step={1}
                // valueLabelDisplay="auto"
                min={1}
                max={60}
                onChangeCommitted={(_e: any, val: any) =>
                  setSystemSetting('visualisation_fps', val)
                }
                onChange={(_e: any, val: any) => {
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
              onChange={(e) => {
                setFps(parseInt(e.target.value, 10));
              }}
              onBlur={(e) => {
                setSystemSetting('visualisation_fps', parseInt(e.target.value, 10));
              }}
              inputProps={{
                min: 1,
                max: 60,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </div>

          <div className={`${classes.settingsRow} slider step-settings-three `}>
            <label>Frontend Pixels</label>
            <div style={{ flexGrow: 1 }}>
              <SettingsSlider
                value={pixelLength}
                // marks={marksPixelLength}
                step={1}
                valueLabelDisplay="auto"
                min={1}
                max={300}
                onChangeCommitted={(_e: any, val: any) =>
                  setSystemSetting('visualisation_maxlen', val)
                }
                onChange={(_e: any, val: any) => {
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
              onChange={(e) => {
                setPixelLength(parseInt(e.target.value, 10));
              }}
              onBlur={(e) =>
                setSystemSetting('visualisation_maxlen', parseInt(e.target.value, 10))
              }
              inputProps={{
                min: 1,
                max: 300,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </div>
          <Divider sx={{ m: '0.5rem 0 0.25rem 0'}} />
        </>
      )}
      <div className={`${classes.settingsRow} step-settings-x `}>
        <label {...longPress}>Expert Mode</label>
        <SettingsSwitch
          checked={viewMode !== 'user'}
          onChange={() =>
            viewMode === 'user' ? setViewMode('expert') : setViewMode('user')
          }
        />
      </div>
      {showFeatures.cloud && (
        <div className={`${classes.settingsRow} step-settings-x `}>
          <label>LedFx Cloud</label>
          <SettingsSwitch
            checked={features.cloud}
            onChange={() => setFeatures('cloud', !features.cloud)}
          />
        </div>
      )}
      {showFeatures.wled && (
        <div className={`${classes.settingsRow} step-settings-x `}>
          <label>WLED Integration</label>
          <SettingsSwitch
            checked={features.wled}
            onChange={() => setFeatures('wled', !features.wled)}
          />
        </div>
      )}
      {showFeatures.integrations && (
        <div className={`${classes.settingsRow} step-settings-x `}>
          <label>Integrations</label>
          <SettingsSwitch
            checked={features.integrations}
            onChange={() => setFeatures('integrations', !features.integrations)}
          />
        </div>
      )}
      {showFeatures.webaudio && (
        <div className={`${classes.settingsRow} step-settings-x `}>
          <label>WebAudio</label>
          <SettingsSwitch
            checked={features.webaudio}
            onChange={() => setFeatures('webaudio', !features.webaudio)}
          />
        </div>
      )}
      {viewMode !== 'user' && (
        <div className={`${classes.settingsRow} step-settings-x `}>
          <label>Copy To</label>
          <SettingsSwitch
            checked={features.streamto}
            onChange={() => setFeatures('streamto', !features.streamto)}
          />
        </div>
      )}
      {showFeatures.effectfilter && (
        <div className={`${classes.settingsRow} step-settings-x `}>
          <label>Effect Filter</label>
          <SettingsSwitch
            checked={features.effectfilter}
            onChange={() => setFeatures('effectfilter', !features.effectfilter)}
          />
        </div>
      )}
      {viewMode !== 'user' && (
        <div className={`${classes.settingsRow} step-settings-eight `}>
          <label>Transitions</label>
          <SettingsSwitch
            checked={features.transitions}
            onChange={() => setFeatures('transitions', !features.transitions)}
          />
        </div>
      )}
      {viewMode !== 'user' && (
        <div className={`${classes.settingsRow} step-settings-x `}>
          <label>Frequencies</label>
          <SettingsSwitch
            checked={features.frequencies}
            onChange={() => setFeatures('frequencies', !features.frequencies)}
          />
        </div>
      )}
      {viewMode !== 'user' && (
        <div className={`${classes.settingsRow} step-settings-x `}>
          <label>Spotify Embedded Player</label>
          <SettingsSwitch
            checked={features.spotify}
            onChange={() => setFeatures('spotify', !features.spotify)}
          />
        </div>
      )}
      {viewMode !== 'user' && features.integrations && (
        <div className={`${classes.settingsRow} step-settings-x `}>
          <label>Spotify Pro</label>
          <SettingsSwitch
            checked={features.spotifypro}
            onChange={() => setFeatures('spotifypro', !features.spotifypro)}
          />
        </div>
      )}
      {viewMode !== 'user' && (
        <div className={`${classes.settingsRow} step-settings-x `}>
          <label>BG Waves (eats performance)</label>
          <SettingsSwitch
            checked={features.waves}
            onChange={() => setFeatures('waves', !features.waves)}
          />
        </div>
      )}
      {viewMode !== 'user' && (
        <div className={`${classes.settingsRow} step-settings-x `}>
          <label>Dashboard (wip)</label>
          <SettingsSwitch
            checked={showFeatures.dashboard}
            onChange={() => setShowFeatures('dashboard', !showFeatures.dashboard)}
          />
        </div>
      )}
      {showFeatures.dev && (
        <div className={`${classes.settingsRow} step-settings-x `}>
          <label>Dev Mode</label>
          <Input
            disableUnderline
            style={{
              marginLeft: '1rem',
              backgroundColor: 'rgb(57, 57, 61)',
              paddingLeft: '0.5rem',
              borderRadius: '5px',
              paddingTop: '3px',
              width: 50,
            }}
            margin="dense"
            onBlur={(e) => {
              if (e.target.value === 'clear') {
                setViewMode('user');
                setShowFeatures('streamto', false);
                setShowFeatures('dev', false);
                setShowFeatures('waves', false);
                setShowFeatures('effectfilter', false);
                setShowFeatures('cloud', false);
                setShowFeatures('wled', false);
                setShowFeatures('integrations', false);
                setShowFeatures('spotify', false);
                setShowFeatures('youtube', false);
                setShowFeatures('webaudio', false);
                setFeatures('streamto', false);
                setFeatures('waves', false);
                setFeatures('cloud', false);
                setFeatures('effectfilter', false);
                setFeatures('wled', false);
                setFeatures('dev', false);
                setFeatures('integrations', false);
                setFeatures('spotify', false);
                setFeatures('youtube', false);
                setFeatures('webaudio', false);
                window.localStorage.removeItem('ledfx-theme');
                window.localStorage.setItem('BladeMod', '0');
                window.location.reload();
              }
              if (e.target.value === 'BladeIsYeon') {
                setViewMode('expert');
                setShowFeatures('dev', true);
                setShowFeatures('streamto', true);
                setShowFeatures('cloud', true);
                setShowFeatures('effectfilter', true);
                setShowFeatures('waves', true);
                setShowFeatures('wled', true);
                setShowFeatures('integrations', true);
                setShowFeatures('spotify', true);
                setShowFeatures('youtube', true);
                setShowFeatures('webaudio', true);
                setFeatures('streamto', true);
                setFeatures('waves', true);
                setFeatures('cloud', true);
                setFeatures('wled', true);
                setFeatures('integrations', true);
                setFeatures('effectfilter', true);
                setFeatures('spotify', true);
                setFeatures('youtube', true);
                setFeatures('webaudio', true);
                window.localStorage.setItem('ledfx-theme', 'DarkRed');
                window.location.reload();
              }
              if (e.target.value === 'BladeCloud') {
                setShowFeatures('cloud', true);
              }
              if (e.target.value === 'BladeWled') {
                setShowFeatures('wled', true);
              }
              if (e.target.value === 'BladeIntegrations') {
                setShowFeatures('integrations', true);
              }
              if (e.target.value === 'BladeSpotify') {
                setShowFeatures('spotify', true);
              }
              if (e.target.value === 'BladeYoutube') {
                setShowFeatures('youtube', true);
              }
              if (e.target.value === 'BladeWebaudio') {
                setShowFeatures('webaudio', true);
              }
              if (e.target.value === 'BladeWaves') {
                setShowFeatures('waves', true);
              }
              if (e.target.value === 'BladeStreamTo') {
                setShowFeatures('streamto', true);
              }
              if (e.target.value === 'BladeEffectFilter') {
                setShowFeatures('effectfilter', true);
              }
              if (e.target.value.startsWith('theme:')) {
                window.localStorage.setItem(
                  'ledfx-theme',
                  e.target.value.replace('theme:', '')
                );
                window.location.reload();
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UICard;
