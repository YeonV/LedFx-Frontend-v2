import { MenuItem, Select, SelectProps } from '@mui/material';

interface ColorTypePickerProps extends Omit<SelectProps, 'value' | 'onChange'> {
  value: string;
  onChange: (e: any) => void;
  isRgb?: boolean;
}

const ColorTypePicker: React.FC<ColorTypePickerProps> = ({ value, onChange, isRgb, ...props }) => (
  <Select disableUnderline value={value} onChange={onChange} {...props}>
    <MenuItem value={'90'}>Solid</MenuItem>
    <MenuItem value={'91'}>Flash</MenuItem>
    <MenuItem value={'92'}>Pulse</MenuItem>
    {isRgb && <MenuItem value={'rgb'}>RGB</MenuItem>}
  </Select>
);

export default ColorTypePicker;
