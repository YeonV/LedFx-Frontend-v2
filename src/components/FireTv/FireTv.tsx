import { useEffect } from 'react'
import { IconButton } from '@mui/material'
import { useVirtualCursor } from './useVirtualCursor'
import VirtualCursor from './VirtualCursor'
import { TbDeviceRemoteFilled } from 'react-icons/tb'
import { BsDpad } from 'react-icons/bs'
import { useFireTvStore } from './useFireTvStore'
import { FireTvButtonConfig } from './FireTv.props'

const KEYCODES = {
  MENU: 82,
  PLAY_PAUSE: 179,
  REWIND: 227,
  FORWARD: 228,
  ENTER: 13,
  DPAD_UP: 38,
  DPAD_DOWN: 40,
  DPAD_LEFT: 37,
  DPAD_RIGHT: 39,
  BACK: 4,
  HOME: 3
}

const FireTv: React.FC = () => {
  const isCustomMode = useFireTvStore((state) => state.isCustomMode)
  const toggleCustomMode = useFireTvStore((state) => state.toggleCustomMode)
  const buttons = useFireTvStore((state) => state.buttons)

  const { cursorPos } = useVirtualCursor(isCustomMode)

  useEffect(() => {
    const handleRemoteEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; code: string; keyCode: number }>
      const { keyCode } = customEvent.detail

      // Menu button - always toggles custom mode
      if (keyCode === KEYCODES.MENU) {
        toggleCustomMode()
        return
      }

      // Map keyCode to button name
      const buttonMap: Record<number, keyof typeof buttons> = {
        [KEYCODES.PLAY_PAUSE]: 'play',
        [KEYCODES.REWIND]: 'rewind',
        [KEYCODES.FORWARD]: 'forward',
        [KEYCODES.ENTER]: 'enter',
        [KEYCODES.BACK]: 'back',
        [KEYCODES.HOME]: 'home',
        [KEYCODES.DPAD_UP]: 'up',
        [KEYCODES.DPAD_DOWN]: 'down',
        [KEYCODES.DPAD_LEFT]: 'left',
        [KEYCODES.DPAD_RIGHT]: 'right'
      }

      const buttonName = buttonMap[keyCode]
      if (buttonName) {
        const buttonConfig = buttons[buttonName]

        if (buttonConfig && typeof buttonConfig === 'object') {
          const config = buttonConfig as FireTvButtonConfig
          if (typeof config === 'object' && config.action) {
            config.action()
          }
        }
      }
    }

    window.addEventListener('androidremote', handleRemoteEvent)
    return () => window.removeEventListener('androidremote', handleRemoteEvent)
  }, [toggleCustomMode, buttons])

  return (
    <>
      <VirtualCursor x={cursorPos.x} y={cursorPos.y} visible={isCustomMode} />
      <IconButton size="small" onClick={toggleCustomMode}>
        {isCustomMode ? <TbDeviceRemoteFilled fill="inherit" /> : <BsDpad fill="inherit" />}
      </IconButton>
    </>
  )
}

export default FireTv
