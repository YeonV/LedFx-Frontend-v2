import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core/';
import useStore from '../../utils/apiStore';
import EffectsCard from './Effects';
import PresetsCard from './_Presets';
import TransitionCard from './Transition';
import MelbankCard from './Melbank';
import InfoCard from './_Info';

const useStyles = makeStyles((theme) => ({
  virtualWrapper: {
    justifyContent: 'center',
    '@media (max-width: 1400px)': {
      justifyContent: 'flex-start',
    },
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

  const virtuals = useStore((state) => state.virtuals);
  const presets = useStore((state) => state.presets);

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
            <TransitionCard virtual={virtual} style={{ marginTop: '1rem' }} />
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
            <MelbankCard virtual={virtual} />
          </Grid>
          {parseInt(window.localStorage.getItem('BladeMod')) > 10 && (
            <Grid item className={classes.girdItem}>
              <InfoCard virtual={virtual} style={{ marginTop: '1rem' }} />
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default Device;
