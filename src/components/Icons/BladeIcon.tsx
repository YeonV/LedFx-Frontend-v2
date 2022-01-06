import { Icon } from '@material-ui/core';
import Wled from './Wled';
import {
  YZLogo2,
  YZLogo2Bottom,
  YZLogo2Top,
  YZLogo2Y,
  YZLogo2Z,
} from './YZ-Logo2';
import { camelToSnake } from '../../utils/helpers';
import '../../assets/materialdesignicons.css';
import '../../index.css';

interface BladeIconProps {
  /**
   * flag indicator
   */
  colorIndicator?: boolean;
  /**
   * Icon is rendered in SceneList
   */
  scene?: boolean;
  /**
   * Icon is rendered in SceneList
   */
  card?: boolean;
  /**
   * examples: `wled`, `Light`, `mdi:led-strip`
   */
  name?: string;
  /**
   * JSX className
   */
  className?: string;
  /**
   * JSX style
   */
  style?: Record<string, unknown>;
}

/**
 * Icon component supporting 2 libraries
 *
 *  ### [mui](https://mui.com/components/material-icons/)
 *  syntax: `MusicNote`
 *
 *  ### [mdi](https://materialdesignicons.com/)
 *  syntax: `mdi:led-strip` (compatible with home-assistant)
 */
function BladeIcon({
  colorIndicator = false,
  name = 'MusicNote',
  className = '',
  style,
  scene = false,
  card = false,
}: BladeIconProps): JSX.Element {
  return (
    <Icon
      className={className}
      color={colorIndicator ? 'primary' : 'inherit'}
      style={style}
    >
      {name.startsWith('yz:logo2y') ? (
        <YZLogo2Y
          style={{
            transform: card ? 'unset' : scene ? 'scale(1)' : 'scale(0.012)',
            marginTop: '3px',
          }}
        />
      ) : name.startsWith('yz:logo2z') ? (
        <YZLogo2Z
          style={{
            transform: card ? 'unset' : scene ? 'scale(1)' : 'scale(0.012)',
            marginTop: '3px',
          }}
        />
      ) : name.startsWith('yz:logo2top') ? (
        <YZLogo2Top
          style={{
            transform: card ? 'unset' : scene ? 'scale(1)' : 'scale(0.012)',
            marginTop: '3px',
          }}
        />
      ) : name.startsWith('yz:logo2bot') ? (
        <YZLogo2Bottom
          style={{
            transform: card ? 'unset' : scene ? 'scale(1)' : 'scale(0.012)',
            marginTop: '3px',
          }}
        />
      ) : name.startsWith('yz:logo2') ? (
        <YZLogo2
          style={{
            transform: card ? 'unset' : scene ? 'scale(1)' : 'scale(0.012)',
            marginTop: '3px',
          }}
        />
      ) : name.startsWith('wled') ? (
        <Wled />
      ) : name.startsWith('mdi:') ? (
        <span
          style={{ position: 'relative' }}
          className={`mdi mdi-${name.split('mdi:')[1]}`}
        />
      ) : (
        name && camelToSnake(name)
      )}
    </Icon>
  );
}

BladeIcon.defaultProps = {
  colorIndicator: false,
  name: 'MusicNote',
  className: '',
  style: {},
  scene: false,
  card: false,
};

export default BladeIcon;
