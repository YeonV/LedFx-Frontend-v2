import { Box, Typography, useTheme } from '@mui/material'
import { IMCell } from './M.utils'
import { useMatrixEditorContext } from './MatrixEditorContext'
import useStore from '../../../../store/useStore'

// The props are now lean. It only needs to know its own data and styling classes.
interface PixelProps {
  classes: any
  yzcolumn: IMCell
}

const Pixel = ({ classes, yzcolumn }: PixelProps) => {
  const theme = useTheme()
  const devices = useStore((state) => state.devices)

  // Get all the state it needs for styling and logic directly from the context.
  const { selectedGroup, isDragging, move } = useMatrixEditorContext()

  const isSelected = yzcolumn.group && yzcolumn.group === selectedGroup
  const isGroupActive = move && isSelected

  const getDynamicStyles = () => {
    // Start with the base styles from the classes prop.
    const styles: any = {
      ...classes.pixel,
      transition: 'all 0.2s ease-in-out'
    }

    // --- Highlighting Logic ---
    if (isGroupActive) {
      // Primary highlight for the group being actively moved (by buttons or DnD)
      styles.borderColor = theme.palette.primary.light
      styles.boxShadow = `inset 0 0 8px 2px ${theme.palette.primary.main}`
    } else if (isSelected) {
      // Subtle highlight for a group that is just selected from the dropdown
      styles.borderColor = theme.palette.primary.main
    }

    // --- Opacity Logic ---
    if (isDragging) {
      // If any drag is happening...
      if (move) {
        // In group move mode, make the selected group stand out.
        styles.opacity = isSelected ? 1 : 0.2
      } else {
        // In single pixel move mode, just fade everything slightly.
        styles.opacity = 0.6
      }
    } else if (move && selectedGroup) {
      // If not dragging, but in move mode with a selection, highlight the active group.
      styles.opacity = isSelected ? 1 : 0.4
    }

    return styles
  }

  // Defensive lookup for device name to prevent crashes
  const deviceName = devices[yzcolumn.deviceId]?.config.name ?? 'Unknown Device'

  return (
    // The outer Box is just a container. The inner Box is the styled pixel.
    <Box>
      {yzcolumn.deviceId !== '' ? (
        <Box className={classes.pixel} sx={getDynamicStyles()}>
          <Typography variant="caption" noWrap title={deviceName}>
            {deviceName}
          </Typography>
          <Typography variant="caption">{yzcolumn.pixel}</Typography>
        </Box>
      ) : (
        // Render an empty, unstyled box to maintain grid structure for empty cells.
        <Box
          className={classes.pixel}
          sx={{ borderColor: 'transparent', background: 'transparent' }}
        />
      )}
    </Box>
  )
}

export default Pixel
