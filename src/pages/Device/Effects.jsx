import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Button, Card, CardContent } from '@material-ui/core/';
import { Casino, Clear, Settings } from '@material-ui/icons/';
import useStore from '../../utils/apiStore';
import BladeEffectDropDown from '../../components/SchemaForm/BladeEffectDropDown';
import BladeEffectSchemaForm from '../../components/SchemaForm/BladeEffectSchemaForm';
import PixelGraph from '../../components/PixelGraph';
import TourEffect from '../../components/Tours/TourEffect';

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
    width: '100%',
    maxWidth: '540px',
    '@media (max-width: 580px)': {      
      maxWidth: '97vw',
      margin: '0 auto',
    },
  },
  pixelbar: {
    opacity: 1,
    transitionDuration: 0
  },
  pixelbarOut: {
    opacity: 0.2,
    transition: 'opacity',
    transitionDuration: 1000
  }
}));

const EffectsCard = ({ virtId }) => {
  const classes = useStyles();
  const [fade, setFade] = useState(false)
  const getVirtuals = useStore((state) => state.getVirtuals);
  const getSchemas = useStore((state) => state.getSchemas);
  const clearVirtualEffect = useStore((state) => state.clearVirtualEffect);
  const setVirtualEffect = useStore((state) => state.setVirtualEffect);
  const virtuals = useStore((state) => state.virtuals);
  const effects = useStore((state) => state.schemas.effects);
  const setPixelGraphs = useStore((state) => state.setPixelGraphs);

  const graphs = useStore((state) => state.graphs);

  const virtual = virtuals[virtId];
  const effectType = virtual && virtual.effect.type;

  const handleRandomize = () => {
    setVirtualEffect(
     virtual.id,
      {
        virtId: virtual.id,
        type: effectType,
        config: 'RANDOMIZE',
        active: true
      }
    ).then(()=>getVirtuals());
  };

  const handleClearEffect = () => {
    clearVirtualEffect(virtId).then(() => {
      setFade(true)
      setTimeout(() => { getVirtuals() }, virtual.config.transition_time * 1000)
      setTimeout(() => { setFade(false) }, virtual.config.transition_time * 1000 + 300)
    });
  };

  useEffect(() => {
    getVirtuals();
    getSchemas();
    if (graphs) {
      setPixelGraphs([virtId]);
    }
  }, [graphs, setPixelGraphs, getVirtuals, getSchemas, effectType]);

  return (
    <Card className={classes.card}>
      <CardContent>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '0 .5rem',
          }}
        >
          <h1>{virtual && virtual.config.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {effectType && (
              <>
              <TourEffect schema={effects[effectType].schema} />
                <Button
                  onClick={() => handleRandomize()}
                  variant="outlined"
                  style={{ marginRight: '.5rem' }}
                  className={'step-device-six'}    
                >
                  <Casino />
                </Button>
                <Button variant="outlined" className={'step-device-five'} onClick={() => handleClearEffect()}>
                  <Clear />
                </Button>
              </>
            )}

          </div>
        </div>
        <div className={clsx(classes.pixelbar, {
          [classes.pixelbarOut]: fade,
        })} style={{ transitionDuration: virtual.config.transition_time * 1000 }}>

          <PixelGraph virtId={virtId} dummy={!(virtuals
            && virtual
            && effects
            && virtual.effect
            && virtual.effect.config)} />

        </div>
        <div style={{ height: '1rem' }} />
        <BladeEffectDropDown
          virtId={virtId}
          effects={effects}
          virtual={virtual}
        />
        {virtuals
          && virtual
          && effects
          && virtual.effect
          && virtual.effect.config && (
            <BladeEffectSchemaForm
              virtual={virtual}
              effects={effects}
              schema={effects[effectType].schema}
              model={virtual.effect.config}
              virtual_id={virtId}
              selectedType={effectType}
            />
          )}
      </CardContent>
    </Card>
  );
};

export default EffectsCard;
