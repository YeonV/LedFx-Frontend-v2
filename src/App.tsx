/* eslint-disable @typescript-eslint/indent */
import { useEffect, useMemo } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import isElectron from 'is-electron'
import { Box, CssBaseline } from '@mui/material'
import Cookies from 'universal-cookie'
import ws, { WsContext, HandleWs } from './utils/Websocket'
import useStore from './store/useStore'
import useWindowDimensions from './utils/useWindowDimension'
import './App.css'
import { deleteFrontendConfig, initFrontendConfig } from './utils/helpers'
import WaveLines from './components/Icons/waves'
import Pages from './pages/Pages'
import SpotifyProvider from './components/Integrations/Spotify/SpotifyProvider'
import { ledfxThemes, ledfxTheme, common } from './themes/AppThemes'
import xmas from './assets/xmas.png'
import newyear from './assets/fireworks.jpg'
import login from './utils/login'

export default function App() {
  const { height, width } = useWindowDimensions()
  const virtuals = useStore((state) => state.virtuals)
  const features = useStore((state) => state.features)
  const protoCall = useStore((state) => state.protoCall)
  const setEffect = useStore((state) => state.setEffect)
  const setProtoCall = useStore((state) => state.setProtoCall)
  const setPlatform = useStore((state) => state.setPlatform)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const getSchemas = useStore((state) => state.getSchemas)
  const shutdown = useStore((state) => state.shutdown)
  const showSnackbar = useStore((state) => state.ui.showSnackbar)
  // const darkMode = useStore((state) => state.ui.darkMode)
  const setCoreParams = useStore((state) => state.setCoreParams)
  const setCoreStatus = useStore((state) => state.setCoreStatus)
  const changeTheme = useStore((state) => state.ui.changeTheme)
  const reloadTheme = useStore((state) => state.ui.reloadTheme)

  const theme = useMemo(
    () => createTheme({
        ...ledfxThemes[window.localStorage.getItem('ledfx-theme') ?? ledfxTheme],
        ...common,
        palette: {
          ...ledfxThemes[window.localStorage.getItem('ledfx-theme') ?? ledfxTheme].palette
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [changeTheme]
  )

  useEffect(() => {
    getVirtuals()
    getSystemConfig()
    getSchemas()
  }, [getVirtuals, getSystemConfig, getSchemas])

  useEffect(() => {
    initFrontendConfig()

    console.info(
      // eslint-disable-next-line no-useless-concat
      '%c Ledfx ' + '%c\n ReactApp by Blade ',
      'padding: 10px 40px; color: #ffffff; border-radius: 5px 5px 0 0; background-color: #800000;',
      'background: #fff; color: #800000; border-radius: 0 0 5px 5px;padding: 5px 0;'
    )
    if (window.location.pathname.includes('hassio_ingress'))
      console.info(
        '%c HomeAssistant detected ',
        'padding: 3px 5px; border-radius: 5px; color: #ffffff; background-color: #038fc7;'
      )
    if (isElectron()) {
      ;(window as any)?.api?.send('toMain', { command: 'get-platform' })
      ;(window as any)?.api?.send('toMain', { command: 'get-core-params' })
      ;(window as any)?.api?.send('toMain', { command: 'close-others' })
    }
  }, [])
  ;(window as any).api?.receive('fromMain', (parameters: any) => {
    if (parameters === 'shutdown') {
      shutdown()
    }
    if (parameters[0] === 'platform') {
      setPlatform(parameters[1])
    }
    if (parameters[0] === 'currentdir') {
      console.log(parameters[1])
    }
    if (parameters[0] === 'protocol') {
      // console.log('protocol', parameters[1])
      setProtoCall(JSON.parse(parameters[1]).commandLine.pop())
    }
    if (parameters[0] === 'snackbar') {
      showSnackbar('info', parameters[1])
    }
    if (parameters[0] === 'coreParams') {
      // console.log('coreParams', parameters[1])
      setCoreParams(parameters[1])
    }
    if (parameters[0] === 'status') {
      // console.log('status', parameters[1])
      setCoreStatus(parameters[1])
    }
    if (parameters === 'clear-frontend') {
      deleteFrontendConfig()
    }
    if (parameters[0] === 'all-windows') {
      // console.log('all-windows', parameters[1])
    }
  })

  useEffect(() => {
    const handleWebsockets = (e: any) => {
      showSnackbar(e.detail.type, e.detail.message)
    }
    document.addEventListener('show_message', handleWebsockets)
    return () => {
      document.removeEventListener('show_message', handleWebsockets)
    }
  }, [showSnackbar])

  useEffect(() => {
    if (protoCall !== '') {
      // showSnackbar('info', `External call: ${protoCall}`)
      const proto = protoCall.split('/').filter((n) => n)

      console.table({
        Domain: proto[1],
        Action: proto[2],
        Payload: proto[3]
      })
      if (proto[1] === 'callback') {
        const cookies = new Cookies()
        const expDate = new Date()
        expDate.setHours(expDate.getHours() + 1)
        cookies.remove('access_token', { path: '/integrations' })
        cookies.set(
          'access_token',
          proto[2].replace('?code=', '').replace('#%2FIntegrations%3F', ''),
          { expires: expDate }
        )
      } else if (proto[1] === 'auth') {
        login(proto.join().split('redirect?')[1]).then(() => {
          window.location.reload()
        })
      } else if (proto[1] === 'command') {
        if (proto[2] === 'theme') {
          if (proto[3] === 'light') {
            window.localStorage.setItem('ledfx-theme', 'LightBlack')
            reloadTheme()
          }
          if (proto[3] === 'dark') {
            window.localStorage.setItem('ledfx-theme', 'DarkWhite')
            reloadTheme()
          }
          if (proto[3] === 'reset') {
            window.localStorage.setItem('ledfx-theme', 'DarkOrange')
            reloadTheme()
          }
        }
      } else if (proto[1] === 'song') {
        const v = proto[2]
        const virtual = (Object.keys(virtuals).find((virt) => virtuals[virt].id === v))
        if (virtual && proto[3].length > 3) {
          setEffect(v, 'texter2d', {
            "gradient": "linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(255, 120, 0) 14%, rgb(255, 200, 0) 28%, rgb(0, 255, 0) 42%, rgb(0, 199, 140) 56%, rgb(0, 0, 255) 70%, rgb(128, 0, 128) 84%, rgb(255, 0, 178) 98%)",
            "option_2": false,
            "flip": false,
            "blur": 0,
            "flip_horizontal": false,
            "speed_option_1": 2,
            "resize_method": "Fast",
            "gradient_roll": 0,
            "alpha": false,
            "value_option_1": 0.5,
            "font": "Blade-5x8",
            "use_gradient": false,
            "diag": false,
            "test": false,
            "impulse_decay": 0.1,
            "mirror": false,
            "flip_vertical": false,
            "text_effect": "Side Scroll",
            "multiplier": 1,
            "brightness": 1,
            "text_color": "#ff0000",
            "background_brightness": 1,
            "rotate": 0,
            "dump": false,
            "option_1": false,
            "height_percent": 100,
            "background_color": "#000000",
            "text": proto[3]
      }, true, true)
        }
      } else {
        showSnackbar('info', `External call: ${protoCall.replace('ledfx://', '')}`)
      }
      setProtoCall('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [protoCall, showSnackbar, setProtoCall])

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={15}>
        <WsContext.Provider value={ws}>
          <SpotifyProvider>
            <Box
              sx={{ display: 'flex' }}
              style={{ paddingTop: isElectron() ? '30px' : 0 }}
            >
              <CssBaseline />
              <Pages handleWs={<HandleWs />} />
            </Box>
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
        {new Date().getFullYear() === 2024 && 
          new Date().getMonth() === 11  && 
          new Date().getDate() >= 24 && (
          <div
            style={{
              margin: 'auto',
              backgroundImage: `url(${xmas})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom',
              display: 'block',
              zIndex: -1,
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              opacity: 0.7
            }}
          />
        )}
        {new Date().getFullYear() === 2025 &&
          new Date().getMonth() === 0 &&
          new Date().getDate() === 1 && (
            <div
              style={{
                margin: 'auto',
                backgroundImage: `url(${newyear})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom right',
                display: 'block',
                zIndex: -1,
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                opacity: 0.7
              }}
            />
          )}
      </SnackbarProvider>
    </ThemeProvider>
  )
}
