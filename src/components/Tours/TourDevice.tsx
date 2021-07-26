import { useState } from 'react';
import { Button, MenuItem, ListItemIcon } from '@material-ui/core';
import Tour from 'reactour';
import { InfoRounded } from '@material-ui/icons';

const steps = [
  {
    selector: '.step-device-one',
    content: (
      <div>
        <h2>Effect Type</h2>
        Text for effect Type
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-device-two',
    content: (
      <div>
        <h2>Transitions</h2>
        Text for Transitions
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-device-three',
    content: (
      <div>
        <h2>Presets</h2>
        Text for Presets
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-device-four',
    content: (
      <div>
        <h2>Frequency Range</h2>
        Text for Frequency Range
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
];

const TourDevice: React.FC = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  return (
    <>
      <MenuItem onClick={() => setIsTourOpen(true)}>
        <ListItemIcon>
          <InfoRounded />
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

export default TourDevice;
