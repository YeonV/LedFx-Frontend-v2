import { TextField, Dialog, Typography, Paper, InputAdornment } from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { LocalPlay } from '@mui/icons-material'
import useStore from '../../store/useStore'

const Bar = ({ handleClose, direct, maxWidth = 500, inputRef }: any) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const virtuals = useStore((state) => state.virtuals)
  const scenes = useStore((state) => state.scenes)
  const activateScene = useStore((state) => state.activateScene)
  const setFeatures = useStore((state) => state.setFeatures)
  const setShowFeatures = useStore((state) => state.setShowFeatures)
  const features = useStore((state) => state.features)
  const setViewMode = useStore((state) => state.setViewMode)
  const reloadTheme = useStore((state) => state.ui.reloadTheme)
  const setSmartBarOpen = useStore((state) => state.ui.bars && state.ui.setSmartBarOpen)

  // Define navigation pages
  const navigationPages = [
    { name: 'Home', path: '/', is_page: true },
    { name: 'Devices', path: '/Devices', is_page: true },
    { name: 'Scenes', path: '/Scenes', is_page: true },
    { name: 'Settings', path: '/Settings', is_page: true },
    { name: 'YZ-Flow', path: '/YZflow', is_page: true },
    { name: 'Playlists', path: '/Playlists', is_page: true },
    { name: 'Integrations', path: '/Integrations', is_page: true }
  ]

  const filterOptions = createFilterOptions({
    stringify: (option: any) => {
      if (Object.keys(option).indexOf('is_device') > -1) {
        return `device ${option.config.name}`
      } else if (Object.keys(option).indexOf('is_page') > -1) {
        return `page ${option.name}`
      } else {
        return `scene ${option.name}`
      }
    }
  })

  return (
    <div
      style={{
        width: '100%',
        maxWidth,
        height: 80,
        padding: '16px 0',
        overflow: 'hidden'
      }}
    >
      <Autocomplete
        autoComplete
        openOnFocus
        autoHighlight={!direct}
        disableCloseOnSelect={direct}
        id="smartbar-autocomplete"
        sx={{ width: '100%', maxWidth: maxWidth || 480, height: 50 }}
        options={[...navigationPages, ...Object.values(virtuals), ...Object.values(scenes)]}
        popupIcon={null}
        filterOptions={filterOptions}
        getOptionLabel={(option: any) => {
          if (Object.keys(option).indexOf('is_device') > -1) {
            return option.config.name
          } else if (Object.keys(option).indexOf('is_page') > -1) {
            return option.name
          } else {
            return option.name
          }
        }}
        onChange={(_event, value: any, _reason, _details) => {
          console.log('SmartBar selected value:', value)
          if (value && typeof value === 'object') {
            if (Object.keys(value).indexOf('is_device') > -1) {
              navigate(`/device/${value.id}`)
              if (!direct) handleClose()
            } else if (Object.keys(value).indexOf('is_page') > -1) {
              setSmartBarOpen(false)
              navigate(value.path)
              if (!direct) handleClose()
            } else {
              activateScene(
                Object.entries(scenes).filter(([_k, v]: any) => v.name === value.name)[0][0]
              )
              if (!direct) handleClose()
            }
          }
        }}
        onInputChange={(event, value) => {
          if (value === 'HackedByBlade!') {
            alert('DevMode activated!')
            setFeatures('dev', true)
          }
          if (features.dev) {
            if (value === 'clear') {
              setViewMode('user')
              setShowFeatures('dev', false)
              setShowFeatures('streamto', false)
              setShowFeatures('waves', false)
              setShowFeatures('effectfilter', false)
              setShowFeatures('cloud', false)
              setShowFeatures('wled', false)
              setShowFeatures('integrations', false)
              setShowFeatures('spotify', false)
              setShowFeatures('youtube', false)
              setShowFeatures('webaudio', false)
              setFeatures('streamto', false)
              setFeatures('waves', false)
              setFeatures('cloud', false)
              setFeatures('effectfilter', false)
              setFeatures('wled', false)
              setFeatures('dev', false)
              setFeatures('integrations', false)
              setFeatures('spotify', false)
              setFeatures('webaudio', false)
              setFeatures('beta', false)
              setFeatures('alpha', false)
              window.localStorage.removeItem('ledfx-theme')
              window.localStorage.setItem('BladeMod', '0')
              window.location.reload()
            }
            if (value === 'BladeCloud') {
              setShowFeatures('cloud', true)
            }
            if (value === 'BladeWled') {
              setShowFeatures('wled', true)
            }
            if (value === 'BladeIntegrations') {
              setShowFeatures('integrations', true)
            }
            if (value === 'BladeSpotify') {
              setShowFeatures('spotify', true)
            }
            if (value === 'BladeYoutube') {
              setShowFeatures('youtube', true)
            }
            if (value === 'BladeWebaudio') {
              setShowFeatures('webaudio', true)
            }
            if (value === 'BladeWaves') {
              setShowFeatures('waves', true)
            }
            if (value === 'BladeStreamTo') {
              setShowFeatures('streamto', true)
            }
            if (value === 'BladeEffectFilter') {
              setShowFeatures('effectfilter', true)
            }
            if (value === 'BladeAlpha') {
              setShowFeatures('alpha', true)
            }
            if (value === 'BladeAlpha!') {
              setShowFeatures('alpha', false)
            }
            if (
              value.startsWith('theme:') &&
              [
                'DarkRed',
                'DarkOrange',
                'LightRed',
                'LightBlue',
                'DarkGreen',
                'DarkBlue',
                'DarkGrey',
                'DarkPink',
                'DarkBw',
                'LightBw'
              ].indexOf(value.replace('theme:', '')) > -1
            ) {
              window.localStorage.setItem('ledfx-theme', value.replace('theme:', ''))
              reloadTheme()
            }
          }
          if (value === 'BladeIsYeon') {
            setViewMode('expert')
            setShowFeatures('dev', true)
            setShowFeatures('streamto', true)
            setShowFeatures('cloud', true)
            setShowFeatures('effectfilter', true)
            setShowFeatures('waves', true)
            setShowFeatures('wled', true)
            setShowFeatures('integrations', true)
            setShowFeatures('spotify', true)
            setShowFeatures('youtube', true)
            setShowFeatures('webaudio', true)
            setShowFeatures('alpha', true)
            setShowFeatures('beta', true)
            setFeatures('streamto', true)
            setFeatures('waves', true)
            setFeatures('cloud', true)
            setFeatures('wled', true)
            setFeatures('integrations', true)
            setFeatures('effectfilter', true)
            setFeatures('spotify', true)
            setFeatures('webaudio', true)
            setFeatures('beta', true)
            setFeatures('alpha', true)
            setFeatures('matrix', true)
            window.localStorage.setItem('ledfx-theme', 'DarkRed')
            window.location.reload()
          }
        }}
        renderOption={(props, option: any) => {
          const isDevice = Object.keys(option).indexOf('is_device') > -1
          const isPage = Object.keys(option).indexOf('is_page') > -1
          const actionText = isDevice ? 'jump to ' : isPage ? 'jump to ' : 'activate '
          const typeText = isDevice ? 'Device' : isPage ? 'Page' : 'Scene'

          return (
            <Box
              component="li"
              {...props}
              sx={{
                color: theme.palette.text.secondary,
                width: '100%',
                padding: '5px 50px',
                '&&&': { justifyContent: 'space-between' }
              }}
            >
              <Typography variant="body1"> {option.config?.name || option.name} </Typography>
              <div>
                <Typography style={{ opacity: 0.6 }} variant="caption">
                  {actionText}
                </Typography>
                <Typography
                  style={{
                    opacity: 0.6,
                    border: '1px solid',
                    borderRadius: 5,
                    padding: '2px 5px'
                  }}
                  variant="caption"
                >
                  {typeText}
                </Typography>
              </div>
            </Box>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 1 }}>
                    <LocalPlay />
                  </InputAdornment>
                )
              },
              htmlInput: {
                ...params.inputProps,
                autoComplete: 'off'
              }
            }}
            inputRef={inputRef}
            autoFocus={!direct}
            color="primary"
            style={{ borderRadius: '50%' }}
            label="SmartBar"
            placeholder="Jump to page / device or activate scene"
          />
        )}
        slots={{
          paper: ({ children }) => (
            <Paper
              style={{
                width: 'calc(100% + 20px)',
                maxWidth: direct ? maxWidth || 480 : maxWidth || 500,
                marginLeft: 0,
                marginRight: direct ? 0 : -10,
                background: theme.palette.background.paper
              }}
            >
              {children}
            </Paper>
          )
        }}
      />
    </div>
  )
}

const SmartBar = ({
  open = false,
  setOpen = undefined,
  direct = false,
  maxWidth = 500,
  inputRef = undefined
}: {
  open?: boolean
  setOpen?: any
  direct?: boolean
  maxWidth?: any
  inputRef?: any
}) => {
  const handleClose = () => {
    console.log('Closing SmartBar')
    if (setOpen !== undefined) setOpen(false)
  }

  return direct ? (
    <Bar direct maxWidth={maxWidth} />
  ) : open !== undefined && setOpen ? (
    <Dialog
      PaperProps={{
        style: {
          alignSelf: 'flex-start',
          marginTop: '75px',
          width: '100%',
          maxWidth
        }
      }}
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="form-dialog-title"
    >
      <Bar handleClose={() => handleClose} inputRef={inputRef} />
    </Dialog>
  ) : (
    <>Failed</>
  )
}

export default SmartBar
