import { useState, forwardRef, useRef } from 'react';
import clsx from 'clsx';
import { useTheme, withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TuneIcon from '@material-ui/icons/Tune';
import BuildIcon from '@material-ui/icons/Build';
import { Link, NavLink } from 'react-router-dom';
import useStore from '../../../utils/apiStore';
import Popover from '../../../components/Popover';
import EditVirtuals from '../EditVirtuals/EditVirtuals';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PixelGraph from '../../../components/PixelGraph';
import { useDeviceCardStyles } from './DeviceCard.styles'
import BladeIcon from '../../../components/Icons/BladeIcon';
import { Delete, MoreVert } from '@material-ui/icons';
import { ListItemIcon, Menu, MenuItem } from '@material-ui/core';

const MuiMenu = forwardRef((props, ref) => {
  return <Menu ref={ref} {...props} />;
});
const MuiMenuItem = forwardRef((props, ref) => {
  return <MenuItem ref={ref} {...props} />;
});

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <MuiMenu
    elevation={0}
    getContentAnchorEl={null}
    onClick={(e) => e.preventDefault()}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'center',
      horizontal: 'right',
    }}
    {...props}
  />
));

// const StyledMenuItem = withStyles((theme) => ({
//   root: {
//     '&:focus': {
//       backgroundColor: theme.palette.primary.main,
//       '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
//         color: theme.palette.common.white,
//       },
//     },
//   },
// }))(MenuItem);

const DeviceCard = ({ virtual, index }) => {
  const classes = useDeviceCardStyles();
  const theme = useTheme();
  const menuRef = useRef(null)
  const isMobile = useMediaQuery(theme.breakpoints.down(580));
  const getVirtuals = useStore((state) => state.getVirtuals);
  const virtuals = useStore((state) => state.virtuals);
  const devices = useStore((state) => state.devices);
  const deleteVirtual = useStore((state) => state.deleteVirtual);
  const setDialogOpenAddDevice = useStore((state) => state.setDialogOpenAddDevice);
  const setDialogOpenAddVirtual = useStore((state) => state.setDialogOpenAddVirtual);
  const graphs = useStore((state) => state.graphs);

  const [fade, setFade] = useState(false)
  const [isActive, setIsActive] = useState((virtuals && virtual && virtuals[virtual] && virtuals[virtual].effect && Object.keys(virtuals[virtual].effect).length > 0) || devices && devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals.length > 0)
  const [expanded, setExpanded] = useState(false);
  const variant = 'outlined';
  const color = 'inherit';

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDeleteDevice = (virtual) => {
    deleteVirtual(virtuals[virtual]?.id).then(() => {
      getVirtuals();
    });
  };

  const handleEditVirtual = (virtual) => {
    setDialogOpenAddVirtual(true, virtual)
  };
  const handleEditDevice = (device) => {
    setDialogOpenAddDevice(true, device)
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return virtuals[virtual] ?

    <Card
      component={NavLink}
      to={`/device/${virtuals[virtual]?.id}`}
      className={`${classes.virtualCardPortrait} ${Object.keys(virtuals[virtual]?.effect).length > 0 ? 'active' : '' }`}
      style={{        
        textDecoration: 'none',
        order: !(devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals.length > 0 || virtuals[virtual]?.effect.name)
          ? 100
          : !virtuals[virtual]?.effect.name 
            ? 50
            : 'unset'
      }}>
      <div className={classes.virtualCardContainer}>
         
        <div className={`${classes.virtualIconWrapper}`}>
          <BladeIcon
            colorIndicator={false}
            name={virtuals[virtual]?.config && virtuals[virtual]?.config.icon_name && virtuals[virtual]?.config.icon_name}
            className={`${classes.virtualIcon} ${!graphs ? 'graphs' : ''} ${expanded ? 'extended' : ''}`}
            style={{ zIndex: 3 }}
            card={true} />
        </div>
      

        <div style={{ padding: '0 0.5rem' }}>
          <Typography variant="h6"
            style={{ color: (!graphs && Object.keys(virtuals[virtual]?.effect).length > 0) ? theme.palette.primary.light : 'inherit' }}
          >
            {virtual && virtuals[virtual]?.config && virtuals[virtual]?.config.name}
          </Typography>
          {virtuals[virtual]?.effect.name
            ? <Typography variant="body1" color="textSecondary">
              Effect: {virtuals[virtual]?.effect.name}
            </Typography>
            : devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals.length > 0
              ? <Typography variant="body1" color="textSecondary">
                Streaming...

              </Typography>
              : <Typography variant="body1" style={{ color: theme.palette.text.disabled }}>{"off"}</Typography>}
        </div>

        <div>
          {virtual && virtuals[virtual]?.config && virtuals[virtual]?.config.preview_only && (
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
          onClick={(e) => { e.preventDefault(); handleExpandClick(e); }}
          aria-expanded={expanded}
          aria-label="show more"
          style={{ zIndex: 2 }}
        >
          <ExpandMoreIcon className={`step-devices-two-${index}`} />
        </IconButton>
        {/* <IconButton
          aria-label="display more actions"
          edge="end"
          color="inherit"
          onClick={(e) => { e.preventDefault(); handleClick(e); }}
          className={'step-two'}
          style={{ marginLeft: '1rem' }}
        >
          <MoreVert />
        </IconButton>
        <MuiMenu
          ref={menuRef}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PopoverClasses={classes.menu}
        >
          
          <Popover
            key={`three-${index}`}
            innerKey={`edit-device-${index}`}
            type="menuItem"
            label={`Delete ${virtuals[virtual]?.is_device ? 'Device' : 'Virtual'}`}
            variant={variant}
            color={color}
            onConfirm={() => {setAnchorEl(null);handleDeleteDevice(virtual)}}
            className={`step-devices-three-${index}`}
          />         
         
          {virtuals[virtual]?.is_device
            ?
            <MuiMenuItem key={`edit-device-${index}`} onClick={(e) => { e.preventDefault(); handleEditDevice(virtuals[virtual]?.is_device) }} className={`step-devices-four-${index}`}>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              Edit Device
            </MuiMenuItem>
            : <EditVirtuals
              innerKey={`edit-virtual-${index}`}
              type="menuItem"
              label="Edit Segments"
              variant={"text"}
              color={color}
              virtual={virtuals[virtual]}
              className={`step-devices-six`}
              icon={<TuneIcon />}
            />}
          <MuiMenuItem key={`five-${index}`} className={`step-devices-five-${index}`} onClick={(e) => { e.preventDefault(); handleEditVirtual(virtual) }}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            Settings
          </MuiMenuItem>
        </MuiMenu> */}

      </div>
      <PixelGraph active={Object.keys(virtuals[virtual]?.effect).length > 0 || devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals.length > 0} virtId={virtuals[virtual]?.id} className={`step-devices-seven`} />

      {<div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, zIndex: 1 }}><Collapse in={expanded} timeout="auto" unmountOnExit className={classes.buttonBarMobile}>
        <div className={`${classes.buttonBarMobileWrapper} ${!graphs ? 'graphs' : ''} ${expanded ? 'extended' : ''}`} onClick={(e) => e.preventDefault()}>
          <div>
            {/* {expanded && devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals
              .map((s, i) => <li key={i}>{s}</li>)} */}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
            <Popover
              variant={"text"}
              startIcon={<Delete />}
              label="delete"
              color={color}
              onConfirm={() => handleDeleteDevice(virtual)}
              className={`step-devices-three-${index}`}
              style={{ width: '100%' }}
            />

            {virtuals[virtual]?.is_device
              ? <Button
                variant={"text"}
                color={color}
                size="small"
                startIcon={<BuildIcon />}
                className={`step-devices-four-${index}`}
                onClick={(e) => { e.preventDefault(); handleEditDevice(virtuals[virtual]?.is_device) }}
              >
                Edit Device
              </Button>
              : <EditVirtuals
                label="Edit Virtual"
                variant={"text"}
                color={color}
                virtual={virtuals[virtual]}
                className={`step-devices-six`}
                startIcon={<TuneIcon />}
              />}
            <Button
              variant={"text"}
              size="small"
              startIcon={<SettingsIcon />}
              color={color}
              className={`step-devices-five-${index}`}
              onClick={(e) => { e.preventDefault(); handleEditVirtual(virtual) }}
            >
              Settings
            </Button>
          </div>

        </div>
      </Collapse></div>}
    </Card>

    : <></>
}

export default DeviceCard
