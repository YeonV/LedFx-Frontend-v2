import type { Theme } from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme,
  Typography
} from '@mui/material'
import { Send } from '@mui/icons-material'
import { forwardRef } from 'react'
import { makeStyles } from '@mui/styles'
import { MenuLineProps, StyledMenuProps } from './AddButton.props'
import { ios } from '../../utils/helpers'

export const useStyles = makeStyles((theme: Theme) => ({
  globalWrapper: {
    position: 'fixed',
    bottom: ios ? 80 : 56,
    left: 0,
    right: 0,
    paddingLeft: ios ? 6 : 16,
    paddingRight: ios ? 6 : 16,
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    background: ios ? 'rgba(54,54,54,0.8)' : theme.palette.background.paper,
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid #a1998e30',
    alignItems: 'center',
    zIndex: 10
  },
  globalActionBar: {
    flexGrow: 1,
    paddingRight: 2,
    paddingLeft: 0,
    color: theme.palette.primary.main
  }
}))
const PREFIX = 'AddButton'

export const AddBStyle = {
  paper: `${PREFIX}-paper`
}

export const AddBWrapper = styled('div')({
  [`& .${AddBStyle.paper}`]: {
    border: '1px solid rgba(255, 255, 255, 0.12)',
    transform: 'translateY(-1rem) !important'
  }
})

export const MenuLine = forwardRef<HTMLLIElement, MenuLineProps>((props, ref) => {
  const { icon = <Send fontSize="small" />, name = 'MenuItem', description = '', action } = props
  const theme = useTheme()
  return (
    <MenuItem onClick={action} ref={ref}>
      <Stack direction="column" mt={1}>
        <Stack direction="row" spacing={2}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={name} />
        </Stack>
        <ListItemText>
          <Typography
            sx={{ pl: 6.5, mt: '4px !important', mb: 1 }}
            color={theme.palette.text.disabled}
          >
            {description}
          </Typography>
        </ListItemText>
      </Stack>
    </MenuItem>
  )
})

export const StyledMenu = ({ open, ...props }: StyledMenuProps) => (
  <Menu
    elevation={0}
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

export type AnchorState = (EventTarget & HTMLButtonElement) | null
