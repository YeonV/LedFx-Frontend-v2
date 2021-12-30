import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TuneIcon from '@material-ui/icons/Tune';
import BuildIcon from '@material-ui/icons/Build';
import { NavLink } from 'react-router-dom';
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
import { Clear, Delete, Pause, PlayArrow } from '@material-ui/icons';

const DeviceCard = ({ virtual, index }) => {
  const classes = useDeviceCardStyles();
  const theme = useTheme();
  const getVirtuals = useStore((state) => state.getVirtuals);
  const getDevices = useStore((state) => state.getDevices);
  const virtuals = useStore((state) => state.virtuals);
  const devices = useStore((state) => state.devices);
  const deleteVirtual = useStore((state) => state.deleteVirtual);
  const setDialogOpenAddDevice = useStore((state) => state.setDialogOpenAddDevice);
  const setDialogOpenAddVirtual = useStore((state) => state.setDialogOpenAddVirtual);
  const graphs = useStore((state) => state.graphs);
  const clearVirtualEffect = useStore((state) => state.clearVirtualEffect);
  const updateVirtual = useStore((state) => state.updateVirtual);

  const [fade, setFade] = useState(false)
  const [isActive, setIsActive] = useState((virtuals && virtual && virtuals[virtual] && virtuals[virtual].effect && Object.keys(virtuals[virtual].effect)?.length > 0) || devices && devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals?.length > 0)
  const [expanded, setExpanded] = useState(false);
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

  const handleClearEffect = () => {
    clearVirtualEffect(virtual).then(() => {
      setFade(true)
      setTimeout(() => { getVirtuals();getDevices(); }, virtuals[virtual].config.transition_time * 1000)
      setTimeout(() => { setFade(false) }, virtuals[virtual].config.transition_time * 1000 + 300)
    });
  };

  const handlePlayPause = () => {
    updateVirtual(virtuals[virtual].id, { active: !virtuals[virtual].active })
      .then(() => getVirtuals());
  };

  useEffect(() => {        
    setIsActive((virtual && virtuals[virtual] && Object.keys(virtuals[virtual]?.effect)?.length > 0) || devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals?.length > 0)
  }, [virtuals, devices])

  console.log("yoo", devices[Object.keys(devices).find(d => d === virtual)]?.config.ip_address)
  return virtual && virtuals[virtual] ?

    <Card
      component={NavLink}
      to={`/device/${virtuals[virtual]?.id}`}
      className={`${classes.virtualCardPortrait} ${Object.keys(virtuals[virtual]?.effect)?.length > 0 ? 'active' : ''}`}
      style={{
        textDecoration: 'none',
        order: !(devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals?.length > 0 || virtuals[virtual]?.effect.name)
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
            style={{ lineHeight: 1, color: (!graphs && Object.keys(virtuals[virtual]?.effect)?.length > 0) ? theme.palette.primary.light : 'inherit' }}
          >
            {virtual && virtuals[virtual]?.config && virtuals[virtual]?.config.name}
          </Typography>
          {virtuals[virtual]?.effect.name
            ? <>
              <Typography variant="body1" color="textSecondary" style={{ height: 25, display: 'flex', alignItems: 'center' }}>
                Effect: {virtuals[virtual]?.effect.name}
                <Button
                  size="small"
                  onClick={(e) => { e.preventDefault(); handlePlayPause(); }}
                  style={{ color: '#999', minWidth: 'unset', zIndex: expanded ? 1 : 3 }}
                >
                  {virtuals[virtual]?.active ? <Pause /> : <PlayArrow />}
                </Button>
                <Button
                  size="small"
                  onClick={(e) => { e.preventDefault(); handleClearEffect(virtual); }}
                  style={{ color: '#999', minWidth: 'unset', zIndex: expanded ? 1 : 3 }}
                >
                  <Clear />
                </Button>
              </Typography>

            </>
            : devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals?.length > 0
              ? <Typography variant="body1" color="textSecondary" style={{ height: 25 }}>
                Streaming...

              </Typography>
              : <Typography variant="body1" style={{ color: theme.palette.text.disabled }} style={{ height: 25 }}>{"off"}</Typography>}
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
          style={{ zIndex: 3, color: '#999' }}
        >
          <ExpandMoreIcon className={`step-devices-two-${index}`} />
        </IconButton>

      </div>
      <div className={clsx(classes.pixelbar, {
        [classes.pixelbarOut]: fade,
      })} style={{ transitionDuration: virtuals[virtual].config.transition_time * 1000 }}>
        <PixelGraph active={isActive} virtId={virtuals[virtual]?.id} className={`step-devices-seven`} />
      </div>
      {<div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, zIndex: 2 }}><Collapse in={expanded} timeout="auto" unmountOnExit className={classes.buttonBarMobile}>
        <div className={`${classes.buttonBarMobileWrapper} ${!graphs ? 'graphs' : ''} ${expanded ? 'extended' : ''}`} onClick={(e) => e.preventDefault()}>
          <div>
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
