import React, { useState, useEffect } from 'react'
import { IconButton } from '@mui/material'
import { useVirtualCursor } from '../../hooks/useVirtualCursor'
import VirtualCursor from '../VirtualCursor'
import { TbDeviceRemoteFilled } from 'react-icons/tb'
import { BsDpad } from 'react-icons/bs'

// Declare the interface for TypeScript
declare global {
  interface Window {
    AndroidRemoteControl?: {
      // eslint-disable-next-line no-unused-vars
      setCustomNavigation: (enabled: boolean) => void
      exitApp: () => void
    }
  }
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

const FireTvController: React.FC = () => {
  const [isCustomMode, setIsCustomMode] = useState(false)

  // Add virtual cursor
  const { cursorPos } = useVirtualCursor(isCustomMode)

  useEffect(() => {
    const handleRemoteEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; code: string; keyCode: number }>
      const { keyCode } = customEvent.detail

      // Handle MENU button to toggle custom mode
      if (keyCode === 82) {
        toggleNavigationMode()
      }
    }

    window.addEventListener('androidremote', handleRemoteEvent)
    return () => window.removeEventListener('androidremote', handleRemoteEvent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCustomMode])

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
    <>
      <VirtualCursor x={cursorPos.x} y={cursorPos.y} visible={isCustomMode} />
      <IconButton size="small" onClick={toggleNavigationMode}>
        {isCustomMode ? <TbDeviceRemoteFilled fill="inherit" /> : <BsDpad fill="inherit" />}
      </IconButton>
    </>
  )
}

export const handleExit = () => {
  if (window.AndroidRemoteControl) {
    // Optionally show a confirmation dialog
    if (window.confirm('Are you sure you want to exit the app?')) {
      window.AndroidRemoteControl.exitApp()
    }
  } else {
    console.warn('AndroidRemoteControl not available (not running on Android)')
  }
}

export default FireTvController
