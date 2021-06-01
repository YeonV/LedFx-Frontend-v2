import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import DisplaySegmentsDialog from './EditVirtuals';

const useStyles = makeStyles((theme) => ({
  displayCardPortrait: {
    padding: '1rem',
    margin: '0.5rem',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    minWidth: '230px',
    height: '240px',
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
  },
  cardWrapper: {
    display: 'flex', flexWrap: 'wrap', margin: '-0.5rem',
  },
  '@media (max-width: 580px)' : {
    cardWrapper:{
      justifyContent: 'center'
    }
  }
}));

const Devices = () => {
  const classes = useStyles();
  const getDisplays = useStore((state) => state.getDisplays);
  const displays = useStore((state) => state.displays);
  const variant = 'outlined';
  const color = 'secondary';

  const handleDeleteDevice = () => {
    // onDelete(displays[display].id);
  };

  const handleEditDisplay = () => {
    // onEditDisplay(display);
  };
  const handleEditDevice = () => {
    // onEditDevice(deviceList.find(d => d.id === displays[display].is_device));
  };

  useEffect(() => {
    getDisplays();
  }, [getDisplays]);
  return (
      <div className={classes.cardWrapper}>
        {displays && Object.keys(displays).map((display, i) => (
          <Card className={classes.displayCardPortrait} key={i}>
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
              <div>
                <Popover
                  variant={variant}
                  // color={color}
                  onConfirm={handleDeleteDevice}
                  className={classes.deleteButton}
                />

                {displays[display].is_device ? (
                  <Button
                    variant={variant}
                    color={color}
                    size="small"
                    className={classes.editButton}
                    onClick={handleEditDevice}
                  >
                    <BuildIcon />
                  </Button>
                ) : (
                  <DisplaySegmentsDialog
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
                  onClick={handleEditDisplay}
                >
                  <SettingsIcon />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
  );
};

export default Devices;
