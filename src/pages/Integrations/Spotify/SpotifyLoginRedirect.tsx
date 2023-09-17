/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-return-assign */
/* eslint-disable prettier/prettier */
import isElectron from 'is-electron';
import { CircularProgress, Dialog } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import {
  finishAuth,
  refreshAuth
} from '../../../utils/spotifyProxies'

const baseURL = isElectron() ? 'http://localhost:8888' : window.location.href.split('/#')[0].replace(/\/+$/, '') || 'http://localhost:8888';
const storedURL = window.localStorage.getItem('ledfx-host');

const SpotifyLoginRedirect = () => {
  localStorage.setItem(
    'Spotify-Token',
    window.location.search.replace('?code=', '')
  );
  finishAuth()
  refreshAuth()
  setTimeout(
    () =>
      (window.location.href = `${
        process.env.NODE_ENV === 'production'
          ? storedURL || baseURL
          : 'http://localhost:3000'
      }/#/Integrations?`),
    3000
  ) // Redirect to homepage after 3 sec
  return (<Dialog open fullScreen>
    <div style={{ margin: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
      <CheckCircle sx={{ fontSize: 120 }} />
      Successfully logged in with Spotify...
      <CircularProgress sx={{ marginTop: '2rem'}} />

    </div>
  </Dialog>
  );
}

export default SpotifyLoginRedirect;
