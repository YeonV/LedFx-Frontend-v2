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
import useStore from '../../store/useStore'
import Popover from '../../components/Popover/Popover'
import CloudScreen from './Cloud/Cloud'
import PresetButton from './PresetButton'
import { cloud } from './Cloud/CloudComponents'
import type { Preset, EffectType, Virtual } from '../../api/ledfx.types'
import type { IPresets } from '../../store/api/storePresets'

interface PresetsCardProps {
  virtual: Virtual
  effectType: EffectType
  presets: IPresets
  style?: React.CSSProperties
}

const PresetsCard = ({ virtual, effectType, presets, style }: PresetsCardProps) => {
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
      const response = await cloud.get(
        `configs?user.username=${localStorage.getItem('ledfx-cloud-username')}`
      )
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

  const uploadPresetCloud = async (presetsList: Record<string, Preset>, presetId: string) => {
    const preset = presetsList[presetId]
    if (!preset) return

    const existing = await cloud.get(
      `presets?user.username=${localStorage.getItem('ledfx-cloud-username')}&Name=${preset.name}`
    )
    const exists = await existing.data
    const eff = await cloud.get(`effects?ledfx_id=${effectType}`)

    if (!eff.data || eff.data.length === 0) {
      showSnackbar('error', 'Effect not found in cloud, cannot upload preset')
      return
    }

    const effId = await eff.data[0].id

    try {
      if (exists.length && exists.length > 0) {
        await cloud.put(`presets/${exists[0].id}`, {
          Name: preset.name,
          config: virtual.effect.config,
          effect: effId,
          user: localStorage.getItem('ledfx-cloud-userid')
        })
      } else {
        await cloud.post('presets', {
          Name: preset.name,
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

  const deletePresetCloud = async (presetsList: Record<string, Preset>, presetId: string) => {
    const preset = presetsList[presetId]
    if (!preset) return

    const existing = await cloud.get(
      `presets?user.username=${localStorage.getItem('ledfx-cloud-username')}&Name=${preset.name}`
    )
    const exists = await existing.data
    if (exists.length && exists.length > 0) {
      await cloud.delete(`presets/${exists[0].id}`)
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
      await getPresets(virtual.id)
    }
  }

  const handleAddPreset = async () => {
    await addPreset(virtual.id, name)
    await getPresets(virtual.id)
    await getFullConfig()
    setName('')
  }

  const handleRemovePreset = (presetId: string) => async () => {
    await deletePreset(effectType, presetId)
    await getPresets(virtual.id)
  }

  const handleActivatePreset =
    (virtId: string, category: 'ledfx_presets' | 'user_presets', presetId: string) => async () => {
      await activatePreset(virtId, category, effectType, presetId)
      await getPresets(virtual.id)
      setName('')
    }

  const checkPresetNameExists = (presetName: string): boolean => {
    const ledfxPresets = presets.ledfx_presets || {}
    const userPresets = presets.user_presets || {}

    return (
      Object.keys(ledfxPresets).includes(presetName) ||
      Object.values(ledfxPresets).some((p) => p.name === presetName) ||
      Object.keys(userPresets).includes(presetName) ||
      Object.values(userPresets).some((p) => p.name === presetName)
    )
  }

  const isDefaultPreset = (presetName: string): boolean => {
    const ledfxPresets = presets.ledfx_presets || {}
    return (
      Object.keys(ledfxPresets).includes(presetName) ||
      Object.values(ledfxPresets).some((p) => p.name === presetName)
    )
  }

  const renderPresetsButton = (
    presetsList: Record<string, Preset> | undefined,
    category: 'ledfx_presets' | 'user_presets'
  ) => {
    if (!presetsList || Object.keys(presetsList).length === 0) {
      return (
        <Button style={{ margin: '1rem 0 0.5rem 1rem' }} size="medium" disabled>
          No {category === 'ledfx_presets' ? 'LedFx' : 'User'} Presets
        </Button>
      )
    }

    return Object.entries(presetsList).map(([presetId, preset]) => (
      <Grid key={presetId}>
        {category === 'user_presets' ? (
          <PresetButton
            buttonColor={preset.active ? 'primary' : 'inherit'}
            label={preset.name}
            delPreset={handleRemovePreset(presetId)}
            uploadPresetCloud={() => uploadPresetCloud(presetsList, presetId)}
            deletePresetCloud={() => deletePresetCloud(presetsList, presetId)}
            onClick={handleActivatePreset(virtual.id, category, presetId)}
          />
        ) : (
          <Button
            size="medium"
            color={preset.active ? 'primary' : 'inherit'}
            onClick={handleActivatePreset(virtual.id, category, presetId)}
          >
            {preset.name}
          </Button>
        )}
      </Grid>
    ))
  }

  useEffect(() => {
    getVirtuals()
    if (virtual.id) getPresets(virtual.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtual.id, effectType])

  useEffect(() => {
    if (features.cloud && isLogged) {
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
            const userPresets = presets.user_presets || {}
            if (!userPresets[p.effect.ledfx_id]) {
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
      await getPresets(virtual.id)
      await getSystemConfig()
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLogged && features.cloud) getCloudConfigs()
  }, [isLogged, features.cloud])

  const hasUserPresets = cloudConfigs.some(
    (c: any) => c.config.user_presets && Object.keys(c.config.user_presets).length > 0
  )

  return (
    <Card variant="outlined" className="step-device-three" style={style}>
      <CardHeader
        style={{ margin: '0' }}
        title="Presets"
        subheader="Explore different effect configurations or create your own."
      />
      <CardContent>
        <Grid spacing={2} container>
          {renderPresetsButton(presets.ledfx_presets, 'ledfx_presets')}
        </Grid>
        <Divider style={{ margin: '1rem 0' }} />
        <Grid spacing={2} container>
          {renderPresetsButton(presets.user_presets, 'user_presets')}
          <Grid>
            <Popover
              popoverStyle={{ padding: '0.5rem' }}
              color="primary"
              variant="outlined"
              onSingleClick={() => {}}
              content={
                <TextField
                  autoFocus
                  onKeyDown={(e: any) => e.key === 'Enter' && handleAddPreset()}
                  error={checkPresetNameExists(name)}
                  size="small"
                  id="presetNameInput"
                  label={
                    isDefaultPreset(name)
                      ? 'Default presets are readonly'
                      : checkPresetNameExists(name)
                        ? 'Preset Already Exists'
                        : 'Add Custom Preset'
                  }
                  style={{ marginRight: '1rem', flex: 1 }}
                  value={name}
                  onChange={(e) => {
                    const newName = e.target.value
                    setName(newName)
                    setValid(!checkPresetNameExists(newName))
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
              confirmDisabled={name.length === 0 || checkPresetNameExists(name) || !valid}
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
          {features.cloud && isLogged && (
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

          {hasUserPresets && (
            <>
              <Divider style={{ margin: '0.5rem 0' }} />
              <Popover
                onConfirm={async () => {
                  await setSystemConfig({ user_presets: {} })
                  await getPresets(virtual.id)
                  await getSystemConfig()
                }}
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
