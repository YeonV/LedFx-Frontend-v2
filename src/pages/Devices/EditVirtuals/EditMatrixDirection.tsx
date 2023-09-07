/* eslint-disable prettier/prettier */
import { MenuItem } from '@mui/material'
import dir from './EditMatrix.props'

const Direction = ({ value, title, img, ...props  }: { value: typeof dir[number], title: string, img: string }) => 
  <MenuItem {...props} sx={{justifyContent: 'space-between'}} value={value}><div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} ><div>{title}</div><img width="30px" src={img} alt={title} /></div></MenuItem>

export default Direction
