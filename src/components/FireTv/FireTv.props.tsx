import { BsDpadFill } from 'react-icons/bs'
import {
  MdFastRewind,
  MdFastForward,
  MdArrowUpward,
  MdArrowDownward,
  MdArrowBack,
  MdArrowForward,
  MdOutlineMenu
} from 'react-icons/md'
import { GrRadialSelected } from 'react-icons/gr'
import { TbArrowBackUp } from 'react-icons/tb'
import { RiHome2Line } from 'react-icons/ri'
import { GiHorizontalFlip } from 'react-icons/gi'
import { HiPlayPause } from 'react-icons/hi2'

import type { ReactNode } from 'react'

export type FireTvButton =
  | 'menu'
  | 'dpad'
  | 'dpadv'
  | 'dpadh'
  | 'rewind'
  | 'play'
  | 'forward'
  | 'enter'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'back'
  | 'home'

export interface FireTvButtonConfig {
  label: string | ((state?: unknown) => string)
  action?: () => void
  icon?: ReactNode
}

export type FireTvButtonsConfig = {
  [K in FireTvButton]?: FireTvButtonConfig | boolean
}

export interface FireTvBarState {
  buttons: FireTvButtonsConfig
  defaultButtons: FireTvButtonsConfig
  barHeight: number
  isCustomMode: boolean
  hasPageButtons: boolean
  setButtons: (config: FireTvButtonsConfig) => void
  setDefaultButtons: (config: FireTvButtonsConfig) => void
  clearButtons: () => void
  setBarHeight: (height: number) => void
  setCustomMode: (enabled: boolean) => void
  toggleCustomMode: () => void
}

export const BUTTON_ICONS: Record<FireTvButton, React.ReactNode> = {
  menu: <MdOutlineMenu size={20} />,
  rewind: <MdFastRewind size={20} />,
  play: <HiPlayPause size={20} />,
  forward: <MdFastForward size={20} />,
  enter: <GrRadialSelected size={20} />,
  back: <TbArrowBackUp size={20} />,
  home: <RiHome2Line size={20} />,
  dpad: <BsDpadFill size={20} />,
  dpadv: <GiHorizontalFlip size={20} style={{ transform: 'rotate(90deg)' }} />,
  dpadh: <GiHorizontalFlip size={20} />,
  up: <MdArrowUpward size={20} />,
  down: <MdArrowDownward size={20} />,
  left: <MdArrowBack size={20} />,
  right: <MdArrowForward size={20} />
} as const

export const BUTTON_LABELS: Record<FireTvButton, string> = {
  menu: 'Switch Navigation',
  dpad: 'D-Pad',
  dpadv: 'Vertical',
  dpadh: 'Horizontal',
  rewind: 'Rewind',
  play: 'Play',
  forward: 'Forward',
  enter: 'Enter',
  up: 'Up',
  down: 'Down',
  left: 'Left',
  right: 'Right',
  back: 'Back',
  home: 'Home'
} as const

export const BUTTON_KEYCODES: Record<FireTvButton, number> = {
  menu: 82,
  dpad: 0, // Group indicator
  dpadv: 0, // Group indicator
  dpadh: 0, // Group indicator
  rewind: 227,
  play: 179,
  forward: 228,
  enter: 13,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  back: 4,
  home: 3
} as const
