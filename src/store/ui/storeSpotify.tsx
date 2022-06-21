const storeSpotify = () => ({
  spotifyEmbedUrl:
    'https://open.spotify.com/embed/playlist/4sXMBGaUBF2EjPvrq2Z3US?',
  spotifyAuthToken: '',
  player: null as any,
  swSize: 'small',
  swX: 50,
  swY: 200,
  swWidth: 300,
  spotifyVol: 0,
  spotifyPos: 0 as any,
  spotifyAuthenticated: false,
  spotifyData: {},
  spotifyDevice: {},
});

export default storeSpotify;
