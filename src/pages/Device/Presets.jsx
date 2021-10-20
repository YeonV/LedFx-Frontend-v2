import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme, Card, CardContent, CardActions, CardHeader, Divider, Button, Grid, Typography, TextField, Switch } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import useStore from '../../utils/apiStore';
import Popover from '../../components/Popover';
import { Add, Cloud, Share } from '@material-ui/icons';
import axios from 'axios';
import CloudScreen from './Cloud';
import { useLongPress } from 'use-long-press';

const cloud = axios.create({
  baseURL: 'https://strapi.yeonv.com',
});

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(2),
  },
  presetButton: {
    margin: theme.spacing(0),
    textDecoration: 'none',
  },
  buttonGrid: {
    direction: 'row',
  },
  hint: {
    color: theme.palette.text.disabled,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing(1),
  },
  deviceCard: {
    width: '100%',
    maxWidth: '540px',
    '@media (max-width: 580px)': {
      maxWidth: '97vw',
      margin: '0 auto',
    },
  },
}));

const PresetsCard = ({ virtual, effectType, presets, style }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [valid, setValid] = useState(true);
  const [sharing, setSharing] = useState(false);

  const activatePreset = useStore((state) => state.activatePreset);
  const addPreset = useStore((state) => state.addPreset);
  const getPresets = useStore((state) => state.getPresets);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const deletePreset = useStore((state) => state.deletePreset);
  const isLogged = useStore((state) => state.isLogged);


  const sharePreset = async (list, preset) => {

    const existing = await cloud.get(`presets?user.username=${localStorage.getItem('username')}&Name=${list[preset].name}`, {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('jwt')}`,
      }
    })
    const exists = await existing.data
    const eff = await cloud.get(`effects?ledfx_id=${effectType}`, {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('jwt')}`,
      }
    })
    const effId = await eff.data[0].id
    // console.log(exists, existing)
    if (exists.length && exists.length > 0) {
      cloud.put(`presets/${exists[0].id}`, {
        Name: list[preset].name,
        config: virtual.effect.config,
        effect: effId,
        user: localStorage.getItem('ledfx-cloud-userid')
      }, {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('jwt')}`,
        }
      })
    } else {      
      cloud.post('presets', {
        Name: list[preset].name,
        config: virtual.effect.config,
        effect: effId,
        user: localStorage.getItem('ledfx-cloud-userid')
      }, {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('jwt')}`,
        }
      })
    }

  }


  const deleteCloudPreset = async (list, preset) => {
    const existing = await cloud.get(`presets?user.username=${localStorage.getItem('username')}&Name=${list[preset].name}`, {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('jwt')}`,
      }
    })
    const exists = await existing.data
    if (exists.length && exists.length > 0) {
      cloud.delete(`presets/${exists[0].id}`, {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('jwt')}`,
        }
      })
    }
  }




  const handleActivatePreset = (virtId, category, effectType, presetId) => () => {
    activatePreset(virtId, category, effectType, presetId).then(() => getVirtuals());
    setName('');
  };
  const renderPresetsButton = (list, CATEGORY) => {
    if (list && !Object.keys(list)?.length) {
      return (
        <Button style={{ margin: '0.5rem 0 0.5rem 0.5rem' }} variant="outlined" size="small" className={classes.presetButton} disabled>
          No {CATEGORY === 'default_presets' ? '' : 'Custom'} Presets
        </Button>
      );
    }


    return list && Object.keys(list).map((preset) => {
      const longPress = useLongPress((e) => deleteCloudPreset(list, preset), {
        onCancel: e => {
          sharePreset(list, preset)
        },
        treshhold: 1000,
        captureEvent: true,
      });
      return (
        <Grid item key={preset}>

          {CATEGORY !== "default_presets"
            ? <>
              <Popover
                className={classes.presetButton}
                color={JSON.stringify(virtual.effect.config) === JSON.stringify(list[preset].config) ? "primary" : "default"}
                variant="outlined"
                direction="center"
                onSingleClick={handleActivatePreset(
                  virtual.id,
                  CATEGORY,
                  effectType,
                  preset,
                )}
                openOnLongPress={true}
                onConfirm={handleRemovePreset(effectType, preset)}
                startIcon={""}
                size="medium"
                noIcon={true}
                label={list[preset].name}
              />
              {sharing && <Button color="primary" style={{ minWidth: 'unset', padding: '4px 4px', border: '1px solid #444' }}
                // onClick={async () => {              
                //   const eff = await cloud.get(`effects?ledfx_id=${effectType}`, {
                //     headers: {
                //       Authorization:
                //         `Bearer ${localStorage.getItem('jwt')}`,
                //     }
                //   })
                //   const effId = await eff.data[0].id
                //   cloud.post('presets', {
                //     Name: list[preset].name,
                //     config: virtual.effect.config,
                //     effect: effId,
                //     user: localStorage.getItem('ledfx-cloud-userid')
                //   }, {
                //     headers: {
                //       Authorization:
                //         `Bearer ${localStorage.getItem('jwt')}`,
                //     }
                //   })
                // }} 
                {...longPress}><Share /></Button>}
            </>
            : <Button
              className={classes.presetButton}
              color={JSON.stringify(virtual.effect.config) === JSON.stringify(list[preset].config) ? "primary" : "default"}
              variant="outlined"
              onClick={handleActivatePreset(
                virtual.id,
                CATEGORY,
                effectType,
                preset,
              )}
            >
              {list[preset].name}
            </Button>}

        </Grid>
      )
    })
  };

  const handleAddPreset = () => {
    addPreset(virtual.id, name).then(() => {
      getPresets(effectType)
    })
    setName('')
  };
  const handleRemovePreset = (effectType, presetId) => () => deletePreset(effectType, presetId)
    .then(() => {
      getPresets(effectType)
    });

  useEffect(() => {
    getVirtuals();
    effectType && getPresets(effectType);
  }, [getVirtuals, effectType])

  return (
    <Card variant="outlined" className={`${classes.deviceCard} step-device-three`} style={style}>
      <CardHeader style={{ margin: '0' }} title="Presets" subheader="Explore different effect configurations or create your own." />
      <CardContent className={classes.content}>
        {/* <Divider style={{ margin: '0 0 0.25rem 0' }} />
        <Typography style={{ marginLeft: '1rem', fontVariant: 'all-small-caps', color: theme.palette.text.disabled }} variant="h6">
          Default Presets
        </Typography>
        <Divider style={{ margin: '0.25rem 0 1rem 0' }} /> */}
        <Grid spacing={2} container className={classes.buttonGrid}>
          {renderPresetsButton(presets?.default_presets, 'default_presets')}
        </Grid>
        <Divider style={{ margin: '1rem 0' }} />
        {/* <Divider style={{ margin: '1rem 0 0.25rem 0' }} />
        <Typography style={{ marginLeft: '1rem', fontVariant: 'all-small-caps', color: theme.palette.text.disabled }} variant="h6">
          Custom Presets
        </Typography>
        <Divider style={{ margin: '0.25rem 0 1rem 0' }} /> */}
        <Grid spacing={2} container className={classes.buttonGrid}>
          {renderPresetsButton(presets?.custom_presets, 'custom_presets')}
          <Grid item>
            <Popover
              className={classes.presetButton}
              popoverStyle={{ padding: '0.5rem' }}
              color={"default"}
              variant="outlined"
              direction="center"
              onSingleClick={() => { console.log("hi") }}
              content={<TextField
                onKeyDown={e => (e.key == 'Enter') && handleAddPreset(e)}
                error={presets["default_presets"] && (Object.keys(presets["default_presets"]).indexOf(name) > -1 || Object.values(presets["default_presets"]).filter(p => p.name === name).length > 0)}
                size="small"
                variant="outlined"
                id="presetNameInput"
                label={
                  presets["default_presets"] &&
                    (Object.keys(presets["default_presets"]).indexOf(name) > -1 || Object.values(presets["default_presets"]).filter(p => p.name === name).length > 0)
                    ? "Default presets are readonly"
                    : presets["custom_presets"] && (Object.keys(presets["custom_presets"]).indexOf(name) > -1 || Object.values(presets["custom_presets"]).filter(p => p.name === name).length > 0)
                      ? "Preset already exsisting"
                      : "Add Custom Preset"}
                style={{ marginRight: '1rem', flex: 1 }}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  presets["custom_presets"] && (Object.keys(presets["custom_presets"]).indexOf(e.target.value) > -1 || Object.values(presets["custom_presets"]).filter(p => p.name === e.target.value).length > 0)
                    ? setValid(false)
                    : setValid(true)
                }}
              />}
              footer={<div style={{ margin: '0 0 0.5rem 1rem' }}>
                <Typography variant="body2" className={classes.hint}>
                  Save the current effect configuration as a new preset.
                </Typography>
              </div>}
              confirmDisabled={name.length === 0 || presets["default_presets"] && (Object.keys(presets["default_presets"]).indexOf(name) > -1 || Object.values(presets["default_presets"]).filter(p => p.name === name).length > 0) || !valid}
              onConfirm={handleAddPreset}
              startIcon={""}
              size="medium"
              icon={<Add />}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions >
        <div style={{ flexDirection: 'column', flex: 1 }}>
          {/* <div className={classes.actions}>
            <TextField
              onKeyDown={e => (e.key == 'Enter') && handleAddPreset(e)}
              error={presets["default_presets"] && (Object.keys(presets["default_presets"]).indexOf(name) > -1 || Object.values(presets["default_presets"]).filter(p => p.name === name).length > 0)}
              size="small"
              variant="outlined"
              id="presetNameInput"
              label={
                presets["default_presets"] &&
                  (Object.keys(presets["default_presets"]).indexOf(name) > -1 || Object.values(presets["default_presets"]).filter(p => p.name === name).length > 0)
                  ? "Default presets are readonly"
                  : presets["custom_presets"] && (Object.keys(presets["custom_presets"]).indexOf(name) > -1 || Object.values(presets["custom_presets"]).filter(p => p.name === name).length > 0)
                    ? "Update Custom Preset"
                    : "Add Custom Preset"}
              style={{ marginRight: '1rem', flex: 1 }}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                presets["custom_presets"] && (Object.keys(presets["custom_presets"]).indexOf(e.target.value) > -1 || Object.values(presets["custom_presets"]).filter(p => p.name === e.target.value).length > 0)
                  ? setValid(false)
                  : setValid(true)
              }}
            />
            <Button
              className={classes.presetButton}
              color="secondary"
              aria-label="Save"
              disabled={name.length === 0 || presets["default_presets"] && (Object.keys(presets["default_presets"]).indexOf(name) > -1 || Object.values(presets["default_presets"]).filter(p => p.name === name).length > 0)}
              variant="contained"
              onClick={handleAddPreset}
              endIcon={<SaveIcon />}
            >
              {valid ? "Save" : "Update"}
            </Button>
          </div> */}
          <div style={{ marginLeft: '0.5rem' }}>
            <Typography variant="body2" className={classes.hint}>
              Long-Press to delete a preset.
            </Typography>
            {!!localStorage.getItem('jwt') && isLogged && <>
              <CloudScreen virtId={virtual.id} effectType={effectType} variant="outlined" label="Get more..." startIcon={<Cloud />} />
              {localStorage.getItem('ledfx-cloud-role') === 'creator' && <>
                <Switch checked={sharing} onChange={(e) => setSharing(e.target.checked)} />
                Share
              </>
              }
            </>
            }
          </div>
        </div>
      </CardActions>

    </Card>
  );
};

export default PresetsCard;
