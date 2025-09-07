import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Divider,
  Button,
  Grid,
  Typography,
  TextField,
  useTheme,
  Stack,
  Box,
  CircularProgress
} from '@mui/material'
import { Add, Cloud, Delete, Sync } from '@mui/icons-material'
// import { diff } from 'deep-object-diff'
import useStore from '../../store/useStore'
import Popover from '../../components/Popover/Popover'
import CloudScreen from './Cloud/Cloud'
import PresetButton from './PresetButton'
import { cloud } from './Cloud/CloudComponents'

const PresetsCard = ({ virtual, effectType, presets, style }: any) => {
  const [name, setName] = useState('')
  const [valid, setValid] = useState(true)
  const [cloudEffects, setCloudEffects] = useState<any>([])
  const [cloudConfigs, setCloudConfigs] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)

  const theme = useTheme()
  const showSnackbar = useStore((state) => state.ui.showSnackbar)
  const setEffect = useStore((state) => state.setEffect)
  const activatePreset = useStore((state) => state.activatePreset)
  const addPreset = useStore((state) => state.addPreset)
  const getPresets = useStore((state) => state.getPresets)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const deletePreset = useStore((state) => state.deletePreset)
  const isLogged = useStore((state) => state.isLogged)
  const features = useStore((state) => state.features)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const getFullConfig = useStore((state) => state.getFullConfig)
  const getCloudConfigs = async () => {
    try {
      const response = await cloud.get(`configs?user.username=${localStorage.getItem('username')}`)
      if (response.status !== 200) {
        alert('No Access')
        return
      }
      const res = await response.data
      setCloudConfigs(res)
    } catch (error) {
      console.log(error)
    }
  }

  const uploadPresetCloud = async (list: any, preset: any) => {
    const existing = await cloud.get(
      `presets?user.username=${localStorage.getItem('username')}&Name=${list[preset].name}`
    )
    const exists = await existing.data
    const eff = await cloud.get(`effects?ledfx_id=${effectType}`)

    if (!eff.data || eff.data.length === 0) {
      showSnackbar('error', 'Effect not found in cloud, cannot upload preset')
      return
    }

    const effId = await eff.data[0].id
    // console.log(exists, existing)
    try {
      if (exists.length && exists.length > 0) {
        cloud.put(`presets/${exists[0].id}`, {
          Name: list[preset].name,
          config: virtual.effect.config,
          effect: effId,
          user: localStorage.getItem('ledfx-cloud-userid')
        })
      } else {
        cloud.post('presets', {
          Name: list[preset].name,
          config: virtual.effect.config,
          effect: effId,
          user: localStorage.getItem('ledfx-cloud-userid')
        })
      }
      showSnackbar('success', 'Preset uploaded to cloud')
    } catch (error) {
      console.log(error)
      showSnackbar('error', 'Failed to upload preset to cloud')
    }
  }

  const deletePresetCloud = async (list: any, preset: any) => {
    const existing = await cloud.get(
      `presets?user.username=${localStorage.getItem('username')}&Name=${list[preset].name}`
    )
    const exists = await existing.data
    if (exists.length && exists.length > 0) {
      cloud.delete(`presets/${exists[0].id}`)
    }
  }

  const getCloudPresets = async () => {
    const response = await cloud.get(`presets?effect.ledfx_id=${effectType}`)
    if (response.status !== 200) {
      alert('No Access')
      return
    }
    const res = await response.data
    const cEffects = {} as any
    res.forEach((p: { effect: { Name: string } }) => {
      if (!cEffects[p.effect.Name]) cEffects[p.effect.Name] = []
      cEffects[p.effect.Name].push(p)
    })
    setCloudEffects(cEffects)
  }

  const handleCloudPresets = async (p: any, save: boolean) => {
    await setEffect(virtual.id, p.effect.ledfx_id, p.config, true)
    if (save) {
      await addPreset(virtual.id, p.Name)
      await getPresets(p.effect.ledfx_id)
    }
  }

  const handleAddPreset = () => {
    addPreset(virtual.id, name).then(() => {
      getPresets(effectType).then(() => {
        getFullConfig()
      })
    })
    setName('')
  }
  const handleRemovePreset = (presetId: string) => () =>
    deletePreset(effectType, presetId).then(() => {
      getPresets(effectType)
    })

  const handleActivatePreset = (virtId: string, category: string, presetId: string) => () => {
    activatePreset(virtId, category, effectType, presetId).then(() => getVirtuals())
    setName('')
  }

  const renderPresetsButton = (list: any, CATEGORY: string) => {
    if (list && !Object.keys(list)?.length) {
      return (
        <Button style={{ margin: '1rem 0 0.5rem 1rem' }} size="medium" disabled>
          No {CATEGORY === 'ledfx_presets' ? '' : 'Custom'} Presets
        </Button>
      )
    }

    return (
      list &&
      Object.keys(list).map((preset) => {
        // if (
        //   Object.keys(diff(virtual.effect.config, list[preset].config)).length >
        //   0
        // )
        //   console.log(preset, diff(virtual.effect.config, list[preset].config))
        return (
          <Grid key={preset}>
            {CATEGORY !== 'ledfx_presets' ? (
              <PresetButton
                buttonColor={
                  JSON.stringify(virtual.effect.config) === JSON.stringify(list[preset].config)
                    ? 'primary'
                    : 'inherit'
                }
                label={list[preset].name}
                delPreset={handleRemovePreset(preset)}
                uploadPresetCloud={() => uploadPresetCloud(list, preset)}
                deletePresetCloud={() => deletePresetCloud(list, preset)}
                onClick={handleActivatePreset(virtual.id, CATEGORY, preset)}
              />
            ) : (
              <Button
                size="medium"
                color={
                  JSON.stringify(virtual.effect.config) === JSON.stringify(list[preset].config)
                    ? 'primary'
                    : 'inherit'
                }
                onClick={handleActivatePreset(virtual.id, CATEGORY, preset)}
              >
                {list[preset].name}
              </Button>
            )}
          </Grid>
        )
      })
    )
  }

  useEffect(() => {
    getVirtuals()
    if (effectType) getPresets(effectType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getVirtuals, effectType])

  useEffect(() => {
    if (features.cloud && !!localStorage.getItem('jwt') && isLogged) {
      getCloudPresets()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged, effectType])

  const syncPresets = async () => {
    if (cloudEffects && isLogged) {
      setIsLoading(true)

      const promises = Object.keys(cloudEffects).flatMap((effect) => {
        return cloudEffects[effect].map((p: any, ind: number) => {
          return new Promise((resolve) => {
            if (!presets.user_presets[p.effect.ledfx_id]) {
              setTimeout(() => {
                handleCloudPresets(p, true)
                resolve(null)
              }, 1000 * ind)
            } else {
              resolve(null)
            }
          })
        })
      })

      await Promise.all(promises)
      getVirtuals()
      setIsLoading(false)
    }
  }

  // Auto sync presets on load
  // useEffect(() => {
  //   syncPresets().then(() => getVirtuals())
  // }, [cloudEffects, presets])

  useEffect(() => {
    if (isLogged && features.cloud) getCloudConfigs()
  }, [isLogged, features.cloud])

  return (
    <Card variant="outlined" className="step-device-three" style={style}>
      <CardHeader
        style={{ margin: '0' }}
        title="Presets"
        subheader="Explore different effect configurations or create your own."
      />
      <CardContent>
        <Grid spacing={2} container>
          {renderPresetsButton(presets?.ledfx_presets || presets?.default_presets, 'ledfx_presets')}
        </Grid>
        <Divider style={{ margin: '1rem 0' }} />
        <Grid spacing={2} container>
          {renderPresetsButton(presets?.user_presets || presets?.custom_presets, 'user_presets')}
          <Grid>
            <Popover
              popoverStyle={{ padding: '0.5rem' }}
              color="primary"
              variant="outlined"
              onSingleClick={() => {}}
              content={
                <TextField
                  onKeyDown={(e: any) => e.key === 'Enter' && handleAddPreset()}
                  error={
                    presets.ledfx_presets &&
                    (Object.keys(presets.ledfx_presets).indexOf(name) > -1 ||
                      Object.values(presets.ledfx_presets).filter((p: any) => p.name === name)
                        .length > 0)
                  }
                  size="small"
                  id="presetNameInput"
                  label={
                    presets.ledfx_presets &&
                    (Object.keys(presets.ledfx_presets).indexOf(name) > -1 ||
                      Object.values(presets.ledfx_presets).filter((p: any) => p.name === name)
                        .length > 0)
                      ? 'Default presets are readonly'
                      : presets.user_presets &&
                          (Object.keys(presets.user_presets).indexOf(name) > -1 ||
                            Object.values(presets.user_presets).filter((p: any) => p.name === name)
                              .length > 0)
                        ? 'Preset Already Exists'
                        : 'Add Custom Preset'
                  }
                  style={{ marginRight: '1rem', flex: 1 }}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (
                      presets.user_presets &&
                      (Object.keys(presets.user_presets).indexOf(e.target.value) > -1 ||
                        Object.values(presets.user_presets).filter(
                          (p: any) => p.name === e.target.value
                        ).length > 0)
                    ) {
                      setValid(false)
                    } else {
                      setValid(true)
                    }
                  }}
                />
              }
              footer={
                <div style={{ margin: '0 0 0.5rem 1rem' }}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                    Save the current effect configuration as a new preset.
                  </Typography>
                </div>
              }
              confirmDisabled={
                name.length === 0 ||
                (presets.ledfx_presets &&
                  (Object.keys(presets.ledfx_presets).indexOf(name) > -1 ||
                    Object.values(presets.ledfx_presets).filter((p: any) => p.name === name)
                      .length > 0)) ||
                !valid
              }
              onConfirm={handleAddPreset}
              startIcon=""
              size="medium"
              icon={<Add />}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <div style={{ flexDirection: 'column', flex: 1, padding: '0 0.5rem' }}>
          <div
            style={{
              marginLeft: '0.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
              Long-Press or right-click to open context-menu
            </Typography>
          </div>
          {features.cloud && !!localStorage.getItem('jwt') && isLogged && (
            <>
              <Divider style={{ margin: '0.5rem 0' }} />
              <Stack direction="row" spacing={2}>
                <Button
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <Box sx={{ display: 'flex' }}>
                        <CircularProgress size="1rem" />
                      </Box>
                    ) : (
                      <Sync />
                    )
                  }
                  onClick={() => syncPresets()}
                >
                  Sync from Cloud
                </Button>
                <CloudScreen
                  virtId={virtual.id}
                  effectType={effectType}
                  variant="outlined"
                  label="get more online"
                  startIcon={<Cloud />}
                />
              </Stack>
            </>
          )}

          {cloudConfigs.some((c: any) => Object.keys(c.config.user_presets).length > 0) && (
            <>
              <Divider style={{ margin: '0.5rem 0' }} />

              <Popover
                onConfirm={() =>
                  setSystemConfig({ user_presets: {} }).then(() => {
                    getPresets(effectType)
                    getSystemConfig()
                  })
                }
                startIcon={<Delete />}
                color="inherit"
                variant="outlined"
                label="clear all user_presets from all effects"
              />
            </>
          )}
        </div>
      </CardActions>
    </Card>
  )
}

export default PresetsCard
