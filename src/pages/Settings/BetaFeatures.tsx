/* eslint-disable react/jsx-no-useless-fragment */
import useStore from '../../store/useStore'
import { SettingsRow } from './SettingsComponents'

const BetaFeatures = () => {
  const setFeatures = useStore((state) => state.setFeatures)
  const showFeatures = useStore((state) => state.showFeatures)
  const features = useStore((state) => state.features)

  return showFeatures.integrations ? (
    <SettingsRow
      title="Integrations"
      checked={features.integrations}
      onChange={() => setFeatures('integrations', !features.integrations)}
    />
  ) : (
    <></>
  )
}

export default BetaFeatures
