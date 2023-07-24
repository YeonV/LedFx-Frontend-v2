import React from 'react'
import { styled } from '@mui/material/styles'
import {
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  IconButton
} from '@mui/material'
import { AddSharp as Add, Send, ElectricalServices } from '@mui/icons-material'
import useStore from '../store/useStore'
import GlobalActionBar from './GlobalActionBar'
import BladeIcon from './Icons/BladeIcon/BladeIcon'

const PREFIX = 'AddButton'

const classes = {
  paper: `${PREFIX}-paper`
}

const Root = styled('div')({
  [`& .${classes.paper}`]: {
    border: '1px solid rgba(255, 255, 255, 0.12)',
    transform: 'translateY(-1rem) !important'
  }
})

const MenuLine = React.forwardRef((props: any, ref: any) => {
  const { icon = <Send fontSize="small" />, name = 'MenuItem', action } = props
  return (
    <MenuItem onClick={action} ref={ref}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={name} />
    </MenuItem>
  )
})

const StyledMenu = ({ open, ...props }: any) => (
  <Menu
    elevation={0}
    // getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    open={open}
    {...props}
  />
)

const AddButton = ({ className, style, setBackdrop, sx }: any) => {
  const theme = useTheme()
  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent === 'MacIntel' && navigator.maxTouchPoints > 1)

  const setDialogOpenAddScene = useStore((state) => state.setDialogOpenAddScene)
  const setDialogOpenAddDevice = useStore(
    (state) => state.setDialogOpenAddDevice
  )
  const setDialogOpenAddVirtual = useStore(
    (state) => state.setDialogOpenAddVirtual
  )
  const setDialogOpenAddIntegration = useStore(
    (state) => state.setDialogOpenAddIntegration
  )
  const features = useStore((state) => state.features)

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
    setBackdrop(true)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setBackdrop(false)
  }

  const menuitems = [
    {
      icon: <BladeIcon name="mdi:led-strip" />,
      name: 'Add Device',
      action: () => {
        setDialogOpenAddDevice(true)
        handleClose()
      }
    },
    {
      icon: <BladeIcon name="mdi:led-strip-variant" />,
      name: 'Add Virtual',
      action: () => {
        setDialogOpenAddVirtual(true)
        handleClose()
      }
    },
    {
      icon: <BladeIcon name="mdi:image-plus" />,
      name: 'Add Scene',
      action: () => {
        setDialogOpenAddScene(true)
        handleClose()
      }
    }
  ]

  if (features.integrations) {
    menuitems.push({
      icon: <ElectricalServices />,
      name: 'Add Integration',
      action: () => {
        setDialogOpenAddIntegration(true)
        handleClose()
      }
    })
  }
  return (
    <>
      <Root
        className={`${className} hideHd`}
        style={{ zIndex: 5, ...style }}
        sx={sx}
      >
        <Fab
          color="primary"
          variant="circular"
          aria-label="add"
          onClick={handleClick}
        >
          <Add />
        </Fab>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          classes={{
            paper: classes.paper
          }}
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
      </Root>
      <div
        className="showHd"
        style={{
          position: 'fixed',
          bottom: ios ? 80 : 56,
          left: 0,
          right: 0,
          paddingLeft: ios ? 6 : 16,
          paddingRight: ios ? 6 : 16,
          height: 56,
          display: 'flex',
          justifyContent: 'space-between',
          background: ios
            ? 'rgba(54,54,54,0.8)'
            : theme.palette.background.paper,
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #a1998e30',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <GlobalActionBar
          sx={{
            flexGrow: 1,
            paddingRight: 2,
            paddingLeft: 0,
            color: theme.palette.primary.main
          }}
          height={15}
          type="icon"
        />
        <Root
          className={className}
          // style={{ zIndex: 5, ...style, position: 'relative', bottom: 0 }}
          // sx={sx}
        >
          <IconButton
            color="inherit"
            aria-label="add"
            onClick={handleClick}
            style={{
              margin: '0 8px 0 0',
              color: '#fff'
            }}
          >
            <Add sx={{ fontSize: 32 }} />
          </IconButton>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            classes={{
              paper: classes.paper
            }}
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
        </Root>
      </div>
    </>
  )
}

export default AddButton
