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
  const showHex = useStore((state) => state.ui.showHex)
  const setShowHex = useStore((state) => state.ui.setShowHex)
  const showComplex = useStore((state) => state.showComplex)
  const setShowComplex = useStore((state) => state.setShowComplex)
  const showGaps = useStore((state) => state.showGaps)
  const setShowGaps = useStore((state) => state.setShowGaps)
  const sortByUser = useStore((state) => state.sortByUser)
  const setSortByUser = useStore((state) => state.setSortByUser)
  const showActiveDevicesFirst = useStore(
    (state) => state.showActiveDevicesFirst
  )
  const setShowActiveDevicesFirst = useStore(
    (state) => state.setShowActiveDevicesFirst
  )

  return (
    <>
      <SettingsRow
        title="Show Infobox on Devices page"
        checked={infoAlerts.devices}
        onChange={() => setInfoAlerts('devices', !infoAlerts.devices)}
        direct
      />
      <SettingsRow
        title="Show Graph on Device page (eats performance)"
        checked={graphs}
        onChange={() => toggleGraphs()}
        direct
      />
      <SettingsRow
        disabled={!graphs}
        title="Show Graphs on Devices page (crazy)"
        checked={graphsMulti}
        onChange={() => toggleGraphsMulti()}
        direct
      />
      {features.beta && (
        <SettingsRow
          disabled={!graphs}
          title="Show Matrix on Devices page (beta)"
          checked={showMatrix}
          onChange={() => toggleShowMatrix()}
          direct
        />
      )}
      <SettingsRow
        title="Show Hex-Input in GradientPicker"
        checked={showHex}
        onChange={() => setShowHex(!showHex)}
        direct
      />
      <SettingsRow
        title="Sort active devices first"
        checked={showActiveDevicesFirst}
        onChange={() => setShowActiveDevicesFirst(!showActiveDevicesFirst)}
      />
      <SettingsRow
        title="Sort devices by user"
        checked={sortByUser}
        onChange={() => setSortByUser(!sortByUser)}
      />
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
