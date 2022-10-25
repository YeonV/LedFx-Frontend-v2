/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/indent */
import { useState } from 'react';
import clsx from 'clsx';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import {
  CardActions,
  CardHeader,
  Switch,
  Link,
  CardContent,
} from '@mui/material';
import Popover from '../../../components/Popover/Popover';
import useStore from '../../../store/useStore';
import useIntegrationCardStyles from './IntegrationCard.styles';
import QLCScreen from '../QLCplus/QLCScreen/QLCScreen';
// import SpotifyView from '../Spotify/SpotifyAuth';
// import DialogAddEventListener from '../../../components/Integrations/QLC/DialogAddEventListener';

const IntegrationCardQLC = ({ integration }: any) => {
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
        subheader={
          integrations[integration].status === 3
            ? 'Connecting...'
            : integrations[integration].status === 2
            ? 'Disconnecting'
            : integrations[integration].status === 1
            ? 'Connected'
            : integrations[integration].status === 0
            ? 'Disconnected'
            : 'Unknown'
        }
        action={
          <Switch
            aria-label="status"
            checked={integrations[integration].active}
            onClick={() => handleActivateIntegration(integrations[integration])}
          />
        }
      />

      <Link target="_blank" href="http://127.0.0.1:9999">
        {`QLC+ API: http://${integrations[integration].config.ip_address}:${integrations[integration].config.port}`}
      </Link>
      <CardContent>
        {integrations[integration].status === 1 ? (
          // <DialogAddEventListener integration={integrations[integration]} />
          <div>...</div>
        ) : (
          <Link
            target="_blank"
            href="https://www.qlcplus.org/docs/html_en_EN/webinterface.html"
          >
            Click here for setup guide.
          </Link>
        )}
      </CardContent>
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
            <QLCScreen
              icon={<AddIcon />}
              variant={variant}
              color={color}
              className={classes.editButton}
              disabled={integrations[integration].status !== 1}
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

export default IntegrationCardQLC;
