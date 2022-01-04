import { Icon } from '@material-ui/core';
import Wled from './Wled';
// import { YZLogo2, YZLogo2Bottom, YZLogo2Top, YZLogo2Y, YZLogo2Z } from './YZ-Logo2'
import { camelToSnake } from '../../utils/helpers';

interface BladeIconProps {
  /**
   * flag indicator
   */
  colorIndicator?: boolean,
  /**
   * Icon is rendered in SceneList
   */
  scene?: boolean,
  /**
   * Icon is rendered in SceneList
   */
  card?: boolean,
  /**
   * Name
   */
  name?: string,
  /**
   * JSX className
   */
  className?: Record<string, unknown>,
  /**
   * JSX style
   */
  style?: Record<string, unknown>,
}

/**
 * Primary UI component for user interaction
 */
const BladeIcon = ({
  colorIndicator = false,
  name = 'MusicNote',
  className = {},
  style,
  scene = false,
  card = false,
}: BladeIconProps) => {
  // eslint-disable-next-line
  console.log(scene, card, className);
  return (
    <Icon
      // className={className}
      color={colorIndicator ? 'primary' : 'inherit'}
      style={style}
    >
      {// eslint-disable-next-line
        name.startsWith('wled') ? <Wled />
          : name.startsWith('mdi:') ? <span className={`mdi mdi-${name.split('mdi:')[1]}`} />
            : name && camelToSnake(name)
      }
    </Icon>
  );
};

BladeIcon.defaultProps = {
  colorIndicator: false,
  name: 'MusicNote',
  className: {},
  style: {},
  scene: false,
  card: false,
};

export default BladeIcon;
