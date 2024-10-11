import { MenuItem, Select } from '@mui/material'

const ColorTypePicker = ({ value, onChange, isRgb }:{
    value: string
    onChange: (e: any) => void
    isRgb?: boolean
  }) => (
    <Select disableUnderline value={value} onChange={onChange}>
      <MenuItem value={'90'}>Solid</MenuItem>
      <MenuItem value={'91'}>Flash</MenuItem>
      <MenuItem value={'92'}>Pulse</MenuItem>
      {isRgb && <MenuItem value={'rgb'}>RGB</MenuItem>}
    </Select>
  );

  export default ColorTypePicker;