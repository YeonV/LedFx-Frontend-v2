/* eslint-disable @typescript-eslint/indent */
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Divider,
  Button,
  Grid,
  Typography,
  TextField,
} from '@material-ui/core';
import { Add, Cloud } from '@material-ui/icons';
import axios from 'axios';
import useStore from '../../store/useStore';
import Popover from '../../components/Popover/Popover';
import CloudScreen from './Cloud/Cloud';
import PresetButton from './PresetButton';

const cloud = axios.create({
  baseURL: 'https://strapi.yeonv.com',
});

const useStyles = makeStyles((theme: any) => ({
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
    // direction: 'row',
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

const PresetsCard = ({ virtual, effectType, presets, style }: any) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [valid, setValid] = useState(true);

  const activatePreset = useStore((state) => state.activatePreset);
  const addPreset = useStore((state) => state.addPreset);
  const getPresets = useStore((state) => state.getPresets);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const deletePreset = useStore((state) => state.deletePreset);
  const isLogged = useStore((state) => state.isLogged);
  const features = useStore((state) => state.features);

  const uploadPresetCloud = async (list: any, preset: any) => {
    const existing = await cloud.get(
      `presets?user.username=${localStorage.getItem('username')}&Name=${
        list[preset].name
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      }
    );
    const exists = await existing.data;
    const eff = await cloud.get(`effects?ledfx_id=${effectType}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    const effId = await eff.data[0].id;
    // console.log(exists, existing)
    if (exists.length && exists.length > 0) {
      cloud.put(
        `presets/${exists[0].id}`,
        {
          Name: list[preset].name,
          config: virtual.effect.config,
          effect: effId,
          user: localStorage.getItem('ledfx-cloud-userid'),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        }
      );
    } else {
      cloud.post(
        'presets',
        {
          Name: list[preset].name,
          config: virtual.effect.config,
          effect: effId,
          user: localStorage.getItem('ledfx-cloud-userid'),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        }
      );
    }
  };

  const deletePresetCloud = async (list: any, preset: any) => {
    const existing = await cloud.get(
      `presets?user.username=${localStorage.getItem('username')}&Name=${
        list[preset].name
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      }
    );
    const exists = await existing.data;
    if (exists.length && exists.length > 0) {
      cloud.delete(`presets/${exists[0].id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
    }
  };

  const handleAddPreset = () => {
    addPreset(virtual.id, name).then(() => {
      getPresets(effectType);
    });
    setName('');
  };
  const handleRemovePreset = (presetId: string) => () =>
    deletePreset(effectType, presetId).then(() => {
      getPresets(effectType);
    });

  const handleActivatePreset =
    (virtId: string, category: string, presetId: string) => () => {
      activatePreset(virtId, category, effectType, presetId).then(() =>
        getVirtuals()
      );
      setName('');
    };

  const renderPresetsButton = (list: any, CATEGORY: string) => {
    if (list && !Object.keys(list)?.length) {
      return (
        <Button
          style={{ margin: '0.5rem 0 0.5rem 0.5rem' }}
          variant="outlined"
          size="small"
          className={classes.presetButton}
          disabled
        >
          No {CATEGORY === 'default_presets' ? '' : 'Custom'} Presets
        </Button>
      );
    }

    return (
      list &&
      Object.keys(list).map((preset) => {
        return (
          <Grid item key={preset}>
            {CATEGORY !== 'default_presets' ? (
              <PresetButton
                buttonColor={
                  JSON.stringify(virtual.effect.config) ===
                  JSON.stringify(list[preset].config)
                    ? 'primary'
                    : 'default'
                }
                label={list[preset].name}
                delPreset={handleRemovePreset(preset)}
                uploadPresetCloud={() => uploadPresetCloud(list, preset)}
                deletePresetCloud={() => deletePresetCloud(list, preset)}
                className={classes.presetButton}
                onClick={handleActivatePreset(virtual.id, CATEGORY, preset)}
              />
            ) : (
              <Button
                className={classes.presetButton}
                color={
                  JSON.stringify(virtual.effect.config) ===
                  JSON.stringify(list[preset].config)
                    ? 'primary'
                    : 'default'
                }
                variant="outlined"
                onClick={handleActivatePreset(virtual.id, CATEGORY, preset)}
              >
                {list[preset].name}
              </Button>
            )}
          </Grid>
        );
      })
    );
  };

  useEffect(() => {
    getVirtuals();
    if (effectType) getPresets(effectType);
  }, [getVirtuals, effectType]);

  return (
    <Card
      variant="outlined"
      className={`${classes.deviceCard} step-device-three`}
      style={style}
    >
      <CardHeader
        style={{ margin: '0' }}
        title="Presets"
        subheader="Explore different effect configurations or create your own."
      />
      <CardContent className={classes.content}>
        <Grid spacing={2} container className={classes.buttonGrid}>
          {renderPresetsButton(presets?.default_presets, 'default_presets')}
        </Grid>
        <Divider style={{ margin: '1rem 0' }} />
        <Grid spacing={2} container className={classes.buttonGrid}>
          {renderPresetsButton(presets?.custom_presets, 'custom_presets')}
          <Grid item>
            <Popover
              className={classes.presetButton}
              popoverStyle={{ padding: '0.5rem' }}
              color="default"
              variant="outlined"
              onSingleClick={() => {
                // eslint-disable-next-line no-console
                console.log('hi');
              }}
              content={
                <TextField
                  onKeyDown={(e: any) => e.key === 'Enter' && handleAddPreset()}
                  error={
                    presets.default_presets &&
                    (Object.keys(presets.default_presets).indexOf(name) > -1 ||
                      Object.values(presets.default_presets).filter(
                        (p: any) => p.name === name
                      ).length > 0)
                  }
                  size="small"
                  variant="outlined"
                  id="presetNameInput"
                  label={
                    presets.default_presets &&
                    (Object.keys(presets.default_presets).indexOf(name) > -1 ||
                      Object.values(presets.default_presets).filter(
                        (p: any) => p.name === name
                      ).length > 0)
                      ? 'Default presets are readonly'
                      : presets.custom_presets &&
                        (Object.keys(presets.custom_presets).indexOf(name) >
                          -1 ||
                          Object.values(presets.custom_presets).filter(
                            (p: any) => p.name === name
                          ).length > 0)
                      ? 'Preset already exsisting'
                      : 'Add Custom Preset'
                  }
                  style={{ marginRight: '1rem', flex: 1 }}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (
                      presets.custom_presets &&
                      (Object.keys(presets.custom_presets).indexOf(
                        e.target.value
                      ) > -1 ||
                        Object.values(presets.custom_presets).filter(
                          (p: any) => p.name === e.target.value
                        ).length > 0)
                    ) {
                      setValid(false);
                    } else {
                      setValid(true);
                    }
                  }}
                />
              }
              footer={
                <div style={{ margin: '0 0 0.5rem 1rem' }}>
                  <Typography variant="body2" className={classes.hint}>
                    Save the current effect configuration as a new preset.
                  </Typography>
                </div>
              }
              confirmDisabled={
                name.length === 0 ||
                (presets.default_presets &&
                  (Object.keys(presets.default_presets).indexOf(name) > -1 ||
                    Object.values(presets.default_presets).filter(
                      (p: any) => p.name === name
                    ).length > 0)) ||
                !valid
              }
              onConfirm={handleAddPreset}
              startIcon=""
              size="medium"
              icon={<Add />}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <div style={{ flexDirection: 'column', flex: 1 }}>
          <div
            style={{
              marginLeft: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <Typography variant="body2" className={classes.hint}>
              Long-Press or right-click to open context-menu
            </Typography>
            {features.cloud && !!localStorage.getItem('jwt') && isLogged && (
              <CloudScreen
                virtId={virtual.id}
                effectType={effectType}
                variant="outlined"
                label="get more online"
                startIcon={<Cloud />}
              />
            )}
          </div>
        </div>
      </CardActions>
    </Card>
  );
};

export default PresetsCard;
