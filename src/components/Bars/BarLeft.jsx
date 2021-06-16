import { useTheme } from '@material-ui/core/styles';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { ListItem, ListItemIcon, ListItemText, Drawer, List, Icon, Divider, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useStore from '../../utils/apiStore';
import { camelToSnake } from '../../utils/helpers';
import useStyles from './BarLeft.styles';
import logoAsset from '../../assets/logo.png';
import Wled from '../../assets/Wled';

const LeftBar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const displays = useStore((state) => state.displays);
  const open = useStore((state) => state.ui.bars?.leftBar.open);
  const setOpen = useStore((state) => state.setLeftBarOpen);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logo = (
    <div className={classes.logo}>
      <a href="/#" className={classes.logoLink}>
        <div className={classes.logoImage}>
          <img src={logoAsset} alt="logo" className={classes.img} />
        </div>
        LedFx
      </a>
      <div className={classes.devbadge} />
    </div>
  );

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        {logo}
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </div>
      <Divider />
      <List>
        {Object.keys(displays).map((d, i) => (
          <Link
            style={{ textDecoration: 'none' }}
            key={i}
            to={`/device/${displays[d].id}`}
            onClick={() => {
              handleDrawerClose();
            }}
          >
            <ListItem button key={displays[d].config.name}>
              <ListItemIcon>
                <Icon
                  color={d.effect && d.effect.active === true ? 'primary' : 'inherit'}
                  style={{ position: 'relative' }}
                >
                  {displays && displays[d] && displays[d].config && displays[d].config.icon_name
                    && displays[d].config.icon_name.startsWith('wled') ? (
                    <Wled />
                  ) : (displays && displays[d] && displays[d].config && displays[d].config.icon_name && displays[d].config.icon_name.startsWith('mdi:')) ? (
                    <span
                      className={`mdi mdi-${displays[d].config.icon_name.split('mdi:')[1]}`}
                    />
                  ) : (
                    camelToSnake(
                      displays[d].config.icon_name || 'SettingsInputComponent',
                    )
                  )}
                </Icon>
              </ListItemIcon>
              <ListItemText
                style={{ color: '#fff' }}
                primary={displays[d].config.name}
              />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default LeftBar;
