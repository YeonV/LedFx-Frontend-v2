/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-return-assign */
/* eslint-disable prettier/prettier */
import isElectron from 'is-electron';

const baseURL = isElectron() ? 'http://localhost:8888' : !!window.localStorage.getItem('ledfx-newbase') ? 'http://localhost:8080' : window.location.href.split('/#')[0] || 'http://localhost:8888';
const storedURL = window.localStorage.getItem('ledfx-host');

const SpotifyLoginRedirect = () => {
  localStorage.setItem(
    'Spotify-Token',
    window.location.search.replace('?code=', '')
  );
  setTimeout(() => window.location.href = `${process.env.NODE_ENV === 'production' ? storedURL || baseURL : 'http://localhost:3000' }/#/Integrations?`, 200 ); // Redirect to homepage after 3 sec
  return (
    <div style={{ margin: '6rem auto' }}>Successfully logged in with Spotify...</div>
  );
}

export default SpotifyLoginRedirect;
