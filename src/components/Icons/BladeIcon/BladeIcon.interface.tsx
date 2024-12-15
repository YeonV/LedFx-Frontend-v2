import { SxProps, Theme } from '@mui/material'

export interface BladeIconProps {
  /**
   * flag indicator
   */
  colorIndicator?: boolean
  /**
   * Icon is rendered in SceneList
   */
  scene?: boolean
  /**
   * Icon is rendered in SceneList
   */
  card?: boolean
  /**
   * Icon is rendered in Intro
   */
  intro?: boolean
  /**
   * Icon is rendered in SceneList
   * examples: `true`, `false`
   */
  list?: boolean
  /**
   * examples: `wled`, `Light`, `mdi:led-strip`
   */
  name?: string
  /**
   * JSX className
   */
  className?: string
  /**
   * JSX style
   */
  style?: Record<string, unknown>
  /**
   * JSX sx
   *
   */
  sx?: SxProps<Theme>
}
