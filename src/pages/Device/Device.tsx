/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { Grid2 as Grid, Stack, Typography } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useStore from '../../store/useStore'
import EffectsCard from './Effects'
import PresetsCard from './Presets'
import TransitionCard from './Transition'
import MelbankCard from './Frequencies'
import StreamToCard from './StreamTo'
import EffectsComplex from './EffectsComplex'
import { Virtual } from '../../store/api/storeVirtuals'
import { defaultEffects } from '../Home/BladeScene'
import PresetsComplex from './PresetsComplex'

const Device = () => {
  const navigate = useNavigate()
  const { virtId } = useParams()
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getPresets = useStore((state) => state.getPresets)
  const addDevice = useStore((state) => state.addDevice)
  const getSchemas = useStore((state) => state.getSchemas)
  const getDevices = useStore((state) => state.getDevices)
  const setEffect = useStore((state) => state.setEffect)
  const updateEffect = useStore((state) => state.updateEffect)
  const clearEffect = useStore((state) => state.clearEffect)
  const updateVirtual = useStore((state) => state.updateVirtual)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const setNewBlender = useStore((state) => state.setNewBlender)
  const blenderAutomagic = useStore((state) => state.uiPersist.blenderAutomagic)
  const graphs = useStore((state) => state.graphs)
  const features = useStore((state) => state.features)
  const fPixels = useStore((state) => state.config.visualisation_maxlen)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const devices = useStore((state) => state.devices)
  const virtuals = useStore((state) => state.virtuals)
  const presets = useStore((state) => state.presets)
  const setSystemSetting = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig())
  }
  const getV = () => {
    for (const prop in virtuals) {
      if (virtuals[prop].id === virtId) {
        return virtuals[prop]
      }
    }
    return null
  }

  const virtual = getV()

  const effectType = virtual && virtual.effect.type

  const addComlexDummy = async (
    virtual: Virtual,
    complex: 'mask' | 'foreground' | 'background',
    icon: string
  ) => {
    return await addDevice({
      type: 'dummy',
      config: {
        center_offset: 0,
        icon_name: icon,
        name: `${virtId}-${complex}`,
        pixel_count: virtual.pixel_count,
        refresh_rate: 64,
        rows: virtual.config.rows
      }
    })
  }

  const addDevices = async () => {
    if (!virtual) return
    const promises = []

    if (!devices[`${virtId}-mask`]) {
      promises.push(addComlexDummy(virtual, 'mask', 'mdi:guy-fawkes-mask'))
    }
    if (!devices[`${virtId}-foreground`]) {
      promises.push(addComlexDummy(virtual, 'foreground', 'mdi:star'))
    }

    if (!devices[`${virtId}-background`]) {
      promises.push(addComlexDummy(virtual, 'background', 'mdi:wallpaper'))
    }

    await Promise.all(promises)
  }

  const setEffects = async () => {
    if (!virtId) return
    const promises = []
    const is2d = virtuals[virtId]?.config.rows > 1
    promises.push(
      setEffect(
        `${virtId}-mask`,
        is2d
          ? defaultEffects.blenderMask2d.type
          : defaultEffects.blenderMask.type,
        is2d
          ? defaultEffects.blenderMask2d.config
          : defaultEffects.blenderMask.config,
        true
      ).then(() => {
        updateVirtual(`${virtId}-mask`, true)
      })
    )
    promises.push(
      setEffect(
        `${virtId}-foreground`,
        is2d
          ? defaultEffects.blenderForeground2d.type
          : defaultEffects.blenderForeground.type,
        is2d
          ? defaultEffects.blenderForeground2d.config
          : defaultEffects.blenderForeground.config,
        true
      ).then(() => {
        updateVirtual(`${virtId}-foreground`, true)
      })
    )
    promises.push(
      setEffect(
        `${virtId}-background`,
        is2d
          ? defaultEffects.blenderBackground2d.type
          : defaultEffects.blenderBackground.type,
        is2d
          ? defaultEffects.blenderBackground2d.config
          : defaultEffects.blenderBackground.config,
        true
      ).then(() => {
        updateVirtual(`${virtId}-background`, true)
      })
    )

    await Promise.all(promises)
  }

  useEffect(() => {
    if (fPixels < 256) setSystemSetting('visualisation_maxlen', 256)
    getVirtuals()
    getSchemas()
    if (effectType) {
      getPresets(effectType)
    }
  }, [effectType])

  useEffect(() => {
    if (
      blenderAutomagic &&
      virtId &&
      virtuals[virtId]?.effect.type === 'blender' &&
      !(
        virtId.endsWith('-mask') ||
        virtId.endsWith('-foreground') ||
        virtId.endsWith('-background')
      ) &&
      (!devices[`${virtId}-mask`] ||
        !devices[`${virtId}-foreground`] ||
        !devices[`${virtId}-background`])
    ) {
      addDevices()
        .then(() => {
          getDevices()
          getVirtuals()
        })
        .catch((error) => {
          console.error('Error adding devices:', error)
        })
    }
  }, [virtId && virtuals[virtId]?.effect?.type, blenderAutomagic])

  useEffect(() => {
    if (
      blenderAutomagic &&
      virtId &&
      devices[`${virtId}-mask`] &&
      devices[`${virtId}-foreground`] &&
      devices[`${virtId}-background`] &&
      virtuals[virtId]?.effect.type === 'blender' &&
      (!virtuals[virtId]?.effect.config?.mask ||
        !virtuals[virtId]?.effect.config?.foreground ||
        !virtuals[virtId]?.effect.config?.background)
    ) {
      setEffects().then(() => {
        updateEffect(
          virtId,
          'blender',
          {
            mask: `${virtId}-mask`,
            foreground: `${virtId}-foreground`,
            background: `${virtId}-background`
          },
          true
        ).then(() => {
          updateVirtual(virtId, true)
          setNewBlender(virtId)
          navigate('/Devices')
        })
      })
    }
    if (
      blenderAutomagic &&
      virtId &&
      devices[`${virtId}-mask`] &&
      devices[`${virtId}-foreground`] &&
      devices[`${virtId}-background`] &&
      virtuals[virtId]?.effect?.type !== 'blender'
    ) {
      if (virtuals[`${virtId}-mask`].effect.config)
        clearEffect(`${virtId}-mask`)
      if (virtuals[`${virtId}-foreground`].effect.config)
        clearEffect(`${virtId}-foreground`)
      if (virtuals[`${virtId}-background`].effect.config)
        clearEffect(`${virtId}-background`)
    }
  }, [devices, virtId && virtuals[virtId]?.effect?.type, blenderAutomagic])

  useEffect(() => {
    getVirtuals()
    getSchemas()
    if (graphs && virtId) {
      if (
        blenderAutomagic &&
        virtId &&
        virtuals[virtId]?.effect?.type === 'blender'
      ) {
        setPixelGraphs([
          virtId,
          `${virtId}-mask`,
          `${virtId}-foreground`,
          `${virtId}-background`
        ])
      } else {
        setPixelGraphs([virtId])
      }
    }
  }, [
    graphs,
    effectType,
    virtId && virtuals[virtId]?.effect.type,
    blenderAutomagic
  ])

  const matrixOpen = !!(
    virtId &&
    virtuals[virtId]?.pixel_count > 100 &&
    virtuals[virtId]?.config.rows > 7
  )
  return (
    <Grid
      container
      direction="row"
      spacing={2}
      sx={{ justifyContent: 'center', paddingTop: '1rem' }}
    >
      {virtual && (
        <>
          <Grid
            sx={{
              flexShrink: 0,
              flexGrow: 1,
              maxWidth: '540px',
              width: '100%'
            }}
          >
            <EffectsCard virtId={virtId || ''} />
          </Grid>
          {!!(devices[`${virtId}-mask`],
          devices[`${virtId}-foreground`],
          devices[`${virtId}-background`]) &&
            virtId &&
            virtuals[virtId]?.effect?.type === 'blender' &&
            blenderAutomagic && (
              <Grid
                sx={{
                  flexShrink: 0,
                  flexGrow: 1,
                  maxWidth: '540px',
                  width: '100%'
                }}
              >
                <Stack spacing={2}>
                  <EffectsComplex
                    virtId={`${virtId}-mask`}
                    key={`${virtId}-mask`}
                    initMatix={matrixOpen}
                  />
                  <EffectsComplex
                    virtId={`${virtId}-foreground`}
                    key={`${virtId}-foreground`}
                    initMatix={matrixOpen}
                  />
                  <EffectsComplex
                    virtId={`${virtId}-background`}
                    key={`${virtId}-background`}
                    initMatix={matrixOpen}
                  />
                  <PresetsComplex virtId={virtId} />
                </Stack>
              </Grid>
            )}

          <Grid
            sx={{
              flexShrink: 0,
              flexGrow: 1,
              maxWidth: '540px',
              width: '100%'
            }}
          >
            {effectType &&
              presets &&
              !(
                devices[`${virtId}-mask`] &&
                devices[`${virtId}-foreground`] &&
                devices[`${virtId}-background`] &&
                virtId &&
                virtuals[virtId]?.effect?.type === 'blender' &&
                blenderAutomagic
              ) && (
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
    </Grid>
  )
}

export default Device
