import { Divider, MenuItem, Select } from '@mui/material'
import useStore from '../../store/useStore'
import { SettingsRow } from './SettingsComponents'

const EffectsSettingsCard = () => {
  const showHex = useStore((state) => state.uiPersist.showHex)
  const features = useStore((state) => state.features)
  const blenderAutomagic = useStore((state) => state.uiPersist.blenderAutomagic)
  const effectDescriptions = useStore((state) => state.ui.effectDescriptions)
  const setShowHex = useStore((state) => state.setShowHex)
  const setFeatures = useStore((state) => state.setFeatures)
  const setBlenderAutomagic = useStore((state) => state.setBlenderAutomagic)
  const setEffectDescriptions = useStore((state) => state.ui.setEffectDescriptions)

  return (
    <>
      <SettingsRow
        expert
        title="Show Copy To"
        checked={features.streamto}
        onChange={() => setFeatures('streamto', !features.streamto)}
      />
      <SettingsRow
        expert
        title="Show Transitions"
        checked={features.transitions}
        onChange={() => setFeatures('transitions', !features.transitions)}
        step="eight"
      />
      <SettingsRow
        expert
        title="Show Frequencies"
        checked={features.frequencies}
        onChange={() => setFeatures('frequencies', !features.frequencies)}
      />
      <Divider sx={{ m: '0.5rem 0 0.25rem 0' }} />
      <SettingsRow
        beta
        title="Show Effect Filter"
        checked={features.effectfilter}
        onChange={() => setFeatures('effectfilter', !features.effectfilter)}
      />
      <SettingsRow
        title="Show Hex-Input in GradientPicker"
        checked={showHex}
        onChange={() => setShowHex(!showHex)}
      />
      <SettingsRow title="Show Effect Descriptions" expert>
        <Select
          disableUnderline
          value={effectDescriptions}
          onChange={(e) => setEffectDescriptions(e.target.value as 'Auto' | 'Show' | 'Hide')}
        >
          <MenuItem value="Auto">Auto</MenuItem>
          <MenuItem value="Show">Show</MenuItem>
          <MenuItem value="Hide">Hide</MenuItem>
        </Select>
      </SettingsRow>
      <Divider sx={{ m: '0.5rem 0 0.25rem 0' }} />
      <SettingsRow
        alpha
        title="Use Blender Automagic"
        checked={blenderAutomagic}
        onChange={() => setBlenderAutomagic(!blenderAutomagic)}
      />
    </>
  )
}

export default EffectsSettingsCard
