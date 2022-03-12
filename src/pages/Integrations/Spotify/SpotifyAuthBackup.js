import Button from '@material-ui/core/Button';
//import pkceChallenge from 'pkce-challenge';
import Cookies from 'universal-cookie/es6';
import { Grid, Typography } from '@material-ui/core';
import { useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';

export function finishAuth() {
    console.log('finishing');
    const search = window.location.search.substring(1);
    const params = JSON.parse(
        '{"' +
            decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
            '"}'
    );
    const cookies = new Cookies();
    const postData = {
        client_id: '7658827aea6f47f98c8de593f1491da5',
        grant_type: 'authorization_code',
        code: params.code,
        redirect_uri: 'http://localhost:3000/integrations/',
        code_verifier: cookies.get('verifier'),
    };
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    return axios
        .post('https://accounts.spotify.com/api/token', qs.stringify(postData), config)
        .then(res => {
            let tokens = {};
            let expDate = new Date();
            expDate.setHours(expDate.getHours() + 1);
            cookies.remove('access_token');
            cookies.remove('logout', { path: '/' });
            cookies.remove('logout', { path: '/integrations' });

            cookies.set('access_token', res.data.access_token, { expires: expDate });
            cookies.set('logout', false);
            tokens.accessToken = res.data.access_token;

            let refreshExpDate = new Date();
            refreshExpDate.setDate(refreshExpDate.getDate() + 7);
            cookies.remove('refresh_token');
            cookies.set('refresh_token', res.data.refresh_token, { expires: refreshExpDate });
            tokens.refreshToken = res.data.refresh_token;
            cookies.remove('verifier');
            window.history.replaceState({}, document.title, `/integrations`);
            return tokens;
        })
        .catch(e => console.log(e));
}
export function finishAuth() {
    return async dispatch => {
        try {
            const tokens = await spotifyProxies.finishAuth();
            dispatch(authFinished(tokens));
        } catch (error) {
            console.log(error);
        }
    };
}


export function refreshAuth() {
    console.log('refreshing');
    const cookies = new Cookies();
    const rT = cookies.get('refresh_token');
    const postData = {
        client_id: '7658827aea6f47f98c8de593f1491da5',
        grant_type: 'refresh_token',
        refresh_token: rT,
    };
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    return axios
        .post('https://accounts.spotify.com/api/token', qs.stringify(postData), config)
        .then(res => {
            let freshTokens = {};
            let expDate = new Date();
            expDate.setHours(expDate.getHours() + 1);
            cookies.remove('access_token', { path: '/integrations' });
            cookies.set('access_token', res.data.access_token, { expires: expDate });
            freshTokens.accessToken = res.data.access_token;

            let refreshExpDate = new Date();
            refreshExpDate.setDate(refreshExpDate.getDate() + 7);
            cookies.remove('refresh_token', { path: '/integrations' });
            cookies.set('refresh_token', res.data.refresh_token, { expires: refreshExpDate });
            freshTokens.refreshToken = res.data.refreshToken;

            return freshTokens;
        })
        .catch(e => console.log(e));
}

export function logoutAuth() {
    const cookies = new Cookies();
    cookies.remove('logout', { path: '/' });
    cookies.remove('logout', { path: '/integrations' });
    cookies.remove('access_token', { path: '/' });
    cookies.remove('access_token', { path: '/integrations' });

    cookies.remove('refresh_token', { path: '/integrations' });
    cookies.remove('refresh_token', { path: '/' });

    cookies.remove('logout');

    cookies.set('logout', true);
    return true;
}

export async function addTrigger(trigger) {
    const res = await axios.post('http://localhost:8888/api/integrations/spotify/spotify', trigger);
    if (res.status === 200) {
        return 'Success';
    } else {
        return 'Error';
    }
}

export async function getTrackFeatures(id, token) {
    const res = await axios.get(`https://api.spotify.com/v1/audio-features/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (res.status === 200) {
        return res.data;
    } else {
        return 'Error';
    }
}

export async function getTrackAnalysis(id, token) {
    const res = await axios.get(`https://api.spotify.com/v1/audio-analysis/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (res.status === 200) {
        return res.data;
    } else {
        return 'Error';
    }
}

export function fixAnalysis(audioAnalysis) {
    let new_analysis = { ...audioAnalysis };

    new_analysis['segments'] = [];
    if (audioAnalysis?.segments) {
        audioAnalysis['segments'].forEach(segment => {
            let new_segment = { ...segment };
            new_segment['start'] = parseFloat(segment['start'].toFixed(2));
            new_segment['pitches'] = [];
            let pitchTotal = 0;
            console.log(segment['pitches']);
            segment['pitches'].forEach(pitch => {
                console.log(pitch);
                pitchTotal += pitch;
            });
            segment['pitches'].forEach(pitch => {
                pitch = (pitch / pitchTotal) * 100;
                new_segment['pitches'].push(pitch);
            });

            new_analysis['segments'].push(new_segment);
        });
    }

    return new_analysis;
}

export function editAsyncIntegration() {
    return async dispatch => {
        const cookie = new Cookies();
        const logoutCheck = cookie.get('logout');
        if (logoutCheck === 'false' || !logoutCheck) {
            dispatch(editIntegration({ status: 1, id: 'spotify' }));
        }
        if (logoutCheck === 'true') {
            dispatch(editIntegration({ status: 0, id: 'spotify' }));
        }
    };
}

export function checkCookiesForTokens() {
    console.log('checking');
    return dispatch => {
        const cookies = new Cookies();
        const tokens = {
            accessToken: cookies.get('access_token'),
            refreshToken: cookies.get('refresh_token'),
        };
        dispatch(cookiesChecked(tokens));
    };
}


export function refreshAuth() {
    return async dispatch => {
        try {
            const tokens = await spotifyProxies.refreshAuth();
            if (tokens.accessToken) {
                dispatch(authRefreshed(tokens));
            }
        } catch (error) {
            console.log(error);
        }
    };
}

export function logoutAuth() {
    return async dispatch => {
        const check = spotifyProxies.logoutAuth();
        const cookies = new Cookies();
        const data = {
            logout: check,
            accessToken: cookies.get('access_token'),
            refreshToken: cookies.get('refresh_token'),
        };
        dispatch(logoutAuthUpdated(data));
    };
}

const SpotifyView = props => {
    const spotify = useSelector(state => state.spotify);
    const dispatch = useDispatch();

    const beginAuth = () => {
        //const codes = pkceChallenge();
        const cookies = new Cookies();
        cookies.set('verifier', codes.code_verifier);
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
            encodeURIComponent('http://localhost:3000/integrations/') +
            '&code_challenge=' +
            encodeURIComponent(codes.code_challenge) +
            '&code_challenge_method=S256';
        console.log(authURL);
        window.location.href = authURL;
    };

    useEffect(() => {
        const cookies = new Cookies();
        const accessTest = cookies.get('logout');
        const accessTest1 = cookies.get('access_token');
        if ((accessTest === 'false' || !accessTest) && !accessTest1) {
            dispatch(refreshAuth());
            cookies.set('logout', false);
        }
        console.log('Got to useEffect:', window.location.search);
        if (window.location.search) {
            console.log('Got to here');
            dispatch(finishAuth());
        }
        dispatch(editAsyncIntegration());
        dispatch(checkCookiesForTokens());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logoutClick = () => {
        dispatch(logoutAuth());
        dispatch(editAsyncIntegration());
    };

    return (
        <Grid container justify="center" alignContent="center" style={{ height: '10%' }}>
            {!spotify.accessToken && !spotify.refreshToken ? (
                <Button variant="contained" color="primary" onClick={() => beginAuth()}>
                    <Typography>Connect to Spotify</Typography>
                </Button>
            ) : spotify.accessToken ? (
                <Button variant="contained" color="primary" onClick={() => logoutClick()}>
                    <Typography>Logout</Typography>
                </Button>
            ) : (
                ''
            )}
        </Grid>
    );
};

export default SpotifyView;
