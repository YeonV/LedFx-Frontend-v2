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
              backgroundColor: '#0dbedc'
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
            <h1>Sorry</h1>
            <p style={{ fontSize: 18, marginBottom: '60px' }}>
              Try refresh first. If the problem persists, clear your browser
              data.
            </p>
            <button
              type="button"
              style={{
                height: 50,
                borderRadius: 10,
                color: '#000',
                backgroundColor: '#transparent',
                cursor: 'pointer',
                fontSize: 18,
                fontWeight: 'bold'
              }}
              onClick={() => {
                window.location.reload()
              }}
            >
              REFRESH
            </button>
            <br />
            <button
              type="button"
              style={{
                height: 50,
                borderRadius: 10,
                color: '#000',
                cursor: 'pointer',
                fontSize: 18,
                fontWeight: 'bold'
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
              CLEAR BROWSER DATA
            </button>
          </div>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
