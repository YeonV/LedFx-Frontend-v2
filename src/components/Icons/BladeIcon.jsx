import { Icon } from '@material-ui/core'
import Wled from './Wled'
import { YZLogo2, YZLogo2Bottom, YZLogo2Top, YZLogo2Y, YZLogo2Z } from './YZ-Logo2'
import { camelToSnake } from '../../utils/helpers'

const BladeIcon = ({
  colorIndicator = false,
  name = "MusicNote",
  className,
  scene = false,
  card = false
}) => {
  return (
    <Icon
      className={className}
      color={colorIndicator ? 'primary' : 'inherit'}
      style={{ position: 'relative' }}
    >
      {name.startsWith('yz:logo2y') ? <YZLogo2Y style={{ transform: card ? 'scale(0.025)' : scene ? 'scale(1)' : 'scale(0.012)', marginTop: '3px' }} />
        : name.startsWith('yz:logo2z') ? <YZLogo2Z style={{ transform: card ? 'scale(0.025)' : scene ? 'scale(1)' : 'scale(0.012)', marginTop: '3px' }} />
        : name.startsWith('yz:logo2top') ? <YZLogo2Top style={{ transform: card ? 'scale(0.025)' : scene ? 'scale(1)' : 'scale(0.012)', marginTop: '3px' }} />
        : name.startsWith('yz:logo2bot') ? <YZLogo2Bottom style={{ transform: card ? 'scale(0.025)' : scene ? 'scale(1)' : 'scale(0.012)', marginTop: '3px' }} />
        : name.startsWith('yz:logo2') ? <YZLogo2 style={{ transform: card ? 'scale(0.025)' : scene ? 'scale(1)' : 'scale(0.012)', marginTop: '3px' }} />
        : name.startsWith('wled') ? <Wled />
        : name.startsWith('mdi:') ? <span className={`mdi mdi-${name.split('mdi:')[1]}`} />
        : camelToSnake(name)}
    </Icon>
  )
}

export default BladeIcon
