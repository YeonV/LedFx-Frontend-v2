import { Icon } from '@mui/material'
import Wled from '../Wled'
import RazerMouse from '../RzrMouse'
import RazerLogo from '../RzrLogo'
import { YZLogo2, YZLogo2Bottom, YZLogo2Top, YZLogo2Y, YZLogo2Z } from '../YZ-Logo2'
import { YZLogo3, YZLogo3Left, YZLogo3Right, YZLogo3Top, YZLogo3Y, YZLogo3Z } from '../YZ-Logo3'
import { camelToSnake } from '../../../utils/helpers'
import '../../../assets/materialdesignicons.css'
import '../../../index.css'
import { BladeIconProps } from './BladeIcon.interface'
import HomeAssistantLogo from '../HomeAssistant'
import NovationLogo from '../Novation'

import type { JSX } from 'react'

const getStyle = (card: boolean, scene: boolean, intro: boolean, list: boolean) => ({
  transform: card ? 'unset' : scene ? 'scale(1)' : intro ? 'scale(0.05)' : 'scale(0.012)',
  marginTop: '3px',
  height: list ? '100%' : 'unset'
})

const renderIcon = (name: string, style: React.CSSProperties): JSX.Element | string => {
  const components: { [key: string]: JSX.Element } = {
    'yz:logo2y': <YZLogo2Y style={style} />,
    'yz:logo2z': <YZLogo2Z style={style} />,
    'yz:logo2top': <YZLogo2Top style={style} />,
    'yz:logo2bot': <YZLogo2Bottom style={style} />,
    'yz:logo2': <YZLogo2 style={style} />,
    'yz:logo3y': <YZLogo3Y style={style} />,
    'yz:logo3z': <YZLogo3Z style={style} />,
    'yz:logo3top': <YZLogo3Top style={style} />,
    'yz:logo3left': <YZLogo3Left style={style} />,
    'yz:logo3right': <YZLogo3Right style={style} />,
    'yz:logo3': <YZLogo3 style={style} />,
    wled: <Wled />,
    'razer:mouse': <RazerMouse />,
    'razer:logo': <RazerLogo />,
    homeAssistant: <HomeAssistantLogo />,
    launchpad: <NovationLogo />
  }

  if (name.startsWith('<svg')) {
    return <div style={style} dangerouslySetInnerHTML={{ __html: name }} />
  }

  if (name.startsWith('https://')) {
    return (
      <img src={name.replaceAll('#000000', 'currentColor')} width={50} alt="icon" style={style} />
    )
  }

  if (name.startsWith('mdi:')) {
    return (
      <span
        style={{ position: 'relative', display: 'flex' }}
        className={`mdi mdi-${name.split('mdi:')[1]}`}
      />
    )
  }

  for (const prefix in components) {
    if (name.startsWith(prefix)) {
      return components[prefix]
    }
  }

  return name && camelToSnake(name)
}

function BladeIcon({
  colorIndicator = false,
  name = 'MusicNote',
  className = '',
  style,
  scene = false,
  card = false,
  intro = false,
  list = false,
  sx
}: BladeIconProps): JSX.Element {
  const iconStyle = getStyle(card, scene, intro, list)

  return (
    <Icon
      className={className}
      color={colorIndicator ? 'primary' : 'inherit'}
      style={style}
      sx={sx}
    >
      {renderIcon(name, iconStyle)}
    </Icon>
  )
}

export default BladeIcon
