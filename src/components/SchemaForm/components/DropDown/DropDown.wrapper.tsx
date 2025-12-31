import DropDown from './DropDown'

export interface EffectDropDownProps {
  effects: any
  virtual: any
  features: any
  setEffect: any
  getVirtuals: any
  ommit?: string[]
  title?: string
}

const EffectDropDown = ({
  effects,
  virtual,
  features,
  setEffect,
  getVirtuals,
  ommit,
  title = 'Effect Type'
}: EffectDropDownProps) => {
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
    />
  )
}

export default EffectDropDown
