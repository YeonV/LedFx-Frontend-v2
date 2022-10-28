/* eslint-disable @typescript-eslint/indent */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
} from '@mui/material';
import { Clear, ExpandMore, Pause, PlayArrow } from '@mui/icons-material';
import useStore from '../../store/useStore';
import EffectDropDown from '../../components/SchemaForm/components/DropDown/DropDown.wrapper';
import BladeEffectSchemaForm from '../../components/SchemaForm/EffectsSchemaForm/EffectSchemaForm';
import PixelGraph from '../../components/PixelGraph';
import TourEffect from '../../components/Tours/TourEffect';
import TroubleshootButton from './TroubleshootButton';
import { Schema } from '../../components/SchemaForm/SchemaForm/SchemaForm.props';

const configOrder = ['color', 'number', 'integer', 'string', 'boolean'];

const orderEffectProperties = (schema: Schema) => {
  const properties: any[] =
    schema &&
    schema.properties &&
    Object.keys(schema.properties).map((sk) => ({
      ...schema.properties[sk],
      id: sk,
    }));
  const ordered = [] as any[];
  configOrder.forEach((type) => {
    ordered.push(...properties.filter((x) => x.type === type));
  });
  ordered.push(...properties.filter((x) => !configOrder.includes(x.type)));
  return ordered
    .sort((a) => (a.type === 'string' && a.enum && a.enum.length ? -1 : 1))
    .sort((a) => (a.type === 'number' ? -1 : 1))
    .sort((a) => (a.type === 'integer' ? -1 : 1))
    .sort((a) => (a.id === 'bg_color' ? -1 : 1))
    .sort((a) => (a.type === 'color' ? -1 : 1))
    .sort((a) => (a.id === 'color' ? -1 : 1))
    .sort((a) => (a.id === 'gradient' ? -1 : 1));
};

const EffectsCard = ({ virtId }: { virtId: string }) => {
  const [fade, setFade] = useState(false);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const getSchemas = useStore((state) => state.getSchemas);
  const clearVirtualEffect = useStore((state) => state.clearVirtualEffect);
  const setVirtualEffect = useStore((state) => state.setVirtualEffect);
  const updateVirtualEffect = useStore((state) => state.updateVirtualEffect);
  const virtuals = useStore((state) => state.virtuals);
  const effects = useStore((state) => state.schemas.effects);
  const setPixelGraphs = useStore((state) => state.setPixelGraphs);
  const viewMode = useStore((state) => state.viewMode);
  const updateVirtual = useStore((state) => state.updateVirtual);
  const features = useStore((state) => state.features);

  const graphs = useStore((state) => state.graphs);
  const getV = () => {
    for (const prop in virtuals) {
      if (virtuals[prop].id === virtId) {
        return virtuals[prop];
      }
    }
  };
  const virtual = getV();

  const effectType = virtual && virtual.effect.type;
  const [theModel, setTheModel] = useState(virtual?.effect?.config);
  const orderedProperties =
    effects && effectType && orderEffectProperties(effects[effectType].schema);

  const handleClearEffect = () => {
    clearVirtualEffect(virtId).then(() => {
      setFade(true);
      setTimeout(() => {
        getVirtuals();
      }, virtual.config.transition_time * 1000);
      setTimeout(() => {
        setFade(false);
      }, virtual.config.transition_time * 1000 + 300);
    });
  };

  const handleEffectConfig = (config: any) => {
    if (updateVirtualEffect && getVirtuals !== undefined) {
      updateVirtualEffect(virtId, effectType, config, false).then(() => {
        getVirtuals();
      });
    }
  };

  const handlePlayPause = () => {
    updateVirtual(virtual.id, !virtual.active).then(() => getVirtuals());
  };

  useEffect(() => {
    getVirtuals();
    getSchemas();
    if (graphs) {
      setPixelGraphs([virtId]);
    }
  }, [graphs, setPixelGraphs, getVirtuals, getSchemas, effectType]);

  useEffect(() => {
    if (virtuals && virtual?.effect?.config) setTheModel(virtual.effect.config);
  }, [virtuals, virtual, virtual.effect, virtual.effect.config]);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          '& > .MuiCardContent-root': {
            pb: '0.25rem',
          },
        }}
      >
        <CardContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
              justifyContent: 'space-between',
            }}
          >
            <h1>{virtual && virtual.config.name}</h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {effects && effectType && (
                <>
                  {viewMode !== 'user' && (
                    <TroubleshootButton virtual={virtual} />
                  )}
                  <TourEffect schemaProperties={orderedProperties} />
                  {/* <Button
                    onClick={() => handleRandomize()}
                    style={{ marginRight: '.5rem' }}
                    className={'step-device-six'}
                    >
                    <Casino />
                  </Button> */}
                  <Button
                    style={{ marginRight: '.5rem' }}
                    className="step-device-five"
                    onClick={() => handlePlayPause()}
                  >
                    {virtual.active ? <Pause /> : <PlayArrow />}
                  </Button>
                  <Button
                    className="step-device-five"
                    onClick={() => handleClearEffect()}
                  >
                    <Clear />
                  </Button>
                </>
              )}
            </div>
          </div>
          <Box
            sx={
              fade
                ? {
                    opacity: 0.2,
                    transition: 'opacity',
                    transitionDuration: '1000',
                  }
                : {
                    opacity: 1,
                    transitionDuration: '0',
                  }
            }
            style={{
              transitionDuration: `${virtual.config.transition_time * 1000}`,
            }}
          >
            <PixelGraph
              virtId={virtId}
              active={
                virtuals &&
                virtual &&
                effects &&
                virtual.effect &&
                virtual.effect.config
              }
              dummy={
                !(
                  virtuals &&
                  virtual &&
                  effects &&
                  virtual.effect &&
                  virtual.effect.config
                )
              }
            />
          </Box>
          <div style={{ height: '1rem' }} />
          <EffectDropDown
            effects={effects}
            virtual={virtual}
            features={features}
            getVirtuals={getVirtuals}
            setVirtualEffect={setVirtualEffect}
          />
        </CardContent>
      </Card>
      {virtuals &&
        virtual &&
        effects &&
        virtual.effect &&
        virtual.effect.config && (
          <Card variant="outlined" style={{ marginTop: '1rem' }}>
            <CardContent style={{ padding: '0 16px' }}>
              <Accordion
                style={{ padding: 0 }}
                defaultExpanded
                // defaultExpanded={viewMode !== 'user'}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{ padding: 0 }}
                >
                  <Typography variant="h5">Effect Configuration</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ padding: '0 0 8px 0' }}>
                  <div>
                    <BladeEffectSchemaForm
                      handleEffectConfig={handleEffectConfig}
                      virtId={virtual.id}
                      schemaProperties={orderedProperties}
                      model={theModel}
                      selectedType={effectType}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        )}
    </>
  );
};

export default EffectsCard;
