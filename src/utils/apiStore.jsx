import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Ledfx } from './apiProxy';

const useStore = create(
  persist(
    devtools((set, get) => ({
      host: 'http://localhost:8888',
      setHost: (host) => {
        window.localStorage.setItem('ledfx-host', host);
        return set((state) => ({
          host,
        }));
      },

      // FRONTEND STUFF

      bars: {
        leftBar: {
          open: false,
        },
      },
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
      ui: {
        snackbar: {
          isOpen: false,
          type: 'error',
          message: 'NO MESSAGE',
        },
      },
      setLeftBarOpen: (open) => set((state) => ({
        bars: {
          leftBar: {
            open,
          },
        },
      })),
      showSnackbar: ({ messageType, message }) => {
        set({
          ui: {
            snackbar: { isOpen: true, message, messageType },
          },
        });
      },
      clearSnackbar: () => {
        set({
          ui: {
            snackbar: {
              isOpen: false,
              type: get().ui.snackbar.type,
              message: get().ui.snackbar.message,
            },
          },
        });
      },

      // API
      devices: {},
      getDevices: async () => {
        const resp = await Ledfx('/api/devices', set);
        // console.log("YZ", resp)
        if (resp && resp.devices) {
          set({ devices: resp.devices });
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      addDevice: async (config) => {
        const resp = await Ledfx(
          `/api/devices`,
          set,
          'POST',
          config,
        );
        if (resp) {
          // set({ presets: resp.preset });
          console.log(resp);
          return resp;
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      updateDevice: async (deviceId, config) => {
        const resp = await Ledfx(
          `/api/devices/${deviceId}`,
          set,
          'PUT',
          config,
        );
        if (resp) {
          // set({ presets: resp.preset });
          console.log(resp);
          return resp;
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      displays: {},
      getDisplays: async () => {
        const resp = await Ledfx('/api/displays', set);
        if (resp && resp.displays) {
          set({ displays: resp.displays });
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      addDisplay: async (config) => {
        const resp = await Ledfx(
          `/api/displays`,
          set,
          'POST',
          config,
        );
        if (resp) {
          // set({ presets: resp.preset });
          console.log(resp);
          return resp;
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      deleteDisplay: async (displayId) => {
        const resp = await Ledfx(
          `/api/displays/${displayId}`,
          set,
          'DELETE',
        );
        if (resp && resp.preset) {
          // set({ presets: resp.preset });
          console.log(resp);
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      clearDisplayEffect: async (displayId) => {
        const resp = await Ledfx(
          `/api/displays/${displayId}/effects`,
          set,
          'DELETE',
        );
        console.log(resp);
        // if (resp && resp.displays) {
        //   set({ displays: resp.displays });
        // } else {
        //   set({ dialogs: { nohost: { open: true } } });
        // }
      },
      setDisplayEffect: async (displayId, { type, config, active }) => {
        const resp = await Ledfx(
          `/api/displays/${displayId}/effects`,
          set,
          'POST',
          {
            type,
            config,
            active,
          },
        );
        console.log(resp);

        if (resp && resp.effect) {
          set({
            displays: get().displays,
            ...{
              [displayId]: {
                effect: {
                  type: resp.effect.type,
                  name: resp.effect.name,
                  config: resp.effect.config,
                },
              },
            },

          });
        } else {
          console.log('NOT GOOD:', resp);
        }
      },
      updateDisplayEffect: async (displayId, { type, config, active }) => {
        const resp = await Ledfx(
          `/api/displays/${displayId}/effects`,
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
              displays: get().displays,
              ...{
                [displayId]: {
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
        // else {
        // set({ dialogs: { nohost: { open: true } } });
        // }
      },
      updateDisplaySegments: async ({ displayId, segments }) => {
        const resp = await Ledfx(
          `/api/displays/${displayId}`,
          set,
          'POST',
          {
            segments: [...segments],
          },
        );
        if (resp && resp.status && resp.status === 'success') {
          if (resp && resp.effect) {
            set({
              displays: get().displays,
              ...{
                [displayId]: {
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
        // else {
        // set({ dialogs: { nohost: { open: true } } });
        // }
      },

      presets: {},
      getPresets: async (effectId) => {
        const resp = await Ledfx(`/api/effects/${effectId}/presets`, set);
        if (resp && resp.status === 'success') {
          set({ presets: resp });
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      addPreset: async (effectId, name) => {
        const resp = await Ledfx(
          `/api/displays/${effectId}/presets`,
          set,
          'POST',
          {
            name,
          },
        );
        if (resp && resp.preset) {
          // set({ presets: resp.preset });
          console.log(resp);
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      activatePreset: async (displayId, category, effectType, presetId) => {
        const resp = await Ledfx(
          `/api/displays/${displayId}/presets`,
          set,
          'PUT',
          {
            category,
            effect_id: effectType,
            preset_id: presetId,
          },
        );
        if (resp && resp.status) {
          console.log(resp);
          // set({ presets: resp.preset });
          console.log(resp);
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      deletePreset: async (displayId, presetId) => {
        const resp = await Ledfx(
          `/api/displays/${displayId}/presets`,
          set,
          'DELETE',
          {
            preset_id: presetId,
            category: 'user_presets',
          },
        );
        if (resp && resp.preset) {
          // set({ presets: resp.preset });
          console.log(resp);
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      scenes: {},
      getScenes: async () => {
        const resp = await Ledfx('/api/scenes', set);
        if (resp && resp.scenes) {
          set({ scenes: resp.scenes });
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      addScene: async ({ name, scene_image }) => {
        const resp = await Ledfx(
          '/api/scenes',
          set,
          'POST',
          {
            name,
            scene_image,
          },
        );

        if (resp && resp.status && resp.status === 'success') {
          // set({ presets: resp.preset });
        } else {
          // set({ dialogs: { nohost: { open: true } } });
          console.log('problems while adding Scene', resp);
        }
      },
      activateScene: async ({ id }) => {
        const resp = await Ledfx(
          '/api/scenes',
          set,
          'PUT',
          {
            id,
            action: 'activate',
          },

        );

        if (resp && resp.status && resp.status === 'success') {
          // set({ presets: resp.preset });
        } else {
          // set({ dialogs: { nohost: { open: true } } });
          console.log('problems while adding Scene', resp);
        }
      },
      deleteScene: async (name) => {
        const resp = await Ledfx(
          '/api/scenes',
          set,
          'DELETE',
          { data: { id: name } },
        );
        if (resp && resp.status && resp.status === 'success') {
          // set({ presets: resp.preset });
        } else {
          console.log('problems while adding Scene', resp);
        }
      },
      integrations: {},
      getIntegrations: async () => {
        const resp = await Ledfx('/api/integrations', set);
        if (resp && resp.integrations) {
          set({ integrations: resp.integrations });
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      schemas: {},
      getSchemas: async () => {
        const resp = await Ledfx('/api/schema', set);
        if (resp) {
          set({ schemas: resp });
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      config: {},
      getSystemConfig: async () => {
        const resp = await Ledfx('/api/config', set);
        if (resp && resp.config) {
          set({ config: { ...resp.config, ...{ ledfx_presets: undefined } } });
        } else {
          set({ dialogs: { nohost: { open: true } } });
        }
      },
      deleteSystemConfig: async () => {
        const resp = await Ledfx('/api/config', set, 'DELETE');
        console.log(resp)
      },
      importSystemConfig: async (config) => {
        const resp = await Ledfx('/api/config', set, 'POST', config);
        console.log(resp)
      },
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
        } else {
          // set({ dialogs: { nohost: { open: true } } });
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
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },


      togglePause: async () => {
        const resp = await Ledfx('/api/displays', set, 'PUT', {});
        if (resp && resp.data) {
          console.log(resp.data);
        }
      },
      shutdown: async () => {
        const resp = await Ledfx('/api/power', set, 'POST', {
          timeout: 0,
          action: 'shutdown',
        });
        if (resp && resp.data) {
          console.log(resp.data);
        }
      },
      restart: async () => {
        const resp = await Ledfx('/api/power', set, 'POST', {
          timeout: 0,
          action: 'restart',
        });
        if (resp && resp.data) {
          console.log(resp.data);
        }
      },
      getPing: async (displayId) => {
        const resp = await Ledfx(`/api/ping/${displayId}`, set);
        if (resp && resp.data) {
          return resp.data;
        }
      },
      getDevice: async (deviceId) => {
        const resp = await Ledfx(`/api/devices/${deviceId}`, set);
        if (resp && resp.data) {
          return {
            key: deviceId,
            id: deviceId,
            name: resp.data.name,
            config: resp.data,
            displays: resp.data.displays,
            active_displays: resp.data.active_displays,
          };
        }
      },
    })),
  ),
);

export default useStore;
