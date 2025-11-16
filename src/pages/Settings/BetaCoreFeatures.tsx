import useStore from '../../store/useStore'
import { SettingsRow } from './SettingsComponents'

const BetaCoreFeatures = () => {
  const setFeatures = useStore((state) => state.setFeatures)
  const features = useStore((state) => state.features)

  return (
    <>
      <SettingsRow
        // beta
        title="Scene Playlist"
        checked={features.scenePlaylistBackend}
        onChange={() => setFeatures('scenePlaylistBackend', !features.scenePlaylistBackend)}
      />
      <SettingsRow
        title="Show Playlist in Bottom Bar"
        checked={features.showPlaylistInBottomBar}
        onChange={() => setFeatures('showPlaylistInBottomBar', !features.showPlaylistInBottomBar)}
      />
    </>
  )
}

export default BetaCoreFeatures
