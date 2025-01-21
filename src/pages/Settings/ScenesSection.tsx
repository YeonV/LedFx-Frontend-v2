import { SettingsRow } from './SettingsComponents'
import useStore from '../../store/useStore'

const ScenesSection = () => {
  const setFeatures = useStore((state) => state.setFeatures)
  const features = useStore((state) => state.features)
  const infoAlerts = useStore((state) => state.uiPersist.infoAlerts)
  const setInfoAlerts = useStore((state) => state.setInfoAlerts)

  return (
    <>
      <SettingsRow
        title="Show Infobox on Scenes page"
        checked={infoAlerts.scenes}
        onChange={() => setInfoAlerts('scenes', !infoAlerts.scenes)}
      />
      <SettingsRow
        title="Recent Scenes"
        checked={features.sceneRecent}
        onChange={() => setFeatures('sceneRecent', !features.sceneRecent)}
      />
      <SettingsRow
        title="Most Played Scenes"
        checked={features.sceneMostUsed}
        onChange={() => setFeatures('sceneMostUsed', !features.sceneMostUsed)}
      />
      <SettingsRow
        title="Scenes Playlist"
        checked={features.scenePlaylist}
        onChange={() => setFeatures('scenePlaylist', !features.scenePlaylist)}
      />
      <SettingsRow
        title="SceneChips (Filter Tags)"
        checked={features.scenechips}
        onChange={() => setFeatures('scenechips', !features.scenechips)}
      />
      <SettingsRow
        title="External call"
        checked={features.sceneexternal}
        onChange={() => setFeatures('sceneexternal', !features.sceneexternal)}
      />
      <SettingsRow
        title="Seperate scrollbar"
        checked={features.sceneScroll}
        onChange={() => setFeatures('sceneScroll', !features.sceneScroll)}
      />
    </>
  )
}

export default ScenesSection
