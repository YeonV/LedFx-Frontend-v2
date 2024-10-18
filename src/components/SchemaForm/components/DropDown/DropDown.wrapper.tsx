import DropDown from './DropDown'

export interface EffectDropDownProps {
  effects: any
  virtual: any
  features: any
  setEffect: any
  getVirtuals: any
  ommit?: string[]
}

const EffectDropDown = ({
  effects,
  virtual,
  features,
  setEffect,
  getVirtuals,
  ommit
}: EffectDropDownProps) => {
  const effectNames =
    effects &&
    Object.keys(effects)
      .filter(e => !ommit?.includes(effects[e].name))
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
    setEffect(virtual.id, e.target.value).then(() => {
      getVirtuals()
    })

  return (
    <DropDown
      value={(virtual && virtual.effect && virtual.effect.type) || ''}
      onChange={(e: any) => onEffectTypeChange(e)}
      groups={groups}
      showFilter={features.effectfilter}
      title="Effect Type"
    />
  )
}

export default EffectDropDown
