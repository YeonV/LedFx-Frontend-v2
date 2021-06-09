import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TuneIcon from '@material-ui/icons/Tune';
import BuildIcon from '@material-ui/icons/Build';
import { NavLink } from 'react-router-dom';
import Wled from '../../assets/Wled';
import useStore from '../../utils/apiStore';
import { camelToSnake } from '../../utils/helpers';
import Popover from '../../components/Popover';
// import TypeBadge from './TypeBadge';
import EditVirtuals from './EditVirtuals';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  displayCardPortrait: {
    padding: '1rem',
    margin: '0.5rem',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    minWidth: '230px',
    height: '240px',
    '@media (max-width: 580px)': {
      width: '87vw',
      height: 'unset',
    }
  },
  displayLink: {
    flexGrow: 0,
    padding: '0 0.5rem',
    textDecoration: 'none',
    fontSize: 'large',
    color: 'inherit',

    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  displayIcon: {
    margingBottom: '4px',
    marginRight: '0.5rem',
    position: 'relative',
    fontSize: '50px',
  },
  displayCardContainer: {
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
  buttonBar:{
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

const DeviceCard = ({ display }) => {
  const classes = useStyles();
  const getDisplays = useStore((state) => state.getDisplays);
  const displays = useStore((state) => state.displays);
  const deleteDisplay = useStore((state) => state.deleteDisplay);
  const setDialogOpenAddDevice = useStore((state) => state.setDialogOpenAddDevice);
  const setDialogOpenAddVirtual = useStore((state) => state.setDialogOpenAddVirtual);

  const [expanded, setExpanded] = useState(false);
  const variant = 'outlined';
  const color = 'inherit';

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDeleteDevice = (display) => {
    deleteDisplay(displays[display].id).then(() => {
      getDisplays();
    });
  };

  const handleEditDisplay = (display) => {
    setDialogOpenAddVirtual(true, display)
  };
  const handleEditDevice = (device) => {
    setDialogOpenAddDevice(true, device)
  };


  return (
    <Card className={classes.displayCardPortrait}>
      <div className={classes.displayCardContainer}>
        <NavLink
          to={`/device/${displays[display].id}`}
          className={classes.displayLink}
          color={displays[display].effect && displays[display].effect.active === true ? 'primary' : 'inherit'}
        >
          <Icon
            color={displays[display].effect && displays[display].effect.active === true ? 'primary' : 'inherit'}
            className={classes.displayIcon}
          >
            {displays[display].config && displays[display].config.icon_name && displays[display].config.icon_name.startsWith('wled') ? (
              <Wled />
            ) : (displays[display].config && displays[display].config.icon_name.startsWith('mdi:')) ? (
              <span
                className={`mdi mdi-${displays[display].config && displays[display].config.icon_name.split('mdi:')[1]}`}
              />
            ) : (
              camelToSnake((displays[display].config && displays[display].config.icon_name) || 'SettingsInputComponent')
            )}
          </Icon>
        </NavLink>
        <NavLink
          to={`/device/${displays[display].id}`}
          className={classes.displayLink}
          color={displays[display].effect && displays[display].effect.active === true ? 'primary' : 'inherit'}
        >
          {display && displays[display].config && displays[display].config.name}
        </NavLink>

        <div>
          {/* <TypeBadge variant={variant} display={display} /> */}
          {display && displays[display].config && displays[display].config.preview_only && (
            <Button
              variant="text"
              disabled
              size="small"

              className={classes.previewButton}
            >
              <VisibilityIcon />
            </Button>
          )}
        </div>
        
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
            onConfirm={() => handleDeleteDevice(display)}
            className={classes.deleteButton}
          />

          {displays[display].is_device ? (
            <Button
              variant={variant}
              color={color}
              size="small"
              className={classes.editButton}
              onClick={() => handleEditDevice(displays[display].is_device)}
            >
              <BuildIcon />
            </Button>
          ) : (
            <EditVirtuals
              variant={variant}
              color={color}
              display={displays[display]}
              className={classes.editButton}
              icon={<TuneIcon />}
            />
          )}
          <Button
            variant={variant}
            size="small"
            color={color}
            className={classes.editButton}
            onClick={() => handleEditDisplay(display)}
          >
            <SettingsIcon />
          </Button>
        </div>
       
      </div>

      <Collapse in={expanded} timeout="auto" unmountOnExit className={classes.buttonBarMobile}>
        <div className={classes.buttonBarMobileWrapper}>
        <Popover
            variant={variant}
            color={color}
            onConfirm={() => handleDeleteDevice(display)}
            className={classes.deleteButton}
          />

          {displays[display].is_device ? (
            <Button
              variant={variant}
              color={color}
              size="small"
              className={classes.editButtonMobile}
              onClick={() => handleEditDevice(displays[display].is_device)}
            >
              <BuildIcon />
            </Button>
          ) : (
            <EditVirtuals
              variant={variant}
              color={color}
              display={displays[display]}
              className={classes.editButtonMobile}
              icon={<TuneIcon />}
            />
          )}
          <Button
            variant={variant}
            size="small"
            color={color}
            className={classes.editButtonMobile}
            onClick={() => handleEditDisplay(display)}
          >
            <SettingsIcon />
          </Button>
        </div>
      </Collapse>
    </Card>
  )
}

export default DeviceCard
