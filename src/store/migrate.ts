/* eslint-disable @typescript-eslint/no-unused-vars */

import { produce } from 'immer'
import { Ledfx } from '../api/ledfx'
import useStore, { IStore } from './useStore'
import store from '../app/app/utils/store.mjs'

export interface MigrationState {
  [key: string]: any
}

interface Migrations {
  [version: number]: (state: MigrationState) => MigrationState
}

export const migrations: Migrations = {
  // Adds a new key
  11: produce((draft) => {
    draft.uiPersist = draft.uiPersist || {}
    draft.uiPersist.testZustand = { test: true }
  }),
  // Removes a key
  12: produce((draft) => {
    if (draft.uiPersist) {
      delete draft.uiPersist.testZustand
    }
  }),

  // Removes an existing value (deprecatedValue) and repositions an existing value (existingValue) based on another value (anotherValue)
  14: (state) => {
    const { deprecatedValue, ...rest } = state
    return {
      ...rest,
      existingValue: state.anotherValue + 1 // Change position of an existing value
      // Remove a deprecated value
    }
  },

  // Adds a new value (newValue) based on an existing value (existingValue). Also adds a new function (newFunction)
  15: (state) => ({
    ...state,
    // Transformations for version 15
    newValue: state.existingValue + 1, // Add new value based on existing value
    // Add a new function
    newFunction: () => console.log('New Function')
  }),

  16: (state) => ({ ...state }),
  17: (state) => ({ ...state }),
  18: (state) => ({ ...state }),
  19: (state) => {
    const { variants, ...rest } = state.uiPersist.pixelGraphSettings
    return {
      ...state,
      uiPersist: {
        ...state.uiPersist,
        pixelGraphSettings: {
          ...rest
        }
      }
    }
  },
  20: (state) => {
    return {
      ...state,
      uiPersist: {
        ...state.uiPersist,
        pixelGraphSettings: {
          ...state.uiPersist.pixelGraphSettings,
          variants: 'canvas'
        }
      }
    }
  },
  21: (state) => {
    return {
      ...state,
      updateScene: async (
        name: string,
        id: string,
        scene_image?: string | null,
        scene_tags?: string | null,
        scene_puturl?: string | null,
        scene_payload?: string | null,
        scene_midiactivate?: string | null,
        virtuals?: Record<string, any>
      ) =>
        virtuals
          ? await Ledfx('/api/scenes', 'POST', {
              name,
              id,
              scene_image,
              scene_tags,
              scene_puturl,
              scene_payload,
              scene_midiactivate,
              virtuals
            })
          : await Ledfx('/api/scenes', 'POST', {
              name,
              id,
              scene_image,
              scene_tags,
              scene_puturl,
              scene_payload,
              scene_midiactivate
            })
    }
  },
  22: (state) => ({
    ...state,
    usePerDeviceDelay: false,
    setUsePerDeviceDelay: (newState: boolean) => {
      useStore.setState(
        produce((state: IStore) => {
          state.usePerDeviceDelay = newState
        }),
        false,
        'webaudio/setUsePerDeviceDelay'
      )
    },
    perDeviceDelay: {} as any,
    setPerDeviceDelay: (newState: any) => {
      useStore.setState(
        produce((state: IStore) => {
          state.perDeviceDelay = newState
        }),
        false,
        'webaudio/setPerDeviceDelay'
      )
    }
  }),
  23: produce((draft) => {
    draft.config = draft.config || {}
    draft.config.startup_scene_id = ''
  }),
  // Migration 24: Adds the `hosts` array to the main config object.
  24: produce((draft) => {
    if (draft.config) {
      draft.config.hosts = draft.config.hosts || []
    }
  }),

  // Migration 25: Adds the `groupMode` flag for the matrix editor assistant.
  25: produce((draft) => {
    if (draft.uiPersist && draft.uiPersist.assistant) {
      // Set a sensible default.
      draft.uiPersist.assistant.groupMode = true
    }
  }),

  // Migration 26: Adds state for the new QR Connector feature.
  26: produce((draft) => {
    if (draft.dialogs) {
      draft.dialogs.qrConnector = { open: false, edit: false }
    }
    draft.userClosedQrConnector = false
  }),

  // Migration 27: Normalizes the shape of cleared effects in virtuals.
  // This prevents bugs by ensuring old, empty effects match the new format.
  27: produce((draft) => {
    if (draft.virtuals) {
      for (const virtId in draft.virtuals) {
        const effect = draft.virtuals[virtId]?.effect
        // Check for the old format: { type: '', name: '', config: {} }
        if (effect && effect.type === '' && Object.keys(effect.config).length === 0) {
          draft.virtuals[virtId].effect.type = null
          draft.virtuals[virtId].effect.config = null
        }
      }
    }
  }),

  // Migration 28: Adds the new state properties for the Matrix Editor workflow.
  28: produce((draft) => {
    draft.isExternalEditorOpen = false
    draft.virtualEditorIsDirty = false
    draft.virtualEditorSnapshot = null
    // `externalStudioRef` is correctly not included as it's not persisted.
  }),

  // Migration 29: Adds playlist feature state
  29: produce((draft) => {
    // Initialize playlist state
    draft.playlists = {}
    draft.currentPlaylist = null
    draft.playlistRuntimeState = null
    draft.playlistOrder = []
  }),

  // Migration 30: Adds global color widget UI state
  30: produce((draft) => {
    if (draft.ui) {
      draft.ui.globalColorWidgetX = 50
      draft.ui.globalColorWidgetY = 200
      draft.ui.globalColorWidget = false
    }
  }),

  // Migration 31: Updates preset structure and adds new store methods
  31: produce((draft) => {
    // Update presets structure to match new API response
    if (draft.presets) {
      // If old structure exists, migrate it
      if (draft.presets.default_presets || draft.presets.custom_presets) {
        draft.presets.ledfx_presets = draft.presets.default_presets || {}
        draft.presets.user_presets = draft.presets.custom_presets || {}
      } else {
        // Initialize new structure
        draft.presets.ledfx_presets = {}
        draft.presets.user_presets = {}
      }
    } else {
      // Initialize if presets doesn't exist
      draft.presets = {
        ledfx_presets: {},
        user_presets: {}
      }
    }

    // Add new feature flags
    if (draft.features) {
      draft.features.scenePlaylistBackend = false
      draft.features.showPlaylistInBottomBar = false
      draft.features.showFlowInBottomBar = false
    }

    if (draft.showFeatures) {
      draft.showFeatures.scenePlaylistBackend = false
      draft.showFeatures.showPlaylistInBottomBar = false
      draft.showFeatures.showFlowInBottomBar = false
    }
  }),

  // Migration 32: Add storeAssets state
  32: produce((draft) => {
    draft.assets = []
    draft.assetsFixed = []
    draft.cacheStats = null
  }),

  // Migration 33: Add LIFX device discovery assistant
  33: produce((draft) => {
    if (draft.assistant) {
      draft.assistant.lifx = true
    }
  }),

  // Migration 34: Add Song Detector Plus state
  34: produce((draft) => {
    draft.thumbnailPath = ''
    draft.albumArtCacheBuster = 0
    draft.position = null
    draft.duration = null
    draft.playing = false
    draft.timestamp = null
    draft.textAutoApply = false
    draft.textVirtuals = []
    draft.gradientAutoApply = false
    draft.gradientVirtuals = []
    draft.selectedGradient = null
    draft.gradients = []
    draft.extractedColors = []
    draft.imageAutoApply = false
    draft.imageVirtuals = []
    draft.imageConfig = {
      background_brightness: 1,
      background_color: '#000000',
      blur: 0,
      brightness: 1,
      clip: false,
      flip_horizontal: false,
      flip_vertical: false,
      min_size: 1
    }
  }),

  // Migration 35: Add Song Detector Plus UI state
  35: produce((draft) => {
    if (draft.ui) {
      draft.ui.sdPlusX = 50
      draft.ui.sdPlusY = 200
      draft.ui.sdPlus = false
      draft.ui.songDetectorScreenOpen = false
    }
  }),

  // Migration 36: Update feature flags - remove YouTube and add new bottom bar features
  36: produce((draft) => {
    if (draft.features) {
      delete draft.features.youtube
      draft.features.showAssetManagerInBottomBar = false
      draft.features.showMidiInBottomBar = false
      draft.features.showGamepadInBottomBar = false
      draft.features.showVisualiserInBottomBar = false
    }

    if (draft.showFeatures) {
      delete draft.showFeatures.youtube
      draft.showFeatures.showAssetManagerInBottomBar = false
      draft.showFeatures.showMidiInBottomBar = false
      draft.showFeatures.showGamepadInBottomBar = false
      draft.showFeatures.showVisualiserInBottomBar = false
    }
  }),

  // Migration 37: Change showMatrix default to true
  37: produce((draft) => {
    // Only update if showMatrix exists and is false (old default)
    if (draft.showMatrix === false) {
      draft.showMatrix = true
    }
  }),

  // Migration 38: Set midiOpen to false
  38: produce((draft) => {
    draft.midiOpen = false
  }),
  // Migration 39: Add client management state
  39: produce((draft) => {
    // Add clientIdentity state
    if (!draft.clientIdentity) {
      draft.clientIdentity = {
        deviceId: '',
        name: '',
        type: 'unknown',
        clientId: undefined
      }
    }
    // Add clients map
    if (!draft.clients) {
      draft.clients = {}
    }
    // Add client management dialog state
    if (draft.dialogs && !draft.dialogs.clientManagement) {
      draft.dialogs.clientManagement = { open: false }
    }
  }),

  // Migration 40: Add 'showVisualisersOnDevicesPage' feature flag
  40: produce((draft) => {
    if (draft.features) {
      draft.features.showVisualisersOnDevicesPage = false
    }
    if (draft.showFeatures) {
      draft.showFeatures.showVisualisersOnDevicesPage = false
    }
  }),

  // Migration 41: Remove clientIdentity from persisted state if present
  41: produce((draft) => {
    // Remove clientIdentity from persisted state if present
    if (draft.clientIdentity) {
      delete draft.clientIdentity
    }
    // Initialize visualizerConfigOptimistic if missing
    if (typeof draft.visualizerConfigOptimistic === 'undefined') {
      draft.visualizerConfigOptimistic = undefined
    }
  }),

  // Migration 42: Add Song Detector and visualizer config fields, migrate optimistic config structure
  42: produce((draft) => {
    // Song Detector: add isActiveVisualisers and textVisualisers if missing
    if (typeof draft.isActiveVisualisers === 'undefined') {
      draft.isActiveVisualisers = false
    }
    if (typeof draft.textVisualisers === 'undefined') {
      draft.textVisualisers = []
    }

    // Migrate visualizerConfigOptimistic to new per-instance structure if needed
    if (draft.visualizerConfigOptimistic && !Array.isArray(draft.visualizerConfigOptimistic)) {
      // If old structure: was a flat object with per-visualType keys, not per-instance
      // Detect if any keys are not instance names (e.g., 'butterchurn', 'matrix', etc.)
      const old = draft.visualizerConfigOptimistic
      const isOldShape = Object.values(old).some(
        (v: any) =>
          v &&
          typeof v === 'object' &&
          v.configs &&
          typeof v.configs === 'object' &&
          Object.keys(v.configs).length > 0 &&
          Object.keys(v).some(
            (k) =>
              ['isPlaying', 'showOverlays', 'autoChange', 'fxEnabled', 'showFxPanel'].includes(k) &&
              typeof v[k] === 'object'
          )
      )
      if (isOldShape) {
        // Convert to new shape: wrap under a default instance name (e.g., 'MAIN')
        draft.visualizerConfigOptimistic = {
          MAIN: {
            visualType: old.visualType || 'butterchurn',
            isPlaying:
              old.isPlaying && typeof old.isPlaying === 'object'
                ? Object.values(old.isPlaying)[0]
                : false,
            showOverlays:
              old.showOverlays && typeof old.showOverlays === 'object'
                ? Object.values(old.showOverlays)[0]
                : true,
            autoChange:
              old.autoChange && typeof old.autoChange === 'object'
                ? Object.values(old.autoChange)[0]
                : false,
            fxEnabled:
              old.fxEnabled && typeof old.fxEnabled === 'object'
                ? Object.values(old.fxEnabled)[0]
                : false,
            showFxPanel:
              old.showFxPanel && typeof old.showFxPanel === 'object'
                ? Object.values(old.showFxPanel)[0]
                : false,
            configs: old.configs || {}
          }
        }
      }
    }
  })
}
