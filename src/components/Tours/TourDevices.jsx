import { useState } from 'react';
import { MenuItem, ListItemIcon } from '@material-ui/core';
import { Badge } from '@mui/material'
import Tour from 'reactour';
import { InfoRounded } from '@material-ui/icons';
import useStore from '../../store/useStore';

const steps = [
  {
    selector: '.step-devices-one',
    content: (
      <div>
        <h2>Devices</h2>
        Add at least one device using the red button to get specific tour.
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-devices-two-0',
    content: (
      <div>
        <h2>Expand</h2>
        Click the down arrow to toggle options.
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-devices-three-0',
    content: (
      <div>
        <h2>Delete</h2>
        A device can be deleted using trashcan icon.
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-devices-four-0',
    content: (
      <div>
        <h2>Device-Settings</h2>
        The wrench will allow you to modify logical device settings including streaming mode
        , pixel count, and IP address.
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-devices-five-0',
    content: (
      <div>
        <h2>Virtual-Settings</h2>
        The Cogwheel will allow you to change various virtual device settings.
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-devices-six',
    content: (
      <div>
        <h2>Segment-Settings</h2>
        The slider bar icon will allow you to modify virtual device segments.
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
  {
    selector: '.step-devices-seven',
    content: (
      <div>
        <h2>Pixelgraph</h2>
        When actively streaming with an active sound source selected you will find
        the graph display here.
        <p>
          Note: Graphs are disabled by default to keep low-end devices safe.
          For high-end clients they can be enabled using the top-right-menu
        </p>
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
];

const TourDevices = ({ cally }) => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const setTour = useStore((state) => state.tours.setTour);
  const invisible = useStore((state) => state.tours.devices);
  return (
    <>
      <MenuItem onClick={(e) => { 
        setIsTourOpen(true); 
        cally(e);
        setTour("devices");
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



export default TourDevices;
