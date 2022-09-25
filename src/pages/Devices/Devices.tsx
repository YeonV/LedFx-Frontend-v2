/* eslint-disable no-plusplus */
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useStore from '../../store/useStore';
import DeviceCard from './DeviceCard/DeviceCard.wrapper';
import NoYet from '../../components/NoYet';
import ws from '../../utils/Websocket';

const useStyles = makeStyles((theme) => ({
  cardWrapper: {
    padding: theme.spacing(1),
    paddingTop: 0,
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '0.5rem',
    justifyContent: 'center',
  },
  '@media (max-width: 580px)': {
    cardWrapper: {
      justifyContent: 'center',
    },
  },
  '@media (max-width: 410px)': {
    cardWrapper: {
      padding: 0,
    },
  },
}));

const Devices = () => {
  const classes = useStyles();
  const getDevices = useStore((state) => state.getDevices);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const virtuals = useStore((state) => state.virtuals);
  const setPixelGraphs = useStore((state) => state.setPixelGraphs);
  const graphs = useStore((state) => state.graphs);

  useEffect(() => {
    getDevices();
    getVirtuals();
  }, [getDevices, getVirtuals]);

  useEffect(() => {
    const handleWebsockets = (e: any) => {
      if (e.detail === 'devices_updated') {
        getDevices();
      }
    };
    document.addEventListener('YZold', handleWebsockets);
    return () => {
      document.removeEventListener('YZold', handleWebsockets);
    };
  }, [getDevices]);

  useEffect(() => {
    const handleWebsockets = () => {
      const req = {
        event_type: 'devices_updated',
        id: 1,
        type: 'subscribe_event',
      };
      // console.log("Send");
      (ws as any).send(JSON.stringify(++req.id && req));
    };
    document.addEventListener('YZold', handleWebsockets);
    return () => {
      document.removeEventListener('YZold', handleWebsockets);
    };
  }, []);

  useEffect(() => {
    if (graphs) {
      setPixelGraphs(Object.keys(virtuals));
    }
  }, [graphs, setPixelGraphs]);

  return (
    <div className={classes.cardWrapper}>
      {virtuals && Object.keys(virtuals).length ? (
        Object.keys(virtuals).map((virtual, i) => (
          <DeviceCard virtual={virtual} key={i} index={i} />
        ))
      ) : (
        <NoYet type="Device" />
      )}
    </div>
  );
};

export default Devices;
