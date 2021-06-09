import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TuneIcon from '@material-ui/icons/Tune';
import BuildIcon from '@material-ui/icons/Build';
import { NavLink } from 'react-router-dom';
import Wled from '../../assets/Wled';
import useStore from '../../utils/apiStore';
import { camelToSnake } from '../../utils/helpers';
import Popover from '../../components/Popover';
import EditVirtuals from '../Devices/EditVirtuals';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import { CardActions, CardHeader, Switch } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  integrationCardPortrait: {
    padding: '1rem',
    margin: '0.5rem',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: '290px',
    justifyContent: 'space-between',
    '@media (max-width: 580px)': {
      width: '87vw',
      height: 'unset',
    }
  },
  integrationLink: {
    flexGrow: 0,
    padding: '0 0.5rem',
    textDecoration: 'none',
    fontSize: 'large',
    color: 'inherit',

    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  integrationIcon: {
    margingBottom: '4px',
    marginRight: '0.5rem',
    position: 'relative',
    fontSize: '50px',
  },
  integrationCardContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    '@media (max-width: 580px)': {
      flexDirection: 'row',
    },
  },
  iconMedia: {
    height: 140,
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto',
    fontSize: 100,
    '& > span:before': {
      position: 'relative',
    },
  },
  editButton: {
    minWidth: 32,
    marginLeft: theme.spacing(1),
    '@media (max-width: 580px)': {
      minWidth: 'unset',
    },
  },
  editButtonMobile: {
    minWidth: 32,
    marginLeft: theme.spacing(1),
    '@media (max-width: 580px)': {
      minWidth: 'unset',
      flexGrow: 1,
    },
  },
  expand: {
    display: 'none',
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    '@media (max-width: 580px)': {
      display: 'block'
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  buttonBar: {    
    '@media (max-width: 580px)': {
      display: 'none'
    },
  },
  buttonBarMobile: {
    width: '100%',
    textAlign: 'right',
  },
  buttonBarMobileWrapper: {
    display: 'flex',
    margin: '0 -1rem -1rem -1rem',
    padding: '0.5rem 0.5rem 1.5rem 0.5rem',
    background: 'rgba(0,0,0,0.4)',
    '& > div, & > button': {
      flexGrow: 1,
      flexBasis: '30%'
    },
    '& > div > button': {
      width: '100%'
    }
  },
}));

const IntegrationCard = ({ integration }) => {

  const classes = useStyles();
  const getIntegrations = useStore((state) => state.getIntegrations);
  const integrations = useStore((state) => state.integrations);
  const deleteIntegration = useStore((state) => state.deleteIntegration);
  const toggleIntegration = useStore((state) => state.toggleIntegration);
  const setDialogOpenAddIntegration = useStore((state) => state.setDialogOpenAddIntegration);

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
    setDialogOpenAddIntegration(true, integration)
  };
  const handleActivateIntegration = (integration) => {
    toggleIntegration({
      id: integration.id
    }).then(() => getIntegrations())
  };

  return (
    <Card className={classes.integrationCardPortrait}>
      <CardHeader 
        title={integration && integrations[integration].config && integrations[integration].config.name} 
        subheader={integration && integrations[integration].config && integrations[integration].config.description} 
        action={
          <Switch aria-label="status" checked={integrations[integration].active} onClick={() => handleActivateIntegration(integrations[integration])} />
        }
      />
      <CardActions style={{alignSelf: 'flex-end'}}>
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
          <Button
            variant={variant}
            size="small"
            color={color}
            className={classes.editButton}
            onClick={() => console.log("coming soon...")}
            disabled
          >
            <AddIcon />
          </Button>
        </div>

      </div>

      <Collapse in={expanded} timeout="auto" unmountOnExit className={classes.buttonBarMobile}>
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
  )
}

export default IntegrationCard
