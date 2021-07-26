import { useState } from 'react';
import { MenuItem, ListItemIcon } from '@material-ui/core';
import Tour from 'reactour';
import { InfoRounded } from '@material-ui/icons';

const steps = [
  {
    selector: '.step-device-one',
    content: (
      <div>
        <h2>Effect Type</h2>
        Choose an effect here.
        <ul style={{ paddingLeft: '1rem' }}>
          <li>BASIC: Simple, non reactive effects</li>
          <li>1.0: Audio reactive effects</li>
          <li>2D: [WIP] Effects designed for a 2D LED matrix</li>
          <li>BPM: Effects designed for the beat of your music</li>
          <li>2.0: Experimental new audio reactive effects</li>
        </ul>
        Each effect has plenty of settings to play with.
        You can tune effects to your liking.
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
        You can adjust the animation between effects
        Set to 0 for no animation
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
        These are a way to save and apply the settings of an effect.
        LedFx has some built in presets, and you can save your own too.
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
        Adjust the audio frequency range used for effects
        Most 1.0 effects will work with any frequency range you specify
        Some effects will bypass this and do their own internal analysis
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
