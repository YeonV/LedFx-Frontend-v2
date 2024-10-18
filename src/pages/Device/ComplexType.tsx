import { MenuItem, Select, ListSubheader, FormControl, InputLabel, capitalize } from '@mui/material';
import useStore from '../../store/useStore';
import { useMemo } from 'react';

const ComplexType = ({ virtId, value }: {value: string, virtId: string}) => {
  const effects = useStore((state) => state.schemas.effects);
  const setEffect = useStore((state) => state.setEffect)
  const complex = virtId.split('-').slice(-1)[0]
  const handleChange = (e: any) => {
    setEffect(virtId, e.target.value, {}, true)
  };

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
      r[a.category] = [...(r[a.category] || []), a];
      return r;
    }, {});

    const categoryOrder = ['Non-Reactive', 'BPM', 'Classic', 'Atmospheric', '2D', 'Matrix', 'Diagnostic'];

    const effectTypes = useMemo(() => {
      // Sort the categories based on the specified order
      const sortedCategories = Object.keys(groups || {}).sort((a, b) => {
        const aIndex = categoryOrder.indexOf(a);
        const bIndex = categoryOrder.indexOf(b);
        return aIndex - bIndex;
      }).sort((a, b) => {
        const aIndex = ['Diagnostic'].indexOf(a);
        const bIndex = ['Diagnostic'].indexOf(b);
        return aIndex - bIndex;
      });
    
      // Create the effectTypes array with sorted categories
      return sortedCategories.flatMap((category) => [
        { type: 'header', category },
        ...groups[category].map((effect: any) => ({
          type: 'item',
          value: effect.id,
          label: effect.name,
          group: category,
        })),
      ]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groups]);
    
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
        <InputLabel htmlFor={`${complex}-select`}>{capitalize(complex)} Effect</InputLabel>
        <Select fullWidth variant='outlined' onChange={handleChange} value={value} id={`${complex}-select`} label={complex}>
        {effectTypes
            .map((effectType, index) =>
            effectType.type === 'header' ? (
            <ListSubheader key={index}>{effectType.category}</ListSubheader>
            ) : (
            <MenuItem key={effectType.value} value={effectType.value}>
                {effectType.label}
            </MenuItem>
            )
        )}
        </Select>
    </FormControl>
  );
};

export default ComplexType;
