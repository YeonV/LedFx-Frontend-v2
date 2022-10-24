const storeSpotify = () => ({
  spotifyEmbedUrl:
    'https://open.spotify.com/embed/playlist/4sXMBGaUBF2EjPvrq2Z3US?',
  spotifyAuthToken: '',
  player: null as any,
  swSize: 'small',
  swX: 50,
  swY: 200,
  swWidth: 300,
  spNetworkTime: 1000,
  spAuthenticated: false,
  spotifyData: {} as any,
  spotifyDevice: {} as any,
  spotifytriggers: {},
  spTriggersList: [] as any,
  spActTriggers: [] as string[],
  playlist: [] as any,
  me: {} as any,
});

export default storeSpotify;
