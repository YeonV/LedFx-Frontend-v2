import DropDown from './DropDown'
import useStore from '../../../../store/useStore'

export interface EffectDropDownProps {
  effects: any
  virtual: any
  features: any
  setEffect: any
  getVirtuals: any
  ommit?: string[]
  title?: string
  viewMode?: 'list' | 'grid'
}

const EffectDropDown = ({
  effects,
  virtual,
  features,
  setEffect,
  ommit,
  title = 'Effect Type',
  viewMode
}: EffectDropDownProps) => {
  // Use feature flag to determine view mode if not explicitly provided
  const effectGridViewEnabled = useStore((state) => state.features.effectGridView)
  const actualViewMode = viewMode !== undefined ? viewMode : (effectGridViewEnabled ? 'grid' : 'list')
  const effectNames =
    effects &&
    Object.keys(effects)
      .filter((e) => !ommit?.includes(effects[e].name))
      .map((eid) => ({
        name: effects[eid].name,
        id: effects[eid].id,
        category: effects[eid].category
      }))

  const groups =
    effectNames &&
    effectNames.reduce((r: any, a: any) => {
      r[a.category] = [...(r[a.category] || []), a]
      return r
    }, {})

  const onEffectTypeChange = (e: any) =>
    // Parent components handle refetch via useEffect dependencies
    setEffect(virtual.id, e.target.value)

  return (
    <DropDown
      value={
        virtual && virtual.effect && virtual.effect.type
          ? virtual.effect.type
          : virtual?.last_effect
            ? virtual.last_effect
            : 'Choose Effect'
      }
      onChange={(e: any) => onEffectTypeChange(e)}
      groups={groups}
      showFilter={features.effectfilter}
      title={
        virtual && virtual.effect && virtual.effect.type
          ? title
          : virtual?.last_effect
            ? 'Last Effect'
            : 'Currently Inactive'
      }
      viewMode={actualViewMode}
    />
  )
}

export default EffectDropDown
