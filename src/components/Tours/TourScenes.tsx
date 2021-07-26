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
        Text for Scenes
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
