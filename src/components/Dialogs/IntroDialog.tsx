import Dialog from '@mui/material/Dialog'
import { useEffect, useState } from 'react'
import {
  Chip,
  DialogContent,
  Stack,
  Typography,
  useMediaQuery
  // useTheme,
} from '@mui/material'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import Button from '@mui/material/Button'
import { CheckCircleOutlineOutlined, ChevronLeft, ChevronRight } from '@mui/icons-material'
import useStore from '../../store/useStore'
import logoCircle from '../../icons/png/128x128.png'
import banner from '../../icons/png/banner.png'
import wledLogo from '../../icons/png/wled.png'
import openrgbLogo from '../../icons/png/openrgb.png'
import launchpadLogo from '../../icons/png/launchpad.png'
import BladeScene from '../../pages/Home/BladeScene'
import BladeSchemaForm from '../SchemaForm/SchemaForm/SchemaForm'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import { SettingsRow } from '../../pages/Settings/SettingsComponents'

export default function IntroDialog({ handleScan, scanning, setScanning }: any) {
  const intro = useStore((state) => state.intro)
  const devices = useStore((state) => state.devices)
  const openRgbDevices = useStore((state) => state.openRgbDevices)
  const launchpadDevice = useStore((state) => state.launchpadDevice)
  // const virtuals = useStore((state) => state.virtuals)
  const scanForOpenRgbDevices = useStore((state) => state.scanForOpenRgbDevices)
  const scanForLaunchpadDevices = useStore((state) => state.scanForLaunchpadDevices)
  const setIntro = useStore((state) => state.setIntro)
  const setTour = useStore((state) => state.setTour)
  const setTourOpen = useStore((state) => state.setTourOpen)
  const reloadTheme = useStore((state) => state.ui.reloadTheme)
  const small = useMediaQuery('(max-width: 720px)')
  const xsmall = useMediaQuery('(max-width: 600px)')

  const viewMode = useStore((state) => state.viewMode)
  const setViewMode = useStore((state) => state.setViewMode)

  // console.log('YZ', virtuals)
  const handleClose = () => {
    setIntro(false)
  }
  // const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const graphsMulti = useStore((state) => state.graphsMulti)
  const assistant = useStore((state) => state.assistant)
  const coreParams = useStore((state) => state.coreParams)
  const isCC = coreParams && Object.keys(coreParams).length > 0
  const setAssistant = useStore((state) => state.setAssistant)
  const toggleGraphsMulti = useStore((state) => state.toggleGraphsMulti)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const onSystemSettingsChange = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig())
  }

  const setFeatures = useStore((state) => state.setFeatures)
  const features = useStore((state) => state.features)

  const schem = useStore((state) => state?.schemas?.audio?.schema)
  const schema = {
    properties: {
      audio_device: schem?.properties?.audio_device || {},
      delay_ms: schem?.properties?.delay_ms || {},
      min_volume: schem?.properties?.min_volume || {}
    }
  }
  const model = useStore((state) => state?.config?.audio)

  useEffect(() => {
    getSystemConfig()
    if (process.env.REACT_APP_LEDFX_ANDROID === 'true') {
      setAssistant('openRgb', false)
      setAssistant('launchpad', false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [s, setS] = useState({} as Record<string, 'left' | 'right'>)

  const [steps, setSteps] = useState([
    {
      key: 'setup',
      title:
        'Start Setup-Assistant?' + process.env.REACT_APP_LEDFX_ANDROID === 'true'
          ? ' (Android)'
          : '',
      label_left: 'Nah, im an expert. Just let me in',
      label_right: 'Yes, please show me around',
      action_left: () => {
        handleClose()
      },
      action_right: handleNext
    },
    {
      key: 'gotWled',
      title: 'Scan for Devices?',
      icon: 'wled',
      label_left: 'No',
      label_right: 'Yes',
      action_left: handleNext,
      action_right: handleNext
    },
    {
      key: 'bladeScene',
      title: 'Create a test Scene for a quick start?',
      icon: 'yz',
      label_left: 'Skip Blade Scene',
      label_right: <BladeScene onClick={() => handleNext()} />,
      action_left: handleNext,
      action_right: handleNext
    },
    {
      key: 'audio',
      title: 'Select your Audio Device',
      icon: 'volumeUp',
      label_left: 'Apply',
      label_right: 'Apply',
      action_left: (): any => false,
      action_right: handleNext
    },
    {
      key: 'tour',
      title: 'Initial Setup complete!',
      label_left: 'Skip Introduction',
      label_right: 'Start Introduction',
      action_left: () => {
        setTourOpen('home', false)
        handleClose()
      },
      action_right: () => {
        setTourOpen('home', true)
        handleClose()
      }
    }
  ] as any)

  useEffect(() => {
    const ste = [
      {
        key: 'setup',
        title:
          'Start Setup Assistant' +
          (process.env.REACT_APP_LEDFX_ANDROID === 'true' ? ' for Android?' : ' ?'),
        label_left: 'Skip',
        label_right: 'Yes',
        action_left: () => {
          handleClose()
        },
        action_right: handleNext
      },
      isCC ?? {
        key: 'theme',
        title: 'Choose your Theme',
        label_left: 'Lightmode',
        label_right: 'Darkmode',
        action_left: () => {
          window.localStorage.setItem('ledfx-theme', 'LightBw')
          reloadTheme()
          handleNext()
        },
        action_right: () => {
          window.localStorage.setItem('ledfx-theme', 'DarkBw')
          reloadTheme()
          handleNext()
        }
      },
      {
        key: 'gotWled',
        title: 'Scan for devices?',
        icon: 'wled',
        label_left: 'Skip',
        label_right: 'Yes',
        action_left: () => {
          setTour('home')
          handleNext()
        },
        action_right: () => {
          onSystemSettingsChange('create_segments', assistant.wledSegments)
          if (assistant.launchpad) scanForLaunchpadDevices()
          if (assistant.openRgb) scanForOpenRgbDevices()
          if (assistant.wled) setScanning(0)
          if (assistant.wled) handleScan()
          handleNext()
        }
      },
      // s.gotWled === 'right' && {
      //   key: 'wledSegs',
      //   title: 'Import Segments from WLED?',
      //   icon: 'wled',
      //   label_left: 'No, only main devices',
      //   label_right: 'Yes, import segments',
      //   action_left: () => {
      //     handleScan()
      //     setTour('home')
      //     handleNext()
      //   },
      //   action_right: () => {
      //     handleScan()
      //     handleNext()
      //   },
      // },
      s.gotWled === 'right' && {
        key: 'wledScanning',
        title: `${devices && Object.keys(devices)?.length}`,
        icon: 'wled',
        label_left: 'Re-Scan',
        label_right: 'Continue',
        action_left: handleBack,
        action_right: () => {
          setScanning(-1)
          handleNext()
        }
      },
      {
        key: 'bladeScene',
        title: 'Create a test Scene for a quick start?',
        icon: 'yz:logo2',
        label_left: 'Skip Blade Scene',
        label_right: <BladeScene onClick={() => handleNext()} />,
        action_left: handleNext,
        action_right: handleNext
      },
      {
        key: 'audio',
        title: 'Adjust some Settings',
        icon: 'tune',
        label_right: graphsMulti ? 'Go to Devices' : 'Confirm',
        action_left: (): any => false,
        action_right: () => handleNext()
      },
      {
        key: 'tour',
        icon: 'checkCircleOutlined',
        title: 'Initial Setup complete!',
        label_left: 'Skip Introduction',
        label_right: 'Start Introduction',
        action_left: () => {
          setTourOpen('home', false)
          handleClose()
        },
        action_right: () => {
          setTourOpen('home', true)
          handleClose()
        }
      }
    ].filter((n: any) => n !== false)

    setSteps(ste)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s, graphsMulti, assistant])

  return (
    <Dialog
      onClose={handleClose}
      open={intro || Object.keys(devices).length === 0}
      PaperProps={{
        style: { maxWidth: 'calc(100vw - 64px)' }
      }}
    >
      <DialogContent>
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: 'column'
            }}
          >
            {!steps[activeStep].icon || steps[activeStep].icon === 'wled' ? (
              <Stack direction="row">
                <img
                  width={activeStep === 0 ? (small ? 128 : 300) : 128}
                  height="auto"
                  src={
                    activeStep === 0
                      ? small
                        ? logoCircle
                        : banner
                      : !steps[activeStep].icon
                        ? logoCircle
                        : wledLogo
                  }
                  alt="logo-circle"
                />
                {activeStep === 0 ? (
                  <Stack marginLeft={3}>
                    <Chip
                      sx={{
                        justifyContent: 'flex-start',
                        padding: '0 0.5rem',
                        margin: '5px'
                      }}
                      icon={<CheckCircleOutlineOutlined />}
                      label="Free"
                      variant="filled"
                    />
                    <Chip
                      sx={{
                        justifyContent: 'flex-start',
                        padding: '0 0.5rem',
                        margin: '5px'
                      }}
                      avatar={<CheckCircleOutlineOutlined />}
                      label="OpenSource"
                      variant="filled"
                    />
                    <Chip
                      sx={{
                        justifyContent: 'flex-start',
                        padding: '0 0.5rem',
                        margin: '5px'
                      }}
                      avatar={<CheckCircleOutlineOutlined />}
                      label="CrossPlatform"
                      variant="filled"
                    />
                  </Stack>
                ) : null}
              </Stack>
            ) : (
              <BladeIcon intro style={{ fontSize: 128 }} name={steps[activeStep].icon} />
            )}

            <div>
              <Typography
                marginLeft={0}
                marginTop={5}
                marginBottom={0}
                variant={xsmall ? 'h4' : 'h3'}
                textAlign={small ? 'center' : 'left'}
              >
                {steps[activeStep].key === 'wledScanning' ? (
                  <>
                    New Devices found:
                    <br />
                  </>
                ) : (
                  steps[activeStep].title
                )}
              </Typography>
              {steps[activeStep].key === 'wledScanning' && (
                <Typography
                  marginLeft={0}
                  marginTop={1}
                  marginBottom={3}
                  variant="h5"
                  textAlign={small ? 'center' : 'left'}
                >
                  <span
                    style={{
                      textAlign: 'right',
                      marginRight: '0.5rem',
                      width: 30,
                      display: 'inline-block'
                    }}
                  >
                    {devices && Object.keys(devices)?.length}
                  </span>
                  <span>WLEDs</span>
                  {openRgbDevices.length > 1 && (
                    <>
                      <br />
                      <span
                        style={{
                          textAlign: 'right',
                          marginRight: '0.5rem',
                          width: 30,
                          display: 'inline-block'
                        }}
                      >
                        {openRgbDevices.length}
                      </span>
                      OpenRGB Devices
                    </>
                  )}
                  {launchpadDevice !== '' && (
                    <>
                      <br />
                      <span
                        style={{
                          textAlign: 'right',
                          marginRight: '0.5rem',
                          width: 30,
                          display: 'inline-block'
                        }}
                      >
                        1
                      </span>
                      Launchpad
                    </>
                  )}
                </Typography>
              )}
            </div>
          </Box>
          {steps[activeStep].key === 'audio' && (
            <div
              style={{
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: small ? 'wrap' : 'nowrap'
              }}
            >
              <Box
                sx={[
                  small
                    ? {
                        flexBasis: '100%'
                      }
                    : {
                        flexBasis: '48%'
                      }
                ]}
              >
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
              </Box>
              <Box
                sx={[
                  small
                    ? {
                        mt: 2
                      }
                    : {
                        mt: 0
                      },
                  small
                    ? {
                        flexBasis: '100%'
                      }
                    : {
                        flexBasis: '48%'
                      }
                ]}
              >
                <SettingsRow
                  title="Show Graphs (eats performance)"
                  checked={graphsMulti}
                  onChange={() => toggleGraphsMulti()}
                  style={{ fontSize: 16, paddingLeft: '0.25rem' }}
                />
                <SettingsRow
                  title="Background Waves (eats performance)"
                  checked={features.waves}
                  onChange={() => setFeatures('waves', !features.waves)}
                  style={{ fontSize: 16, paddingLeft: '0.25rem' }}
                />
                <SettingsRow
                  title="Scenes Playlist"
                  checked={features.scenePlaylist}
                  onChange={() => setFeatures('scenePlaylist', !features.scenePlaylist)}
                />
                <SettingsRow
                  title="Expert Mode"
                  checked={viewMode !== 'user'}
                  onChange={() =>
                    viewMode === 'user' ? setViewMode('expert') : setViewMode('user')
                  }
                />
              </Box>
            </div>
          )}
          {steps[activeStep].key === 'gotWled' && (
            <div
              style={{
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: small ? 'wrap' : 'nowrap'
              }}
            >
              <Box
                sx={[
                  small
                    ? {
                        flexBasis: '100%'
                      }
                    : {
                        flexBasis: '48%'
                      }
                ]}
              />
              <Box
                sx={[
                  {
                    pl: '1rem'
                  },
                  small
                    ? {
                        mt: 2
                      }
                    : {
                        mt: 0
                      },
                  small
                    ? {
                        flexBasis: '100%'
                      }
                    : {
                        flexBasis: '48%'
                      }
                ]}
              >
                <Stack direction="row" alignItems="center">
                  <img width={32} height="auto" src={wledLogo} alt="wled" />
                  <SettingsRow
                    title="WLED"
                    checked={assistant.wled}
                    onChange={() => setAssistant('wled', !assistant.wled)}
                    style={{ fontSize: 16, paddingLeft: '0.75rem' }}
                  />
                </Stack>
                <Stack direction="row" alignItems="center">
                  <img width={32} height="auto" src={wledLogo} alt="wled" />
                  <SettingsRow
                    title="WLED Segments"
                    checked={assistant.wledSegments}
                    onChange={() => setAssistant('wledSegments', !assistant.wledSegments)}
                    style={{ fontSize: 16, paddingLeft: '0.75rem' }}
                  />
                </Stack>
                {process.env.REACT_APP_LEDFX_ANDROID !== 'true' && (
                  <Stack direction="row" alignItems="center">
                    <img width={32} height="auto" src={openrgbLogo} alt="openrgb" />
                    <SettingsRow
                      title="OpenRGB"
                      checked={assistant.openRgb}
                      onChange={() => setAssistant('openRgb', !assistant.openRgb)}
                      style={{ fontSize: 16, paddingLeft: '0.75rem' }}
                    />
                  </Stack>
                )}
                {process.env.REACT_APP_LEDFX_ANDROID !== 'true' && (
                  <Stack direction="row" alignItems="center">
                    <img width={32} height="auto" src={launchpadLogo} alt="wled" />
                    <SettingsRow
                      title="Launchpad"
                      checked={assistant.launchpad}
                      onChange={() => setAssistant('launchpad', !assistant.launchpad)}
                      style={{ fontSize: 16, paddingLeft: '0.75rem' }}
                    />
                  </Stack>
                )}
              </Box>
            </div>
          )}
          <Stack
            direction={small ? 'column' : 'row'}
            gap={3}
            justifyContent="center"
            marginTop={3}
            marginBottom={3}
          >
            {steps[activeStep].label_left && (
              <Button
                size="small"
                onClick={(_e) => {
                  steps[activeStep].action_left()
                  setS((p: any) => ({
                    ...p,
                    [steps[activeStep].key]: 'left'
                  }))
                }}
                sx={[
                  {
                    borderRadius: '2rem',
                    textTransform: 'none',

                    // minHeight: 'min(15vh, 120px)',
                    fontSize: '2rem'
                  },
                  small
                    ? {
                        marginRight: 0
                      }
                    : {
                        marginRight: '1rem'
                      },
                  small
                    ? {
                        minWidth: '60vw'
                      }
                    : {
                        minWidth: 'min(30vw, 350px)'
                      }
                ]}
              >
                {steps[activeStep].key === 'wledScanning' && scanning && scanning > -1
                  ? `Scanning...${scanning}%`
                  : steps[activeStep].label_left}
              </Button>
            )}
            {typeof steps[activeStep].label_right === 'string' ? (
              <Button
                size="small"
                color="inherit"
                // color={1 === 1 ? 'primary' : 'inherit'}
                onClick={(_e) => {
                  steps[activeStep].action_right()
                  setS((p: any) => ({
                    ...p,
                    [steps[activeStep].key]: 'right'
                  }))
                }}
                sx={[
                  {
                    borderRadius: '2rem',

                    // borderColor: 1 ? theme.palette.primary.main : 'inherit',
                    borderColor: 'inherit',

                    textTransform: 'none',
                    marginTop: 0,

                    // minHeight: 'min(15vh, 120px)',
                    fontSize: '2rem'
                  },
                  small
                    ? {
                        marginLeft: 0
                      }
                    : {
                        marginLeft: '1rem'
                      },
                  small
                    ? {
                        minWidth: '60vw'
                      }
                    : {
                        minWidth: 'min(30vw, 350px)'
                      }
                ]}
              >
                {steps[activeStep].label_right}
              </Button>
            ) : (
              steps[activeStep].label_right
            )}
          </Stack>
          <MobileStepper
            variant="dots"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            sx={[
              {
                flexDirection: 'row',
                justifyContent: 'center',
                background: 'transparent'
              },
              activeStep > 0
                ? {
                    '& .MuiMobileStepper-dots': {
                      display: 'flex'
                    }
                  }
                : {
                    '& .MuiMobileStepper-dots': {
                      display: 'none'
                    }
                  }
            ]}
            nextButton={
              <Button
                size="small"
                variant="text"
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
                sx={[
                  activeStep > 0
                    ? {
                        display: 'flex'
                      }
                    : {
                        display: 'none'
                      }
                ]}
              >
                <ChevronRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                variant="text"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={[
                  activeStep > 0
                    ? {
                        display: 'flex'
                      }
                    : {
                        display: 'none'
                      }
                ]}
              >
                <ChevronLeft />
              </Button>
            }
          />
        </Box>
      </DialogContent>
    </Dialog>
  )
}
