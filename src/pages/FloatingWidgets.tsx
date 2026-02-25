import isElectron from 'is-electron'
import useStore from '../store/useStore'
import Mp from '../components/Integrations/Spotify/Widgets/Mp/Mp'
import MGraphFloating from '../components/Integrations/Spotify/Widgets/MGraphFlotaing/MGraphFloating'
import Keybinding from '../components/Integrations/Spotify/Widgets/Keybinding/Keybinding'
import SongDetectorFloating from '../components/Integrations/Spotify/Widgets/SongDetector/SongDetectorFloating'
import SongDetectorPlusFloating from '../components/Integrations/Spotify/Widgets/SongDetector/SongDetectorPlusFloating'
import SongDetectorScreen from '../components/Integrations/Spotify/Widgets/SongDetector/SongDetectorScreen'
import PixelGraphSettingsFloating from '../components/Integrations/Spotify/Widgets/PixelGraphSettings/PixelGraphSettingsFloating'
import GlobalColorWidget from '../components/Integrations/Spotify/Widgets/GlobalColorWidget/GlobalColorWidget'
import ElectronStoreInspector from '../components/DevTools/ElectronStoreInspector'

const FloatingWidgets = () => {
  const isElect = isElectron()
  const keybinding = useStore((state) => state.ui.keybinding)
  const setKeybinding = useStore((state) => state.ui.setKeybinding)
  const mp = useStore((state) => state.ui.mp)
  const mg = useStore((state) => state.ui.mg)
  const setMg = useStore((state) => state.ui.setMg)
  const pgs = useStore((state) => state.ui.pgs)
  const setPgs = useStore((state) => state.ui.setPgs)
  const sd = useStore((state) => state.ui.sd)
  const setSd = useStore((state) => state.ui.setSd)
  const sdPlus = useStore((state) => state.ui.sdPlus)
  const setSdPlus = useStore((state) => state.ui.setSdPlus)
  const globalColorWidget = useStore((state) => state.ui.globalColorWidget)
  const setGlobalColorWidget = useStore((state) => state.ui.setGlobalColorWidget)
  const storeInspector = useStore((state) => state.ui.storeInspector)
  const setStoreInspector = useStore((state) => state.ui.setStoreInspector)

  return (
    <>
      {mp && <Mp />}
      {pgs && <PixelGraphSettingsFloating close={() => setPgs(false)} />}
      {sd && <SongDetectorFloating close={() => setSd(false)} />}
      {sdPlus && <SongDetectorPlusFloating close={() => setSdPlus(false)} />}
      {mg && <MGraphFloating close={() => setMg(false)} />}
      {keybinding && <Keybinding close={() => setKeybinding(false)} />}
      {globalColorWidget && <GlobalColorWidget close={() => setGlobalColorWidget(false)} />}
      {isElect && storeInspector && (
        <ElectronStoreInspector close={() => setStoreInspector(false)} />
      )}
      <SongDetectorScreen />
    </>
  )
}

export default FloatingWidgets
