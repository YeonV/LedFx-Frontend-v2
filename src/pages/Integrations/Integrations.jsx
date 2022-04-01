import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useStore from '../../utils/apiStore';
import IntegrationCard from './IntegrationCard/IntegrationCard';
import NoYet from '../../components/NoYet';
import IntegrationCardSpotify from './IntegrationCard/IntegrationCardSpotify';

const useStyles = makeStyles((theme) => ({
  cardWrapper: {
    display: 'flex', flexWrap: 'wrap', margin: '-0.5rem', justifyContent: 'center'
  },
  '@media (max-width: 580px)' : {
    cardWrapper:{
      justifyContent: 'center'
    }
  }
}));

const Integrations = () => {
  const classes = useStyles();
  const getIntegrations = useStore((state) => state.getIntegrations);
  const integrations = useStore((state) => state.integrations);

  useEffect(() => {
    getIntegrations();
  }, [getIntegrations]);
  return (
    <div className={classes.cardWrapper}>
    {integrations && Object.keys(integrations).length ? Object.keys(integrations).map((integration, i) => 
      integrations[integration].type === 'spotify' 
        ? <IntegrationCardSpotify integration={integration} key={i} />
        : <IntegrationCard integration={integration} key={i} />
    ) : <NoYet type="Integration" />}
  </div>
  );
};

export default Integrations;
