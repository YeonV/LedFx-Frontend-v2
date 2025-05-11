import { SettingsRow } from './SettingsComponents'
import useStore from '../../store/useStore'

const UICard = () => {
  const viewMode = useStore((state) => state.viewMode)
  const setViewMode = useStore((state) => state.setViewMode)
  const setFeatures = useStore((state) => state.setFeatures)
  const showFeatures = useStore((state) => state.showFeatures)
  const features = useStore((state) => state.features)

  return (
    <>
      <SettingsRow
        title="Expert Mode"
        checked={viewMode !== 'user'}
        onChange={() => (viewMode === 'user' ? setViewMode('expert') : setViewMode('user'))}
      />
      <SettingsRow
        expert
        title="Beta Mode"
        checked={features.beta}
        onChange={() => setFeatures('beta', !features.beta)}
      />
      {showFeatures.alpha && (
        <SettingsRow
          expert
          title="Alpha Mode"
          checked={features.alpha}
          onChange={() => setFeatures('alpha', !features.alpha)}
        />
      )}
    </>
  )
}

export default UICard
