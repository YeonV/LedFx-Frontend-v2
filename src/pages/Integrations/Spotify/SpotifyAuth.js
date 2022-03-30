import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import axios from 'axios';
import Cookies from 'universal-cookie/es6';
import { finishAuth, refreshAuth, logoutAuth } from './proxies';
import getPkce from 'oauth-pkce';
import useStore from '../../../utils/apiStore';
import isElectron from 'is-electron';
import { Login, Logout } from '@mui/icons-material';
import { useIntegrationCardStyles } from '../IntegrationCard/IntegrationCard.styles';

const baseURL = isElectron() ? 'http://localhost:8888' : !!window.localStorage.getItem('ledfx-newbase') ? 'http://localhost:8080' : window.location.href.split('/#')[0] || 'http://localhost:8888';
const storedURL = window.localStorage.getItem('ledfx-host');
const redirectUrl = `${process.env.NODE_ENV === 'production' ? storedURL || baseURL : 'http://localhost:3000' }/callback/#/Integrations?`;
const spotify = axios.create({
  baseURL: redirectUrl,
});

const apiCredentials = {
  CLIENT_ID: '7658827aea6f47f98c8de593f1491da5',
  //CLIENT_SECRET: '',
  REDIRECT_URL: decodeURIComponent(redirectUrl),
  SCOPES: [
    //Users (Review later if needed)
    'user-top-read',
    'user-read-email',
    'user-read-private',
    //Playback
    'streaming',
    'user-read-playback-position',
    //Spotify Connect
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    //Listening History (resume playback)
    'user-read-recently-played',
    //Library
    'user-library-read',
    'user-library-modify',
  ],
};

export function SpotifyLoginRedirect() {
  localStorage.setItem(
    'Spotify-Token',
    window.location.search.replace('?code=', '')
  );
  setTimeout(() => window.location.href = `${process.env.NODE_ENV === 'production' ? storedURL || baseURL : 'http://localhost:3000' }/#/Integrations?`, 200 ); // Redirect to homepage after 3 sec
  return (
    <div style={{ margin: '6rem auto' }}>Successfully logged in with Spotify...</div>
  );
}

const SpotifyView = ({ thePlayer, disabled=false }) => {
  //SpotifyAuthdValid();

  // const [isAuthenticated,setIsAuthenticated]=useState(false);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setSpotifyAuthToken = useStore((state) => state.setSpotifyAuthToken);
  const [codes, setCodes] = useState({});
  const cookies = new Cookies();
  const classes = useIntegrationCardStyles();
  useEffect(() => {
    getPkce(50, (error, { verifier, challenge }) => {
      setCodes({ verifier, challenge });
    });
    // console.log(codes)
    if (cookies.get('access_token')) {
      setIsAuthenticated(true);
    }
  }, []);
  const beginAuth = () => {
    cookies.set('verifier', codes.verifier);
    let authURL =
      `https://accounts.spotify.com/authorize/` +
      '?response_type=code' +
      '&client_id=' +
      encodeURIComponent('7658827aea6f47f98c8de593f1491da5') +
      '&scope=' +
      encodeURIComponent(
        'user-library-read user-library-modify user-read-email user-top-read streaming user-read-private user-read-playback-state user-modify-playback-state'
      ) +
      '&redirect_uri=' +
      encodeURIComponent(apiCredentials.REDIRECT_URL) +
      '&code_challenge=' +
      encodeURIComponent(codes.challenge) +
      '&code_challenge_method=S256';
    // console.log(authURL);
    window.location.href = authURL;
  };

  useEffect(() => {
    const accessTest = cookies.get('logout');
    const accessTest1 = cookies.get('access_token');
    if ((accessTest === 'false' || !accessTest) && !accessTest1) {      
      refreshAuth();
      cookies.set('logout', false);
      setIsAuthenticated(true);
    }
    if (localStorage.getItem('Spotify-Token')) {
      setIsAuthenticated(true);

      try {
        finishAuth();
      } catch (err) {
        console.log(err);
      }
    }
    // dispatch(editAsyncIntegration());
    // dispatch(checkCookiesForTokens());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cookies.get('access_token')) {
      setIsAuthenticated(true);
      setSpotifyAuthToken(cookies.get('access_token'));
    } else {
      setIsAuthenticated(false);
    }
  }, [cookies]);

  return !isAuthenticated 
    ? <Button disabled={disabled} variant="outlined" size="small" color="inherit" className={classes.editButton} onClick={(e) => { beginAuth() }}>
        <Login />
        {/* <Typography>Connect to Spotify</Typography> */}
      </Button>
    : <Button disabled={disabled} variant="outlined" size="small" color="inherit" className={classes.editButton} onClick={() => {
          logoutAuth();
          thePlayer.current.disconnect();
          setIsAuthenticated(false);
          setSpotifyAuthToken(false);}}>
          
          <Logout />
        {/* <Typography>Logout</Typography> */}
      </Button>
};

export default SpotifyView;
