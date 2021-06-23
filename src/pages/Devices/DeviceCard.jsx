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
import PixelGraph from '../Device/PixelGraph';

const useStyles = makeStyles((theme) => ({
  virtualCardPortrait: {
    padding: '1rem',
    margin: '0.5rem',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    minWidth: '230px',
    maxWidth: '400px',
    // width: '230px',
    // height: '240px',
    // '@media (max-width: 580px)': {
      width: '100%',
      height: 'unset',
    // }
  },
  virtualLink: {
    flexGrow: 0,
    textDecoration: 'none',
    fontSize: 'large',
    color: 'inherit',

    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  virtualIcon: {
    margingBottom: '4px',
    marginRight: '0.5rem',
    position: 'relative',
    fontSize: '50px',
  },
  virtualCardContainer: {
    display: 'flex',
    alignItems: 'center',
    // flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    // '@media (max-width: 580px)': {
      flexDirection: 'row',
    // },
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
    // minWidth: 32,
    marginLeft: theme.spacing(1),
    // '@media (max-width: 580px)': {
      minWidth: 'unset',
    // },
  },
  editButtonMobile: {
    // minWidth: 32,
    marginLeft: theme.spacing(1),
    // '@media (max-width: 580px)': {
      minWidth: 'unset',
      flexGrow: 1,
    // },
  },
  expand: {
    // display: 'none',
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    // '@media (max-width: 580px)': {
      display: 'block'
    // },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  buttonBar: {
    // '@media (max-width: 580px)': {
      display: 'none'
    // },
  },
  buttonBarMobile: {
    width: '100%',
    textAlign: 'right',
  },
  buttonBarMobileWrapper: {
    display: 'flex',
    margin: '0 -0.5rem -1rem -0.5rem',
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

const DeviceCard = ({ virtual }) => {
  const classes = useStyles();
  const getVirtuals = useStore((state) => state.getVirtuals);
  const virtuals = useStore((state) => state.virtuals);
  const devices = useStore((state) => state.devices);
  const deleteVirtual = useStore((state) => state.deleteVirtual);
  const setDialogOpenAddDevice = useStore((state) => state.setDialogOpenAddDevice);
  const setDialogOpenAddVirtual = useStore((state) => state.setDialogOpenAddVirtual);

  
  const [expanded, setExpanded] = useState(false);
  const variant = 'outlined';
  const color = 'inherit';

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDeleteDevice = (virtual) => {
    deleteVirtual(virtuals[virtual].id).then(() => {
      getVirtuals();
    });
  };

  const handleEditVirtual = (virtual) => {
    setDialogOpenAddVirtual(true, virtual)
  };
  const handleEditDevice = (device) => {
    setDialogOpenAddDevice(true, device)
  };


  return (
    <Card className={classes.virtualCardPortrait}>
      <div className={classes.virtualCardContainer}>
        <NavLink
          to={`/device/${virtuals[virtual].id}`}
          className={classes.virtualLink}
          color={virtuals[virtual].effect && virtuals[virtual].effect.active === true ? 'primary' : 'inherit'}
        >
          <Icon
            color={virtuals[virtual].effect && virtuals[virtual].effect.active === true ? 'primary' : 'inherit'}
            className={classes.virtualIcon}
          >
            {virtuals[virtual].config && virtuals[virtual].config.icon_name && virtuals[virtual].config.icon_name.startsWith('wled') ? (
              <Wled />
            ) : (virtuals[virtual].config && virtuals[virtual].config.icon_name.startsWith('mdi:')) ? (
              <span
                className={`mdi mdi-${virtuals[virtual].config && virtuals[virtual].config.icon_name.split('mdi:')[1]}`}
              />
            ) : (
              camelToSnake((virtuals[virtual].config && virtuals[virtual].config.icon_name) || 'SettingsInputComponent')
            )}
          </Icon>
        </NavLink>
        <div  style={{padding: '0 0.5rem'}}>
        <NavLink
          to={`/device/${virtuals[virtual].id}`}
          className={classes.virtualLink}
          color={virtuals[virtual].effect && virtuals[virtual].effect.active === true ? 'primary' : 'inherit'}
        >
          {virtual && virtuals[virtual].config && virtuals[virtual].config.name}
        </NavLink>
        {virtuals[virtual].effect.name ? (
          <Typography variant="body1" color="textSecondary">
            Effect: {virtuals[virtual].effect.name}
          </Typography>
        ) : (<></>)}
        {!virtuals[virtual].effect.name ? (<Typography variant="body1" color="textSecondary">
          Streaming from: {devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals}
        </Typography>) : (<></>)}
        </div>
        <div>
          {/* <TypeBadge variant={variant} virtual={virtual} /> */}
          {virtual && virtuals[virtual].config && virtuals[virtual].config.preview_only && (
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
            onConfirm={() => handleDeleteDevice(virtual)}
            className={classes.deleteButton}
          />

          {virtuals[virtual].is_device ? (
            <Button
              variant={variant}
              color={color}
              size="small"
              className={classes.editButton}
              onClick={() => handleEditDevice(virtuals[virtual].is_device)}
            >
              <BuildIcon />
            </Button>
          ) : (
            <EditVirtuals
              variant={variant}
              color={color}
              virtual={virtuals[virtual]}
              className={classes.editButton}
              icon={<TuneIcon />}
            />
          )}
          <Button
            variant={variant}
            size="small"
            color={color}
            className={classes.editButton}
            onClick={() => handleEditVirtual(virtual)}
          >
            <SettingsIcon />
          </Button>
        </div>

      </div>
      <PixelGraph virtId={virtuals[virtual].id} />
      <Collapse in={expanded} timeout="auto" unmountOnExit className={classes.buttonBarMobile}>
        <div className={classes.buttonBarMobileWrapper}>
          <Popover
            variant={variant}
            color={color}
            onConfirm={() => handleDeleteDevice(virtual)}
            className={classes.deleteButton}
          />

          {virtuals[virtual].is_device ? (
            <Button
              variant={variant}
              color={color}
              size="small"
              className={classes.editButtonMobile}
              onClick={() => handleEditDevice(virtuals[virtual].is_device)}
            >
              <BuildIcon />
            </Button>
          ) : (
            <EditVirtuals
              variant={variant}
              color={color}
              virtual={virtuals[virtual]}
              className={classes.editButtonMobile}
              icon={<TuneIcon />}
            />
          )}
          <Button
            variant={variant}
            size="small"
            color={color}
            className={classes.editButtonMobile}
            onClick={() => handleEditVirtual(virtual)}
          >
            <SettingsIcon />
          </Button>
        </div>
      </Collapse>
    </Card>
  )
}

export default DeviceCard
