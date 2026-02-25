import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useStore from '../store/useStore'

const useDisplayMode = () => {
  const location = useLocation()
  const { pathname } = location
  const updateClientIdentity = useStore((state) => state.updateClientIdentity)

  // Check for display mode (OBS-friendly clean UI) - works with HashRouter
  const searchParams = new URLSearchParams(location.search)
  const isDisplayMode = searchParams.get('display') === 'true'
  const clientName = searchParams.get('clientName')

  useEffect(() => {
    // Add/remove class for displayMode visualiser
    const className = 'displayModeVisualiser'
    if (isDisplayMode && pathname === '/visualiser') {
      document.body.classList.add(className)
    } else {
      document.body.classList.remove(className)
    }
    if (isDisplayMode && pathname === '/visualiser') {
      const nameToSet = clientName || `Visualiser${Date.now()}`
      // Update Zustand/sessionStorage atomically
      // WebSocketManager will handle the actual WS update based on these store changes
      updateClientIdentity({
        name: nameToSet,
        type: 'visualiser'
      })
    }
    // Clean up on unmount
    return () => {
      document.body.classList.remove(className)
    }
  }, [isDisplayMode, pathname, clientName, updateClientIdentity])

  return isDisplayMode
}

export default useDisplayMode
