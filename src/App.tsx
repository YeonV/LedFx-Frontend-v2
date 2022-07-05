import { useEffect } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@mui/styles';
import { CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import isElectron from 'is-electron';
import ws, { WsContext, HandleWs } from './utils/Websocket';
import useStore from './store/useStore';
import useWindowDimensions from './utils/useWindowDimension';
import useStyles from './App.styles';
import './App.css';
import { ledfxTheme, ledfxThemes } from './themes/AppThemes';
import { BladeDarkGreyTheme5 } from './themes/AppThemes5';
import { deleteFrontendConfig, initFrontendConfig } from './utils/helpers';
import WaveLines from './components/Icons/waves';
import Pages from './pages/Pages';

export default function App() {
  const { height, width } = useWindowDimensions();
  const classes = useStyles();
  const features = useStore((state) => state.features);
  const setPlatform = useStore((state) => state.setPlatform);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const getSchemas = useStore((state) => state.getSchemas);
  const shutdown = useStore((state) => state.shutdown);
  const showSnackbar = useStore((state) => state.ui.showSnackbar);

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

  return (
    <ThemeProvider theme={BladeDarkGreyTheme5}>
      <MuiThemeProvider theme={ledfxThemes[ledfxTheme]}>
        <SnackbarProvider maxSnack={5}>
          <WsContext.Provider value={ws}>
            <div
              className={classes.root}
              style={{ paddingTop: isElectron() ? '30px' : 0 }}
            >
              <CssBaseline />
              <Pages handleWs={<HandleWs />} />
            </div>
          </WsContext.Provider>
          {features.waves && (
            <WaveLines
              startColor={
                ledfxThemes[ledfxTheme || 'DarkBlue'].palette.primary.main
              }
              stopColor={
                ledfxThemes[ledfxTheme || 'DarkBlue'].palette.accent.main ||
                '#ffdc0f'
              }
              width={width - 8}
              height={height}
            />
          )}
        </SnackbarProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}
