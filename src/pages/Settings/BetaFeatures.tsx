import useStore from '../../store/useStore'
import { SettingsRow } from './SettingsComponents'

const BetaFeatures = () => {
  const setFeatures = useStore((state) => state.setFeatures)
  const showFeatures = useStore((state) => state.showFeatures)
  const features = useStore((state) => state.features)

  return (
    <>
      <SettingsRow
        title="Gamepad"
        checked={features.gamepad}
        onChange={() => setFeatures('gamepad', !features.gamepad)}
      />
      <SettingsRow
        title="MIDI"
        checked={features.scenemidi}
        onChange={() => setFeatures('scenemidi', !features.scenemidi)}
      />
      <SettingsRow
        title="Wakelock"
        checked={features.wakelock}
        onChange={() => setFeatures('wakelock', !features.wakelock)}
      />
      {showFeatures.integrations ? (
        <SettingsRow
          title="Integrations"
          checked={features.integrations}
          onChange={() => setFeatures('integrations', !features.integrations)}
        />
      ) : (
        <></>
      )}
    </>
  )
}

export default BetaFeatures
