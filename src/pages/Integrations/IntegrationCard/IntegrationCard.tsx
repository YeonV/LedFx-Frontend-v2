import { useState } from 'react';
import clsx from 'clsx';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import { CardActions, CardHeader, Switch } from '@mui/material';
import Popover from '../../../components/Popover/Popover';
import useStore from '../../../store/useStore';
import useIntegrationCardStyles from './IntegrationCard.styles';
// import SpotifyView from '../Spotify/SpotifyAuth';

const IntegrationCard = ({ integration }: any) => {
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
  ) : null;
};

export default IntegrationCard;
