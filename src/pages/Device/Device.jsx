import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core/';
import useStore from '../../utils/apiStore';
import EffectsCard from './Effects';
import PresetsCard from './Presets';
import TransitionCard from './Transition';
import MelbankCard from './Frequencies';
import StreamToCard from './StreamTo';

const useStyles = makeStyles((theme) => ({
  virtualWrapper: {
    justifyContent: 'center',
  },
  girdItem: { flexShrink: 0, flexGrow: 1, maxWidth: '540px', width: '100%' },
}));

const Device = ({
  match: {
    params: { virtId },
  },
}) => {
  const classes = useStyles();

  const getVirtuals = useStore((state) => state.getVirtuals);
  const getPresets = useStore((state) => state.getPresets);
  const getSchemas = useStore((state) => state.getSchemas);
  const features = useStore((state) => state.features);

  const virtuals = useStore((state) => state.virtuals);
  const presets = useStore((state) => state.presets);
  const viewMode = useStore((state) => state.viewMode);

  const virtual = virtuals[virtId];
  const effectType = virtual && virtual.effect.type;

  useEffect(() => {
    getVirtuals();
    getSchemas();
    effectType && getPresets(effectType);
  }, [getVirtuals, getSchemas, getPresets, effectType]);

  return (
    <Grid
      container
      direction="row"
      spacing={2}
      className={classes.virtualWrapper}
    >
      {virtual && (
        <>
          <Grid item className={classes.girdItem}>
            <EffectsCard virtId={virtId} />

          </Grid>

          <Grid item className={classes.girdItem}>
            
            {effectType && presets && (
              <PresetsCard
                virtual={virtual}
                presets={presets}
                effectType={effectType}
                style={{ marginBottom: '1rem' }}
              />
            )}
            {features['streamto'] && <StreamToCard virtuals={virtuals} virtual={virtual} />}
            {viewMode === 'expert' && <TransitionCard virtual={virtual} style={{ marginTop: '1rem' }} />}
            {viewMode === 'expert' && <MelbankCard virtual={virtual} style={{ marginTop: '1rem' }} />}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Device;
