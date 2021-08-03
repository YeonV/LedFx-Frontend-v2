import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useStore from '../../utils/apiStore';
import DeviceCard from './DeviceCard/DeviceCard';
import NoYet from '../../components/NoYet';

const useStyles = makeStyles((theme) => ({
  cardWrapper: {
    padding: theme.spacing(1),
    display: 'flex', flexWrap: 'wrap', margin: '-0.5rem', justifyContent: 'center'
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

  return (
      <div className={classes.cardWrapper}>
        {virtuals && Object.keys(virtuals).length ? Object.keys(virtuals).map((virtual, i) => (
          <DeviceCard virtual={virtual} key={i} index={i} />
        )) : (<NoYet type="Device" />)}
      </div>
  );
};

export default Devices;
