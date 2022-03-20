import Button from '@material-ui/core/Button';
import { Grid, Typography } from '@material-ui/core';
import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const setIsAuthenticated = false;
const productionUrl = 'https://my.ledfx.app/callback/#/Integrations';
const localUrl = 'http://localhost:3000/callback/#/Integrations?';
const SpotifyRedirectURL = axios.create({
  baseURL: `${process.env.NODE_ENV === 'production' ? productionUrl : localUrl}`,
});
const apiCredentials = {
  CLIENT_ID: '7658827aea6f47f98c8de593f1491da5',
  //CLIENT_SECRET: '',
  REDIRECT_URL: `${
    process.env.NODE_ENV === 'production' ? productionUrl : localUrl
  }`,
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
const SpotifyURL = `https://accounts.spotify.com/authorize?client_id=${
  apiCredentials.CLIENT_ID
}&redirect_uri=${encodeURIComponent(
  apiCredentials.REDIRECT_URL
)}&scope=${encodeURIComponent(
  apiCredentials.SCOPES.join(' ')
)}&response_type=token`;
0
export function SpotifyLoginRedirect(props) {
  const [text, setText] = useState('Loading...');
  const location = useLocation();
  const params = useParams();
  const history = useNavigate();
  let expDate = new Date();
  expDate.setHours(expDate.getHours() + 1);
  console.log("Spotify Token", location.hash.split('token=')[1])
  localStorage.setItem('Spotify-Token', location.hash.split('token=')[1]);
  setTimeout(() => window.location.href = 'http://localhost:3000/#/Integrations', 200); // Redirect to homepage after 3 sec
  return <p>{text}</p>;
};

export function logoutClick(props) {
  localStorage.removeItem('Spotify-Token');
  window.location.href = 'http://localhost:3000/#/Integrations';
  setIsAuthenticated = false;
  isAuthenticated = false;
};

//Need to figure out how to put in Spoitfy token exiry time.
 const SpotifyAuthdValid = (props) => {
   if (localStorage.getItem('Spotify-Token')) {
     return setIsAuthenticated = true;
   } else {
     return setIsAuthenticated = false;
   };
 };

const SpotifyView = (props) => {
  //SpotifyAuthdValid();
  console.log("Is Spotify Auth'd?", setIsAuthenticated)
  return (
    <Grid
      container
      justifyContent="center"
      alignContent="center"
      //style={{ height: '50%' }}
    >
      {!setIsAuthenticated ? (
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            console.log("AND IT BEGINS....")            
            window.location.href = SpotifyURL            
          }}
        >
          <Typography>Connect to Spotify</Typography>
        </Button>
      ) : setIsAuthenticated ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => logoutClick()}
        >
          <Typography>Logout</Typography>
        </Button>
      ) : (
        ''
      )}
    </Grid>
  );
};

export default SpotifyView;
