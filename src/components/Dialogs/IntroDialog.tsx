/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/indent */
import Dialog from '@mui/material/Dialog'
import { useEffect, useState } from 'react'
import {
  DialogContent,
  Stack,
  Typography,
  useMediaQuery,
  // useTheme,
} from '@mui/material'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import Button from '@mui/material/Button'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import useStore from '../../store/useStore'
import logoCircle from '../../icons/png/128x128.png'
import wledLogo from '../../icons/png/wled.png'
import BladeScene from '../../pages/Home/BladeScene'
import BladeSchemaForm from '../SchemaForm/SchemaForm/SchemaForm'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import { SettingsRow } from '../../pages/Settings/SettingsComponents'

export default function IntroDialog({ handleScan, scanning, setScanning }: any) {
  const intro = useStore((state) => state.intro)
  const devices = useStore((state) => state.devices)
  // const virtuals = useStore((state) => state.virtuals)
  const setIntro = useStore((state) => state.setIntro)
  const setTour = useStore((state) => state.setTour)
  const setTourOpen = useStore((state) => state.setTourOpen)
  const small = useMediaQuery('(max-width: 720px)')
  const xsmall = useMediaQuery('(max-width: 600px)')

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
  const toggleGraphsMulti = useStore((state) => state.toggleGraphsMulti)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const onSystemSettingsChange = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig())
  }

  const schem = useStore((state) => state?.schemas?.audio?.schema)
  const schema = {
    properties: {
      audio_device: schem?.properties?.audio_device || {},
      delay_ms: schem?.properties?.delay_ms || {},
      min_volume: schem?.properties?.min_volume || {},
    },
  }
  const model = useStore((state) => state?.config?.audio)

  useEffect(() => {
    getSystemConfig()
  }, [])

  const [s, setS] = useState({} as Record<string, 'left' | 'right'>)

  const [steps, setSteps] = useState([
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
      key: 'bladeScene',
      title: 'Create a test Scene for a quick start?',
      icon: 'yz',
      label_left: 'Skip Blade Scene',
      label_right: <BladeScene onClick={() => handleNext()} />,
      action_left: handleNext,
      action_right: handleNext,
    },
    {
      key: 'audio',
      title: 'Select your Audio Device',
      icon: 'volumeUp',
      label_left: schema && (
        <BladeSchemaForm
          hideToggle
          schema={schema}
          model={model}
          onModelChange={(e) => {
            setSystemConfig({
              audio: e,
            }).then(() => getSystemConfig())
          }}
        />
      ),
      label_right: 'Apply',
      action_left: (): any => false,
      action_right: handleNext,
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
      },
    },
  ] as any)
  
  useEffect(() => {
    const ste = [
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
      s.gotWled === 'right' && {
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
      s.gotWled === 'right' && {
        key: 'wledScanning',
        title:
          scanning && scanning > -1
            ? `Scanning...${scanning}%`
            : `${devices && Object.keys(devices)?.length} new WLEDs found`,
        icon: 'wled',
        label_left: 'RESCAN',
        label_right: 'Continue',
        action_left: (): any => false,
        action_right: ()=> {
          setScanning(-1)
          handleNext()
        },
      },
      {
        key: 'bladeScene',
        title: 'Create a test Scene for a quick start?',
        icon: 'yz:logo2',
        label_left: 'Skip Blade Scene',
        label_right: <BladeScene onClick={() => handleNext()} />,
        action_left: handleNext,
        action_right: handleNext,
      },
      {
        key: 'audio',
        title: 'No Party yet? Adjust some Settings',
        icon: 'volumeUp',
        label_left: <div style={{ padding: '1rem'}}>{schema && (
          <BladeSchemaForm
            hideToggle
            schema={schema}
            model={model}
            onModelChange={(e) => {
              setSystemConfig({
                audio: e,
              }).then(() => getSystemConfig())
            }}
          />
        )}
        <SettingsRow
            title="Graphs (overkill)"
            checked={graphsMulti}
            onChange={() => toggleGraphsMulti()}
            style={{ fontSize: 16, paddingLeft: '0.25rem',}}
            direct
          />
        </div>,
        label_right: 'Apply',
        action_left: (): any => false,
        action_right: handleNext,
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
        },
      },
    ].filter((n: any) => n !== false)

    setSteps(ste)
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
            {!steps[activeStep].icon ||
            steps[activeStep].icon === 'wled'
              ? <img
                  width={128}
                  src={!steps[activeStep].icon ? logoCircle : wledLogo}
                  alt="logo-circle"
                />
              : <BladeIcon
                  intro
                  style={{ fontSize: 128 }}
                  name={steps[activeStep].icon}
                  
                />
            }

            <div>
              <Typography
                marginLeft={0}
                marginTop={5}
                marginBottom={5}
                variant={xsmall ? 'h4' : 'h3'}
              >
                {steps[activeStep].key === 'wledScanning'
                ? (scanning && scanning > -1)
                    ? `Scanning...${scanning}%`
                    : `${devices && Object.keys(devices)?.length} new WLEDs found` 
                :steps[activeStep].title}                
              </Typography>
            </div>
          </Box>
          <Stack direction="row" gap={3}>
            <Button
              size="small"
              onClick={(_e) => {
                steps[activeStep].action_left()
                setS((p: any) => ({
                  ...p,
                  [steps[activeStep].key]: 'left',
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
              {steps[activeStep].label_left}
            </Button>
            {typeof steps[activeStep].label_right === 'string' ? (
              <Button
                size="small"
                color="inherit"
                // color={1 === 1 ? 'primary' : 'inherit'}
                onClick={(_e) => {
                  steps[activeStep].action_right()
                  setS((p: any) => ({
                    ...p,
                    [steps[activeStep].key]: 'right',
                  }))
                }}
                sx={{
                  borderRadius: '3vh',
                  // borderColor: 1 ? theme.palette.primary.main : 'inherit',
                  borderColor: 'inherit',
                  textTransform: 'none',
                  marginLeft: small ? 0 : '1rem',
                  marginTop: small ? '1rem' : 0,
                  width: small ? '80vw' : 'min(40vw, 550px)',
                  minHeight: 'min(15vh, 120px)',
                  fontSize: '2rem',
                }}
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
                disabled={activeStep === steps.length - 1}
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
      </DialogContent>
    </Dialog>
  )
}
