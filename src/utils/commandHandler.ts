// src/utils/commandHandler.ts
import { EffectConfig } from '../api/ledfx.types'
import useStore from '../store/useStore'
import { log } from './log'

// Define payload types for better safety (optional but highly recommended)
interface ScenePayload {
  scene: string
  // any other scene-specific payload parts
}

interface EffectCommandPayload {
  // As produced by OneEffect
  virtId: string
  type: string
  config: string | EffectConfig // Config might be stringified or an object
  active: boolean
  fallback: number | boolean
}

interface OneShotPayload {
  color?: string
  ramp?: number
  hold?: number
  holdType?: 'press' | 'release' // From MIDIListener example
  fade?: number
}

// Define other payload types as needed...

// Define the shape of your store's state and actions that the command handler will use
// This helps with intellisense and type checking.
type StoreApi = ReturnType<typeof useStore.getState>

// --- Command Strategies ---
// Each strategy takes the payload and the entire store's state/actions object
const commandStrategies: {
  // eslint-disable-next-line no-unused-vars
  [command: string]: (payload: any, store: StoreApi) => void
} = {
  scene: (payload: ScenePayload, store) => {
    store.activateScene(payload.scene)
    const sceneData = store.scenes[payload.scene]
    if (sceneData?.scene_puturl && sceneData?.scene_payload) {
      store.captivateScene(sceneData.scene_puturl, sceneData.scene_payload)
    }
  },

  'play/pause': (_payload: any, store) => {
    store.togglePause()
  },

  'brightness-up': (_payload: any, store) => {
    store.setSystemConfig({
      global_brightness: Math.min(store.config.global_brightness + 0.1, 1).toFixed(2)
    })
  },

  'brightness-down': (_payload: any, store) => {
    store.setSystemConfig({
      global_brightness: Math.max(store.config.global_brightness - 0.1, 0).toFixed(2)
    })
  },

  'one-shot': (payload: OneShotPayload, store) => {
    // Normalize hold logic if it differs based on source (e.g. MIDI noteoff vs Gamepad press)
    // For now, using the example from MIDIListener
    // wtf was this again?
    const holdDuration =
      (payload.holdType && payload.holdType !== 'release') || !payload.holdType
        ? (payload.hold ?? 200) // Default hold if not release type
        : 10000 // Long hold for release type (or specific logic from MIDIListener)

    store.oneShotAll(
      payload.color || '#0dbedc',
      payload.ramp || 10,
      holdDuration,
      payload.fade || 2000
    )
  },

  effect: (payload: EffectCommandPayload, store) => {
    if (!payload || typeof payload.virtId !== 'string' || typeof payload.type !== 'string') {
      console.warn('Effect command called with invalid base payload:', payload)
      return
    }
    if (payload.config) {
      try {
        const parsedConfig =
          typeof payload.config === 'string' ? JSON.parse(payload.config) : payload.config

        store.setEffect(
          payload.virtId,
          payload.type,
          parsedConfig,
          payload.active,
          payload.fallback
        )
      } catch (e) {
        console.error('Error parsing/setting effect config in commandHandler:', payload.config, e)
      }
    } else {
      console.warn('Effect command called without a config payload in commandHandler:', payload)
    }
  },
  'effect-fallback': (payload: Partial<EffectCommandPayload>, store) => {
    if (payload && typeof payload.virtId === 'string') {
      store.setEffectFallback(payload.virtId)
    }
  },

  'copy-to': (_payload: any, store) => {
    // Assuming payload for 'copy-to' might not be used by this handler
    store.setFeatures('streamto', !store.features.streamto)
  },

  transitions: (_payload: any, store) => {
    store.setFeatures('transitions', !store.features.transitions)
  },

  frequencies: (_payload: any, store) => {
    store.setFeatures('frequencies', !store.features.frequencies)
  },

  'scene-playlist': (_payload: any, store) => {
    store.toggleScenePLplay()
  },

  // Add other commands from Gamepad.tsx like 'scan-wled' if they should be global
  'scan-wled': (_payload: any, store) => {
    store.scanForDevices() // Assuming scanForDevices is a store action
  },
  smartbar: (_payload: any, store) => {
    store.ui.setSmartBarOpen(!store.ui.bars.smartBar.open)
  },
  padscreen: (_payload: any, _store) => {
    // not in useStore yet
    // store.ui.setPadScreenOpen(!store.ui.bars.padScreen.open)
  }
}

// --- The Public Execute Command Function ---
export function executeCommand(command: string, payload?: any): void {
  log.purple('CommandHandler', `Attempting to execute: ${command}`, payload)

  const handler = commandStrategies[command]
  const storeApi = useStore.getState() // Get the fresh state and all actions

  if (handler) {
    try {
      handler(payload, storeApi)
      log.purple('CommandHandler', `Executed: ${command}`)
    } catch (error) {
      console.error(
        `[CommandHandler] Error executing command '${command}':`,
        error,
        'Payload:',
        payload
      )
    }
  } else {
    console.warn(`[CommandHandler] No handler found for command: ${command}`)
  }
}
