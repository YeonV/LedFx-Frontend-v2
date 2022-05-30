import isElectron from 'is-electron';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Ledfx } from './apiProxy';

const useStore = create(
  persist(
    devtools((set, get) => ({

      host: isElectron() ? 'http://localhost:8888' : window.location.href.split('#')[0],
      setHost: (host) => {
        window.localStorage.setItem('ledfx-host', host.title ? host.title : host);
        return set((state) => ({
          host,
        }));
      },

      // FRONTEND STUFF

      features: {
        dev: false,
        cloud: false,
        wled: false,
        integrations: false,
        spotify: false,
        spotifypro: false,
        youtube: false,
        webaudio: false,
        waves: false,
        streamto: false,
        effectfilter: false,
        transitions: false,
        frequencies: false,
        go: false
      },
      setFeatures: (feat, use) => set((state) => ({
        features: {
          ...state.features,
          [feat]: use
        }
      })),
      showFeatures: {
        dev: false,
        cloud: false,
        wled: false,
        integrations: false,
        spotify: false,
        spotifypro: false,
        youtube: false,
        webaudio: false,
        waves: false,
        streamto: false,
        effectfilter: false,
        transitions: false,
        frequencies: false,
        go: false
      },
      setShowFeatures: (feat, show) => set((state) => ({
        showFeatures: {
          ...state.showFeatures,
          [feat]: show
        }
      })),
      tours: {
        home: false,
        devices: false,
        device: false,
        integrations: false,
        scenes: false,
        settings: false
      },
      setTour: (tour) => set((state) => ({
        tours: {
          ...state.tours,
          [tour]: true
        }
      })),

      settingsExpanded: false,
      setSettingsExpanded: (setting) => set(() => ({
        settingsExpanded: setting
      })),
      disconnected: false,
      setDisconnected: (dis) => set(() => ({
        disconnected: dis
      })),

      viewMode: 'user',
      setViewMode: (mode) => set(() => ({
        viewMode: mode
      })),

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
            open: open,
            edit: edit,
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
          }
        },
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
              ...state.ui.snackbar,
              isOpen: false,
            },
          },
        }));
      },

      webAud: false,
      setWebAud: (newState) => {
        set((state) => ({ webAud: newState }))
      },
      webAudName: '',
      setWebAudName: (newState) => {
        set((state) => ({ webAudName: newState }))
      },
      clientDevice: null,
      clientDevices: null,
      setClientDevice: (newState) => {
        set((state) => ({ clientDevice: newState }))
      },
      setClientDevices: (newState) => {
        set((state) => ({ clientDevices: newState }))
      },
      spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/4sXMBGaUBF2EjPvrq2Z3US?',
      setSpotifyEmbedUrl: (url) => {
        set((state) => ({ spotifyEmbedUrl: url }))
      },
      spotifyAuthToken:'',
      setSpotifyAuthToken: (token) => {
        set((state) => ({ spotifyAuthToken: token }))
      },
      thePlayer:'',
      setThePlayer: (ref) => {
        set((state) => ({ thePlayer: ref }))
      },
      swSize:'small',
      setSwSize: (x) => {
        set((state) => ({ swSize: x || 'small'}))
      },
      swX: 50,
      setSwX: (x) => {
        set((state) => ({ swX: x || 50}))
      },
      swY: 200,
      setSwY: (y) => {
        set((state) => ({ swY: y || 200 }))
      },
      swWidth:300,
      setSwWidth: (width) => {
        set((state) => ({ swWidth: width }))
      },
      spotifyVol:'',
      setSpotifyVol: (vol) => {
        set((state) => ({ spotifyVol: vol }))
      },
      spotifyPos: 0,
      setSpotifyPos: (pos) => {
        set((state) => ({ spotifyPos: pos }))
      },
      isAuthenticated:false,
      setIsAuthenticated: (val) => {
        set((state) => ({ isAuthenticated: val }))
      },      
      spotifyData:{},
      setSpotifyData: (type,data) => {
        set((state) => ({spotifyData:{...state.spotifyData,[type]:data}}))
      },
      spotifyDevice:{},
      setSpotifyDevice: (id) => {
        set((state) => ({spotifyDevice:id}))
      },
      youtubeURL: 'https://www.youtube.com/watch?v=s6Yyb3N9IuA&list=PLD579BDF7F8D8BFE0',
      setYoutubeURL: (url) => {
        set((state) => ({ youtubeURL: url }))
      },

      streamingToDevices: [],
      setStreamingToDevices: (devices) => set(() => ({
        streamingToDevices: devices
      })),

      graphs: isElectron(),
      toggleGraphs: () => {
        set((state) => ({ graphs: !state.graphs }))
      },

      // Cloud
      // const [isLogged, setIsLogged] = useState(!!localStorage.getItem('jwt'));
      isLogged: false,
      setIsLogged: (logged) => set(() => ({
        isLogged: logged
      })),

      
      // API
      devices: {},
      getDevices: async () => {
        const resp = await Ledfx('/api/devices', set);
        if (resp && resp.devices) {
          set({ devices: resp.devices });
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
            virtuals: resp.data.virtuals,
            active_virtuals: resp.data.active_virtuals,
          };
        }
      },
      addDevice: async (config) => await Ledfx(
        `/api/devices`,
        set,
        'POST',
        config,
      ),
      activateDevice: async (deviceId) => {
        const resp = await Ledfx(
          `/api/devices/${deviceId}`,
          set,
          'POST',
          {},
        )
        if (resp) {
          set({ paused: resp.paused });
          if (resp && resp.virtuals) {
            set({ virtuals: resp.virtuals });
          }
        }
    },
      updateDevice: async (deviceId, config) => await Ledfx(
        `/api/devices/${deviceId}`,
        set,
        'PUT',
        config,
      ),

      virtuals: {},
      getVirtuals: async () => {
        const resp = await Ledfx('/api/virtuals', set);
        if (resp) {
          set({ paused: resp.paused });
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
      updateVirtual: async (virtId, { active }) => await Ledfx(
        `/api/virtuals/${virtId}`,
        set,
        'PUT',
        {
          active: active
        },
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
      colors: {},
      getColors: async () => {
        const resp = await Ledfx(`/api/colors`, set);
        if (resp ) {
          set({ colors: resp });
        }
      },
      // HERE API DOC
      addColor: async (config) => await Ledfx(
        `/api/colors`,
        set,
        'POST',
        { ...config } // { 'name': 'string' }
      ),
      deleteColors: async (colorkey) => await Ledfx(
        `/api/colors`,
        set,
        'DELETE',
        {
          data: colorkey
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

      spotifytriggers: {},
      getSpotifyTriggers: async (SpotifyId) => {
        const resp = await Ledfx(`/api/integrations`, set, 'GET');
        console.log(resp)
        // const res = await resp.json()
        if (resp) {
          set({ spotify: resp });
        }
      },
      spotifyTriggersList: [],
      addToTriggerList: async (newTrigger,type) => {
        switch(type){
          case 'create':
            set(state=>({spotifyTriggersList: [...newTrigger]}))
          break;
          case 'update':
            set(state=>({spotifyTriggersList: [...state.spotifyTriggersList, newTrigger]}))
          break;
      }
      },
      addSpotifySongTrigger: async ({scene_id, song_id, song_name, song_position}) =>{ await Ledfx(
        `/api/integrations/spotify/spotify`,
        set,
        'POST',
        {
          scene_id: scene_id,
          song_id: song_id,
          song_name: song_name,
          song_position: song_position,
        },
      )
      set(state=>state.getIntegrations())
    },
      toggleSpotifyTrigger: async (config) => await Ledfx(
        `/api/integrations/spotify/${SpotifyId}`,
        set,
        'PUT',
        config,
      ),
      deleteSpotifyTrigger: async (config) => {await Ledfx(
        `/api/integrations/spotify/spotify`,
        set,
        'DELETE',
        config
      )
      set(state=>state.getIntegrations())
    
    },

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
      getFullConfig: async () => {
        const resp = await Ledfx('/api/config', set);
        if (resp && resp.host) {
          return { ...resp, ...{ ledfx_presets: undefined } };
        } else {
          set({ dialogs: { nohost: { open: true } } });
        }
      },
      setSystemConfig: async ({ config }) => await Ledfx('/api/config', set, 'PUT', config),
      deleteSystemConfig: async () => await Ledfx('/api/config', set, 'DELETE'),
      importSystemConfig: async (config) => await Ledfx('/api/config', set, 'POST', config),

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
        if (resp && resp.paused) {
          set({ paused: resp.paused })
        }
      },     

      shutdown: async () => await Ledfx('/api/power', set, 'POST', {
        timeout: 0,
        action: 'shutdown',
      }),
      restart: async () => await Ledfx('/api/power', set, 'POST', {
        timeout: 0,
        action: 'restart',
      }),
      getInfo: async () => await Ledfx('/api/info', set),
      getPing: async (virtId) => await Ledfx(`/api/ping/${virtId}`, set),
     
    
    })),
    {
      // ...
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !["dialogs", "disconnected", "ui"].includes(key))
        ),
    }
  ),
);

export default useStore;