import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { ListItem, ListItemIcon, ListItemText, Drawer, List, Icon, Divider, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useStore from '../../utils/apiStore';
import { camelToSnake } from '../../utils/helpers';
import useStyles from './BarLeft.styles';
import logoAsset from '../../assets/logo.png';
import Wled from '../../assets/Wled';
import YZ from '../../assets/YZ';

const LeftBar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const virtuals = useStore((state) => state.virtuals);
  const open = useStore((state) => state.ui.bars?.leftBar.open);
  const setOpen = useStore((state) => state.setLeftBarOpen);
  const smallScreen = useMediaQuery('(max-width:768px)');
  
  
  const handleDrawerClose = () => {    
      setOpen(false)
  };

  const logo = (
    <div className={classes.logo}>
      <a href="/#" className={classes.logoLink}>
        <div className={classes.logoImage}>
          <img src={logoAsset} alt="logo" className={classes.img} />
        </div>
        LedFx
      </a>
      <div className={classes.devbadge} onClick={()=>window.localStorage.setItem('BladeMod', 0)} onDoubleClick={()=>window.localStorage.setItem('BladeMod', 10)} />
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
        {Object.keys(virtuals).map((d, i) => (
          <Link
            style={{ textDecoration: 'none' }}
            key={i}
            to={`/device/${virtuals[d].id}`}
            onClick={() => {
              smallScreen && handleDrawerClose();
            }}
          >
            <ListItem button key={virtuals[d].config.name}>
              <ListItemIcon>
                <Icon
                  color={d.effect && d.effect.active === true ? 'primary' : 'inherit'}
                  style={{ position: 'relative' }}
                >
                  {virtuals[d].config && virtuals[d].config.icon_name && virtuals[d].config.icon_name.startsWith('yz') ? (
                    <YZ style={{ transform: 'scale(0.011)', marginTop: '3px'}} />
                  ) : virtuals && virtuals[d] && virtuals[d].config && virtuals[d].config.icon_name
                    && virtuals[d].config.icon_name.startsWith('wled') ? (
                    <Wled />
                  ) : (virtuals && virtuals[d] && virtuals[d].config && virtuals[d].config.icon_name && virtuals[d].config.icon_name.startsWith('mdi:')) ? (
                    <span
                      className={`mdi mdi-${virtuals[d].config.icon_name.split('mdi:')[1]}`}
                    />
                  ) : (
                    camelToSnake(
                      virtuals[d].config.icon_name || 'SettingsInputComponent',
                    )
                  )}
                </Icon>
              </ListItemIcon>
              <ListItemText
                style={{ color: '#fff' }}
                primary={virtuals[d].config.name}
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
