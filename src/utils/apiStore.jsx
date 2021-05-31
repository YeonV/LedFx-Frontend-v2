import { Ledfx } from "./apiProxy";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const useStore = create(
  persist(
    devtools((set, get) => ({
      host: "http://localhost:8888",
      setHost: (host) => {
        window.localStorage.setItem("ledfx-host", host);
        return set((state) => ({
          host: host,
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
        },
      },
      setDialogOpen: (open, edit = false) =>
        set((state) => ({
          dialogs: {
            nohost: {
              open: open,
              edit: edit,
            },
          },
        })),
      ui: {
        snackbar: {
          isOpen: false,
          type: "error",
          message: "NO MESSAGE",
        },
      },
      setLeftBarOpen: (open) =>
        set((state) => ({
          bars: {
            leftBar: {
              open: open,
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

      displays: {},
      getDisplays: async () => {
        const resp = await Ledfx("/api/displays", set);
        if (resp && resp.displays) {
          set({ displays: resp.displays });
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      clearDisplayEffect: async (displayId, { type, config, active }) => {
        const resp = await Ledfx(
          `/api/displays/${displayId}/effects`,
          set,
          "DELETE"
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
          "POST",
          {
            type,
            config,
            active,
          }
        );
        console.log(resp);

        if (resp && resp.effect) {

          set({
            displays: get().displays, ...{
              [displayId]: {
                effect: {
                  type: resp.effect.type,
                  name: resp.effect.name,
                  config: resp.effect.config,
                }
              },
            }


          });
        } else {
          console.log("NOT GOOD:", resp)
        }
      },
      updateDisplayEffect: async (displayId, { type, config, active }) => {
        const resp = await Ledfx(
          `/api/displays/${displayId}/effects`,
          set,
          "PUT",
          {
            type,
            config,
            active,
          }
        );
        if (resp && resp.status && resp.status === "success") {
          if (resp && resp.effect) {

            set({
              displays: get().displays, ...{
                [displayId]: {
                  effect: {
                    type: resp.effect.type,
                    name: resp.effect.name,
                    config: resp.effect.config,
                  }
                },
              }


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
        if (resp && resp.status === "success") {
          set({ presets: resp });
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      addPreset: async (effectId, name) => {
        const resp = await Ledfx(
          `/api/displays/${effectId}/presets`,
          set,
          "POST",
          {
            name,
          }
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
          "PUT",
          {
            category: category,
            effect_id: effectType,
            preset_id: presetId,
          }
        );
        if (resp && resp.preset) {
          // set({ presets: resp.preset });
          console.log(resp);
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      removePreset: async (effectId, presetId) => {
        const resp = await Ledfx(
          `/api/effects/${effectId}/presets`,
          set,
          "DELETE",
          {
            preset_id: presetId,
            category: "user_presets",
          }
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
        const resp = await Ledfx("/api/scenes", set);
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
          "POST",
          {
            name,
            scene_image
          }
        );
        console.log(resp);
        // if (resp && resp.preset) {
        //   // set({ presets: resp.preset });
        // } else {
        //   // set({ dialogs: { nohost: { open: true } } });
        // }
      },
      integrations: {},
      getIntegrations: async () => {
        const resp = await Ledfx("/api/integrations", set);
        if (resp && resp.integrations) {
          set({ integrations: resp.integrations });
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      schemas: {},
      getSchemas: async () => {
        const resp = await Ledfx("/api/schema", set);
        if (resp) {
          set({ schemas: resp });
        } else {
          // set({ dialogs: { nohost: { open: true } } });
        }
      },
      config: {},
      getSystemConfig: async () => {
        const resp = await Ledfx("/api/config", set);
        if (resp && resp.config) {
          set({ config: { ...resp.config, ...{ ledfx_presets: undefined } } });
        } else {
          set({ dialogs: { nohost: { open: true } } });
        }
      },

      togglePause: async () => {
        const resp = await Ledfx("/api/displays", set, "PUT", {});
        if (resp && resp.data) {
          console.log(resp.data);
        }
      },
      shutdown: async () => {
        const resp = await Ledfx("/api/power", set, "POST", {
          timeout: 0,
          action: "shutdown",
        });
        if (resp && resp.data) {
          console.log(resp.data);
        }
      },
      restart: async () => {
        const resp = await Ledfx("/api/power", set, "POST", {
          timeout: 0,
          action: "restart",
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
    }))
  )
);

export default useStore;
