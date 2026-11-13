import ReactDOM from 'react-dom/client'
import './index.css'
import { StyledEngineProvider } from '@mui/material'
import App from './App'
import reportWebVitals from './reportWebVitals'
import ErrorBoundary from './utils/ErrorBoundary'
import { isAndroidApp } from './components/FireTv/android.bridge'
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

declare global {
  interface Window {
    api: {
      send: (_channel: string, _data: any) => void
      receive: (_channel: string, _func: (_data: any) => void) => void
      yz: boolean
    }
  }
}

if (isAndroidApp()) {
  const phonePortrait = window.matchMedia('(orientation: portrait) and (max-width: 599px)')
  const applyStatusBarSpace = () => {
    document
      .querySelector('meta[name="viewport"]')
      ?.setAttribute(
        'content',
        `width=device-width, initial-scale=1${phonePortrait.matches ? ', viewport-fit=cover' : ''}`
      )
    if (phonePortrait.matches) {
      document.documentElement.style.setProperty(
        '--android-status-bar',
        'max(calc(env(safe-area-inset-top) - 22px), min(env(safe-area-inset-top), 24px))'
      )
      document.documentElement.style.setProperty('--android-toolbar-trim', '6px')
      document.documentElement.style.setProperty('--android-nav-bar', 'env(safe-area-inset-bottom)')
    } else {
      document.documentElement.style.removeProperty('--android-status-bar')
      document.documentElement.style.removeProperty('--android-toolbar-trim')
      document.documentElement.style.removeProperty('--android-nav-bar')
    }
  }
  applyStatusBarSpace()
  phonePortrait.addEventListener('change', applyStatusBarSpace)
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <ErrorBoundary>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </ErrorBoundary>
)

// serviceWorkerRegistration.register();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
