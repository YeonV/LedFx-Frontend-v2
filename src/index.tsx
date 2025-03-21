import ReactDOM from 'react-dom/client'
import './index.css'
import { StyledEngineProvider } from '@mui/material'
import App from './App'
import reportWebVitals from './reportWebVitals'
import ErrorBoundary from './utils/ErrorBoundary'
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
