import { useEffect, useState } from 'react'
import useStore from '../../store/useStore'
import BladeSchemaForm from '../../components/SchemaForm/SchemaForm/SchemaForm'
import { SettingsRow, SettingsSwitch } from './SettingsComponents'
import { Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
import { Delete, Visibility } from '@mui/icons-material'

const AudioCard = ({ className }: any) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const schema = useStore((state) => state?.schemas?.audio?.schema)
  const model = useStore((state) => state?.config?.audio)
  const perDeviceDelay = useStore((state) => state?.perDeviceDelay)
  const setPerDeviceDelay = useStore((state) => state.setPerDeviceDelay)
  const usePerDeviceDelay = useStore((state) => state?.usePerDeviceDelay)
  const setUsePerDeviceDelay = useStore((state) => state.setUsePerDeviceDelay)

  useEffect(() => {
    getSystemConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (usePerDeviceDelay && model?.audio_device && schema.properties?.audio_device?.enum) {
      if (
        (perDeviceDelay[schema.properties.audio_device?.enum[model.audio_device]] ||
          perDeviceDelay[schema.properties.audio_device?.enum[model.audio_device]] === 0) &&
        perDeviceDelay[schema.properties.audio_device?.enum[model.audio_device]] !== model.delay_ms
      ) {
        setSystemConfig({
          audio: {
            delay_ms: perDeviceDelay[schema.properties.audio_device?.enum[model.audio_device]]
          }
        }).then(() => getSystemConfig())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usePerDeviceDelay, model?.audio_device])

  return (
    <div className={className}>
      {schema && (
        <BladeSchemaForm
          hideToggle
          schema={schema}
          model={model}
          onModelChange={(e) => {
            setSystemConfig({
              audio: e
            }).then(() => getSystemConfig())
          }}
        />
      )}
      <SettingsRow title="Remember delay per device">
        <IconButton
          size="small"
          sx={{ pt: 0, mr: 1 }}
          onClick={() => {
            setDialogOpen(true)
          }}
        >
          <Visibility color="disabled" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ pt: 0, mr: 1 }}
          onClick={() => {
            setPerDeviceDelay({})
          }}
        >
          <Delete color="disabled" />
        </IconButton>
        <SettingsSwitch
          checked={usePerDeviceDelay}
          onChange={(e) => setUsePerDeviceDelay(e.target.checked)}
        />
      </SettingsRow>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg">
        <DialogTitle>Per Device Delay</DialogTitle>
        <DialogContent>
          {perDeviceDelay.length === 0 ? (
            <p>No per device delay set</p>
          ) : (
            Object.entries(perDeviceDelay).map(([key, value], i) => (
              <SettingsRow key={i} title={key} style={{ paddingLeft: '20px' }}>
                <TextField
                  sx={{ width: '70px', ml: 3 }}
                  variant="standard"
                  type="number"
                  value={value}
                  onChange={(e) =>
                    setPerDeviceDelay({
                      ...perDeviceDelay,
                      [key]: parseInt(e.target.value)
                    })
                  }
                />
              </SettingsRow>
            ))
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AudioCard
