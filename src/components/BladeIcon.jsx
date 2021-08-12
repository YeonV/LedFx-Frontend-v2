import { Icon } from '@material-ui/core'
import Wled from '../assets/Wled'
import YZ from '../assets/YZ'
import { camelToSnake } from '../utils/helpers'

const BladeIcon = ({
  colorIndicator = false,
  name = "MusicNote",
  className,
}) => {
  return (
    <Icon
      className={className}
      color={colorIndicator ? 'primary' : 'inherit'}
      style={{ position: 'relative' }}
    >
      {name.startsWith('yz') ? <YZ style={{ transform: 'scale(0.011)', marginTop: '3px' }} />
        : name.startsWith('wled') ? <Wled />
          : name.startsWith('mdi:') ? <span className={`mdi mdi-${name.split('mdi:')[1]}`} />
            : camelToSnake(name)}
    </Icon>
  )
}

export default BladeIcon
