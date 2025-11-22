import { Box, CssBaseline } from '@mui/material'
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(error, errorInfo)
  }

  handleHardRefresh = async () => {
    // 1. Clear the Cache Storage API
    if ('caches' in window) {
      try {
        const keys = await caches.keys()
        await Promise.all(keys.map((key) => caches.delete(key)))
      } catch (err) {
        console.error('Failed to clear caches:', err)
      }
    }

    // 2. Unregister Service Workers
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const registration of registrations) {
          await registration.unregister()
        }
      } catch (err) {
        console.error('Failed to unregister service workers:', err)
      }
    }

    // 3. Force Reload with Timestamp
    const url = new URL(window.location.href)
    url.searchParams.set('hard_refresh', Date.now().toString())
    window.location.href = url.toString()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            color: '#fff'
          }}
          sx={{
            '& button:hover': {
              backgroundColor: '#0dbedc !important',
              color: '#000 !important'
            }
          }}
        >
          <CssBaseline />
          <div
            style={{
              maxWidth: 360,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
              margin: '0 auto'
            }}
          >
            <h1>Client issue detected</h1>
            <p style={{ fontSize: 18, marginBottom: '40px' }}>
              Please try these recovery options in order
            </p>
            {/* BUTTON 1: Standard Refresh */}
            <button
              type="button"
              style={{
                height: 50,
                borderRadius: 10,
                color: '#000',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontSize: 18,
                fontWeight: 'bold',
                border: 'none',
                marginBottom: '15px'
              }}
              onClick={() => {
                window.location.reload()
              }}
            >
              Step1: Reload
            </button>
            {/* BUTTON 2: Hard Refresh */}
            <button
              type="button"
              style={{
                height: 50,
                borderRadius: 10,
                color: '#000',
                backgroundColor: '#ffeb3b',
                cursor: 'pointer',
                fontSize: 18,
                fontWeight: 'bold',
                border: 'none'
              }}
              onClick={this.handleHardRefresh}
            >
              Step2: Repair
            </button>
            {/* DIVIDER SECTION */}
            <div
              style={{
                margin: '20px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <div style={{ width: '100%', height: '1px', backgroundColor: '#333' }}></div>
              <span style={{ fontSize: '14px', color: '#aaa', padding: '5px 0' }}>
                Step3: Press CTRL+F5
              </span>
              <div style={{ width: '100%', height: '1px', backgroundColor: '#333' }}></div>
            </div>
            {/* BUTTON 3: Clear Data */}
            <button
              type="button"
              style={{
                height: 50,
                borderRadius: 10,
                color: '#fff',
                backgroundColor: '#d32f2f',
                cursor: 'pointer',
                fontSize: 18,
                fontWeight: 'bold',
                border: 'none'
              }}
              onClick={() => {
                window.localStorage.removeItem('undefined')
                window.localStorage.removeItem('ledfx-storage')
                window.localStorage.removeItem('ledfx-host')
                window.localStorage.removeItem('ledfx-hosts')
                window.localStorage.removeItem('ledfx-frontend')
                window.localStorage.removeItem('ledfx-cloud-role')
                window.localStorage.removeItem('ledfx-cloud-userid')
                window.localStorage.removeItem('ledfx-theme')
                window.localStorage.removeItem('jwt')
                window.localStorage.removeItem('username')
                window.localStorage.removeItem('BladeMod')
                window.location.reload()
              }}
            >
              Step4: Nuke*
            </button>
            {/* WARNING TEXT */}
            <p
              style={{
                fontSize: '12px',
                color: '#aaa',
                marginTop: '10px',
                fontStyle: 'italic'
              }}
            >
              *resets client settings. (backend won't be affected)
            </p>
          </div>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
