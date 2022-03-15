import useStore from '../../../utils/apiStore';
import Button from '@material-ui/core/Button';
import { Grid, Typography } from '@material-ui/core';
import { Link } from '@mui/material';
import { useEffect, useState } from 'react';
import { Route, useHistory, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
//import request from "./axiosClient";

const productionUrl = 'https://my.ledfx.app/#/./Integrations';
const localUrl = 'http://localhost:3000/#/./Integrations';
const SpotifyRedirectURL = axios.create({
  baseURL: `${process.env.NODE_ENV === 'production' ? productionUrl : localUrl}`,
});
// const SpotifyRedirectURL = axios.create(
//   `${process.env.NODE_ENV === 'production' ? productionUrl : localUrl}`
// );
// const backendUrl = process.env.REACT_APP_BACKEND_URL;
//const backendUrl = "backendurl";
const apiCredentials = {
  CLIENT_ID: '7658827aea6f47f98c8de593f1491da5',
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

function SpotifyLoginRedirect(props) {
  const [text, setText] = useState('Loading...');
  const location = useLocation();
  const params = useParams();
  const history = useHistory();
  // console.log(params, props, location)
  useEffect(() => {
    // Successfully logged with the provider
    // Now logging with strapi by using the access_token (given by the provider) in props.location.search
    fetch({ SpotifyURL })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(`Couldn't login to Strapi. Status: ${res.status}`);
        }
        return res;
      })
      .then((res) => res.json())
      .then(async (res) => {
        // Successfully logged with Strapi
        // Now saving the jwt to use it for future authenticated requests to Strapi
        // console.log(res)
        localStorage.setItem('jwt', res.jwt);
        localStorage.setItem('username', res.user.username);
        const me = await SpotifyRedirectURL.get('users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });
        const user = await me.data;
        // console.log(user)
        localStorage.setItem('ledfx-cloud-userid', user.id);
        localStorage.setItem('ledfx-cloud-role', user.role.type);
        setIsAuthenticated(true);
        setText(
          `You have been successfully logged in as ${localStorage.getItem(
            'username'
          )}. You will be redirected in a few seconds...`
        );
        setTimeout(() => history.push('/Integrations'), 2000); // Redirect to homepage after 3 sec
      })
      .catch((err) => {
        console.log(err);
        setText('An error occurred, please see the developer console.');
      });
  }, [history, location.search, params.providerName]);

  return <p>{text}</p>;
};

const SpotifyView = (props) => {
  const setIsAuthenticated = false;
  return (
    <Grid
      container
      justifyContent="center"
      alignContent="center"
      style={{ height: '10%' }}
    >
      {!setIsAuthenticated ? (
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => SpotifyLoginRedirect()}
          //onClick={(e) => window.location.href = SpotifyURL}
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

// export function useLogin() {
//    const setToken = useStore(setTokenSelector);
//    const setIsAuthenticated = useStore(setIsAuthenticatedSelector);

//    useLayoutEffect(() => {
//      const token = getTokenFromUrl();
//      if (token) {
//        setAxiosHeaders(token);
//        setToken(token);
//        setIsAuthenticated(true);
//      } else {
//        setIsAuthenticated(false);
//        removeAxiosAuthHeader();
//      }
//    }, [setToken, setIsAuthenticated]);
//   }

//const spotifyAuth = useStore((state) => state.setYoutubeURL);
//const setAuthSpotify = useStore((state) => state.setAuthSpotify);

// const beginAuth = () => `https://accounts.spotify.com/authorize?client_id=${
//        apiCredentials.CLIENT_ID
//      }&redirect_uri=${encodeURIComponent(
//          apiCredentials.REDIRECT_URL
//      )}&scope=${encodeURIComponent(
//          apiCredentials.SCOPES.join(" ")
//      )}&response_type=token`;

// const setToken = (set) => ({
//     isAuthenticated: false,
//     setIsAuthenticated: (state) => set({ isAuthenticated: state }),
//     token: null,
//     setToken: (token) => set({ token })});
// const setIsAuthenticated= false;
// return (
//   <Grid container justifyContent="center" alignContent="center" style={{ height: '10%' }}>
//             {!setIsAuthenticated ? (
//                 <Button variant="contained" color="primary" onClick={<Link target="_blank" to='http://www.google.com'>Google</Link>}>

//                     <Typography>Connect to Spotify</Typography>
//                 </Button>
//             ) : setIsAuthenticated ? (
//                 <Button variant="contained" color="primary" onClick={() => logoutClick()}>
//                     <Typography>Logout</Typography>
//                 </Button>
//             ) : (
//                 ''
//             )}
//         </Grid>
//   );
// };

// const setTokenSelector = (state) => state.setToken;
// const setIsAuthenticatedSelector = (state) => state.setIsAuthenticated;

// export function useLogin() {
//   const setToken = useStore(setTokenSelector);
//   const setIsAuthenticated = useStore(setIsAuthenticatedSelector);

//   useLayoutEffect(() => {
//     const token = getTokenFromUrl();
//     if (token) {
//       setAxiosHeaders(token);
//       setToken(token);
//       setIsAuthenticated(true);
//     } else {
//       setIsAuthenticated(false);
//       removeAxiosAuthHeader();
//     }
//   }, [setToken, setIsAuthenticated]);
// }

//  const getTokenFromUrl = () => {
//      const hashParams = {};
//      let e = "";
//      const r = /([^&;=]+)=?([^&;]*)/g;
//      const q = window.location.hash.substring(1);
//      eslint-disable-next-line no-cond-assign
//      while ((e = r.exec(q))) {
//        hashParams[e[1]] = decodeURIComponent(e[2]);
//      }

//     if (hashParams.access_token) {
//       return hashParams.access_token;
//     }
//     return false;
//   };

// const isTokenValid = (date) => {
//     const HOUR = 1000 * 60 * 60;
//     const anHourAgo = Date.now() - HOUR;
//     return date > anHourAgo;
//   };

//   export const setAxiosHeaders = (token) => {
//     request.defaults.headers.common.Authorization = `Bearer ${token}`;
//   };

//   export const removeAxiosAuthHeader = () => {
//     delete request.defaults.headers.common.Authorization;
//   };

// export const queryKeys = {
//   USER_PROFILE: "userProfile",
//   USER_PLAYLISTS: "userPlaylists",
//   NEW_RELEASES: "newReleases",
//   FEATURED_PLAYLISTS: "featuredPlaylists",
//   CATEGORY_LIST: "categoryList",
//   CATEGORY_PLAYLISTS: "categoryPlaylists",
//   PLAYLIST_TRACKS: "PLAYLIST_TRACKS",
//   PLAYLIST_DETAILS: "PLAYLIST_DETAILS",
//   PLAYLIST_FOLLOW_STATUS: "PLAYLIST_FOLLOW_STATUS",
//   RECENTLY_PLAYED: "recentlyPlayed",
//   ARTISTS: "ARTISTS",
//   ARTIST: "ARTIST",
//   ARTIST_FOLLOW_STATUS: "ARTIST_FOLLOW_STATUS",
//   ARTIST_TOP_TRACKS: "ARTIST_TOP_TRACKS",
//   RELATED_ARTISTS: "RELATED_ARTISTS",
//   ARTIST_ALBUMS: "ARTIST_ALBUMS",
//   USER_ALBUMS: "USER_ALBUMS",
//   ALBUM_TRACKS: "ALBUM_TRACKS",
//   TOP_TRACKS: "TOP_TRACKS",
//   TRACK_SAVED_STATUS: "TRACK_SAVED_STATUS",
//   SEARCH: "SEARCH",
// };

// export const tabs = {
//   BROWSE: "BROWSE",
//   CATEGORIES: "CATEGORIES",
//   SUB_PLAYLIST_VIEW: "SUB_PLAYLIST_VIEW",
//   PLAYLIST_LIST_VIEW: "LIST_VIEW",
//   RECENTLY_PLAYED: "RECENTLY_PLAYED",
//   ARTIST_LIST: "ARTIST_LIST",
//   ARTIST: "ARTIST",
//   ALBUM_LIST: "ALBUM_LIST",
//   ALBUM: "ALBUM",
//   TOP_TRACKS: "TOP_TRACKS",
//   SEARCH_VIEW: "SEARCH_VIEW",
// };

// export const iconSize = "h-7 w-7";
// export const searchResultLimit = 20;
// export const paginationLimit = 30;

// export const localStorageKeys = {
//   LAST_SAVED_VOLUME: "LAST_SAVED_VOLUME",
//   SPOTIFY_TOKEN: "SPOTIFY_TOKEN",
// };

// export const playbackOptions = {
//   PLAY: "play",
//   PAUSE: "pause",
//   STOP: "stop",
// };

// export const tableFieldListNames = {
//   TITLE: "TITLE",
//   ALBUM: "ALBUM",
//   ARTIST: "ARTIST",
//   ADDED_AT: "ADDED_AT",
//   DURATION: "DURATION",
// };

// export const repoUrl = "https://github.com/LedFx/LedFx";

//export default SpotifyView;
