import { useState } from 'react';
import { MenuItem, Button } from '@material-ui/core';
import Tour from 'reactour';
import { Info, InfoRounded } from '@material-ui/icons';
import useStore from '../../utils/apiStore';

const step = ({ title = 'Title', text = 'Text', number = 0 }) => (
  {
    selector: `.step-effect-${number}`,
    content: (
      <div>
        <h2>{title}</h2>
        {text}
      </div>
    ),
    style: {
      backgroundColor: '#303030',
    },
  }
);

const TourEffect = ({ schema }) => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const setTour = useStore((state) => state.setTour);
  const steps = Object.keys(schema.properties).map((p, i) => step({ 
    title: schema.properties[p].title, 
    text: schema.properties[p].description, 
    number: i }))
  return (
    <>
      <Button
        onClick={(e) => {
          setIsTourOpen(true);
          setTour("effect");
        }}
        variant="outlined"
        style={{ marginRight: '.5rem' }}
        className={'step-device-seven'}
      >
        <Info />
      </Button>
      <Tour
        steps={steps}
        accentColor="#800000"
        isOpen={isTourOpen}
        showNavigation={false}
        // badgeContent={()=><Info size="small" />}
        onRequestClose={() => setIsTourOpen(false)}
        showNumber={false}
      />
    </>
  );
};

export default TourEffect;
