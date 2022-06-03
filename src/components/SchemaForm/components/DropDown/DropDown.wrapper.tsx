import DropDown from './DropDown';

export interface EffectDropDownProps {
  effects: any;
  virtual: any;
  features: any;
  setVirtualEffect: (_virtId: string, _: any) => any;
  getVirtuals: () => Record<string, unknown>;
}

const EffectDropDown = ({
  effects,
  virtual,
  features,
  setVirtualEffect,
  getVirtuals,
}: EffectDropDownProps) => {
  const effectNames =
    effects &&
    Object.keys(effects).map((eid) => ({
      name: effects[eid].name,
      id: effects[eid].id,
      category: effects[eid].category,
    }));

  const groups =
    effectNames &&
    effectNames.reduce((r: any, a: any) => {
      // eslint-disable-next-line no-param-reassign
      r[a.category] = [...(r[a.category] || []), a];
      return r;
    }, {});

  const onEffectTypeChange = (e: any) =>
    setVirtualEffect(virtual.id, e.target.value).then(() => {
      getVirtuals();
    });

  return (
    <DropDown
      value={(virtual && virtual.effect && virtual.effect.type) || ''}
      onChange={(e: any) => onEffectTypeChange(e)}
      groups={groups}
      showFilter={features.effectfilter}
    />
  );
};

export default EffectDropDown;
