import { useState } from 'react';
import { Button } from '@material-ui/core';
import Tour from 'reactour';
import { Info } from '@material-ui/icons';
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

  const yzSchema = schema && schema.properties &&
    Object.keys(schema.properties)
      .map(sk => ({
        ...schema.properties[sk],
        id: sk,
      }))
      .sort((a) => (a.type === 'number') ? -1 : 1)
      .sort((a) => (a.type === 'integer') ? -1 : 1)
      .sort((a) => (a.type === 'string' && a.enum && a.enum.length) ? -1 : 1)
      .sort((a) => (a.type === 'color') ? -1 : 1)
      .sort((a) => a.id === 'color' ? -1 : 1)
      .sort((a) => a.id === 'gradient_name' ? -1 : 1)

  // console.log(schema.properties)
  const steps = yzSchema.map((p, i) => step({
    title: p.title,
    text: p.description,
    number: i
  }))
  
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
