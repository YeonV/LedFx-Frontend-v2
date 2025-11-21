import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Button, Stack } from '@mui/material'
import { setAndroidCustomNavigation, getAndroidAbi, isAndroidApp } from './android.bridge'

interface RemoteEvent {
  key: string
  code: string
  keyCode: number
  timestamp: string
}

/**
 * Fire TV codes:
 * Via Debug Menu:
 * ArrowRight code: ArrowRight keyCode: 39
 * ArrowDown code: ArrowDown keyCode: 40
 * ArrowLeft code: ArrowLeft keyCode: 37
 * ArrowUp code: ArrowLeft ArrowUp: 38
 * MediaRewind code: MediaRewind keycode: 227
 * MediaPlayPause code: MediaPlayPause keycode: 179
 * MediaFastForward code: MediaFastForward keycode: 228
 * Enter code: NumpadEnter keyCode: 13
 * Via Remote:
 * Menu code: KEYCODE_MENU keyCode: 82
 */

const FireTvDebugger: React.FC = () => {
  const [events, setEvents] = useState<RemoteEvent[]>([])
  const [isCustomMode, setIsCustomMode] = useState(false)

  useEffect(() => {
    const handleRemoteEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; code: string; keyCode: number }>
      const { key, code, keyCode } = customEvent.detail

      // Add to event log
      setEvents((prev) =>
        [
          {
            key,
            code,
            keyCode,
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev
        ].slice(0, 15)
      )

      // Handle MENU button to toggle custom mode
      if (keyCode === 82) {
        toggleNavigationMode()
      }
    }

    window.addEventListener('androidremote', handleRemoteEvent)
    return () => window.removeEventListener('androidremote', handleRemoteEvent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleNavigationMode = () => {
    const newMode = !isCustomMode
    setIsCustomMode(newMode)

    setAndroidCustomNavigation(newMode)
    console.log(`Navigation mode: ${newMode ? 'CUSTOM (cursor)' : 'NATIVE (focus)'}`)
  }

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 2,
        p: 2,
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        border: '1px solid #2196F3',
        width: '100%'
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6" color="#2196F3">
          📱 FireTV
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={toggleNavigationMode}
          sx={{
            backgroundColor: isCustomMode ? '#4CAF50' : '#FF9800',
            '&:hover': {
              backgroundColor: isCustomMode ? '#45a049' : '#F57C00'
            },
            fontWeight: 'bold',
            fontSize: '0.75rem',
            px: 2
          }}
        >
          {isCustomMode ? '🎯 Custom' : '🎮 Native'}
        </Button>
      </Stack>

      {/* Android System Info */}

      {/* Event Log */}
      <Box>
        <Typography variant="subtitle2" color="#2196F3">
          Recent Events:
        </Typography>
        <Box
          sx={{
            mt: 1,
            p: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 1,
            maxHeight: 200,
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            height: 100,
            mb: 2
          }}
        >
          {events.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              Waiting for remote input...
            </Typography>
          ) : (
            events.map((evt, idx) => (
              <Box key={idx} sx={{ mb: 0.5 }}>
                <span style={{ color: '#64B5F6' }}>{evt.key}</span>
                <span style={{ color: '#888', marginLeft: 8 }}>code: {evt.code}</span>
                <span style={{ color: '#888', marginLeft: 8 }}>keyCode: {evt.keyCode}</span>
                <span style={{ color: '#666', marginLeft: 8, fontSize: '0.75rem' }}>
                  {evt.timestamp}
                </span>
              </Box>
            ))
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="#2196F3">
          Android Info:
        </Typography>
        <Box
          component="table"
          sx={{
            mt: 1,
            width: '100%',
            '& td': {
              padding: '4px 8px',
              fontSize: '0.85rem',
              fontFamily: 'monospace'
            },
            '& td:first-of-type': {
              color: '#64B5F6',
              fontWeight: 'bold',
              width: '40%'
            }
          }}
        >
          <tbody>
            <tr>
              <td>Android Bridge:</td>
              <td>{isAndroidApp() ? '✅ Available' : '❌ Not Available'}</td>
            </tr>
            {isAndroidApp() && (
              <>
                <tr>
                  <td>CPU ABI:</td>
                  <td>{getAndroidAbi()}</td>
                </tr>
                {window.AndroidRemoteControl?.getAppVersion && (
                  <tr>
                    <td>App Version:</td>
                    <td>{window.AndroidRemoteControl.getAppVersion()}</td>
                  </tr>
                )}
                {window.AndroidRemoteControl?.getAllSupportedAbis && (
                  <tr>
                    <td>Supported ABIs:</td>
                    <td>{window.AndroidRemoteControl.getAllSupportedAbis()}</td>
                  </tr>
                )}
              </>
            )}
            <tr>
              <td>User Agent:</td>
              <td style={{ fontSize: '0.75rem', wordBreak: 'break-word' }}>
                {navigator.userAgent}
              </td>
            </tr>
          </tbody>
        </Box>
      </Box>
    </Paper>
  )
}

export default FireTvDebugger
