import { useState } from 'react';
import { Button } from '@material-ui/core';
import Tour from 'reactour';

const steps = [
  {
    selector: '.step-zero',
    content: (
      <div>
        <h2>LedFx Guide</h2>
        Now we are able to create guides for you, to explain every little aspect
        of LedFx
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
        <h2>Bottom Navigation</h2>
        Access your views here
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
        <h2>Top-Menu</h2>
        for global actions
        and access to page-specific tours
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
        <h2>Add Quick-Dial button</h2>
        Text for adding Devices, Virtuals, Scenes, (and integrations?)
        Note: Desktop hover, mobile click
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  },
];

const TourHome:React.FC = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsTourOpen(true)} variant="outlined" className="step-zero">
        Tour
      </Button>
      <Tour
        steps={steps}
        accentColor="#800000"
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
    </>
  );
};

export default TourHome;
