import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useStore from '../../utils/apiStore';
import DeviceCard from './DeviceCard';


const useStyles = makeStyles((theme) => ({
  cardWrapper: {
    display: 'flex', flexWrap: 'wrap', margin: '-0.5rem',
  },
  '@media (max-width: 580px)' : {
    cardWrapper:{
      justifyContent: 'center'
    }
  }
}));

const Devices = () => {
  const classes = useStyles();
  const getVirtuals = useStore((state) => state.getVirtuals);
  const virtuals = useStore((state) => state.virtuals);
  const setPixelGraphs = useStore((state) => state.setPixelGraphs);
  const graphs = useStore((state) => state.graphs);

  useEffect(() => {
    getVirtuals();
  }, [getVirtuals]);

  useEffect(() => {
    if (graphs) {
      setPixelGraphs(Object.keys(virtuals))
    }
  }, [graphs, setPixelGraphs]);
  // }, [graphs, virtuals, setPixelGraphs]);

  return (
      <div className={classes.cardWrapper}>
        {virtuals && Object.keys(virtuals).length ? Object.keys(virtuals).map((virtual, i) => (
          <DeviceCard virtual={virtual} key={i} />
        )) : (<>No devices yet</>)}
      </div>
  );
};

export default Devices;
