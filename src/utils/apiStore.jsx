import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Ledfx } from './apiProxy';

const useStore = create(
  persist(
    devtools((set, get) => ({

      host: 'http://localhost:8888',
      setHost: (host) => {
        window.localStorage.setItem('ledfx-host', host.title ? host.title : host);
        return set((state) => ({
          host,
        }));
      },

      // FRONTEND STUFF

      pixelGraphs: [],
      setPixelGraphs: (virtuals) => set((state) => ({
        pixelGraphs: [...virtuals]
      })),

      dialogs: {
        nohost: {
          open: false,
          edit: false
        },
        addScene: {
          open: false,
        },
        addDevice: {
          open: false,
          edit: {},
        },
        addVirtual: {
          open: false,
          edit: {},
        },
        addIntegration: {
          open: false,
          edit: {},
        },
      },
      setDialogOpen: (open, edit = false) => set((state) => ({
        dialogs: {
          ...state.dialogs,
          nohost: {
            open,
            edit,
          },
        },
      })),
      setDialogOpenAddScene: (open, edit = false) => set((state) => ({
        dialogs: {
          ...state.dialogs,
          addScene: {
            open,
            edit,
          },
        },
      })),
      setDialogOpenAddDevice: (open, edit = false) => set((state) => ({
        dialogs: {
          ...state.dialogs,
          addDevice: {
            open,
            edit,
          },
        },
      })),
      setDialogOpenAddVirtual: (open, edit = false) => set((state) => ({
        dialogs: {
          ...state.dialogs,
          addVirtual: {
            open,
            edit,
          },
        },
      })),
      setDialogOpenAddIntegration: (open, edit = false) => set((state) => ({
        dialogs: {
          ...state.dialogs,
          addIntegration: {
            open,
            edit,
          },
        },
      })),

      ui: {
        snackbar: {
          isOpen: false,
          type: 'error',
          message: 'NO MESSAGE',
        },
        bars: {
          leftBar: {
            open: false,
          },
        }
      },
      setLeftBarOpen: (open) => set((state) => ({
        ui: {
          ...state.ui,
          bars: {
          leftBar: {
            open,
          },
        }},
      })),
      showSnackbar: ({ messageType, message }) => {
        set((state) => ({
          ui: {
            ...state.ui,
            snackbar: { isOpen: true, message, messageType },
          },
        }));
      },
      clearSnackbar: () => {
        set((state) => ({
          ui: {
            ...state.ui,
            snackbar: {
              isOpen: false,
              type: get().ui.snackbar.type,
              message: get().ui.snackbar.message,
            },
          },
        }));
      },

      // API
      devices: {},
      getDevices: async () => {
        const resp = await Ledfx('/api/devices', set);
        if (resp && resp.devices) {
          set({ devices: resp.devices });
        }
      },
      addDevice: async (config) => await Ledfx(
        `/api/devices`,
        set,
        'POST',
        config,
      ),
      updateDevice: async (deviceId, config) => await Ledfx(
        `/api/devices/${deviceId}`,
        set,
        'PUT',
        config,
      ),

      virtuals: {},
      getVirtuals: async () => {
        const resp = await Ledfx('/api/virtuals', set);
        if (resp && resp.virtuals && resp.paused) {
          set({ virtuals: resp.virtuals });
          set({ paused: resp.paused });
        } else {
          if (resp && resp.virtuals) {
            set({ virtuals: resp.virtuals });
          }
        }
      },
      addVirtual: async (config) => await Ledfx(
        `/api/virtuals`,
        set,
        'POST',
        config,
      ),
      deleteVirtual: async (virtId) => await Ledfx(
        `/api/virtuals/${virtId}`,
        set,
        'DELETE',
      ),
      clearVirtualEffect: async (virtId) => await Ledfx(
        `/api/virtuals/${virtId}/effects`,
        set,
        'DELETE',
      ),
      setVirtualEffect: async (virtId, { type, config, active }) => {
        const resp = await Ledfx(
          `/api/virtuals/${virtId}/effects`,
          set,
          'POST',
          {
            type,
            config,
            active,
          },
        );

        if (resp && resp.effect) {
          set({
            virtuals: get().virtuals,
            ...{
              [virtId]: {
                effect: {
                  type: resp.effect.type,
                  name: resp.effect.name,
                  config: resp.effect.config,
                },
              },
            },

          });
        }
      },
      updateVirtualEffect: async (virtId, { type, config, active }) => {
        const resp = await Ledfx(
          `/api/virtuals/${virtId}/effects`,
          set,
          'PUT',
          {
            type,
            config,
            active,
          },
        );
        if (resp && resp.status && resp.status === 'success') {
          if (resp && resp.effect) {
            set({
              virtuals: get().virtuals,
              ...{
                [virtId]: {
                  effect: {
                    type: resp.effect.type,
                    name: resp.effect.name,
                    config: resp.effect.config,
                  },
                },
              },

            });
          }
        }
      },
      updateVirtualSegments: async ({ virtId, segments }) => {
        const resp = await Ledfx(
          `/api/virtuals/${virtId}`,
          set,
          'POST',
          {
            segments: [...segments],
          },
        );
        if (resp && resp.status && resp.status === 'success') {
          if (resp && resp.effect) {
            set({
              virtuals: get().virtuals,
              ...{
                [virtId]: {
                  effect: {
                    type: resp.effect.type,
                    name: resp.effect.name,
                    config: resp.effect.config,
                  },
                },
              },

            });
          }
        }
      },

      presets: {},
      getPresets: async (effectId) => {
        const resp = await Ledfx(`/api/effects/${effectId}/presets`, set);
        if (resp && resp.status === 'success') {
          set({ presets: resp });
        }
      },
      addPreset: async (effectId, name) => await Ledfx(
        `/api/virtuals/${effectId}/presets`,
        set,
        'POST',
        { name }
      ),
      activatePreset: async (virtId, category, effectType, presetId) => await Ledfx(
        `/api/virtuals/${virtId}/presets`,
        set,
        'PUT',
        {
          category,
          effect_id: effectType,
          preset_id: presetId,
        },
      ),
      deletePreset: async (effectId, presetId) => await Ledfx(
        `/api/effects/${effectId}/presets`,
        set,
        'DELETE',
        {
          data: {
            preset_id: presetId,
            category: 'user_presets',
          }
        },
      ),

      scenes: {},
      getScenes: async () => {
        const resp = await Ledfx('/api/scenes', set);
        if (resp && resp.scenes) {
          set({ scenes: resp.scenes });
        }
      },
      addScene: async ({ name, scene_image }) => await Ledfx(
        '/api/scenes',
        set,
        'POST',
        { name, scene_image },
      ),
      activateScene: async ({ id }) => await Ledfx(
        '/api/scenes',
        set,
        'PUT',
        {
          id,
          action: 'activate',
        },

      ),
      deleteScene: async (name) => await Ledfx(
        '/api/scenes',
        set,
        'DELETE',
        { data: { id: name } },
      ),

      integrations: {},
      getIntegrations: async () => {
        const resp = await Ledfx('/api/integrations', set);
        if (resp && resp.integrations) {
          set({ integrations: resp.integrations });
        }
      },
      addIntegration: async (config) => await Ledfx(
        `/api/integrations`,
        set,
        'POST',
        config,
      ),
      updateIntegration: async (config) => await Ledfx(
        `/api/integrations`,
        set,
        'POST',
        config,
      ),
      toggleIntegration: async (config) => await Ledfx(
        `/api/integrations`,
        set,
        'PUT',
        config,
      ),
      deleteIntegration: async (config) => await Ledfx(
        `/api/integrations`,
        set,
        'DELETE',
        { data: { id: config } }
      ),

      schemas: {},
      getSchemas: async () => {
        const resp = await Ledfx('/api/schema', set);
        if (resp) {
          set({ schemas: resp });
        }
      },

      config: {},
      getSystemConfig: async () => {
        const resp = await Ledfx('/api/config', set);
        if (resp && resp.host) {
          set({ config: { ...resp, ...{ ledfx_presets: undefined, devices: undefined, virtuals: undefined, virtuals: undefined, integrations: undefined, scenes: undefined } } });
        } else {
          set({ dialogs: { nohost: { open: true } } });
        }
      },
      setSystemConfig: async ({config}) => await Ledfx('/api/config', set, 'PUT', config),
      deleteSystemConfig: async () => await Ledfx('/api/config', set, 'DELETE'),
      importSystemConfig: async (config) => await Ledfx('/api/config', set, 'POST', config),

      settings: {},
      getAudioInputs: async () => {
        const resp = await Ledfx('/api/audio/devices', set);
        if (resp) {
          set({
            settings: get().settings,
            ...{
              "settings": {
                "audio_inputs": resp,
              }
            },

          });
        }
      },
      setAudioInput: async (index) => {
        const resp = await Ledfx('/api/audio/devices', set, 'PUT', { index: parseInt(index) });
        if (resp && resp.status === 'success') {
          set({
            settings: get().settings,
            ...{
              "settings": {
                audio_inputs: get().settings.audio_inputs,
                "active_device_index": parseInt(index),
              }
            },

          });
        }
      },
      scanForDevices: async () => {
        const resp = await Ledfx('/api/find_devices', set, 'POST', {});
        if (resp && resp.status === 'success') {
          
        } else {
          set({ dialogs: { nohost: { open: true } } });
        }
      },

      paused: false,
      togglePause: async () => {
        const resp = await Ledfx('/api/virtuals', set, 'PUT', {});
        if (resp) {
          set({ paused: resp.paused })
        }
      },

      graphs: false,
      toggleGraphs: () => {
          set((state) => ({ graphs: !state.graphs }))
      },

      shutdown: async () => await Ledfx('/api/power', set, 'POST', {
        timeout: 0,
        action: 'shutdown',
      }),
      restart: async () => await Ledfx('/api/power', set, 'POST', {
        timeout: 0,
        action: 'restart',
      }),
      getPing: async (virtId) => await Ledfx(`/api/ping/${virtId}`, set),
      getDevice: async (deviceId) => {
        const resp = await Ledfx(`/api/devices/${deviceId}`, set);
        if (resp && resp.data) {
          return {
            key: deviceId,
            id: deviceId,
            name: resp.data.name,
            config: resp.data,
            virtuals: resp.data.virtuals,
            active_virtuals: resp.data.active_virtuals,
          };
        }
      },
    })),
  ),
);

export default useStore;
