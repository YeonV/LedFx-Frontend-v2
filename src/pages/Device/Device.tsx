import { useEffect } from 'react'
import { Card, Grid, Stack, Typography } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useStore from '../../store/useStore'
import EffectsCard from './Effects'
import PresetsCard from './Presets'
import TransitionCard from './Transition'
import MelbankCard from './Frequencies'
import StreamToCard from './StreamTo'
import EffectsComplex from './EffectsComplex'
import { Virtual } from '../../store/api/storeVirtuals'

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
  const updateVirtual = useStore((state) => state.updateVirtual)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const setNewBlender = useStore((state) => state.setNewBlender)
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

  const addComlexDummy = async (virtual: Virtual, complex: 'mask' | 'foreground' | 'background', icon: string) => {
    return await addDevice({
      type: 'dummy',
      config: {
        center_offset: 0,
        icon_name: icon,
        name: `${virtId}-${complex}`,
        pixel_count: virtual.pixel_count,
        refresh_rate: 64,
        rows: virtual.config.rows,
      }
    })
  }

  const addDevices = async () => {
    if (!virtual) return;
    const promises = [];
  
    
    if (!devices[`${virtId}-mask`]) {
      promises.push(addComlexDummy(virtual, 'mask', 'mdi:guy-fawkes-mask'))
    }  
    if (!devices[`${virtId}-foreground`]) {
      promises.push(addComlexDummy(virtual, 'foreground', 'mdi:star'))
    }
  
    if (!devices[`${virtId}-background`]) {
      promises.push(addComlexDummy(virtual, 'background', 'mdi:wallpaper'))
    }
  
    await Promise.all(promises);
  }

  const setEffects = async () => {
    if (!virtId) return;
    const promises = [];
    promises.push(setEffect(
      `${virtId}-mask`,
      'texter2d',
      {
        "text": "LedFx",
        "speed_option_1": 0,
        "dump": false,
        "background_color": "#000000",
        "font": "Blade-5x8",
        "flip": false,
        "option_2": false,
        "option_1": false,
        "multiplier": 1,
        "flip_vertical": false,
        "use_gradient": false,
        "brightness": 1,
        "value_option_1": 0.5,
        "text_color": "#ffffff",
        "advanced": false,
        "gradient_roll": 0,
        "gradient": "linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(255, 120, 0) 14%, rgb(255, 200, 0) 28%, rgb(0, 255, 0) 42%, rgb(0, 199, 140) 56%, rgb(0, 0, 255) 70%, rgb(128, 0, 128) 84%, rgb(255, 0, 178) 98%)",
        "background_brightness": 1,
        "blur": 0,
        "flip_horizontal": false,
        "resize_method": "Fast",
        "diag": false,
        "height_percent": 100,
        "text_effect": "Side Scroll",
        "mirror": false,
        "test": false,
        "impulse_decay": 0.1,
        "rotate": 0,
        "deep_diag": false,
        "alpha": false
      },
      true
    ).then(() => {
      updateVirtual(`${virtId}-mask`, true)
    }))
    promises.push(setEffect(
      `${virtId}-foreground`,
      'blade_power_plus',
      {
        "blur": 2,
        "background_color": "#000080",
        "multiplier": 0.5,
        "decay": 0.7,
        "frequency_range": "Lows (beat+bass)",
        "gradient": "linear-gradient(90deg, #00ffff 0.00%,#0000ff 100.00%)",
        "mirror": false,
        "flip": true,
        "gradient_roll": 0,
        "fix_hues": true,
        "brightness": 1,
        "background_brightness": 0.63
      },
      true
    ).then(() => {
      updateVirtual(`${virtId}-foreground`, true)
    }))
    promises.push(setEffect(
      `${virtId}-background`,
      'plasma2d',
      {
        "advanced": false,
        "background_brightness": 1,
        "background_color": "#000000",
        "blur": 0,
        "brightness": 0.03,
        "density": 0.5,
        "density_vertical": 0.1,
        "diag": false,
        "dump": false,
        "flip": false,
        "flip_horizontal": false,
        "flip_vertical": false,
        "frequency_range": "Lows (beat+bass)",
        "gradient": "linear-gradient(90deg, #ff00b2 0.00%,#ff2800 50.00%,#ffc800 100.00%)",
        "gradient_roll": 0,
        "lower": 0.01,
        "mirror": false,
        "radius": 0.2,
        "rotate": 0,
        "test": false,
      },
      true
    ).then(() => {
      updateVirtual(`${virtId}-background`, true)
    }))
    
    await Promise.all(promises);
  }

  useEffect(() => {    
    if (fPixels < 256) setSystemSetting('visualisation_maxlen', 256)
    getVirtuals()
    getSchemas()
    if (effectType) {
      getPresets(effectType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectType])

  useEffect(() => {
    if (virtId && virtuals[virtId].effect.type === 'blender' && !(virtId.endsWith('-mask') || virtId.endsWith('-foreground') || virtId.endsWith('-background')) && (!devices[`${virtId}-mask`] || !devices[`${virtId}-foreground`] || !devices[`${virtId}-background`])) {        
      addDevices().then(() => {
        getDevices()
        getVirtuals()
      }).catch(error => {
        console.error('Error adding devices:', error);
      });      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [virtId && virtuals[virtId]?.effect?.type])

  useEffect(() => {
    if (virtId && devices[`${virtId}-mask`] && devices[`${virtId}-foreground`] && devices[`${virtId}-background`] && virtuals[virtId].effect.type === 'blender' && (!virtuals[virtId].effect.config.mask || !virtuals[virtId].effect.config.foreground || !virtuals[virtId].effect.config.background)) {
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
          navigate(`/Devices`)
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [devices, virtId && virtuals[virtId]?.effect?.type])

  useEffect(() => {
    getVirtuals()
    getSchemas()
    if (graphs && virtId) {
      if (virtId && virtuals[virtId].effect.type === 'blender') {
        setPixelGraphs([virtId, `${virtId}-mask`, `${virtId}-foreground`, `${virtId}-background`])
      } else {
        setPixelGraphs([virtId])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphs, effectType, virtId && virtuals[virtId].effect.type])

  const matrixOpen = !!(virtId && virtuals[virtId].pixel_count > 100 && virtuals[virtId].config.rows > 7)
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
            item
            sx={{
              flexShrink: 0,
              flexGrow: 1,
              maxWidth: '540px',
              width: '100%'
            }}
          >
            <EffectsCard virtId={virtId || ''} />
          </Grid>
          {!!(devices[`${virtId}-mask`], devices[`${virtId}-foreground`], devices[`${virtId}-background`]) && virtId && virtuals[virtId].effect.type === 'blender' &&
            <Grid
              item
              sx={{
                flexShrink: 0,
                flexGrow: 1,
                maxWidth: '540px',
                width: '100%'
              }}
            >
              <Stack spacing={2}>
                <EffectsComplex virtId={`${virtId}-mask`} key={`${virtId}-mask`} initMatix={matrixOpen} />
                <EffectsComplex virtId={`${virtId}-foreground`} key={`${virtId}-foreground`} initMatix={matrixOpen} />
                <EffectsComplex virtId={`${virtId}-background`} key={`${virtId}-background`} initMatix={matrixOpen} />
                <Card sx={{ padding: '16px'}} variant="outlined">
                  <Typography variant="body2" color="textSecondary">
                    No presets available for complex effects. Please use scenes to save your configuration.
                  </Typography> 
                </Card>
              </Stack>
          </Grid>}

          <Grid
            item
            sx={{
              flexShrink: 0,
              flexGrow: 1,
              maxWidth: '540px',
              width: '100%'
            }}
          >
            {effectType && presets && !(devices[`${virtId}-mask`] && devices[`${virtId}-foreground`] && devices[`${virtId}-background`] && virtId && virtuals[virtId].effect.type === 'blender') && (
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
