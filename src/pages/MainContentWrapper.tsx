import { Box, useMediaQuery, useTheme } from '@mui/material'
import useStore from '../store/useStore'
import { drawerWidth, ios } from '../utils/helpers'

const MainContentWrapper = ({
  children,
  isDisplayMode
}: {
  children: React.ReactNode
  isDisplayMode: boolean
}) => {
  const theme = useTheme()
  const xsmallScreen = useMediaQuery('(max-width: 475px)')
  const leftBarOpen = useStore((state) => state.ui.bars && state.ui.bars.leftBar.open)

  return (
    <Box
      id="yz-main-content"
      sx={[
        isDisplayMode
          ? {
              // Display mode: No padding, no margins, full viewport
              flexGrow: 1,
              background: 'transparent',
              padding: 0,
              margin: 0,
              width: '100vw',
              height: '100vh',
              overflow: 'hidden'
            }
          : {
              // Normal mode: Standard layout with transitions
              flexGrow: 1,
              background: 'transparent',
              padding: ios || xsmallScreen ? '0 !important' : theme.spacing(0),

              transition: theme.transitions.create('margin', {
                easing: leftBarOpen
                  ? theme.transitions.easing.easeOut
                  : theme.transitions.easing.sharp,
                duration: leftBarOpen
                  ? theme.transitions.duration.enteringScreen
                  : theme.transitions.duration.leavingScreen
              }),

              '@media (max-width: 580px)': {
                padding: '8px'
              }
            },
        !isDisplayMode && leftBarOpen
          ? {
              marginLeft: 0
            }
          : !isDisplayMode && {
              marginLeft: `-${drawerWidth}px`
            }
      ]}
    >
      {!isDisplayMode && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar
          }}
        />
      )}
      {children}
    </Box>
  )
}

export default MainContentWrapper
