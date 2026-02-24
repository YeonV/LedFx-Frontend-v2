import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import isElectron from 'is-electron'
import useStore from '../store/useStore'

const useAppHotkeys = () => {
  const navigate = useNavigate()
  const isElect = isElectron()

  const smartBarOpen = useStore((state) => state.ui.bars && state.ui.bars.smartBar.open)
  const setSmartBarOpen = useStore((state) => state.ui.bars && state.ui.setSmartBarOpen)

  const setMp = useStore((state) => state.ui.setMp)
  const setPgs = useStore((state) => state.ui.setPgs)
  const setFpsViewer = useStore((state) => state.ui.setFpsViewer)
  const setMg = useStore((state) => state.ui.setMg)
  const setSd = useStore((state) => state.ui.setSd)
  const setSdPlus = useStore((state) => state.ui.setSdPlus)
  const setGlobalColorWidget = useStore((state) => state.ui.setGlobalColorWidget)
  const setStoreInspector = useStore((state) => state.ui.setStoreInspector)
  const setKeybinding = useStore((state) => state.ui.setKeybinding)

  const features = useStore((state) => state.features)
  const setFeatures = useStore((state) => state.setFeatures)
  const setShowFeatures = useStore((state) => state.setShowFeatures)

  useHotkeys(['ctrl+alt+y', 'ctrl+alt+z'], () => setSmartBarOpen(!smartBarOpen))
  useHotkeys(['ctrl+alt+d'], () => setMp(!useStore.getState().ui.mp))
  useHotkeys(['ctrl+alt+p'], () => setPgs(!useStore.getState().ui.pgs))
  useHotkeys(['ctrl+alt+f'], () => setFpsViewer(!useStore.getState().ui.fpsViewer))
  useHotkeys(['ctrl+alt+m'], () => setMg(!useStore.getState().ui.mg))
  useHotkeys(['ctrl+alt+t'], () => setSd(!useStore.getState().ui.sd))
  useHotkeys(['ctrl+alt+s'], () => setSdPlus(!useStore.getState().ui.sdPlus))
  useHotkeys(['ctrl+alt+c'], () => setGlobalColorWidget(!useStore.getState().ui.globalColorWidget))
  useHotkeys(['ctrl+alt+x'], () => setStoreInspector(!useStore.getState().ui.storeInspector))
  useHotkeys(['ctrl+alt+k', 'ctrl+space'], () => setKeybinding(!useStore.getState().ui.keybinding))
  useHotkeys(['ctrl+alt+n'], () => navigate('/reactflow'))
  useHotkeys(['ctrl+alt+g'], () => {
    if (window.localStorage.getItem('guestmode') === 'activated') {
      window.localStorage.removeItem('guestmode')
    } else {
      window.localStorage.setItem('guestmode', 'activated')
    }
    window.location.reload()
  })

  useHotkeys(
    ['ctrl+alt+l'],
    () => {
      window.localStorage.setItem('lock', 'activated')
      window.location.reload()
    },
    { enabled: isElect }
  )

  useHotkeys(['ctrl+alt+a'], () => {
    setFeatures('beta', !features.beta)
    setFeatures('alpha', !features.alpha)
    setShowFeatures('alpha', !features.alpha)
    setShowFeatures('beta', !features.beta)
  })
}

export default useAppHotkeys
