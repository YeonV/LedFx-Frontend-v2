import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import useStore from '../../utils/apiStore';

export const DEFAULT_CAT = 'default_presets';
export const CUSTOM_CAT = 'custom_presets';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
  presetButton: {
    margin: theme.spacing(1),
    textDecoration: 'none',
  },
  buttonGrid: {
    direction: 'row',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(3),
  },
  deviceCard: {
    width: '100%',
    maxWidth: '540px',
    '@media (max-width: 580px)': {
      maxWidth: '87vw'
    },
  },
}));

const PresetsCard = ({ display, effectType, presets, style }) => {
  // console.log(presets);
  const classes = useStyles();
  const [name, setName] = useState('');
  const isNameValid = validateTextInput(name, presets);

  const activatePreset = useStore((state) => state.activatePreset);
  const addPreset = useStore((state) => state.addPreset);
  // const getPresets = useStore((state) => state.getPresets);
  const getDisplays = useStore((state) => state.getDisplays);
  const deletePreset = useStore((state) => state.deletePreset);

  const handleActivatePreset = (displayId, category, effectType, presetId) => () => {
    console.log(displayId, category, effectType, presetId);
    activatePreset(displayId, category, effectType, presetId);
    setName('');
  };

  const renderPresetsButton = (list, CATEGORY) => {
    if (list && !Object.keys(list)?.length) {
      return (
        <Button className={classes.presetButton} disabled>
          No Saved Presets
        </Button>
      );
    }
    return list && Object.keys(list).map((preset) => (
      <Grid item key={preset}>
        <Button
          className={classes.presetButton}
          onClick={handleActivatePreset(
            display.id,
            CATEGORY,
            effectType,
            preset,
          )}
          onDoubleClick={handleRemovePreset(display.id, list[preset].id)}
        >
          {list[preset].name}
        </Button>
      </Grid>
    ));
  };

  const handleAddPreset = () => addPreset(display.id, name).then(() => {
    getDisplays();
    // getPresets(effectType)
  });
  const handleRemovePreset = (displayId, presetId) => () => deletePreset(displayId, presetId)
    .then(() => {
      getDisplays();
      // getPresets(effectType)
    });

  return (
    <Card variant="outlined" className={classes.deviceCard} style={style}>
      <CardHeader title="Presets" subheader="Explore different effect configurations" />
      <CardContent className={classes.content}>
        <Typography variant="subtitle2">LedFx Presets</Typography>
        <Grid container className={classes.buttonGrid}>
          {renderPresetsButton(presets?.default_presets, DEFAULT_CAT)}
        </Grid>
        <Typography variant="subtitle2">My Presets</Typography>
        <Grid container className={classes.buttonGrid}>
          {renderPresetsButton(presets?.custom_presets, CUSTOM_CAT)}
        </Grid>
        <Typography variant="h6">Add Preset</Typography>
        <Typography variant="body1" color="textSecondary">
          Save this effect configuration as a preset
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <TextField
          error={!isNameValid}
          id="presetNameInput"
          label="Preset Name"
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          className={classes.presetButton}
          color="primary"
          aria-label="Save Preset"
          disabled={name.length === 0 || !isNameValid}
          variant="contained"
          onClick={handleAddPreset}
          endIcon={<SaveIcon />}
        >
          Save Preset
        </Button>
      </CardActions>
    </Card>
  );
};

const validateTextInput = (input, presets) => {
  const used = presets.customPresets && presets.customPresets.concat(presets.defaultPresets);
  return !(used && used.some((p) => p.name === input));
};

export default PresetsCard;
