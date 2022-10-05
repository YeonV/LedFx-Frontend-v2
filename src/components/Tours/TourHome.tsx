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
        around 😊
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
        <h2>Navigation</h2>
        Go to different pages from here
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
        <h2>Menu</h2>
        LedFx actions and settings can be found up here
        <ul style={{ paddingLeft: '1rem' }}>
          <li>👨‍🏫 You can access a tour for other pages in this menu</li>
          <li>
            👀 &apos;Enable Graphs&apos; to see a preview of the device LEDs.
            Leave it off if your browser struggles with too many pixels!
          </li>
        </ul>
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
        <h2>Devices Quick-Access</h2>
        Directly jump to a device
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
        <h2>The Big Plus Button</h2>
        This is where it all begins!
        <ul style={{ paddingLeft: '1rem' }}>
          <li>Add Device: Add a networked LED strip</li>
          <li>
            Add Virtual: Divide or merge your devices into one virtual strip
          </li>
          <li>Add Scene: Save the active effects of all devices</li>
          <li>
            Add Integration: Connect LedFx to other software (upcoming...)
          </li>
        </ul>
        I&apos;d recommend you now close this tour and add your first devices to
        LedFx 🎉
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
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
