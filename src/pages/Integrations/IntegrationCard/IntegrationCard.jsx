import { useState } from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import useStore from '../../../utils/apiStore';
import Popover from '../../../components/Popover/Popover';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import {
  CardActions,
  CardHeader,
  Typography,
  Switch,
  Link,
  CardContent,
} from '@material-ui/core';
import { useIntegrationCardStyles } from './IntegrationCard.styles';
//import SpotifyView from '../Spotify/SpotifyAuth';

const IntegrationCard = ({ integration }) => {
  const classes = useIntegrationCardStyles();
  const getIntegrations = useStore((state) => state.getIntegrations);
  const integrations = useStore((state) => state.integrations);
  const deleteIntegration = useStore((state) => state.deleteIntegration);
  const toggleIntegration = useStore((state) => state.toggleIntegration);
  const setDialogOpenAddIntegration = useStore(
    (state) => state.setDialogOpenAddIntegration
  );

  const [expanded, setExpanded] = useState(false);
  const variant = 'outlined';
  const color = 'inherit';

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDeleteDevice = (integration) => {
    deleteIntegration(integrations[integration].id).then(() => {
      getIntegrations();
    });
  };

  const handleEditIntegration = (integration) => {
    setDialogOpenAddIntegration(true, integration);
  };
  const handleActivateIntegration = (integration) => {
    toggleIntegration({
      id: integration.id,
    }).then(() => getIntegrations());
  };

  return integrations[integration]?.config ? (
    <Card className={classes.integrationCardPortrait}>
      <CardHeader
        title={integrations[integration].config.name}
        subheader={integrations[integration].config.description}
        action={
          <Switch
            aria-label="status"
            checked={integrations[integration].active}
            onClick={() => handleActivateIntegration(integrations[integration])}
          />
        }
      />
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
          </div>
        </div>

        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
          className={classes.buttonBarMobile}
        >
          <div className={classes.buttonBarMobileWrapper}>
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
          </div>
        </Collapse>
      </CardActions>
    </Card>
  ) : (
    <></>
  );
};

export default IntegrationCard;