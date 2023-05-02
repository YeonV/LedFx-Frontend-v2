import Dialog from '@mui/material/Dialog'
import { useEffect, useRef, useState } from 'react'
import {
  DialogContent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import Button from '@mui/material/Button'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import useStore from '../../store/useStore'
import logoCircle from '../../icons/png/128x128.png'
import wledLogo from '../../icons/png/wled.png'
import BladeScene from '../../pages/Home/BladeScene'

export default function IntroDialog({ handleScan, scanning }: any) {
  const intro = useStore((state) => state.intro)
  const devices = useStore((state) => state.devices)
  // const virtuals = useStore((state) => state.virtuals)
  const setIntro = useStore((state) => state.setIntro)
  const setTour = useStore((state) => state.setTour)
  const small = useMediaQuery('(max-width: 720px)')
  const xsmall = useMediaQuery('(max-width: 600px)')

  // console.log('YZ', virtuals)
  const handleClose = () => {
    setIntro(false)
  }
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const onSystemSettingsChange = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig())
  }

  const steps = useRef([
    {
      key: 'setup',
      title: 'Start Setup-Assistant?',
      label_left: 'Nah, im an expert. Just let me in',
      label_right: 'Yes, please show me around',
      action_left: () => {
        handleClose()
      },
      action_right: handleNext,
    },
    {
      key: 'gotWled',
      title: 'Scan for WLEDs in network?',
      icon: 'wled',
      label_left: 'Nah, no WLEDs',
      label_right: 'Yes, please scan my network for WLEDs',
      action_left: handleNext,
      action_right: handleNext,
    },
    {
      key: 'wledSegs',
      title: 'Import Segments from WLED?',
      icon: 'wled',
      label_left: 'No, only main devices',
      label_right: 'Yes, import segments',
      action_left: () => {
        onSystemSettingsChange('create_segments', false)
        handleScan()
        setTour('home')
        handleNext()
      },
      action_right: () => {
        onSystemSettingsChange('create_segments', true)
        handleScan()
        handleNext()
      },
    },
    {
      key: 'wledScanning',
      title:
        scanning && scanning > -1
          ? `Scanning...${scanning}%`
          : `${devices && Object.keys(devices)?.length} WLEDs found`,
      icon: 'wled',
      label_left: 'Skip Introduction',
      label_right: 'Start Introduction',
      action_left: handleClose,
      action_right: () => {
        setTour('home')
        handleClose()
      },
    },
    {
      key: 'audio',
      title: 'Select your Audio Device',
      icon: 'wled',
      label_left: 'Skip Introduction',
      label_right: 'Start Introduction',
      action_left: handleClose,
      action_right: handleClose,
    },
    {
      key: 'scene',
      title: 'Test Scene',
      icon: 'wled',
      label_left: 'Skip Introduction',
      label_right: <BladeScene />,
      action_left: handleClose,
      action_right: handleClose,
    },
  ])

  const [s, setS] = useState({} as Record<string, 'left' | 'right'>)

  useEffect(() => {
    steps.current = [
      ...steps.current.filter((st: any) => {
        console.log(st)
        console.log(typeof steps.current[activeStep].label_right)

        return !st.key.startsWith('ywled')
      }),
    ]
  }, [s])

  return (
    <Dialog
      onClose={handleClose}
      open={intro}
      PaperProps={{
        style: { maxWidth: 'calc(100vw - 64px)' },
      }}
    >
      <DialogContent>
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              height: 300,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <img
              width={128}
              src={
                !steps.current[activeStep].icon
                  ? logoCircle
                  : (steps.current[activeStep].icon === 'wled' && wledLogo) ||
                    ''
              }
              alt="logo-circle"
            />
            <div>
              <Typography
                marginLeft={0}
                marginTop={5}
                marginBottom={5}
                variant={xsmall ? 'h4' : 'h3'}
              >
                {steps.current[activeStep].title}
              </Typography>
              {scanning > -1 ? (
                <Typography
                  color="GrayText"
                  marginLeft={xsmall ? 0 : 5}
                  variant="subtitle1"
                >
                  {`${devices && Object.keys(devices)?.length} WLEDs found`}
                </Typography>
              ) : (
                <Typography
                  color="GrayText"
                  marginLeft={xsmall ? 0 : 5}
                  variant="subtitle1"
                >
                  {' '}
                </Typography>
              )}
            </div>
          </Box>
          <Stack direction="row" gap={3}>
            <Button
              size="small"
              onClick={(_e) => {
                steps.current[activeStep].action_left()
                setS((p: any) => ({
                  ...p,
                  [steps.current[activeStep].key]: 'left',
                }))
              }}
              sx={{
                borderRadius: '3vh',
                textTransform: 'none',
                marginRight: small ? 0 : '1rem',
                width: small ? '80vw' : 'min(40vw, 550px)',
                minHeight: 'min(15vh, 120px)',
                fontSize: '2rem',
              }}
            >
              {steps.current[activeStep].label_left}
            </Button>
            {typeof steps.current[activeStep].label_right === 'string' ? (
              <Button
                size="small"
                color={1 ? 'primary' : 'inherit'}
                onClick={(_e) => {
                  steps.current[activeStep].action_right()
                  setS((p: any) => ({
                    ...p,
                    [steps.current[activeStep].key]: 'right',
                  }))
                }}
                sx={{
                  borderRadius: '3vh',
                  borderColor: 1 ? theme.palette.primary.main : 'inherit',
                  textTransform: 'none',
                  marginLeft: small ? 0 : '1rem',
                  marginTop: small ? '1rem' : 0,
                  width: small ? '80vw' : 'min(40vw, 550px)',
                  minHeight: 'min(15vh, 120px)',
                  fontSize: '2rem',
                }}
              >
                {steps.current[activeStep].label_right}
              </Button>
            ) : (
              steps.current[activeStep].label_right
            )}
          </Stack>
          <MobileStepper
            variant="dots"
            steps={steps.current.length}
            position="static"
            activeStep={activeStep}
            sx={{
              flexDirection: small ? 'column' : ' row',
              justifyContent: 'center',
              background: 'transparent',
              '& .MuiMobileStepper-dots': {
                display: activeStep > 0 ? 'flex' : 'none',
              },
            }}
            nextButton={
              <Button
                size="small"
                variant="text"
                onClick={handleNext}
                disabled={activeStep === steps.current.length - 1}
                sx={{ display: activeStep > 0 ? 'flex' : 'none' }}
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
                sx={{ display: activeStep > 0 ? 'flex' : 'none' }}
              >
                <ChevronLeft />
              </Button>
            }
          />
        </Box>
        {steps.current[activeStep].key === 'scene' && <BladeScene />}
      </DialogContent>
    </Dialog>
  )
}
