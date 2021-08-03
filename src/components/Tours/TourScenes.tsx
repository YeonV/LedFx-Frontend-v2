import { useState } from 'react';
import { MenuItem, ListItemIcon } from '@material-ui/core';
import Tour from 'reactour';
import { InfoRounded } from '@material-ui/icons';

const steps = [
  {
    selector: '.step-scenes-one',
    content: (
      <div>
        <h2>Scenes</h2>
        You can save the current state of LedFx as a scene,
        while giving it a name and optionally an image or an icon.
        <p>
          Note: This includes all active effects for all devices and their effect-settings.
        </p>
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
];

const TourScenes: React.FC = () => {
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

export default TourScenes;
