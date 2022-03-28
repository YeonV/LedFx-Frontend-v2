import React,{useEffect} from 'react'
import Button from '@material-ui/core/Button';
import { Grid, Typography } from '@material-ui/core';
import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie/es6'
import { finishAuth,refreshAuth,logoutAuth } from './proxies';
import getPkce from 'oauth-pkce';
import useStore from '../../../utils/apiStore';



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

export function SpotifyLoginRedirect(props) {
  const search = window.location.search.substring(1);
    const params = JSON.parse(
        '{"' +
            decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
            '"}'
    );

  localStorage.setItem('Spotify-Token', params.code);
  
  setTimeout(() => window.location.href = 'http://localhost:3000/#/Integrations', 200); // Redirect to homepage after 3 sec
  return <p>{params.code}</p>;
};

const SpotifyView = (props) => {
  //SpotifyAuthdValid();

  const [isAuthenticated,setIsAuthenticated]=React.useState(false);
  const setSpotifyAuthToken = useStore((state) => state.setSpotifyAuthToken);
  const [ codes, setCodes]  = React.useState({})
  const cookies = new Cookies();


  React.useEffect(()=>{
    getPkce(50, (error, { verifier, challenge }) => {
      setCodes({ verifier, challenge });
    });
    console.log(codes)
    if(cookies.get('access_token')){
      setIsAuthenticated(true);
    }
  },[])
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
    console.log(authURL);
    window.location.href = authURL;
};

useEffect(() => {
  const accessTest = cookies.get('logout');
  const accessTest1 = cookies.get('access_token');
  if ((accessTest === 'false' || !accessTest) && !accessTest1) {
      // dispatch(refreshAuth());
      refreshAuth();
      cookies.set('logout', false);
      setIsAuthenticated(true);
  }
  console.log('Got to useEffect:', window.location.search);
  if (localStorage.getItem('Spotify-Token')) {
      console.log('Got to here');
      // dispatch(finishAuth());
      setIsAuthenticated(true);

      try{
      finishAuth()

    }catch(err){
        console.log(err)
      }
  }
  // dispatch(editAsyncIntegration());
  // dispatch(checkCookiesForTokens());
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

useEffect(()=>{
if(cookies.get('access_token')){
  setIsAuthenticated(true);
  setSpotifyAuthToken(cookies.get('access_token'));
}else{
  setIsAuthenticated(false);

}
},[cookies])

  return (
    <Grid
      container
      justifyContent="center"
      alignContent="center"
      //style={{ height: '50%' }}
    >
      {!isAuthenticated ? (
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            console.log("AND IT BEGINS....")            
           beginAuth();
          }}
        >
          <Typography>Connect to Spotify</Typography>
        </Button>
      ) : isAuthenticated ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {logoutAuth();
  setIsAuthenticated(false);

      }
          
          }
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
