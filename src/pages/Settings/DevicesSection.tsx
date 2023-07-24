import { SettingsRow } from './SettingsComponents'
import useStore from '../../store/useStore'

const DevicesSection = () => {
  const graphs = useStore((state) => state.graphs)
  const toggleGraphs = useStore((state) => state.toggleGraphs)
  const graphsMulti = useStore((state) => state.graphsMulti)
  const toggleGraphsMulti = useStore((state) => state.toggleGraphsMulti)
  const showMatrix = useStore((state) => state.showMatrix)
  const toggleShowMatrix = useStore((state) => state.toggleShowMatrix)

  const showActiveDevicesFirst = useStore(
    (state) => state.showActiveDevicesFirst
  )
  const setShowActiveDevicesFirst = useStore(
    (state) => state.setShowActiveDevicesFirst
  )

  return (
    <>
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
      <SettingsRow
        disabled={!graphs}
        title="Show Matrix on Devices page"
        checked={showMatrix}
        onChange={() => toggleShowMatrix()}
        direct
      />

      <SettingsRow
        title="Sort active devices first"
        checked={showActiveDevicesFirst}
        onChange={() => setShowActiveDevicesFirst(!showActiveDevicesFirst)}
      />
    </>
  )
}

export default DevicesSection
