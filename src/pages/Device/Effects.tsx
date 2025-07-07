/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
  CircularProgress
} from '@mui/material'
import {
  ExpandMore,
  Pause,
  PlayArrow,
  GridOn,
  GridOff,
  Fullscreen as FullScreenIcon,
  Stop
} from '@mui/icons-material'
import useStore from '../../store/useStore'
import EffectDropDown from '../../components/SchemaForm/components/DropDown/DropDown.wrapper'
import BladeEffectSchemaForm from '../../components/SchemaForm/EffectsSchemaForm/EffectSchemaForm'
import PixelGraph from '../../components/PixelGraph/PixelGraph'
import TourEffect from '../../components/Tours/TourEffect'
import TroubleshootButton from './TroubleshootButton'
import { Schema } from '../../components/SchemaForm/SchemaForm/SchemaForm.props'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { Effect, Virtual } from '../../api/ledfx.types'
import { useSubscription } from '../../utils/Websocket/WebSocketProvider'

const configOrder = ['color', 'number', 'integer', 'string', 'boolean']

const orderEffectProperties = (
  schema: Schema,
  hidden_keys?: string[],
  advanced_keys?: string[],
  advanced?: boolean
) => {
  const properties: any[] =
    schema &&
    schema.properties &&
    Object.keys(schema.properties)
      .filter((k) => {
        if (hidden_keys && hidden_keys.length > 0) {
          return hidden_keys?.indexOf(k) === -1
        }
        return true
      })
      .filter((ke) => {
        if (advanced_keys && advanced_keys.length > 0 && !advanced) {
          return advanced_keys?.indexOf(ke) === -1
        }
        return true
      })
      .map((sk) => ({
        ...schema.properties[sk],
        id: sk
      }))
  const ordered = [] as any[]
  configOrder.forEach((type) => {
    ordered.push(...properties.filter((x) => x.type === type))
  })
  ordered.push(...properties.filter((x) => !configOrder.includes(x.type)))
  return ordered
    .sort((a) => (a.id === 'advanced' ? 1 : -1))
    .sort((a) => (a.type === 'string' && a.enum && a.enum.length ? -1 : 1))
    .sort((a) => (a.type === 'number' ? -1 : 1))
    .sort((a) => (a.type === 'integer' ? -1 : 1))
    .sort((a) => (a.id === 'bg_color' ? -1 : 1))
    .sort((a) => (a.type === 'color' ? -1 : 1))
    .sort((a) => (a.id === 'color' ? -1 : 1))
    .sort((a) => (a.id === 'gradient' ? -1 : 1))
}

const EffectsCard = ({ virtId }: { virtId: string }) => {
  const [fade, setFade] = useState(false)
  const showMatrix = useStore((state) => state.showMatrix)
  const [loading, setLoading] = useState(false)

  const getVirtuals = useStore((state) => state.getVirtuals)
  const clearEffect = useStore((state) => state.clearEffect)
  const setEffect = useStore((state) => state.setEffect)
  const updateEffect = useStore((state) => state.updateEffect)
  const virtuals = useStore((state) => state.virtuals)
  const devices = useStore((state) => state.devices)
  const effects = useStore((state) => state.schemas.effects)
  const viewMode = useStore((state) => state.viewMode)
  const effectDescriptions = useStore((state) => state.ui.effectDescriptions)
  const updateVirtual = useStore((state) => state.updateVirtual)
  const features = useStore((state) => state.features)
  const [virtual, setVirtual] = useState<Virtual | undefined>(undefined)
  const [matrix, setMatrix] = useState(
    showMatrix ||
      !!(
        virtuals[virtId]?.config?.rows &&
        virtuals[virtId]?.config?.rows > 7 &&
        virtuals[virtId]?.pixel_count > 100 &&
        virtuals[virtId].effect.type === 'blender'
      )
  )
  const handle = useFullScreenHandle()
  const [fullScreen, setFullScreen] = useState(false)

  useSubscription('effect_set', getVirtuals)

  const getV = () => {
    for (const prop in virtuals) {
      if (virtuals[prop].id === virtId) {
        return virtuals[prop]
      }
    }
  }

  useEffect(() => {
    const v = getV()
    if (v) setVirtual(v)
  }, [JSON.stringify(virtuals[virtId])])

  const effectType = virtual && virtual.effect.type
  const lastEffect = virtual && virtual.last_effect
  const [theModel, setTheModel] = useState(virtual?.effect?.config)
  const orderedProperties =
    effects &&
    effectType &&
    orderEffectProperties(
      effects[effectType].schema,
      effects[effectType].hidden_keys,
      effects[effectType].advanced_keys,
      theModel?.advanced
    )
  const handleClearEffect = () => {
    if (virtual) {
      clearEffect(virtId).then(() => {
        setFade(true)
        setTimeout(
          () => {
            getVirtuals()
          },
          (virtual.config.transition_time || 0) * 1000
        )
        setTimeout(
          () => {
            setFade(false)
          },
          (virtual.config.transition_time || 0) * 1000 + 300
        )
      })
    }
  }

  const handleEffectConfig = (config: Effect['config']) => {
    if (config && updateEffect && getVirtuals !== undefined && effectType) {
      updateEffect(virtId, effectType, config, false).then(() => {
        getVirtuals()
      })
    }
  }

  const handlePlayPause = () => {
    if (virtual) updateVirtual(virtual.id, !virtual.active).then(() => getVirtuals())
  }

  useEffect(() => {
    if (
      virtuals &&
      virtuals[virtId]?.effect?.config &&
      JSON.stringify(theModel) !== JSON.stringify(virtuals[virtId].effect.config)
    ) {
      setTheModel(virtual?.effect.config)
    }
  }, [
    virtuals,
    virtuals[virtId],
    virtuals[virtId]?.effect,
    JSON.stringify(virtuals[virtId]?.effect?.config),
    virtual,
    virtual?.effect,
    virtual?.effect.config,
    effectType
  ])

  useEffect(() => {
    setMatrix(
      showMatrix ||
        ((virtuals[virtId]?.config?.rows || 1) > 7 &&
          virtuals[virtId]?.pixel_count > 100 &&
          virtuals[virtId].effect.type === 'blender')
    )
  }, [virtuals[virtId].effect.type])

  const actives = devices[
    Object.keys(devices).find((d) => d === virtId) || ''
  ]?.active_virtuals?.filter((value, index, self) => self.indexOf(value) === index)
  const streaming = actives && actives.length > 0 && actives?.some((a) => virtuals[a].active)

  const running = virtual && virtual.effect && virtual.effect.type

  const paused = virtual && !virtual.active

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          '& > .MuiCardContent-root': {
            pb: '0.25rem'
          }
        }}
      >
        <CardContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="body2" color="textDisabled" m={0} mb={1}>
              {running && !paused
                ? 'Running'
                : running && paused
                  ? 'Paused'
                  : streaming
                    ? 'Streaming from ' + actives?.join(', ')
                    : 'Not active'}
            </Typography>
            <h1 style={{ margin: 0 }}>{virtual && virtual.config.name}</h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              {lastEffect && !effectType && (
                <>
                  <Button
                    style={{ marginRight: '.5rem' }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handlePlayPause()
                    }}
                  >
                    <PlayArrow />
                  </Button>
                </>
              )}
              {effects && effectType && (
                <>
                  {viewMode !== 'user' && <TroubleshootButton virtual={virtual} />}
                  <TourEffect schemaProperties={orderedProperties} />
                  {(virtual.config.rows || 1) > 1 && (
                    <Button
                      style={{ marginRight: '.5rem' }}
                      className="step-device-six"
                      onClick={() => setMatrix(!matrix)}
                    >
                      {matrix ? <GridOff /> : <GridOn />}
                    </Button>
                  )}
                  {(virtual.config.rows || 1) > 1 && (
                    <Button
                      style={{ marginRight: '.5rem' }}
                      className="step-device-seven"
                      onClick={handle.enter}
                    >
                      <FullScreenIcon />
                    </Button>
                  )}
                  <Button
                    style={{ marginRight: '.5rem' }}
                    className="step-device-six"
                    onClick={() => handlePlayPause()}
                  >
                    {virtual.active ? <Pause /> : <PlayArrow />}
                  </Button>
                  <Box sx={{ position: 'relative' }}>
                    <Button
                      className="step-device-five"
                      disabled={loading}
                      onClick={(e) => {
                        e.preventDefault()
                        handleClearEffect()
                        setLoading(true)
                        setTimeout(
                          () => {
                            setLoading(false)
                          },
                          (virtuals[virtId].config.transition_time || 0) * 1000
                        )
                      }}
                    >
                      <Stop />
                    </Button>
                    {loading && (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginTop: '-12px',
                          marginLeft: '-12px'
                        }}
                      />
                    )}
                  </Box>
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
                    transitionDuration: '1000'
                  }
                : {
                    opacity: 1,
                    transitionDuration: '0'
                  }
            }
            style={{
              transitionDuration: `${(virtual?.config?.transition_time || 0) * 1000}`
            }}
          >
            <FullScreen handle={handle} onChange={setFullScreen}>
              <PixelGraph
                onDoubleClick={() => {
                  if (fullScreen) {
                    handle.exit()
                    setFullScreen(!fullScreen)
                  } else {
                    handle.enter()
                    setFullScreen(fullScreen)
                  }
                }}
                fullScreen={fullScreen}
                showMatrix={matrix}
                virtId={virtId}
                active={streaming || !!running}
                dummy={false}
              />
            </FullScreen>
          </Box>
          <div style={{ height: '1rem' }} />
          {virtual && (
            <EffectDropDown
              effects={effects}
              virtual={virtual}
              features={features}
              getVirtuals={getVirtuals}
              setEffect={setEffect}
            />
          )}
        </CardContent>
      </Card>
      {virtuals && virtual && effects && virtual.effect && virtual.effect.config && (
        <Card variant="outlined" style={{ marginTop: '1rem' }}>
          <CardContent style={{ padding: '0 16px' }}>
            <Accordion style={{ padding: 0, boxShadow: 'none' }} defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{ padding: 0 }}
              >
                <Typography variant="h5">Effect Configuration</Typography>
              </AccordionSummary>
              <AccordionDetails style={{ padding: '0 0 8px 0' }}>
                {theModel && effectType && (
                  <div>
                    <BladeEffectSchemaForm
                      handleEffectConfig={handleEffectConfig}
                      virtId={virtual.id}
                      schemaProperties={orderedProperties}
                      model={theModel as Record<string, unknown>}
                      selectedType={effectType}
                      descriptions={effectDescriptions}
                    />
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default EffectsCard
