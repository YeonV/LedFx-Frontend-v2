import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreVert, Language, GitHub, Login, Logout, Lan, Settings } from '@mui/icons-material'
import isElectron from 'is-electron'
import {
  Box,
  Badge,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from '@mui/material'

import useStore from '../../../store/useStore'
import { backendUrl } from '../../../pages/Device/Cloud/CloudComponents'
import { StyledBadge } from './BarTop'
import {
  getThemeMode,
  MenuLine,
  renderTourForSlug,
  toggleThemeMode,
  TopBarMenuProps
} from './BarTop.utils'
import { YeonVMenuItems } from './YeonVMenuItems'
import { ContextMenuItems } from './ContextMenuItems'

const TopBarMenu = ({ slug, invisible }: TopBarMenuProps) => {
  const navigate = useNavigate()
  const [loggingIn, setLogginIn] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  // STORE ACCESS - DO NOT MODIFY
  const currentTheme = useStore((state) => state.ui.currentTheme)
  const setCurrentTheme = useStore((state) => state.ui.setCurrentTheme)
  const setDialogOpen = useStore((state) => state.setDialogOpen)
  const setHostManager = useStore((state) => state.setHostManager)
  const isLogged = useStore((state) => state.isLogged)
  const setIsLogged = useStore((state) => state.setIsLogged)
  const reloadTheme = useStore((state) => state.ui.reloadTheme)
  const features = useStore((state) => state.features)
  const coreParams = useStore((state) => state.coreParams)

  const isCC = coreParams && Object.keys(coreParams).length > 0
  const isCreator =
    localStorage.getItem('ledfx-cloud-role') === 'creator' &&
    localStorage.getItem('username') === 'YeonV'

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => setAnchorEl(null)

  const changeHost = () => {
    setDialogOpen(true, true)
    closeMenu()
  }

  const changeHostManager = () => {
    setHostManager(true)
    closeMenu()
  }

  const handleGithubLogin = (e: any) => {
    e.preventDefault()
    setLogginIn(true)

    if (isLogged) {
      setLogginIn(false)
      logout(e)
    } else if (window.location.pathname.includes('hassio_ingress')) {
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = `${backendUrl}/connect/github?callback=${window.location.origin}`
    } else if (isElectron()) {
      window.open(
        `${backendUrl}/connect/github?callback=ledfx://auth/github/`,
        '_blank',
        'noopener,noreferrer'
      )
    } else {
      window.open(
        `${backendUrl}/connect/github?callback=${window.location.origin}`,
        '_blank',
        'noopener,noreferrer'
      )
    }
  }

  const logout = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault()
    localStorage.removeItem('ledfx-cloud-jwt')
    localStorage.removeItem('ledfx-cloud-jwt-expiry')
    localStorage.removeItem('ledfx-cloud-refresh-token')
    localStorage.removeItem('ledfx-cloud-username')
    localStorage.removeItem('ledfx-cloud-userid')
    localStorage.removeItem('ledfx-cloud-role')
    setIsLogged(false)
  }

  const navigateToSettings = () => {
    const queryParam =
      slug === 'device'
        ? 'effects'
        : slug === 'Scenes'
          ? 'scenes'
          : slug === 'Devices'
            ? 'devices'
            : ''

    navigate(`/Settings${queryParam ? `?${queryParam}` : ''}`)
    closeMenu()
  }

  const handleThemeChange = (newTheme: string) => {
    setCurrentTheme(newTheme)
    window.localStorage.setItem('ledfx-theme', newTheme)
    reloadTheme()
  }

  const handleThemeModeToggle = () => {
    const newTheme = toggleThemeMode(currentTheme)
    handleThemeChange(newTheme)
  }

  const handleThemeColorChange = (color: string) => {
    const mode = getThemeMode(currentTheme)
    const newTheme =
      (mode === 'dark' ? 'Dark' : 'Light') + color.charAt(0).toUpperCase() + color.slice(1)
    handleThemeChange(newTheme)
  }

  return (
    <>
      <IconButton
        aria-label="display more actions"
        edge="end"
        color="inherit"
        onClick={handleClick}
        className="step-two"
        style={{ marginLeft: '1rem' }}
      >
        <Badge variant="dot" color="error" invisible={invisible}>
          <MoreVert sx={{ fontSize: 32 }} />
        </Badge>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        {features.cloud && isLogged && (
          <MenuItem
            sx={{ pb: 2 }}
            divider
            onClick={() => {
              closeMenu()
              navigate('/User')
            }}
          >
            <ListItemIcon style={{ marginTop: -13 }}>
              <StyledBadge
                badgeContent={
                  localStorage.getItem('ledfx-cloud-role') === 'authenticated'
                    ? 'logged in'
                    : localStorage.getItem('ledfx-cloud-role')
                }
                color="primary"
              >
                <GitHub />
              </StyledBadge>
            </ListItemIcon>
            <div>
              <div>{localStorage.getItem('ledfx-cloud-username')}</div>
            </div>
          </MenuItem>
        )}
        {features.cloud && (
          <MenuItem onClick={handleGithubLogin}>
            <ListItemIcon>
              {isLogged ? (
                <Logout />
              ) : loggingIn ? (
                <Box sx={{ display: 'flex', marginLeft: 0.6 }}>
                  <CircularProgress size="0.9rem" />
                </Box>
              ) : (
                <Login />
              )}
            </ListItemIcon>
            {isLogged ? 'Logout' : 'Login with Github'}
          </MenuItem>
        )}
        <MenuLine icon={<Language />} text="Change Host" onClick={changeHost} />
        {isCC && isCreator && (
          <MenuLine icon={<Lan />} text="Host Manager" onClick={changeHostManager} />
        )}

        {renderTourForSlug(slug, closeMenu)}
        <Divider />
        <ContextMenuItems slug={slug} onClose={closeMenu} />
        {slug !== 'Settings' && [
          <Divider key={'divider1'} />,
          <MenuLine
            key={'settings'}
            icon={<Settings />}
            text="Settings"
            onClick={navigateToSettings}
          />
        ]}
        <YeonVMenuItems
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          onThemeModeToggle={handleThemeModeToggle}
          onThemeColorChange={handleThemeColorChange}
        />
      </Menu>
    </>
  )
}

export default TopBarMenu
