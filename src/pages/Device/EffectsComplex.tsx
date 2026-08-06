/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Box,
  IconButton,
  Stack,
  capitalize,
  Select,
  MenuItem,
  ListSubheader
} from '@mui/material'
import { GridOn, GridOff, Settings } from '@mui/icons-material'
import useStore from '../../store/useStore'
import BladeEffectSchemaForm from '../../components/SchemaForm/EffectsSchemaForm/EffectSchemaForm'
import BladeFrame from '../../components/SchemaForm/components/BladeFrame'
import { Schema } from '../../components/SchemaForm/SchemaForm/SchemaForm.props'
import PixelGraph from '../../components/PixelGraph/PixelGraph'
import EffectDropDown from '../../components/SchemaForm/components/DropDown/DropDown.wrapper'
import { Ledfx } from '../../api/ledfx'
import { EffectConfig, Virtual } from '../../api/ledfx.types'

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

const EffectsComplex = ({ virtId, initMatix }: { virtId: string; initMatix?: boolean }) => {
  const getDevices = useStore((state) => state.getDevices)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getSchemas = useStore((state) => state.getSchemas)
  const updateEffect = useStore((state) => state.updateEffect)
  const setEffect = useStore((state) => state.setEffect)
  const blenderAutomagic = useStore((state) => state.uiPersist.blenderAutomagic)
  const virtuals = useStore((state) => state.virtuals)
  const features = useStore((state) => state.features)
  const effects = useStore((state) => state.schemas.effects)
  const effectDescriptions = useStore((state) => state.ui.effectDescriptions)
  const getLedFxPresets = useStore((state) => state.getLedFxPresets)
  const getUserPresets = useStore((state) => state.getUserPresets)
  const activatePreset = useStore((state) => state.activatePreset)
  const [fade] = useState(false)
  const [virtual, setVirtual] = useState<Virtual | undefined>(undefined)
  const [matrix, setMatrix] = useState(initMatix)
  const [showSettings, setShowSettings] = useState(false)
  // Held locally rather than read from state.presets: that slot is a single
  // shared object, and this component is mounted once per sub-virtual
  // (background, foreground, mask), so they would overwrite each other. These
  // catalogues are keyed by effect type instead, so each instance can look up
  // its own.
  const [ledfxPresets, setLedfxPresets] = useState<Record<string, any>>({})
  const [userPresets, setUserPresets] = useState<Record<string, any>>({})

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
  }, [JSON.stringify(virtuals[virtId] ?? {})])

  const effectType = virtual && virtual.effect?.type
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

  const handleEffectConfig = (config: EffectConfig, vId: string) => {
    // Optimistically update theModel immediately to prevent flickering
    setTheModel((prev: any) => ({ ...prev, ...config }))

    if (updateEffect && getVirtuals !== undefined && effectType) {
      updateEffect(vId, effectType, config, false).then(() => {
        getVirtuals()
        getDevices()
      })
    }
  }

  useEffect(() => {
    getVirtuals()
    getSchemas()
  }, [])

  // Fetched only once the settings panel is open. Both getters hit /api/config,
  // so loading them eagerly would cost a full config fetch per card on render.
  useEffect(() => {
    if (!showSettings) return
    getLedFxPresets().then((p: any) => p && setLedfxPresets(p))
    getUserPresets().then((p: any) => p && setUserPresets(p))
  }, [showSettings, effectType])

  const applyPreset = (value: string) => {
    // Category and id travel together: the two namespaces are independent and
    // can hold the same preset id, so the id alone is ambiguous.
    const [category, presetId] = value.split('::')
    if (!effectType || !presetId) return
    activatePreset(virtId, category as 'ledfx_presets' | 'user_presets', effectType, presetId).then(
      () => {
        getVirtuals()
        getDevices()
      }
    )
  }

  const ledfxForType: Record<string, any> = (effectType && ledfxPresets?.[effectType]) || {}
  const userForType: Record<string, any> = (effectType && userPresets?.[effectType]) || {}
  const hasPresets = Object.keys(ledfxForType).length + Object.keys(userForType).length > 0

  useEffect(() => {
    if (virtuals[virtId]?.effect && Object.keys(virtuals[virtId]?.effect).length === 0) {
      Ledfx('/api/config').then((resp) => {
        const v = resp.virtuals.find((v: any) => v.id === virtId)
        if (!v || !v.last_effect || !v.effects || !v.effects[v.last_effect]) return
        const { type, config } = v.effects[v.last_effect]
        if (type && config) {
          setEffect(virtId, type, config, true)
        }
      })
    }
  }, [effectType])

  useEffect(() => {
    if (
      virtuals &&
      virtuals[virtId]?.effect?.config &&
      JSON.stringify(theModel) !== JSON.stringify(virtuals[virtId]?.effect?.config)
    ) {
      setTheModel(virtual?.effect?.config)
    }
  }, [
    virtuals,
    virtuals[virtId],
    virtuals[virtId]?.effect,
    JSON.stringify(virtuals[virtId]?.effect?.config),
    virtual,
    virtual?.effect,
    virtual?.effect?.config,
    effectType
  ])

  return (
    <Card variant="outlined">
      <CardContent style={{ padding: '10px 16px 0px 16px' }}>
        <Box
          sx={
            fade
              ? {
                  opacity: 0.2,
                  transition: 'opacity',
                  transitionDuration: '1000'
                }
              : { opacity: 1, transitionDuration: '0' }
          }
          style={{
            transitionDuration: `${(virtual?.config?.transition_time || 0) * 1000}`
          }}
        >
          <PixelGraph showMatrix={matrix} virtId={virtId} active={true} dummy={false} />
        </Box>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: 'center', paddingTop: '1rem', mb: 2 }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <EffectDropDown
              effects={effects}
              virtual={virtual}
              features={features}
              setEffect={setEffect}
              getVirtuals={getVirtuals}
              ommit={blenderAutomagic ? ['Blender'] : []}
              title={`${capitalize(virtId.split('-').slice(-1)[0])} Effect`}
            />
          </Box>
          <IconButton onClick={() => setShowSettings(!showSettings)}>
            <Settings />
          </IconButton>
          <IconButton
            style={{ marginLeft: '.5rem' }}
            className="step-device-six"
            onClick={() => setMatrix(!matrix)}
          >
            {matrix ? <GridOff /> : <GridOn />}
          </IconButton>
        </Stack>
        {showSettings &&
          virtuals &&
          virtual &&
          effects &&
          virtual.effect &&
          virtual.effect.config &&
          theModel &&
          effectType && (
            <div>
              {hasPresets && (
                <BladeFrame title="Preset" full style={{ margin: '0 0 1rem 0', width: 'unset' }}>
                  {/*
                    Deliberately an action, not persisted state: applying a
                    preset then nudging any slider means the config no longer
                    matches it, so showing it as still selected would lie.
                  */}
                  <Select
                    variant="standard"
                    disableUnderline
                    fullWidth
                    value=""
                    displayEmpty
                    onChange={(e) => applyPreset(e.target.value as string)}
                  >
                    <MenuItem value="" disabled>
                      Apply a preset...
                    </MenuItem>
                    {Object.keys(ledfxForType).length > 0 && <ListSubheader>LedFx</ListSubheader>}
                    {Object.entries(ledfxForType).map(([id, preset]) => (
                      <MenuItem key={`ledfx-${id}`} value={`ledfx_presets::${id}`}>
                        {preset?.name || id}
                      </MenuItem>
                    ))}
                    {Object.keys(userForType).length > 0 && <ListSubheader>User</ListSubheader>}
                    {Object.entries(userForType).map(([id, preset]) => (
                      <MenuItem key={`user-${id}`} value={`user_presets::${id}`}>
                        {preset?.name || id}
                      </MenuItem>
                    ))}
                  </Select>
                </BladeFrame>
              )}
              <BladeEffectSchemaForm
                handleEffectConfig={(e: any) => handleEffectConfig(e, virtId)}
                virtId={virtId}
                schemaProperties={orderedProperties}
                model={theModel as Record<string, unknown>}
                selectedType={effectType}
                descriptions={effectDescriptions}
              />
            </div>
          )}
      </CardContent>
    </Card>
  )
}

export default EffectsComplex
