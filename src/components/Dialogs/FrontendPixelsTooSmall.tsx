import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input
} from '@mui/material'
import useStore from '../../store/useStore'
import {
  SettingsRow
  // SettingsSlider
} from '../../pages/Settings/SettingsComponents'
import useSliderStyles from '../SchemaForm/components/Number/BladeSlider.styles'
import { useLocation } from 'react-router-dom'
// import { inverseLogScale, logScale } from '../../utils/helpers'

export default function FrontendPixelsTooSmall() {
  const sliderClasses = useSliderStyles()
  const location = useLocation()
  const showWarning = useStore((state) => state.uiPersist.warnings.lessPixels)
  const fPixels = useStore((state) => state.config.visualisation_maxlen)
  const showMatrix = useStore((state) => state.showMatrix)
  const virtuals = useStore((state) => state.virtuals)
  const alphaMatrix = useStore((state) => state.features.matrix)
  const open = useStore((state) => state.dialogs.lessPixels?.open || false)
  const toggleShowMatrix = useStore((state) => state.toggleShowMatrix)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const setShowWarning = useStore((state) => state.setWarnings)

  const [pixelLength, setPixelLength] = useState(fPixels || 50)
  const [biggestDevice, setBiggestDevice] = useState({ id: '', pixels: 0 })

  const setDialogOpenLessPixels = useStore(
    (state) => state.setDialogOpenLessPixels
  )
  const setSystemSetting = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig())
  }
  const handleClose = () => setDialogOpenLessPixels(false)

  useEffect(() => {
    const tooBig = Object.keys(virtuals).filter(
      (v: any) =>
        virtuals[v].config.rows > 1 && virtuals[v]?.pixel_count > fPixels
    )
    const biggest = tooBig.reduce(
      (a: any, b: any) =>
        virtuals[a]?.pixel_count > virtuals[b]?.pixel_count ? a : b,
      0
    )
    if (
      fPixels &&
      (showMatrix || alphaMatrix) &&
      tooBig.length > 0 &&
      fPixels < 4096
    ) {
      setBiggestDevice({ id: biggest, pixels: virtuals[biggest]?.pixel_count })
      setDialogOpenLessPixels(true)
    }
    if (fPixels && showMatrix && tooBig.length === 0) {
      setDialogOpenLessPixels(false)
    }
  }, [
    showMatrix,
    fPixels,
    virtuals,
    setDialogOpenLessPixels,
    location,
    alphaMatrix
  ])

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
          <Input
            disableUnderline
            className={sliderClasses.input}
            value={pixelLength}
            style={{ width: 100 }}
            margin="dense"
            onChange={(e) => {
              setPixelLength(parseInt(e.target.value, 10))
            }}
            onBlur={(e) =>
              setSystemSetting(
                'visualisation_maxlen',
                parseInt(e.target.value, 10)
              )
            }
            sx={{
              '& input': { textAlign: 'right' }
            }}
            inputProps={{
              min: 1,
              max: 16384,
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
