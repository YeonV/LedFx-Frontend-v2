import { Box, Typography, useTheme } from '@mui/material'
import { IMCell } from './M.utils'
import useStore from '../../../../store/useStore'

const Pixel = ({
  m,
  currentColIndex,
  classes,
  currentRowIndex,
  // decodedPixels,
  // colN,
  // pixels,
  yzcolumn,
  selectedGroup,
  error,
  setCurrentCell,
  setCurrentDevice,
  setSelectedPixel,
  openContextMenu,
  isDragging,
  move,
  bgColor = 'transparent'
}: {
  m: IMCell[][]
  currentColIndex: number
  classes: any
  currentRowIndex: number
  move: boolean
  // decodedPixels: any
  // colN: number
  // pixels: any
  yzcolumn: IMCell
  selectedGroup: string
  error: {
    row: number
    col: number
  }[]
  setCurrentCell: any
  setCurrentDevice: any
  setSelectedPixel: any
  openContextMenu: any
  isDragging: boolean
  bgColor?: string
}) => {
  const theme = useTheme()
  const devices = useStore((state) => state.devices)
  // const mode = useStore((state) => state.config).transmission_mode
  if (error.length > 0) console.log(isDragging, error)

  const isSelected = yzcolumn.group && yzcolumn.group === selectedGroup

  const isGroupActive = move && isSelected

  const getDynamicStyles = () => {
    // Base style from your classes.pixel
    const styles = {
      ...classes.pixel,
      transition: 'all 0.2s ease-in-out'
    }

    // --- Highlighting Logic ---
    if (isGroupActive) {
      styles.borderColor = theme.palette.primary.light // Change the existing border color
      styles.boxShadow = `inset 0 0 8px 2px ${theme.palette.primary.main}` // Add the glow
    } else if (isSelected) {
      styles.borderColor = theme.palette.primary.main // Subtle highlight
      styles.boxShadow = `inset 0 0 8px 2px ${theme.palette.primary.main}`
    }

    // --- Opacity Logic ---
    if (isDragging || isSelected) {
      styles.opacity = isSelected ? 1 : 0.2
    } else if (selectedGroup) {
      styles.opacity = isSelected ? 1 : 0.4
    }

    return styles
  }
  const getDragStyles = () => {
    // Base style from your classes.pixel
    const styles = {
      transition: 'all 0.2s ease-in-out',
      opacity: 1
    }

    // --- Opacity Logic ---
    if (isDragging) {
      styles.opacity = isSelected ? 1 : 0.2
    } else if (selectedGroup) {
      styles.opacity = isSelected ? 1 : 0.4
    }

    return styles
  }

  return (
    <Box
      key={`col-${currentColIndex}`}
      sx={[
        {
          transition: 'all 0.2s ease-in-out',
          backgroundColor: bgColor
        },
        getDragStyles()
      ]}
      onContextMenu={(e) => {
        e.preventDefault()
        setCurrentCell([currentColIndex, currentRowIndex])
        setCurrentDevice(yzcolumn.deviceId !== '' ? yzcolumn.deviceId : '')
        setSelectedPixel(yzcolumn.pixel || 0)

        if (
          currentRowIndex > -1 &&
          currentColIndex > -1 &&
          m[currentRowIndex][currentColIndex]?.deviceId !== ''
        ) {
          openContextMenu(e)
        }
      }}
    >
      {yzcolumn.deviceId !== '' && (
        <Box className={classes.pixel} sx={getDynamicStyles()}>
          <Typography variant="caption">{devices[yzcolumn.deviceId].config.name}</Typography>
          <Typography variant="caption">{yzcolumn.pixel}</Typography>
        </Box>
      )}
    </Box>
  )
}

export default Pixel
