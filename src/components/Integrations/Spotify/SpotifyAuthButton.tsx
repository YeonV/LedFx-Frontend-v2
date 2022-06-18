/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Cookies from 'universal-cookie/es6';
import getPkce from 'oauth-pkce';
import isElectron from 'is-electron';
import { Login, Logout } from '@mui/icons-material';
import useStore from '../../../utils/apiStore';
import {
  finishAuth,
  refreshAuth,
  logoutAuth,
} from '../../../utils/spotifyProxies';
import { useIntegrationCardStyles } from '../../../pages/Integrations/IntegrationCard/IntegrationCard.styles';

// eslint-disable-next-line prettier/prettier
const baseURL = isElectron() ? 'http://localhost:8888' : window.localStorage.getItem('ledfx-newbase') ? 'http://localhost:8080' : window.location.href.split('/#')[0] || 'http://localhost:8888';
const storedURL = window.localStorage.getItem('ledfx-host');
const redirectUrl = `${
  process.env.NODE_ENV === 'production'
    ? storedURL || baseURL
    : 'http://localhost:3000'
}/callback/#/Integrations?`;

// const spotify = axios.create({
//   baseURL: redirectUrl,
// });

const apiCredentials = {
  CLIENT_ID: '7658827aea6f47f98c8de593f1491da5',
  // CLIENT_SECRET: '',
  REDIRECT_URL: decodeURIComponent(redirectUrl),
  SCOPES: [
    // Users (Review later if needed)
    'user-top-read',
    'user-read-email',
    'user-read-private',
    // Playback
    'streaming',
    'user-read-playback-position',
    // Spotify Connect
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    // Listening History (resume playback)
    'user-read-recently-played',
    // Library
    'user-library-read',
    'user-library-modify',
  ],
};

const SpotifyAuthButton = ({ disabled = false }: any) => {
  const spotifyAuthenticated = useStore(
    (state) => (state as any).spotifyAuthenticated
  );
  const thePlayer = useStore((state) => (state as any).thePlayer);
  const setSpotifyAuthenticated = useStore(
    (state) => (state as any).setSpotifyAuthenticated
  );
  const setSpotifyAuthToken = useStore(
    (state) => (state as any).setSpotifyAuthToken
  );
  const [codes, setCodes] = useState({});
  const cookies = new Cookies();
  const classes = useIntegrationCardStyles();
  useEffect(() => {
    getPkce(50, (error, { verifier, challenge }) => {
      setCodes({ verifier, challenge });
    });
    if (cookies.get('access_token')) {
      setSpotifyAuthenticated(true);
    }
  }, []);
  const beginAuth = () => {
    cookies.set('verifier', (codes as any).verifier);
    const authURL =
      'https://accounts.spotify.com/authorize/' +
      '?response_type=code' +
      `&client_id=${encodeURIComponent(
        '7658827aea6f47f98c8de593f1491da5'
      )}&scope=${encodeURIComponent(
        'user-library-read user-library-modify user-read-email user-top-read streaming user-read-private user-read-playback-state user-modify-playback-state'
      )}&redirect_uri=${encodeURIComponent(
        apiCredentials.REDIRECT_URL
      )}&code_challenge=${encodeURIComponent(
        (codes as any).challenge
      )}&code_challenge_method=S256`;
    window.location.href = authURL;
  };

  useEffect(() => {
    const accessTest = cookies.get('logout');
    const accessTest1 = cookies.get('access_token');
    if ((accessTest === 'false' || !accessTest) && !accessTest1) {
      refreshAuth();
      cookies.set('logout', false);
      setSpotifyAuthenticated(true);
    }
    if (localStorage.getItem('Spotify-Token')) {
      setSpotifyAuthenticated(true);

      try {
        finishAuth();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      }
    }
  }, []);

  useEffect(() => {
    if (cookies.get('access_token')) {
      setSpotifyAuthenticated(true);
      setSpotifyAuthToken(cookies.get('access_token'));
    } else {
      setSpotifyAuthenticated(false);
    }
  }, [cookies]);

  return !spotifyAuthenticated ? (
    <Button
      disabled={disabled}
      variant="outlined"
      size="small"
      color="inherit"
      className={classes.editButton}
      onClick={() => {
        beginAuth();
      }}
    >
      <Login />
    </Button>
  ) : (
    <Button
      disabled={disabled}
      variant="outlined"
      size="small"
      color="inherit"
      className={classes.editButton}
      onClick={() => {
        logoutAuth();
        thePlayer.current.disconnect();
        setSpotifyAuthenticated(false);
        setSpotifyAuthToken(false);
      }}
    >
      <Logout />
    </Button>
  );
};

export default SpotifyAuthButton;
