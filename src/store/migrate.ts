/* eslint-disable no-unused-vars */
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
  })
}
