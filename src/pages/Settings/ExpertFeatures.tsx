import { Divider } from '@mui/material'
import { SettingsRow } from './SettingsComponents'
import useStore from '../../store/useStore'

const ExpertFeatures = () => {
  const setFeatures = useStore((state) => state.setFeatures)
  const showFeatures = useStore((state) => state.showFeatures)
  const features = useStore((state) => state.features)
  const showActiveDevicesFirst = useStore(
    (state) => state.showActiveDevicesFirst
  )
  const setShowActiveDevicesFirst = useStore(
    (state) => state.setShowActiveDevicesFirst
  )
  return (
    <>
      {showFeatures.cloud && (
        <SettingsRow
          title="LedFx Cloud"
          checked={features.cloud}
          onChange={() => setFeatures('cloud', !features.cloud)}
        />
      )}
      {showFeatures.webaudio && (
        <SettingsRow
          title="WebAudio"
          checked={features.webaudio}
          onChange={() => setFeatures('webaudio', !features.webaudio)}
        />
      )}
      <SettingsRow
        title="Sort active devices first"
        checked={showActiveDevicesFirst}
        onChange={() => setShowActiveDevicesFirst(!showActiveDevicesFirst)}
      />
      <SettingsRow
        title="Copy To"
        checked={features.streamto}
        onChange={() => setFeatures('streamto', !features.streamto)}
      />
      <SettingsRow
        title="Transitions"
        checked={features.transitions}
        onChange={() => setFeatures('transitions', !features.transitions)}
        step="eight"
      />
      <SettingsRow
        title="Frequencies"
        checked={features.frequencies}
        onChange={() => setFeatures('frequencies', !features.frequencies)}
      />
      <Divider sx={{ m: '0.5rem 0 0.25rem 0' }} />
      <SettingsRow
        title="Spotify Embedded Player"
        checked={features.spotify}
        onChange={() => setFeatures('spotify', !features.spotify)}
      />

      <SettingsRow
        title="BG Waves (eats performance)"
        checked={features.waves}
        onChange={() => setFeatures('waves', !features.waves)}
      />
      <Divider sx={{ m: '0.5rem 0 0.25rem 0' }} />
      <SettingsRow
        title="SceneTables (Recent+Most)"
        checked={features.scenetables}
        onChange={() => setFeatures('scenetables', !features.scenetables)}
      />
      <SettingsRow
        title="SceneChips (Filter Tags)"
        checked={features.scenechips}
        onChange={() => setFeatures('scenechips', !features.scenechips)}
      />
      <Divider sx={{ m: '0.5rem 0 0.25rem 0' }} />
      <SettingsRow
        title="Beta Mode"
        checked={features.beta}
        onChange={() => setFeatures('beta', !features.beta)}
      />
      {showFeatures.alpha && (
        <SettingsRow
          title="Alpha Mode"
          checked={features.alpha}
          onChange={() => setFeatures('alpha', !features.alpha)}
        />
      )}
    </>
  )
}

export default ExpertFeatures
