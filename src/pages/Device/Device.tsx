/* eslint-disable no-restricted-syntax */
import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import useStore from '../../store/useStore';
import EffectsCard from './Effects';
import PresetsCard from './Presets';
import TransitionCard from './Transition';
import MelbankCard from './Frequencies';
import StreamToCard from './StreamTo';

const PREFIX = 'Device';

const classes = {
  virtualWrapper: `${PREFIX}-virtualWrapper`,
  girdItem: `${PREFIX}-girdItem`,
};

const StyledGrid = styled(Grid)(() => ({
  [`&.${classes.virtualWrapper}`]: {
    justifyContent: 'center',
  },

  [`& .${classes.girdItem}`]: {
    flexShrink: 0,
    flexGrow: 1,
    maxWidth: '540px',
    width: '100%',
  },
}));

const Device = () => {
  const { virtId } = useParams();
  const getVirtuals = useStore((state) => state.getVirtuals);
  const getPresets = useStore((state) => state.getPresets);
  const getSchemas = useStore((state) => state.getSchemas);
  const features = useStore((state) => state.features);

  const virtuals = useStore((state) => state.virtuals);
  const presets = useStore((state) => state.presets);

  const getV = () => {
    for (const prop in virtuals) {
      if (virtuals[prop].id === virtId) {
        return virtuals[prop];
      }
    }
    return null;
  };

  const virtual = getV();
  // Object.keys(virtuals).length && virtuals.find((v) => v.id === virtId);

  const effectType = virtual && virtual.effect.type;

  useEffect(() => {
    getVirtuals();
    getSchemas();
    if (effectType) getPresets(effectType);
  }, [getVirtuals, getSchemas, getPresets, effectType]);

  return (
    <StyledGrid
      container
      direction="row"
      spacing={2}
      className={classes.virtualWrapper}
    >
      {virtual && (
        <>
          <Grid item className={classes.girdItem}>
            <EffectsCard virtId={virtId || ''} />
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
            {!(
              features.streamto ||
              features.transitions ||
              features.frequencies
            ) && (
              <Typography variant="body2" color="textSecondary" align="right">
                {' '}
                activate more advanced features with{' '}
                <Link style={{ color: 'inherit' }} to="/Settings?ui">
                  {' '}
                  Expert-Mode
                </Link>
              </Typography>
            )}
            {features.streamto && (
              <StreamToCard virtuals={virtuals} virtual={virtual} />
            )}
            {features.transitions && (
              <TransitionCard virtual={virtual} style={{ marginTop: '1rem' }} />
            )}
            {features.frequencies && (
              <MelbankCard virtual={virtual} style={{ marginTop: '1rem' }} />
            )}
          </Grid>
        </>
      )}
    </StyledGrid>
  );
};

export default Device;
