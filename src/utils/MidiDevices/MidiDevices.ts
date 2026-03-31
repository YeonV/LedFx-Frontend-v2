import { LaunchpadMK2 } from './LaunchpadMK2/LaunchpadMK2'
import { LaunchpadS } from './LaunchpadS/LaunchpadS'
import { LaunchpadX } from './LaunchpadX/LaunchpadX'
import { LaunchkeyMK3 } from './LaunchkeyMK3/LaunchkeyMK3'
import { LaunchkeyMiniMK3 } from './LaunchkeyMiniMK3/LaunchkeyMiniMK3'
import { LaunchkeyDevice } from './LaunchkeyDevice'
import { LaunchpadDevice } from './LaunchPadDevice'
import { LaunchpadMiniMK3 } from './LaunchpadMiniMK3/LaunchpadMiniMK3'

export const Launchpad = {
  X: LaunchpadX,
  MK2: LaunchpadMK2,
  S: LaunchpadS,
  MiniMK3: LaunchpadMiniMK3
}

export const Launchkey = {
  MK3: LaunchkeyMK3,
  MiniMK3: LaunchkeyMiniMK3
}

export const MidiDevices = {
  Launchpad,
  Launchkey
}

export type IMidiDevice = LaunchkeyDevice | LaunchpadDevice
