import { SettingsRow } from './SettingsComponents'
import useStore from '../../store/useStore'

const DevicesSection = () => {
  const graphs = useStore((state) => state.graphs)
  const toggleGraphs = useStore((state) => state.toggleGraphs)
  const graphsMulti = useStore((state) => state.graphsMulti)
  const toggleGraphsMulti = useStore((state) => state.toggleGraphsMulti)
  const showMatrix = useStore((state) => state.showMatrix)
  const toggleShowMatrix = useStore((state) => state.toggleShowMatrix)
  const features = useStore((state) => state.features)
  const infoAlerts = useStore((state) => state.uiPersist.infoAlerts)
  const setInfoAlerts = useStore((state) => state.setInfoAlerts)
  const showComplex = useStore((state) => state.showComplex)
  const setShowComplex = useStore((state) => state.setShowComplex)
  const showGaps = useStore((state) => state.showGaps)
  const setShowGaps = useStore((state) => state.setShowGaps)

  return (
    <>
      <SettingsRow
        title="Show Infobox on Devices page"
        checked={infoAlerts.devices}
        onChange={() => setInfoAlerts('devices', !infoAlerts.devices)}
      />
      <SettingsRow
        title="Show Graph on Device page (eats performance)"
        checked={graphs}
        onChange={() => toggleGraphs()}
      />
      <SettingsRow
        disabled={!graphs}
        title="Show Graphs on Devices page (eats even more performance)"
        checked={graphsMulti}
        onChange={() => toggleGraphsMulti()}
      />
      {features.beta && (
        <SettingsRow
          disabled={!graphs}
          title="Show Matrix on Devices page (beta)"
          checked={showMatrix}
          onChange={() => toggleShowMatrix()}
        />
      )}
      <SettingsRow
        title="Show complex devices"
        checked={showComplex}
        onChange={() => setShowComplex(!showComplex)}
      />
      <SettingsRow
        title="Show gaps"
        checked={showGaps}
        onChange={() => setShowGaps(!showGaps)}
      />
    </>
  )
}

export default DevicesSection
