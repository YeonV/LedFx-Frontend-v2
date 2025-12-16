import useStore from '../../store/useStore'
import { SettingsRow } from './SettingsComponents'

const BottomBarCard = () => {
  const setFeatures = useStore((state) => state.setFeatures)
  const features = useStore((state) => state.features)

  return (
    <>
      <SettingsRow
        title="Assets"
        checked={features.showAssetManagerInBottomBar}
        onChange={() =>
          setFeatures('showAssetManagerInBottomBar', !features.showAssetManagerInBottomBar)
        }
      />
      <SettingsRow
        title="Playlist"
        checked={features.showPlaylistInBottomBar}
        onChange={() => setFeatures('showPlaylistInBottomBar', !features.showPlaylistInBottomBar)}
      />
      <SettingsRow
        beta
        title="YZ-Flow"
        checked={features.showFlowInBottomBar}
        onChange={() => setFeatures('showFlowInBottomBar', !features.showFlowInBottomBar)}
      />
      <SettingsRow
        beta
        title="Gamepad"
        checked={features.showGamepadInBottomBar}
        onChange={() => setFeatures('showGamepadInBottomBar', !features.showGamepadInBottomBar)}
      />
      <SettingsRow
        beta
        title="MIDI"
        checked={features.showMidiInBottomBar}
        onChange={() => setFeatures('showMidiInBottomBar', !features.showMidiInBottomBar)}
      />
    </>
  )
}

export default BottomBarCard
