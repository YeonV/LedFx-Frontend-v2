import { useState } from 'react';
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
import BladeIcon from '../../../components/BladeIcon';


const DeviceCard = ({ virtual, index }) => {
  const classes = useDeviceCardStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(580));
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

  return virtuals[virtual] ?
    <Card className={classes.virtualCardPortrait} style={{
      order: !(devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals.length > 0 || virtuals[virtual]?.effect.name)
        ? 100
        : 'unset'
    }}>
      <div className={classes.virtualCardContainer}>

        <NavLink
          to={`/device/${virtuals[virtual]?.id}`}
          className={classes.virtualLink}          
        >
          <BladeIcon
            colorIndicator={Object.keys(virtuals[virtual]?.effect).length > 0}
            name={virtuals[virtual]?.config && virtuals[virtual]?.config.icon_name && virtuals[virtual]?.config.icon_name}
            className={classes.virtualIcon}
            card={true} />
        </NavLink>

        <div style={{ padding: '0 0.5rem' }}>
          <NavLink
            to={`/device/${virtuals[virtual]?.id}`}
            className={classes.virtualLink}
            style={{ color: Object.keys(virtuals[virtual]?.effect).length > 0 ? theme.palette.primary.light : 'inherit'}}
          >
            {virtual && virtuals[virtual]?.config && virtuals[virtual]?.config.name}
          </NavLink>
          {virtuals[virtual]?.effect.name
            ? <Typography variant="body1" color="textSecondary">
              Effect: {virtuals[virtual]?.effect.name}
            </Typography>
            : devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals.length > 0
              ? <Typography variant="body1" color="textSecondary">
                {expanded
                  ? "Streaming from: "
                  : "Streaming..."}
                {expanded && devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals
                  .map((s, i) => <li key={i}>{s}</li>)}
              </Typography>
              : <></>}
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
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon className={`step-devices-two-${index}`} />
        </IconButton>

      </div>
      <PixelGraph virtId={virtuals[virtual]?.id} className={`step-devices-seven`} />

      {<Collapse in={expanded} timeout="auto" unmountOnExit className={classes.buttonBarMobile}>
        <div className={classes.buttonBarMobileWrapper}>
          <Popover
            variant={variant}
            color={color}
            onConfirm={() => handleDeleteDevice(virtual)}
            className={`step-devices-three-${index}`}
          />

          {virtuals[virtual]?.is_device
            ? <Button
              variant={variant}
              color={color}
              size="small"
              className={`${classes.editButton} step-devices-four-${index}`}
              onClick={() => console.log(virtuals[virtual], virtuals[virtual]?.is_device) || handleEditDevice(virtuals[virtual]?.is_device)}
            >
              <BuildIcon />
            </Button>
            : <EditVirtuals
              variant={variant}
              color={color}
              virtual={virtuals[virtual]}
              className={`${classes.editButton} step-devices-six`}
              icon={<TuneIcon />}
            />}
          <Button
            variant={variant}
            size="small"
            color={color}
            className={`${classes.editButton} step-devices-five-${index}`}
            onClick={() => handleEditVirtual(virtual)}
          >
            <SettingsIcon />
          </Button>
        </div>
      </Collapse>}
    </Card>
    : <></>
}

export default DeviceCard
