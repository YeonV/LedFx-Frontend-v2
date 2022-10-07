import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import {
  CardActions,
  Chip,
  CardContent,
  CardHeader,
  Switch,
} from '@material-ui/core';
import { Avatar } from '@mui/material';
import Popover from '../../../components/Popover/Popover';
import useStore from '../../../store/useStore';
import useIntegrationCardStyles from './IntegrationCard.styles';
import SpotifyAuthButton from '../../../components/Integrations/Spotify/SpotifyAuthButton';
import SpotifyScreen from '../Spotify/SpotifyScreen/SpotifyScreen';
import BladeIcon from '../../../components/Icons/BladeIcon/BladeIcon';
import { spotifyMe } from '../../../utils/spotifyProxies';

const IntegrationCardSpotify = ({ integration }: { integration: string }) => {
  const classes = useIntegrationCardStyles();
  const getIntegrations = useStore((state) => state.getIntegrations);
  const integrations = useStore((state) => state.integrations);
  const deleteIntegration = useStore((state) => state.deleteIntegration);
  const toggleIntegration = useStore((state) => state.toggleIntegration);
  const setMe = useStore((state) => state.setMe);
  const me = useStore((state) => state.spotify.me);
  const spAuthenticated = useStore((state) => state.spotify.spAuthenticated);
  const setDialogOpenAddIntegration = useStore(
    (state) => state.setDialogOpenAddIntegration
  );
  const player = useStore((state) => state.spotify.player);

  const [expanded, setExpanded] = useState(false);
  const variant = 'outlined';
  const color = 'inherit';

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDeleteDevice = (integ: string) => {
    deleteIntegration(integrations[integ].id).then(() => {
      getIntegrations();
    });
  };

  const handleEditIntegration = (integ: any) => {
    setDialogOpenAddIntegration(true, integ);
  };
  const handleActivateIntegration = (integ: any) => {
    toggleIntegration({
      id: integ.id,
    }).then(() => getIntegrations());
  };

  useEffect(() => {
    const getMe = async () => {
      const i = await spotifyMe();
      if (i) {
        setMe(i);
      }
    };
    getMe();
  }, [integrations[integration].status, spAuthenticated]);
  // eslint-disable-next-line no-console
  console.log('me', me);

  return integrations[integration]?.config ? (
    <Card className={classes.integrationCardPortrait}>
      <CardHeader
        title={integrations[integration].config.name}
        subheader={integrations[integration].config.description}
        // subheader={integrations[integration].status === 3
        //     ? 'Connecting...'
        //     : integrations[integration].status === 2
        //     ? 'Disconnecting'
        //     : integrations[integration].status === 1
        //     ? 'Connected'
        //     : integrations[integration].status === 0
        //     ? 'Disconnected'
        //     : 'Unknown'
        // }
        // avatar={
        //   <Avatar aria-label="recipe">
        //     <BladeIcon name="mdi:spotify" />
        //   </Avatar>
        // }
        action={
          <Switch
            aria-label="status"
            checked={integrations[integration].active}
            onClick={async () => {
              if ((window as any).Spotify && player && spAuthenticated) {
                if (!integrations[integration].active) {
                  await player.connect();
                } else {
                  await player.disconnect();
                }
              }
              return handleActivateIntegration(integrations[integration]);
            }}
          />
        }
      />

      {me?.images && integrations[integration].status === 1 && spAuthenticated && (
        <CardContent>
          <Chip
            avatar={<Avatar src={me.images[0].url} />}
            label={me.display_name}
            variant="outlined"
          />
        </CardContent>
      )}

      <CardActions style={{ alignSelf: 'flex-end' }}>
        <div className={classes.integrationCardContainer}>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          <div className={classes.buttonBar}>
            <SpotifyAuthButton disabled={!integrations[integration].active} />
            <Popover
              variant={variant}
              color={color}
              onConfirm={() => handleDeleteDevice(integration)}
              className={classes.editButton}
            />

            <Button
              variant={variant}
              size="small"
              color={color}
              className={classes.editButton}
              onClick={() => handleEditIntegration(integration)}
            >
              <EditIcon />
            </Button>
            {/* <Button
              variant={variant}
              size="small"
              color={color}
              className={classes.editButton}
              disabled={integrations[integration].status !== 1 || !spAuthenticated}
              onClick={() => console.log('coming soon...')}
            >
              <AddIcon />
            </Button> */}
            <SpotifyScreen
              icon={<BladeIcon name="mdi:spotify" />}
              variant={variant}
              color={color}
              className={classes.editButton}
              disabled={
                integrations[integration].status !== 1 || !spAuthenticated
              }
            />
          </div>
        </div>

        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
          className={classes.buttonBarMobile}
        >
          <div className={classes.buttonBarMobileWrapper}>
            {integrations[integration].active && <SpotifyAuthButton />}
            <Popover
              variant={variant}
              color={color}
              onConfirm={() => handleDeleteDevice(integration)}
              className={classes.editButton}
            />
            <Button
              variant={variant}
              size="small"
              color={color}
              className={classes.editButtonMobile}
              onClick={() => handleEditIntegration(integration)}
            >
              <EditIcon />
            </Button>
            <SpotifyScreen
              icon={<AddIcon />}
              variant={variant}
              color={color}
              className={classes.editButton}
              disabled={
                integrations[integration].status !== 1 || !spAuthenticated
              }
            />
          </div>
        </Collapse>
      </CardActions>
    </Card>
  ) : null;
};

export default IntegrationCardSpotify;
