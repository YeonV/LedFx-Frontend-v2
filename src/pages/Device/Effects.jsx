import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardContent } from '@material-ui/core/';
import { Casino, Delete } from '@material-ui/icons/';
import useStore from '../../utils/apiStore';
import BladeEffectDropDown from '../../components/SchemaForm/BladeEffectDropDown';
import BladeSchemaForm from '../../components/SchemaForm/BladeSchemaForm';
import PixelGraph from './PixelGraph';

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
        maxWidth: '87vw'
    },
  },
}));

const EffectsCard = ({ virtId }) => {
  const classes = useStyles();
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
    setVirtualEffect({
      virtId: virtual.id,
      type: effectType,
      config: 'RANDOMIZE',
    });
  };

  const handleClearEffect = () => {
    clearVirtualEffect(virtId);
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
              <Button
                onClick={() => handleRandomize()}
                variant="outlined"
                style={{ marginRight: '.5rem' }}
              >
                <Casino />
              </Button>
            )}
            <Button variant="outlined" onClick={() => handleClearEffect()}>
              <Delete />
            </Button>
          </div>
        </div>
        
        <PixelGraph virtId={virtId} />
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
          <BladeSchemaForm
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
