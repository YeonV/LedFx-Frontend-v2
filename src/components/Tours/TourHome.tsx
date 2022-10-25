import { useState } from 'react';
import { Button, useTheme } from '@material-ui/core';
import Tour from 'reactour';
import { Fab } from '@mui/material';
import { LiveHelp } from '@mui/icons-material';
import useStore from '../../store/useStore';

const steps = [
  {
    selector: '.step-zero',
    content: (
      <div>
        <h2>LedFx Tour</h2>
        Welcome to LedFx! Feel free to follow this tour and we&apos;ll show you
        how to get Started 😊
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-one',
    content: (
      <div>
        <h2>Add a Device</h2>
        To add a WLED device automaticly press "WLED-SCAN", otherwise press the plus 
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-two',
    content: (
      <div>
        <h2>Select effects</h2>
        Now go to your WLED device, by Simply clicking the Devices button in your Navigation Bar
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-three',
    content: (
      <div>
        <h2>Select effects</h2>
        Now click on Effect Type and choose one of the effects.
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-four',
    content: (
      <div>
        <h2>Setting up your audio device</h2>
        Go to settings on your Navigation Bar and then press "Audio Settings"
        Here you can add a audio Device
        When its your first time It's recommended to select an Audio output like youre headphones
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.setp-five',
    content: (
      <div>
        <h2>Now youre done!</h2>
        When you now play some Stuff from youre PC, your WLED lights should sync to the sound
        Feel now free, to play around and try out some stuff 
      </div>
    )
  }
];

const TourHome = ({
  className,
  variant = 'button',
}: {
  className?: string;
  variant?: string;
}) => {
  const theme = useTheme();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const setTour = useStore((state) => state.setTour);

  return (
    <>
      {variant === 'fab' ? (
        <Fab
          aria-label="guided-tour"
          className="step-zero"
          onClick={() => {
            setTour('home');
            setIsTourOpen(true);
          }}
          style={{
            margin: '8px',
          }}
          sx={{
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.light,
            },
          }}
        >
          <LiveHelp />
        </Fab>
      ) : (
        <Button
          variant="outlined"
          className={`step-zero ${className}`}
          onClick={() => {
            setTour('home');
            setIsTourOpen(true);
          }}
        >
          <LiveHelp sx={{ mr: '8px' }} />
          Start Tour
        </Button>
      )}
      <Tour
        steps={steps}
        accentColor={theme.palette.accent.main}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
    </>
  );
};

TourHome.defaultProps = {
  className: '',
  variant: 'button',
};

export default TourHome;
