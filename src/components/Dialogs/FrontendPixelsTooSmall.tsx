import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  MenuItem,
  Select,
  Tooltip,
  useTheme
} from '@mui/material'
import useStore from '../../store/useStore'
import {
  SettingsRow
  // SettingsSlider
} from '../../pages/Settings/SettingsComponents'
import useSliderStyles from '../SchemaForm/components/Number/BladeSlider.styles'
import { useLocation } from 'react-router-dom'
import { InfoRounded } from '@mui/icons-material'
// import { inverseLogScale, logScale } from '../../utils/helpers'

export default function FrontendPixelsTooSmall() {
  const sliderClasses = useSliderStyles()
  const location = useLocation()
  const showWarning = useStore((state) => state.uiPersist.warnings.lessPixels)
  const fPixels = useStore((state) => state.config.visualisation_maxlen)
  const showMatrix = useStore((state) => state.showMatrix)
  const virtuals = useStore((state) => state.virtuals)
  const open = useStore((state) => state.dialogs.lessPixels?.open || false)
  const toggleShowMatrix = useStore((state) => state.toggleShowMatrix)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const setShowWarning = useStore((state) => state.setWarnings)
  const theme = useTheme()

  const [pixelLength, setPixelLength] = useState(fPixels || 50)
  const [biggestDevice, setBiggestDevice] = useState({ id: '', pixels: 0 })
  const marks = [
    { value: 'select', label: 'select' },
    { value: 50, label: '50' },
    { value: 128, label: '128' },
    { value: 256, label: '256' },
    { value: 512, label: '512' },
    { value: 1024, label: '1K' },
    { value: 2048, label: '2K' },
    { value: 4096, label: '4K' },
    { value: 8192, label: '8K' },
    { value: 16384, label: '16K' },
    { value: 32768, label: '32K' },
    { value: 65535, label: '64K' }
  ]

  const setDialogOpenLessPixels = useStore((state) => state.setDialogOpenLessPixels)
  const setSystemSetting = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig())
  }
  const handleClose = () => setDialogOpenLessPixels(false)

  useEffect(() => {
    const tooBig = Object.keys(virtuals).filter(
      (v: any) => (virtuals[v].config.rows || 1) > 1 && virtuals[v]?.pixel_count > fPixels
    )
    const biggest = tooBig.reduce(
      (a: any, b: any) => (virtuals[a]?.pixel_count > virtuals[b]?.pixel_count ? a : b),
      0
    )
    if (fPixels && showMatrix && tooBig.length > 0 && fPixels < 4096) {
      setBiggestDevice({ id: biggest, pixels: virtuals[biggest]?.pixel_count })
      setDialogOpenLessPixels(true)
    }
    if (fPixels && showMatrix && tooBig.length === 0) {
      setDialogOpenLessPixels(false)
    }
  }, [showMatrix, fPixels, virtuals, setDialogOpenLessPixels, location])

  useEffect(() => {
    getSystemConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getSystemConfig()
    setPixelLength(fPixels)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fPixels])

  return (
    <Dialog
      open={showWarning && open}
      onClose={handleClose}
      aria-labelledby="about-dialog-title"
      aria-describedby="about-dialog-description"
      PaperProps={{
        style: { margin: '0 auto' }
      }}
    >
      <DialogTitle id="about-dialog-title">Not enough Pixels</DialogTitle>
      <DialogContent sx={{ paddingBottom: '28px' }}>
        <DialogContentText id="about-dialog-description" marginBottom={3}>
          {fPixels >= biggestDevice.pixels
            ? 'All good now'
            : `${biggestDevice.id} has ${biggestDevice.pixels} pixels, but the Frontend
          is configured to show only ${fPixels} pixels. Please increase the
          number of pixels`}
        </DialogContentText>
        <SettingsRow
          title="Show too-less-pixels Warning"
          checked={showWarning}
          onChange={() => setShowWarning('lessPixels', !showWarning)}
        />
        <SettingsRow
          title="Show Matrix on Devices page (beta)"
          checked={showMatrix}
          onChange={() => toggleShowMatrix()}
        />
        <SettingsRow title="Frontend Pixels" step="three">
          <Tooltip title="Use of high pixel counts in front end visualisation is strongly discouraged, and should not be used if access to the browser front end is from a client remote to the LedFx server.">
            <InfoRounded
              sx={{
                color: pixelLength > 4096 ? theme.palette.warning.main : 'inherit',
                cursor: 'pointer',
                verticalAlign: 'middle',
                mr: 2,
                fontSize: '1.2rem'
              }}
            />
          </Tooltip>
          <Select
            disableUnderline
            variant="standard"
            value={'select'}
            onChange={(e) =>
              e.target.value !== 'select' &&
              setSystemSetting('visualisation_maxlen', e.target.value)
            }
          >
            {marks.map((item: any) => (
              <MenuItem
                disabled={item.value === 'select'}
                key={item.value}
                value={item.value}
                sx={{ color: item.value > 4096 ? theme.palette.warning.main : 'inherit' }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Select>
          <Input
            disableUnderline
            className={sliderClasses.input}
            value={pixelLength}
            style={{ width: 70 }}
            margin="dense"
            onChange={(e) => {
              setPixelLength(parseInt(e.target.value, 10))
            }}
            onBlur={(e) => setSystemSetting('visualisation_maxlen', parseInt(e.target.value, 10))}
            sx={{
              '& input': {
                textAlign: 'right',
                color: pixelLength > 4096 ? theme.palette.warning.main : 'inherit'
              }
            }}
            inputProps={{
              min: 1,
              max: 4096,
              type: 'number',
              'aria-labelledby': 'input-slider'
            }}
          />
        </SettingsRow>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
