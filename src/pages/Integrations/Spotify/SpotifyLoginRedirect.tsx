/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-return-assign */
/* eslint-disable prettier/prettier */
import React from 'react'
import isElectron from 'is-electron';
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
  return (
    <div style={{ margin: '6rem auto' }}>Successfully logged in with Spotify...</div>
  );
}

export default SpotifyLoginRedirect;
