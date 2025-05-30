import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  Divider,
  IconButton,
  Box
} from '@mui/material'
import { useLocation, Link } from 'react-router-dom'
import isElectron from 'is-electron'
import { useRef } from 'react'
import useStore from '../../store/useStore'
import useStyles from './BarLeft.styles'
import logoAsset from '../../assets/logo.png'
// import bannerAsset from '../../assets/banner.png';
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import useClickOutside from '../../utils/useClickOutside'
import { ios } from '../../utils/helpers'

const LeftBar = () => {
  const classes = useStyles()
  const theme = useTheme()
  const { pathname } = useLocation()
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)
  const virtuals = useStore((state) => state.virtuals)
  const open = useStore((state) => state.ui.bars?.leftBar.open)
  const setOpen = useStore((state) => state.ui.setLeftBarOpen)
  const smallScreen = useMediaQuery('(max-width:768px)')
  const leftDrawer = useRef(null)
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const logo = (
    <div className={classes.logo}>
      {
        <>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <div className={classes.logoImage}>
              <img
                src={logoAsset}
                alt="logo"
                style={{
                  filter: theme.palette.mode === 'light' ? 'invert(1)' : 'invert(0)'
                }}
              />
            </div>
            <Box
              className={classes.devbadge}
              onClick={() => window.localStorage.setItem('BladeMod', '0')}
              sx={(theme) => ({
                filter: 'invert(0)',

                border: theme.palette.secondary.main,

                backgroundColor: isElectron()
                  ? 'transparent'
                  : theme.palette.mode === 'light' || theme.palette.primary.main === '#FFFFFF'
                    ? 'transparent'
                    : theme.palette.primary.main,

                ...theme.applyStyles('light', {
                  filter: 'invert(1)'
                })
              })}
            />
          </Box>
          {/* <Box sx={{ display: 'flex' }}>
            <img src={bannerAsset} alt="logo" style={{ maxWidth: '100%' }} />
          </Box> */}
        </>
      }
    </div>
  )
  useClickOutside(leftDrawer, handleDrawerClose)

  return (
    <Drawer
      ref={ios ? leftDrawer : null}
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <Box
        className={classes.drawerHeader}
        sx={{
          padding: theme.spacing(0, 1),
          background: theme.palette.secondary.main,
          ...theme.mixins.toolbar
        }}
        onClick={handleDrawerClose}
      >
        {logo}
        <IconButton>{theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}</IconButton>
      </Box>
      <Divider />
      <List>
        {Object.keys(virtuals)
          .filter((v) =>
            showComplex
              ? v
              : !(v.endsWith('-mask') || v.endsWith('-foreground') || v.endsWith('-background'))
          )
          .filter((v) => (showGaps ? v : !v.startsWith('gap-')))
          .map((d, i) => (
            <Link
              style={{ textDecoration: 'none' }}
              key={i}
              to={`/device/${virtuals[d].id}`}
              onClick={() => {
                if (smallScreen) handleDrawerClose()
              }}
            >
              <ListItem
                sx={
                  pathname.split('/').length === 3 &&
                  pathname.split('/')[1] === 'device' &&
                  pathname.split('/')[2] === d
                    ? {
                        backgroundColor: theme.palette.secondary.main,
                        boxShadow: theme.shadows[12],
                        '&:hover,&:focus,&:visited,&': {
                          backgroundColor: theme.palette.secondary.main,
                          boxShadow: theme.shadows[12]
                        },
                        color: '#fff'
                      }
                    : {}
                }
                key={virtuals[d].config.name}
              >
                <ListItemIcon>
                  <BladeIcon
                    style={{ position: 'relative' }}
                    colorIndicator={
                      !(
                        pathname.split('/').length === 3 &&
                        pathname.split('/')[1] === 'device' &&
                        pathname.split('/')[2] === d
                      ) && Object.keys(virtuals[d]?.effect).length > 0
                    }
                    name={
                      virtuals &&
                      virtuals[d] &&
                      virtuals[d].config &&
                      virtuals[d].config.icon_name &&
                      virtuals[d].config.icon_name
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  style={{
                    color:
                      !(
                        pathname.split('/').length === 3 &&
                        pathname.split('/')[1] === 'device' &&
                        pathname.split('/')[2] === d
                      ) && Object.keys(virtuals[d]?.effect).length > 0
                        ? theme.palette.primary.light
                        : theme.palette.text.primary
                  }}
                  primary={virtuals[d].config.name}
                />
              </ListItem>
            </Link>
          ))}
      </List>
      <Divider />
    </Drawer>
  )
}

export default LeftBar
