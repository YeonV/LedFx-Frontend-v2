import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Button, Stack } from '@mui/material'

interface RemoteEvent {
  key: string
  code: string
  keyCode: number
  timestamp: string
}

// Declare the interface for TypeScript
declare global {
  interface Window {
    AndroidRemoteControl?: {
      setCustomNavigation: (enabled: boolean) => void
    }
  }
}

const RemoteDebugger: React.FC = () => {
  const [events, setEvents] = useState<RemoteEvent[]>([])
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())
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

      // Show active state
      setActiveKeys((prev) => new Set(prev).add(key))
      setTimeout(() => {
        setActiveKeys((prev) => {
          const newSet = new Set(prev)
          newSet.delete(key)
          return newSet
        })
      }, 300)
    }

    window.addEventListener('androidremote', handleRemoteEvent)
    return () => window.removeEventListener('androidremote', handleRemoteEvent)
  }, [])

  const toggleNavigationMode = () => {
    const newMode = !isCustomMode
    setIsCustomMode(newMode)

    if (window.AndroidRemoteControl) {
      window.AndroidRemoteControl.setCustomNavigation(newMode)
      console.log(`Navigation mode: ${newMode ? 'CUSTOM (cursor)' : 'NATIVE (focus)'}`)
    } else {
      console.warn('AndroidRemoteControl interface not available')
    }
  }

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 2,
        p: 2,
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        border: '1px solid #2196F3'
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6" color="#2196F3">
          📱 Fire TV Remote Debug
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

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Mode: {isCustomMode ? 'Custom Cursor Navigation' : 'Native Focus Navigation'}
      </Typography>

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
            maxHeight: 150,
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.85rem'
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

      {/* Visual Remote Buttons */}
      <Box
        sx={{
          mb: 2,
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: 1 }}>
          <Box /> {/* Empty cell */}
          <RemoteButton label="UP" isActive={activeKeys.has('ArrowUp')} />
          <Box />
          <RemoteButton label="LEFT" isActive={activeKeys.has('ArrowLeft')} />
          <RemoteButton label="OK" isActive={activeKeys.has('Enter')} />
          <RemoteButton label="RIGHT" isActive={activeKeys.has('ArrowRight')} />
          <Box />
          <RemoteButton label="DOWN" isActive={activeKeys.has('ArrowDown')} />
          <Box />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <RemoteButton label="MENU" isActive={activeKeys.has('Menu')} />
          <RemoteButton label="BACK" isActive={activeKeys.has('Escape')} />
          <RemoteButton label="PLAY" isActive={activeKeys.has('MediaPlayPause')} />
        </Box>
      </Box>
    </Paper>
  )
}

const RemoteButton: React.FC<{ label: string; isActive: boolean }> = ({ label, isActive }) => (
  <Box
    sx={{
      width: 60,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isActive ? '#2196F3' : 'rgba(255,255,255,0.1)',
      color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
      borderRadius: 1,
      fontSize: '0.7rem',
      fontWeight: 'bold',
      transition: 'all 0.1s',
      border: isActive ? '2px solid #64B5F6' : '1px solid rgba(255,255,255,0.2)',
      boxShadow: isActive ? '0 0 10px rgba(33, 150, 243, 0.5)' : 'none'
    }}
  >
    {label}
  </Box>
)

export default RemoteDebugger
