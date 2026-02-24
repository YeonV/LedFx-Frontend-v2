import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import isElectron from 'is-electron'

const useElectronProtocol = () => {
  const navigate = useNavigate()
  const isElect = isElectron()

  useEffect(() => {
    if (isElect) {
      let handled = false
      const handler = (...args: any[]) => {
        if (handled) return
        const [message] = args
        const [messageType, data] = message
        if (messageType === 'store-value' && data?.key === 'protocol-callback') {
          if (data.value && typeof data.value === 'string' && data.value.startsWith('ledfx://')) {
            // Ignore song detector calls - they're handled in App.tsx
            if (data.value.startsWith('ledfx://song/')) {
              return
            }
            handled = true
            navigate('/callback')
          }
        }
      }
      window.api.receive('fromMain', handler)

      // Request the value after handler is set up
      setTimeout(() => {
        window.api.send('toMain', {
          command: 'get-store-value',
          key: 'protocol-callback',
          defaultValue: null
        })
      }, 100)
    }
  }, [isElect, navigate])
}

export default useElectronProtocol
