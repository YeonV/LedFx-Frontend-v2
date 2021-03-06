import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Fab,
  Icon,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Add,
  Send,
  Wallpaper,
  SettingsInputComponent,
  SettingsInputSvideo,
} from '@material-ui/icons';
import useStore from '../store/useStore';

const MenuLine = React.forwardRef((props: any, ref: any) => {
  const { icon = <Send fontSize="small" />, name = 'MenuItem', action } = props;
  return (
    <MenuItem onClick={action} ref={ref}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={name} />
    </MenuItem>
  );
});

const StyledMenu = withStyles({
  paper: {
    border: '1px solid rgba(255, 255, 255, 0.12)',
    transform: 'translateY(-1rem) !important',
  },
})((props: any) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    open={props.open}
    {...props}
  />
));

const AddButton = ({ className, style, setBackdrop }: any) => {
  const setDialogOpenAddScene = useStore(
    (state) => state.setDialogOpenAddScene
  );
  const setDialogOpenAddDevice = useStore(
    (state) => state.setDialogOpenAddDevice
  );
  const setDialogOpenAddVirtual = useStore(
    (state) => state.setDialogOpenAddVirtual
  );
  const setDialogOpenAddIntegration = useStore(
    (state) => state.setDialogOpenAddIntegration
  );
  const features = useStore((state) => state.features);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setBackdrop(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setBackdrop(false);
  };

  const menuitems = [
    {
      icon: <SettingsInputComponent />,
      name: 'Add Device',
      action: () => {
        setDialogOpenAddDevice(true);
        handleClose();
      },
    },
    {
      icon: (
        <Icon>
          <span
            className="mdi mdi-led-strip-variant"
            style={{ position: 'relative', display: 'flex' }}
          />
        </Icon>
      ),
      name: 'Add Virtual',
      action: () => {
        setDialogOpenAddVirtual(true);
        handleClose();
      },
    },
    {
      icon: <Wallpaper />,
      name: 'Add Scene',
      action: () => {
        setDialogOpenAddScene(true);
        handleClose();
      },
    },
  ];

  if (features.integrations) {
    menuitems.push({
      icon: <SettingsInputSvideo />,
      name: 'Add Integration',
      action: () => {
        setDialogOpenAddIntegration(true);
        handleClose();
      },
    });
  }
  return (
    <div className={className} style={{ zIndex: 5, ...style }}>
      <Fab color="primary" aria-label="add" onClick={handleClick}>
        <Add />
      </Fab>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuitems.map((menuitem) => (
          <MenuLine
            key={menuitem.name}
            name={menuitem.name}
            icon={menuitem.icon}
            action={menuitem.action}
          />
        ))}
      </StyledMenu>
    </div>
  );
};

export default AddButton;
