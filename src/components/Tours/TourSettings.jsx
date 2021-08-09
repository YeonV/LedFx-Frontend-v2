import { useState } from 'react';
import { MenuItem, ListItemIcon, Badge } from '@material-ui/core';
import Tour from 'reactour';
import { InfoRounded } from '@material-ui/icons';
import useStore from '../../utils/apiStore';

const steps = [
  {
    selector: '.step-settings-one',
    content: (
      <div>
        <h2>Audio Device</h2>
        Select your audio input device here.
        <p>
          Note: Additional Informations incoming
        </p>
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-settings-two',
    content: (
      <div>
        <h2>Frontend FPS</h2>
        FPS sent to the frontend to render the PixelGraphs
        <p>
          Note: Low-end devices might struggle with too much data.
          Keep it at maximum, if everything runs smooth.
        </p>
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-settings-three',
    content: (
      <div>
        <h2>Frontend Max Pixel Length</h2>
        Pixels per device sent to the frontend to render the PixelGraphs
        <p>
          Note: Low-end devices might struggle with too much data.
        </p>
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-settings-four',
    content: (
      <div>
        <h2>Control Buttons</h2>
        No Explanation needed
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-settings-five',
    content: (
      <div>
        <h2>WLED Integration</h2>
        Finetune how LedFx should handle your WLEDs
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
];

const TourSettings = ({ cally }) => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const setTour = useStore((state) => state.setTour);
  const invisible = useStore((state) => state.tours.settings);
  return (
    <>
      <MenuItem onClick={(e) => { 
        setIsTourOpen(true); 
        cally(e);
        setTour("settings");
        }}>
        <ListItemIcon>
          <Badge variant="dot" color="primary" invisible={invisible}>
            <InfoRounded />
          </Badge>
        </ListItemIcon>
        Tour
      </MenuItem>
      <Tour
        steps={steps}
        accentColor="#800000"
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
    </>
  );
};

export default TourSettings;
