import {
  Divider,
  MenuItem,
  Select,
  Stack,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material'
import BladeIcon from '../../Icons/BladeIcon/BladeIcon'
import { ledfxThemes, themes } from '../../../themes/AppThemes'
import { getThemeColor, getThemeMode } from './BarTop.utils'

interface YeonVMenuItemsProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
  onThemeModeToggle: () => void
  onThemeColorChange: (color: string) => void
}

export const YeonVMenuItems = ({
  currentTheme,
  onThemeChange,
  onThemeModeToggle,
  onThemeColorChange
}: YeonVMenuItemsProps) => {
  const theme = useTheme()

  if (localStorage.getItem('username') !== 'YeonV') return null

  return [
    <Divider key={'divider2'} />,
    <Select
      key="theme-select"
      IconComponent={() => null}
      fullWidth
      sx={{ pl: 2 }}
      disableUnderline
      value={currentTheme}
      onChange={(e) => onThemeChange(e.target.value)}
    >
      {Object.keys(ledfxThemes).map((t) => (
        <MenuItem key={t} value={t}>
          <Stack direction={'row'}>
            <ListItemIcon sx={{ alignItems: 'center', minWidth: 38 }}>
              <BladeIcon name={t.startsWith('Dark') ? 'DarkMode' : 'LightMode'} />
            </ListItemIcon>
            <ListItemText>{t}</ListItemText>
          </Stack>
        </MenuItem>
      ))}
    </Select>,
    <MenuItem key="theme-mode-toggle" onClick={onThemeModeToggle}>
      <Stack direction={'row'}>
        <ListItemIcon sx={{ alignItems: 'center', minWidth: 38 }}>
          <BladeIcon name={theme.palette.mode === 'dark' ? 'DarkMode' : 'LightMode'} />
        </ListItemIcon>
        <ListItemText>DarkMode</ListItemText>
      </Stack>
    </MenuItem>,
    <Select
      key="color-select"
      IconComponent={() => null}
      fullWidth
      sx={{ pl: 2 }}
      disableUnderline
      value={getThemeColor(currentTheme, getThemeMode(currentTheme))}
      onChange={(e) => onThemeColorChange(e.target.value)}
    >
      {Object.keys(themes).map((t) => (
        <MenuItem key={t} value={t}>
          <Stack direction={'row'}>
            <ListItemIcon
              sx={{
                alignItems: 'center',
                minWidth: 38,
                color: themes[t as keyof typeof themes][theme.palette.mode].palette.primary.main
              }}
            >
              <BladeIcon name={'circle'} />
            </ListItemIcon>
            <ListItemText>{t.charAt(0).toUpperCase() + t.slice(1)}</ListItemText>
          </Stack>
        </MenuItem>
      ))}
    </Select>
  ]
}
