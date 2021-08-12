import { useState, useEffect } from 'react';

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
  },
  presetButton: {
    margin: theme.spacing(0),
    textDecoration: 'none',
  },
  buttonGrid: {
    direction: 'row',
    margin: '1rem 0',
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
      maxWidth: '97vw',
      margin: '0 auto',
    },
  },
}));

const PresetsCard = ({ virtual, effectType, presets, style }) => {
  // console.log(presets);
  const classes = useStyles();
  const [name, setName] = useState('');
  const isNameValid = validateTextInput(name, presets);

  const activatePreset = useStore((state) => state.activatePreset);
  const addPreset = useStore((state) => state.addPreset);
  const getPresets = useStore((state) => state.getPresets);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const deletePreset = useStore((state) => state.deletePreset);

  const handleActivatePreset = (virtId, category, effectType, presetId) => () => {    
    activatePreset(virtId, category, effectType, presetId).then(()=>getVirtuals());
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
          variant="outlined"
          onClick={handleActivatePreset(
            virtual.id,
            CATEGORY,
            effectType,
            preset,
          )}
          onDoubleClick={handleRemovePreset(effectType, preset)}
        >
          {list[preset].name}
        </Button>
      </Grid>
    ));
  };

  const handleAddPreset = () => addPreset(virtual.id, name).then(() => {
    // getVirtuals();
    getPresets(effectType)
  });
  const handleRemovePreset = (effectType, presetId) => () => deletePreset(effectType, presetId)
    .then(() => {
      // getVirtuals();
      getPresets(effectType)
    });

    useEffect(() => {
      getVirtuals();
      effectType && getPresets(effectType);
    }, [getVirtuals, effectType])

  return (
    <Card variant="outlined" className={`${classes.deviceCard} step-device-three`} style={style}>
      <CardHeader title="Presets" subheader="Explore different effect configurations" />
      <CardContent className={classes.content}>
        <Typography variant="h6">LedFx Presets</Typography>
        <Grid spacing={2} container className={classes.buttonGrid}>
          {renderPresetsButton(presets?.default_presets, DEFAULT_CAT)}
        </Grid>
        <Typography variant="h6">My Presets</Typography>
        <Typography variant="body2" color="textSecondary">
          DoubleClick to delete
        </Typography>
        <Grid spacing={2} container className={classes.buttonGrid}>
          {renderPresetsButton(presets?.custom_presets, CUSTOM_CAT)}
        </Grid>
        <Typography variant="h6">Add Preset</Typography>
        <Typography variant="body2" color="textSecondary">
          Save this effect configuration as a preset
        </Typography>
        
      </CardContent>
      <CardActions className={classes.actions}>
        <TextField
          error={!isNameValid}
          size="small"
          variant="outlined"
          id="presetNameInput"
          label="Preset Name"
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          className={classes.presetButton}
          size="large"
          color="secondary"
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
