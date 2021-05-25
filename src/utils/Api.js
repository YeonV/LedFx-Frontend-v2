import { Ledfx } from "./Proxy";
import create from "zustand";
import { devtools } from "zustand/middleware";

const useStore = create(
  devtools((set, get) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),

    host: "http://localhost:8888",
    setHost: (host) => {
      window.localStorage.setItem("ledfx-host", host);
      return set((state) => ({
        host: host,
      }));
    },

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

    displays: {},
    getDisplays: async () => {
      const resp = await Ledfx("/api/displays", set);
      if (resp && resp.displays) {
        set({ displays: resp.displays });
      } else {
        set({ dialogs: { nohost: { open: true } } });
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
  }))
);

export default useStore;
