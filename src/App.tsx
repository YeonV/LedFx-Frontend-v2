/* eslint-disable @typescript-eslint/indent */
import { useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import isElectron from 'is-electron';
import { CssBaseline } from '@mui/material';
import ws, { WsContext, HandleWs } from './utils/Websocket';
import useStore from './store/useStore';
import useWindowDimensions from './utils/useWindowDimension';
import './App.css';
import {
  deleteFrontendConfig,
  initFrontendConfig,
  drawerWidth,
} from './utils/helpers';
import WaveLines from './components/Icons/waves';
import Pages from './pages/Pages';
import SpotifyProvider from './components/Integrations/Spotify/SpotifyProvider';
import { common, ledfxThemes, ledfxTheme } from './themes/AppThemes';

const PREFIX = 'App';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  drawerHeader: `${PREFIX}-drawerHeader`,
  contentShift: `${PREFIX}-card`,
};
const Root = styled('div')(({ theme }: any) => ({
  [`& .${classes.root}`]: {
    display: 'flex',
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
    background: 'transparent',
    padding: theme.spacing(0),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    '@media (max-width: 580px)': {
      padding: '8px',
    },
  },

  [`& .${classes.drawerHeader}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },

  [`& .${classes.contentShift}`]: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function App() {
  const { height, width } = useWindowDimensions();
  const features = useStore((state) => state.features);
  const protoCall = useStore((state) => state.protoCall);
  const setProtoCall = useStore((state) => state.setProtoCall);
  const setPlatform = useStore((state) => state.setPlatform);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const getSchemas = useStore((state) => state.getSchemas);
  const shutdown = useStore((state) => state.shutdown);
  const showSnackbar = useStore((state) => state.ui.showSnackbar);
  const darkMode = useStore((state) => state.ui.darkMode);

  const theme = useMemo(
    () =>
      createTheme({
        ...ledfxThemes[ledfxTheme],
        ...common,
        palette: {
          ...ledfxThemes[ledfxTheme].palette,
          mode: darkMode ? 'dark' : 'light',
          background: darkMode
            ? {
                default: '#030303',
                paper: '#151515',
              }
            : {
                default: '#bbb',
                paper: '#fefefe',
              },
        },
      }),
    [darkMode]
  );

  useEffect(() => {
    getVirtuals();
    getSystemConfig();
    getSchemas();
  }, [getVirtuals, getSystemConfig, getSchemas]);

  useEffect(() => {
    initFrontendConfig();
    // eslint-disable-next-line no-console
    console.info(
      // eslint-disable-next-line no-useless-concat
      '%c Ledfx ' + '%c\n ReactApp by Blade ',
      'padding: 10px 40px; color: #ffffff; border-radius: 5px 5px 0 0; background-color: #800000;',
      'background: #fff; color: #800000; border-radius: 0 0 5px 5px;padding: 5px 0;'
    );
    (window as any).api?.send('toMain', 'get-platform');
  }, []);

  (window as any).api?.receive('fromMain', (parameters: string) => {
    if (parameters === 'shutdown') {
      shutdown();
    }
    if (parameters[0] === 'platform') {
      setPlatform(parameters[1]);
    }
    if (parameters[0] === 'currentdir') {
      // eslint-disable-next-line no-console
      console.log(parameters[1]);
    }
    if (parameters[0] === 'protocol') {
      setProtoCall(JSON.parse(parameters[1]).commandLine.pop());
    }
    if (parameters === 'clear-frontend') {
      deleteFrontendConfig();
    }
  });

  useEffect(() => {
    const handleWebsockets = (e: any) => {
      showSnackbar(e.detail.type, e.detail.message);
    };
    document.addEventListener('YZNEW', handleWebsockets);
    return () => {
      document.removeEventListener('YZNEW', handleWebsockets);
    };
  }, []);

  useEffect(() => {
    if (protoCall !== '') {
      showSnackbar('info', `External call: ${protoCall}`);
      const proto = protoCall.split('/').filter((n) => n);
      // eslint-disable-next-line no-console
      console.table({
        Domain: proto[1],
        Action: proto[2],
        Payload: proto[3],
      });
      setProtoCall('');
    }
  }, [protoCall, showSnackbar]);

  return (
    <ThemeProvider theme={theme}>
      {/* <MuiThemeProvider theme={ledfxThemes[ledfxTheme]}> */}
      {/* <StyledEngineProvider injectFirst> */}
      <SnackbarProvider maxSnack={5}>
        <WsContext.Provider value={ws}>
          <SpotifyProvider>
            <Root
              className={classes.root}
              style={{ paddingTop: isElectron() ? '30px' : 0 }}
            >
              <CssBaseline />
              <Pages handleWs={<HandleWs />} />
            </Root>
          </SpotifyProvider>
        </WsContext.Provider>
        {features.waves && (
          <WaveLines
            startColor={theme.palette.primary.main}
            stopColor={theme.palette.accent.main || '#ffdc0f'}
            width={width - 8}
            height={height}
          />
        )}
      </SnackbarProvider>
      {/* </StyledEngineProvider> */}
      {/* </MuiThemeProvider> */}
    </ThemeProvider>
  );
}
