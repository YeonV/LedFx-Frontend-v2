import { Box, Portal } from '@mui/material'

interface VirtualCursorProps {
  x: number
  y: number
  visible: boolean
}

const VirtualCursor: React.FC<VirtualCursorProps> = ({ x, y, visible }) => {
  if (!visible) return null

  return (
    <Portal>
      {/* Cursor dot */}
      <Box
        sx={{
          position: 'fixed !important',
          left: `${x}px !important`,
          top: `${y}px !important`,
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: 'rgba(33, 150, 243, 0.8)',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          zIndex: '2147483647 !important',
          boxShadow: '0 0 20px rgba(33, 150, 243, 0.8), 0 0 40px rgba(33, 150, 243, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          transition: 'all 0.05s ease-out'
        }}
      />
      {/* Crosshair */}
      <Box
        sx={{
          position: 'fixed !important',
          left: `${x}px !important`,
          top: `${y}px !important`,
          width: 40,
          height: 40,
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          zIndex: '2147483646 !important',
          border: '1px solid rgba(33, 150, 243, 0.5)',
          borderRadius: '50%',
          transition: 'all 0.05s ease-out'
        }}
      />
      {/* Coordinate display */}
      {/* <Box
        sx={{
          position: 'fixed !important',
          left: `${x + 25}px !important`,
          top: `${y - 25}px !important`,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#2196F3',
          padding: '4px 8px',
          borderRadius: 1,
          fontSize: '0.7rem',
          fontFamily: 'monospace',
          pointerEvents: 'none',
          zIndex: '2147483647 !important',
          whiteSpace: 'nowrap'
        }}
      >
        {Math.round(x)}, {Math.round(y)}
      </Box> */}
    </Portal>
  )
}

export default VirtualCursor
