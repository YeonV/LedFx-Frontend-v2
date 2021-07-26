import { useState } from 'react';
import { MenuItem, ListItemIcon } from '@material-ui/core';
import Tour from 'reactour';
import { InfoRounded } from '@material-ui/icons';

const steps = [
  {
    selector: '.step-settings-one',
    content: (
      <div>
        <h2>Settings</h2>
        Text for AudioInput
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
        <h2>Settings</h2>
        Text for Frontend FPS
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
        <h2>Settings</h2>
        Text for Frontend Pixels
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
];

const TourSettings: React.FC = () => {
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

export default TourSettings;
