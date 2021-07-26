import { useState } from 'react';
import { MenuItem, ListItemIcon } from '@material-ui/core';
import Tour from 'reactour';
import { InfoRounded } from '@material-ui/icons';

const steps = [
  {
    selector: '.step-integrations-one',
    content: (
      <div>
        <h2>Integrations</h2>
        Text for Integrations
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
];

const TourIntegrations: React.FC = () => {
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

export default TourIntegrations;
