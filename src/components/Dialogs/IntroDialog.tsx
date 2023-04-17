import Dialog from '@mui/material/Dialog';
import { useState } from 'react';
import { DialogContent, Typography, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import useStore from '../../store/useStore';
import logoCircle from '../../icons/png/128x128.png';
import wledLogo from '../../icons/png/wled.png';

export default function IntroDialog({ handleScan, scanning }: any) {
  const intro = useStore((state) => state.intro);
  const devices = useStore((state) => state.devices);
  const setIntro = useStore((state) => state.setIntro);
  const setTour = useStore((state) => state.setTour);
  const small = useMediaQuery('(max-width: 720px)');
  const xsmall = useMediaQuery('(max-width: 600px)');

  const handleClose = () => {
    setIntro(false);
  };
  //   const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const setSystemConfig = useStore((state) => state.setSystemConfig);
  const onSystemSettingsChange = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig());
  };

  const steps = [
    {
      title: 'New to LedFx?',
      label_left: 'Nah, im an expert. Just let me in',
      label_right: 'Yes, please show me around',
      action_left: () => {
        handleClose();
      },
      action_right: handleNext,
    },
    {
      title: 'Scan for WLEDs in network?',
      icon: 'wled',
      label_left: 'Nah, no WLEDs',
      label_right: 'Yes, please scan my network for WLEDs',
      action_left: handleClose,
      action_right: handleNext,
    },
    {
      title: 'Import Segments from WLED?',
      icon: 'wled',
      label_left: 'No, only main devices',
      label_right: 'Yes, import segments',
      action_left: () => {
        onSystemSettingsChange('create_segments', false);
        handleScan();
        setTour('home');
        handleNext();
      },
      action_right: () => {
        onSystemSettingsChange('create_segments', true);
        handleScan();
        handleNext();
      },
    },
    {
      title:
        scanning && scanning > -1
          ? `Scanning...${scanning}%`
          : `${devices && Object.keys(devices)?.length} WLEDs found`,
      icon: 'wled',
      label_left: 'Skip Introduction',
      label_right: 'Start Introduction',
      action_left: handleClose,
      action_right: () => {
        setTour('home');
        handleClose();
      },
    },
  ];

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
              height: 256,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: xsmall ? 'column' : 'row',
            }}
          >
            <img
              width={128}
              src={steps[activeStep].icon === 'wled' ? wledLogo : logoCircle}
              alt="logo-circle"
            />
            <div>
              <Typography
                marginLeft={xsmall ? 0 : 5}
                marginTop={xsmall ? 3 : 0}
                variant={xsmall ? 'h4' : 'h3'}
              >
                {steps[activeStep].title}
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
          <MobileStepper
            variant={undefined}
            steps={2}
            position="static"
            activeStep={activeStep}
            sx={{
              flexDirection: small ? 'column' : ' row',
              background: 'transparent',
              '& .MuiMobileStepper-dots': {
                display: 'none',
              },
            }}
            nextButton={
              <Button
                size="small"
                onClick={steps[activeStep].action_right}
                // disabled={activeStep === maxSteps - 1}
                sx={{
                  borderRadius: '3vh',
                  textTransform: 'none',
                  marginLeft: small ? 0 : '1rem',
                  marginTop: small ? '1rem' : 0,
                  width: small ? '80vw' : '40vw',
                  minHeight: '15vh',
                  fontSize: '2rem',
                }}
              >
                {steps[activeStep].label_right}
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={steps[activeStep].action_left}
                // disabled={activeStep === 0}
                sx={{
                  borderRadius: '3vh',
                  textTransform: 'none',
                  marginRight: small ? 0 : '1rem',
                  width: small ? '80vw' : '40vw',
                  minHeight: '15vh',
                  fontSize: '2rem',
                }}
              >
                {steps[activeStep].label_left}
              </Button>
            }
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// export default function IntroDialog() {
//   const [open, setOpen] = useState(true);

//   //   const handleClickOpen = () => {
//   //     setOpen(true);
//   //   };

//   const handleClose = (value: string) => {
//     setOpen(false);
//   };

//   return (
//     <div>
//       {/* <Typography variant="subtitle1" component="div">
//         Selected: {selectedValue}
//       </Typography>
//       <br />
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Open simple dialog
//       </Button> */}
//       <SimpleDialog
//         selectedValue={selectedValue}
//         open={open}
//         onClose={handleClose}
//       />
//     </div>
//   );
// }
