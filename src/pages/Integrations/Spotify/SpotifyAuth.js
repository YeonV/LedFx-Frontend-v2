import Button from '@material-ui/core/Button';
import pkceChallenge from 'pkce-challenge';
import Cookies from 'universal-cookie/es6';
import { Grid, Typography } from '@material-ui/core';
import { useEffect } from 'react';

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
        const codes = pkceChallenge();
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
