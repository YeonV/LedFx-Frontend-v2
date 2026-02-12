/**
 * Type: AUTO-GENERATED FILE
 * Tool: LedFx TypeScript Generator
 * Author: YeonV
 */

/* eslint-disable */

// --- Base Device Schema Generation --- 
/**
 * Base configuration shared by all devices
 * @category DeviceSpecificConfigs
 */
export interface BaseDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   * @default 'mdi:led-strip'
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   * @default 0
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   * @default 60
   */
  refresh_rate?: number /* FPS */;
}

/**
 * Configuration for Virtual Strips/Segments
 * @category Configs
 */
export interface VirtualConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * Span: Effect spans all segments. Copy: Effect copied on each segment
   */
  mapping: "span" | "copy";
  /**
   * Number of physical pixels to combine into larger virtual pixel groups
   * @minimum 0
   */
  grouping: number;
  /**
   * Icon for the device*
   * @default 'mdi:led-strip-variant'
   */
  icon_name?: string;
  /**
   * Max brightness for the device
   * @default 1.0
   * @minimum 0
   * @maximum 1
   */
  max_brightness?: number;
  /**
   * Number of pixels from the perceived center of the device
   * @default 0
   */
  center_offset?: number;
  /**
   * Preview the pixels without updating the devices
   * @default False
   */
  preview_only?: boolean;
  /**
   * Length of transition between effects
   * @default 0.4
   * @minimum 0
   * @maximum 5
   */
  transition_time?: number;
  /**
   * Type of transition between effects
   * @default 'Add'
   */
  transition_mode?: "Add" | "Dissolve" | "Push" | "Slide" | "Iris" | "Through White" | "Through Black" | "None";
  /**
   * Lowest frequency for this virtual's audio reactive effects
   * @default 20
   * @minimum 20
   * @maximum 15000
   */
  frequency_min?: number;
  /**
   * Highest frequency for this virtual's audio reactive effects
   * @default 15000
   * @minimum 20
   * @maximum 15000
   */
  frequency_max?: number;
  /**
   * Amount of rows. > 1 if this virtual is a matrix
   * @default 1
   */
  rows?: number;
  /**
   * 90 Degree rotations
   * @default 0
   * @minimum 0
   * @maximum 3
   */
  rotate?: number;
  /**
   * Whether the segments are complex (requires matrix editor)
   * @default false
   */
  complex_segments?: boolean;
}

/**
 * Configuration for device type: artnet
 * @category DeviceSpecificConfigs
 */
export interface ArtnetDeviceConfig extends BaseDeviceConfig {
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
  /**
   * DMX universe for the device
   * @default 0
   * @minimum 0
   */
  universe?: number;
  /**
   * Size of each DMX universe
   * @default 510
   * @minimum 1
   * @maximum 512
   */
  packet_size?: number;
  /**
   * Channel bytes to insert before the RGB data
   * @default ''
   */
  pre_amble?: string;
  /**
   * Channel bytes to insert after the RGB data
   * @default ''
   */
  post_amble?: string;
  /**
   * Number of pixels to consume per device. Pre and post ambles are repeated per device. By default (0) all pixels will be used by one instance
   * @default 0
   * @minimum 0
   */
  pixels_per_device?: number;
  /**
   * The start address within the universe
   * @default 1
   * @minimum 1
   * @maximum 512
   */
  dmx_start_address?: number;
  /**
   * Whether to use even packet size
   * @default True
   */
  even_packet_size?: boolean;
  /**
   * RGB data order mode, supported for physical hardware that just doesn't play by the rules
   * @default 'RGB'
   */
  rgb_order?: string;
  /**
   * White channel handling mode, if RGB leave as None. Commonly written as RGBW or RGBA
   * @default 'None'
   */
  white_mode?: string;
  /**
   * port
   * @default 6454
   */
  port?: number;
}

/**
 * Configuration for device type: ddp
 * @category DeviceSpecificConfigs
 */
export interface DdpDeviceConfig extends BaseDeviceConfig {
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
  /**
   * Port for the UDP device
   * @minimum 1
   * @maximum 65535
   */
  port: number;
  /**
   * DDP destination ID (1=default, 2-249=custom, 250=config, 251=status, 254=DMX, 255=all)
   * @default 1
   * @minimum 1
   * @maximum 255
   */
  destination_id?: number;
}

/**
 * Configuration for device type: dummy
 * @category DeviceSpecificConfigs
 */
export interface DummyDeviceConfig extends BaseDeviceConfig {
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
}

/**
 * Configuration for device type: e131
 * @category DeviceSpecificConfigs
 */
export interface E131DeviceConfig extends BaseDeviceConfig {
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
  /**
   * DMX universe for the device
   * @default 1
   * @minimum 1
   */
  universe?: number;
  /**
   * Size of each DMX universe
   * @default 510
   * @minimum 1
   */
  universe_size?: number;
  /**
   * Channel offset within the DMX universe
   * @default 0
   * @minimum 0
   */
  channel_offset?: number;
  /**
   * Priority given to the sACN packets for this device
   * @default 100
   * @minimum 0
   * @maximum 200
   */
  packet_priority?: number;
}

/**
 * Configuration for device type: govee
 * @category DeviceSpecificConfigs
 */
export interface GoveeDeviceConfig extends BaseDeviceConfig {
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Number of segments (seen in app)
   * @minimum 1
   */
  pixel_count: number;
  /**
   * Bypass check for device status check response on port 4003
   * @default False
   */
  ignore_status?: boolean;
  /**
   * Some archane setting to make the pixel pattern stretch to fit the device
   * @default False
   */
  stretch_to_fit?: boolean;
}

/**
 * Configuration for device type: hue
 * @category DeviceSpecificConfigs
 */
export interface HueDeviceConfig extends BaseDeviceConfig {
  /**
   * Hostname or IP address of the Hue bridge
   */
  ip_address: string;
  /**
   * Entertainment zone group name
   */
  group_name: string;
  /**
   * port
   * @default 2100
   */
  udp_port?: number;
}

/**
 * Configuration for device type: lifx
 * @category DeviceSpecificConfigs
 */
export interface LifxDeviceConfig extends BaseDeviceConfig {
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
}

/**
 * Configuration for device type: nanoleaf
 * @category DeviceSpecificConfigs
 */
export interface NanoleafDeviceConfig extends BaseDeviceConfig {
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * port
   * @default 16021
   */
  port?: number;
  /**
   * port
   * @default 60222
   */
  udp_port?: number;
  /**
   * Auth token
   */
  auth_token?: string;
  /**
   * Streaming protocol to Nanoleaf device
   * @default 'TCP'
   */
  sync_mode?: "TCP" | "UDP";
}

/**
 * Configuration for device type: open_pixel_control
 * @category DeviceSpecificConfigs
 */
export interface OpenPixelControlDeviceConfig extends BaseDeviceConfig {
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
  /**
   * Channel to send pixel data
   * @minimum 0
   * @maximum 255
   */
  channel: number;
}

/**
 * Configuration for device type: osc
 * @category DeviceSpecificConfigs
 */
export interface OscDeviceConfig extends BaseDeviceConfig {
  /**
   * Port of the OSC server
   * @minimum 1
   * @maximum 65535
   */
  port: number;
  /**
   * The amount of channels OR if address_type == Three_addresses then this is the amount of RGB subsequent addresses (set to 3 if your addresses are defined like R,G,B,R,G,B)
   * @minimum 1
   */
  pixel_count: number;
  /**
   * One_Argument -> <addr> [R, G, B]; Three_Arguments -> <addr> R G B; Three_Addresses -> <addr> R, <addr+1> G, <addr+2> B; All_To_One -> <addr> [[R, G, B], [R, G, B], [R, G, B]]
   */
  send_type: string;
  /**
   * Starting address/id of the OSC device
   * @minimum 0
   */
  starting_addr: number;
  /**
   * The OSC Path to send to - Placeholders: {address} -> this will start at the starting_addr and count up
   */
  path: string;
}

/**
 * Configuration for device type: rpi_ws281x
 * @category DeviceSpecificConfigs
 */
export interface RpiWs281xDeviceConfig extends BaseDeviceConfig {
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
  /**
   * Raspberry Pi GPIO pin your LEDs are connected to
   */
  gpio_pin: 10 | 12 | 13 | 18 | 21;
  /**
   * Color order
   */
  color_order: "RGB" | "RBG" | "GRB" | "BRG" | "GBR" | "BGR";
}

/**
 * Configuration for device type: twinkly_squares
 * @category DeviceSpecificConfigs
 */
export interface TwinklySquaresDeviceConfig extends BaseDeviceConfig {
  /**
   * Number of 8x8 Twinkly Squares panels
   * @minimum 1
   */
  panel_count: number;
}

/**
 * Configuration for device type: udp
 * @category DeviceSpecificConfigs
 */
export interface UdpDeviceConfig extends BaseDeviceConfig {
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
  /**
   * Port for the UDP device
   * @minimum 1
   * @maximum 65535
   */
  port: number;
  /**
   * RGB packet encoding
   */
  udp_packet_type: "DRGB" | "WARLS" | "DRGBW" | "DNRGB" | "adaptive_smallest" | "RGB (HyperHDR)";
  /**
   * Seconds to wait after the last received packet to yield device control
   * @default 1
   * @minimum 1
   * @maximum 255
   */
  timeout?: number;
  /**
   * Won't send updates if nothing has changed on the LED device
   * @default True
   */
  minimise_traffic?: boolean;
}

/**
 * Configuration for device type: wled
 * @category DeviceSpecificConfigs
 */
export interface WledDeviceConfig extends BaseDeviceConfig {
  /**
   * Streaming protocol to WLED device. Recommended: DDP for 0.13 or later. Use UDP for older versions.
   * @default 'DDP'
   */
  sync_mode?: "DDP" | "UDP" | "E131";
  /**
   * Time between LedFx effect off and WLED effect activate
   * @default 1
   * @minimum 0
   * @maximum 255
   */
  timeout?: number;
  /**
   * Import WLED segments into LedFx
   * @default False
   */
  create_segments?: boolean;
}

/**
 * Configuration for device type: zengee
 * @category DeviceSpecificConfigs
 */
export interface ZengeeDeviceConfig extends BaseDeviceConfig {
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
}

/**
 * Literal union of all known device type strings
 * @category Types
 */
export type DeviceType = "adalight" | "artnet" | "ddp" | "dummy" | "e131" | "govee" | "hue" | "launchpad" | "lifx" | "nanoleaf" | "open_pixel_control" | "openrgb" | "osc" | "rpi_ws281x" | "twinkly_squares" | "udp" | "wled" | "zengee";

/**
 * Device specific configurations
 * @category Specific
 */
export type DeviceSpecificConfig = ArtnetDeviceConfig | DdpDeviceConfig | DummyDeviceConfig | E131DeviceConfig | GoveeDeviceConfig | HueDeviceConfig | LifxDeviceConfig | NanoleafDeviceConfig | OpenPixelControlDeviceConfig | OscDeviceConfig | RpiWs281xDeviceConfig | TwinklySquaresDeviceConfig | UdpDeviceConfig | WledDeviceConfig | ZengeeDeviceConfig;

/**
 * Universal interface merging all possible *optional* device properties (using snake_case)
 * @category Configs
 */
export interface DeviceConfig {
  type?: DeviceType; // Optional device type identifier
  auth_token?: string;
  center_offset?: number;
  channel?: number;
  channel_offset?: number;
  color_order?: string;
  create_segments?: boolean;
  destination_id?: number;
  dmx_start_address?: number;
  even_packet_size?: boolean;
  gpio_pin?: number;
  group_name?: string;
  icon_name?: string;
  ignore_status?: boolean;
  ip_address?: string;
  minimise_traffic?: boolean;
  name?: string;
  packet_priority?: number;
  packet_size?: number;
  panel_count?: number;
  path?: string;
  pixel_count?: number;
  pixels_per_device?: number;
  port?: number;
  post_amble?: string;
  pre_amble?: string;
  refresh_rate?: number /* FPS */;
  rgb_order?: string;
  send_type?: string;
  starting_addr?: number;
  stretch_to_fit?: boolean;
  sync_mode?: string;
  timeout?: number;
  udp_packet_type?: string;
  udp_port?: number;
  universe?: number;
  universe_size?: number;
  white_mode?: string;
}

// Specific Effect Configurations (for Discriminated Union)
/**
 * Specific configuration for the 'bands' effect.
 * @category EffectSpecificConfigs
 */
export interface BandsEffectConfig {
  type: "bands";
  /**
   * Number of bands
   * @default 6
   * @minimum 1
   * @maximum 16
   */
  band_count?: number;
  /**
   * Alignment of bands
   * @default 'left'
   */
  align?: "left" | "right" | "invert" | "center";
}

/**
 * Specific configuration for the 'bands_matrix' effect.
 * @category EffectSpecificConfigs
 */
export interface BandsMatrixEffectConfig {
  type: "bands_matrix";
  /**
   * Number of bands
   * @default 6
   * @minimum 1
   * @maximum 16
   */
  band_count?: number;
  /**
   * Mirror the effect
   * @default False
   */
  mirror?: boolean;
  /**
   * Flip Gradient
   * @default False
   */
  flip_gradient?: boolean;
  /**
   * Flip horizontally
   * @default False
   */
  flip_horizontal?: boolean;
}

/**
 * Specific configuration for the 'bar' effect.
 * @category EffectSpecificConfigs
 */
export interface BarEffectConfig {
  type: "bar";
  /**
   * Choose from different animations
   * @default 'wipe'
   */
  mode?: "bounce" | "wipe" | "in-out";
  /**
   * Acceleration profile of bar
   * @default 'ease_out'
   */
  ease_method?: "ease_in_out" | "ease_in" | "ease_out" | "linear";
  /**
   * Amount of color change per beat
   * @default 0.125
   * @minimum 0.0625
   * @maximum 0.5
   */
  color_step?: number;
  /**
   * Skips odd or even beats
   * @default 'none'
   */
  beat_skip?: "none" | "odds" | "even";
  /**
   * Offset the beat
   * @default 0
   * @minimum 0.0
   * @maximum 1.0
   */
  beat_offset?: number;
  /**
   * If skipping beats, skip every
   * @default 1
   */
  skip_every?: 1 | 2;
}

/**
 * Specific configuration for the 'blade_power_plus' effect.
 * @category EffectSpecificConfigs
 */
export interface BladePowerPlusEffectConfig {
  type: "blade_power_plus";
  /**
   * Mirror the effect
   * @default False
   */
  mirror?: boolean;
  /**
   * Amount to blur the effect
   * @default 2
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Rate of color decay
   * @default 0.7
   * @minimum 0
   * @maximum 1
   */
  decay?: number;
  /**
   * Make the reactive bar bigger/smaller
   * @default 0.5
   * @minimum 0.0
   * @maximum 1.0
   */
  multiplier?: number;
  /**
   * Color of Background
   * @default '#000000'
   */
  background_color?: string /* Color */;
  /**
   * Frequency range for the beat detection
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
}

/**
 * Specific configuration for the 'bleep' effect.
 * @category EffectSpecificConfigs
 */
export interface BleepEffectConfig {
  type: "bleep";
  /**
   * mirror effect
   * @default False
   */
  mirror_effect?: boolean;
  /**
   * Use gradient in power dimension instead of time
   * @default False
   */
  grad_power?: boolean;
  /**
   * Time to scroll the bleep
   * @default 1.0
   * @minimum 0.1
   * @maximum 5.0
   */
  scroll_time?: number;
  /**
   * Frequency range for the beat detection
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * How to plot the data
   * @default 'Lines'
   */
  draw?: "Points" | "Lines" | "Fill";
  /**
   * How many historical points to capture
   * @default 64
   * @minimum 2
   * @maximum 64
   */
  points?: number;
  /**
   * Line width only
   * @default 1
   * @minimum 1
   * @maximum 8
   */
  size?: number;
}

/**
 * Specific configuration for the 'blender' effect.
 * @category EffectSpecificConfigs
 */
export interface BlenderEffectConfig {
  type: "blender";
  /**
   * How to stretch the mask source pixles to the effect pixels
   * @default '2d full'
   */
  mask_stretch?: "2d full" | "2d tile";
  /**
   * How to stretch the background source pixles to the effect pixels
   * @default '2d full'
   */
  background_stretch?: "2d full" | "2d tile";
  /**
   * How to stretch the foreground source pixles to the effect pixels
   * @default '2d full'
   */
  foreground_stretch?: "2d full" | "2d tile";
  /**
   * The virtual from which to source the mask
   * @default ''
   */
  mask?: string;
  /**
   * The virtual from which to source the foreground
   * @default ''
   */
  foreground?: string;
  /**
   * The virtual from which to source the background
   * @default ''
   */
  background?: string;
  /**
   * Switch Foreground and Background
   * @default False
   */
  invert_mask?: boolean;
  /**
   * 1 default = luminance as alpha, anything below 1 is mask cutoff
   * @default 1.0
   * @minimum 0.01
   * @maximum 1.0
   */
  mask_cutoff?: number;
}

/**
 * Specific configuration for the 'block_reflections' effect.
 * @category EffectSpecificConfigs
 */
export interface BlockReflectionsEffectConfig {
  type: "block_reflections";
  /**
   * Effect Speed modifier
   * @default 0.5
   * @minimum 1e-05
   * @maximum 1.0
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default 0.5
   * @minimum 1e-05
   * @maximum 1.0
   */
  reactivity?: number;
}

/**
 * Specific configuration for the 'blocks' effect.
 * @category EffectSpecificConfigs
 */
export interface BlocksEffectConfig {
  type: "blocks";
  /**
   * Number of color blocks
   * @default 4
   * @minimum 1
   * @maximum 10
   */
  block_count?: number;
}

/**
 * Specific configuration for the 'clone' effect.
 * @category EffectSpecificConfigs
 */
export interface CloneEffectConfig {
  type: "clone";
  /**
   * Source screen for grab
   * @default 0
   * @minimum 0
   * @maximum 4
   */
  screen?: number;
  /**
   * pixels down offset of grab
   * @default 0
   * @minimum 0
   * @maximum 1080
   */
  down?: number;
  /**
   * pixels across offset of grab
   * @default 0
   * @minimum 0
   * @maximum 1920
   */
  across?: number;
  /**
   * width of grab
   * @default 128
   * @minimum 1
   * @maximum 1920
   */
  width?: number;
  /**
   * height of grab
   * @default 128
   * @minimum 1
   * @maximum 1080
   */
  height?: number;
}

/**
 * Specific configuration for the 'concentric' effect.
 * @category EffectSpecificConfigs
 */
export interface ConcentricEffectConfig {
  type: "concentric";
  /**
   * Frequency range for beat detection
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Invert propagation direction
   * @default False
   */
  invert?: boolean;
  /**
   * Frequency range's power multiplier
   * @default 0.5
   * @minimum 0.0
   * @maximum 1.0
   */
  power_multiplier?: number;
  /**
   * Scales the gradient
   * @default 1
   * @minimum 0.1
   * @maximum 10.0
   */
  gradient_scale?: number;
  /**
   * Stretches the gradient vertically
   * @default 1
   * @minimum 0.1
   * @maximum 5.0
   */
  stretch_height?: number;
  /**
   * Soften the center point
   * @default 0.5
   * @minimum 0.0
   * @maximum 5.0
   */
  center_smoothing?: number;
  /**
   * Idle motion speed
   * @default 1
   * @minimum 0.0
   * @maximum 1
   */
  idle_speed?: number;
}

/**
 * Specific configuration for the 'crawler' effect.
 * @category EffectSpecificConfigs
 */
export interface CrawlerEffectConfig {
  type: "crawler";
  /**
   * Effect Speed modifier
   * @default 0.5
   * @minimum 1e-05
   * @maximum 1.0
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default 0.25
   * @minimum 1e-05
   * @maximum 1.0
   */
  reactivity?: number;
  /**
   * Sway modifier
   * @default 20
   * @minimum 1e-05
   * @maximum 50
   */
  sway?: number;
  /**
   * Chop modifier
   * @default 30
   * @minimum 1e-05
   * @maximum 100
   */
  chop?: number;
  /**
   * Stretch modifier
   * @default 2.5
   * @minimum 1e-05
   * @maximum 10
   */
  stretch?: number;
}

/**
 * Specific configuration for the 'digitalrain2d' effect.
 * @category EffectSpecificConfigs
 */
export interface Digitalrain2dEffectConfig {
  type: "digitalrain2d";
  /**
   * Color gradient to display
   * @default 'linear-gradient(90deg, rgb(0, 199, 140) 0%, rgb(0, 255, 50) 100%)'
   */
  gradient?: string /* Gradient */;
  /**
   * Number of code lines in the matrix as a multiplier of matrix pixel width
   * @default 1.9
   * @minimum 0.01
   * @maximum 4.0
   */
  count?: number;
  /**
   * Number of code lines to add per second
   * @default 30.0
   * @minimum 0.1
   * @maximum 30.0
   */
  add_speed?: number;
  /**
   * Width of code lines as % of matrix
   * @default 1
   * @minimum 1
   * @maximum 30
   */
  width?: number;
  /**
   * Minimum number of seconds for a code line to run from top to bottom
   * @default 2.0
   * @minimum 1
   * @maximum 10.0
   */
  run_seconds?: number;
  /**
   * Code line tail length as a % of the matrix
   * @default 67
   * @minimum 1
   * @maximum 100
   */
  tail?: number;
  /**
   * Decay filter applied to the impulse for development
   * @default 0.01
   * @minimum 0.01
   * @maximum 0.3
   */
  impulse_decay?: number;
  /**
   * audio injection multiplier, 0 is none
   * @default 10
   * @minimum 0.0
   * @maximum 10
   */
  multiplier?: number;
}

/**
 * Specific configuration for the 'energy' effect.
 * @category EffectSpecificConfigs
 */
export interface EnergyEffectConfig {
  type: "energy";
  /**
   * Amount to blur the effect
   * @default 4.0
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default True
   */
  mirror?: boolean;
  /**
   * Change colors in time with the beat
   * @default False
   */
  color_cycler?: boolean;
  /**
   * Color of low, bassy sounds
   * @default '#FF0000'
   */
  color_lows?: string /* Color */;
  /**
   * Color of midrange sounds
   * @default '#00FF00'
   */
  color_mids?: string /* Color */;
  /**
   * Color of high sounds
   * @default '#0000FF'
   */
  color_high?: string /* Color */;
  /**
   * Responsiveness to changes in sound
   * @default 0.6
   * @minimum 0.3
   * @maximum 0.99
   */
  sensitivity?: number;
  /**
   * Mode of combining each frequencies' colors
   * @default 'additive'
   */
  mixing_mode?: "additive" | "overlap";
}

/**
 * Specific configuration for the 'energy2' effect.
 * @category EffectSpecificConfigs
 */
export interface Energy2EffectConfig {
  type: "energy2";
  /**
   * Effect Speed modifier
   * @default 0.1
   * @minimum 1e-05
   * @maximum 1.0
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default 0.2
   * @minimum 1e-05
   * @maximum 1.0
   */
  reactivity?: number;
}

/**
 * Specific configuration for the 'equalizer' effect.
 * @category EffectSpecificConfigs
 */
export interface EqualizerEffectConfig {
  type: "equalizer";
  /**
   * Alignment of bands
   * @default 'left'
   */
  align?: "left" | "right" | "invert" | "center";
  /**
   * Repeat the gradient into segments
   * @default 6
   * @minimum 1
   * @maximum 16
   */
  gradient_repeat?: number;
}

/**
 * Specific configuration for the 'equalizer2d' effect.
 * @category EffectSpecificConfigs
 */
export interface Equalizer2dEffectConfig {
  type: "equalizer2d";
  /**
   * Size of the tracer bar that follows a filtered value
   * @default 1.0
   * @minimum 0
   * @maximum 5
   */
  peak_percent?: number;
  /**
   * Decay filter applied to the peak value
   * @default 0.03
   * @minimum 0.01
   * @maximum 0.1
   */
  peak_decay?: number;
  /**
   * Turn on white peak markers that follow a freq value filtered with decay
   * @default False
   */
  peak_marks?: boolean;
  /**
   * Peak mark color
   * @default '#FFFFFF'
   */
  peak_color?: string /* Color */;
  /**
   * Center the equalizer bar
   * @default False
   */
  center?: boolean;
  /**
   * Use max or mean value for bar size
   * @default False
   */
  max_vs_mean?: boolean;
  /**
   * Why be so square?
   * @default False
   */
  ring?: boolean;
  /**
   * Weeeeeeeeeee
   * @default False
   */
  spin?: boolean;
  /**
   * Number of freq bands
   * @default 16
   * @minimum 1
   * @maximum 64
   */
  bands?: number;
  /**
   * Frequency range for spin impulse
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Spin impulse multiplier
   * @default 1.0
   * @minimum 0
   * @maximum 5
   */
  spin_multiplier?: number;
  /**
   * Decay filter applied to the spin impulse
   * @default 0.1
   * @minimum 0.01
   * @maximum 0.3
   */
  spin_decay?: number;
}

/**
 * Specific configuration for the 'fade' effect.
 * @category EffectSpecificConfigs
 */
export interface FadeEffectConfig {
  type: "fade";
  /**
   * Rate of change of color
   * @default 0.5
   * @minimum 0.1
   * @maximum 10
   */
  speed?: number;
}

/**
 * Specific configuration for the 'filter' effect.
 * @category EffectSpecificConfigs
 */
export interface FilterEffectConfig {
  type: "filter";
  /**
   * Simple color selector
   * @default '#FF0000'
   */
  color?: string /* Color */;
  /**
   * Frequency range for derived brightness
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Use gradient instead of color
   * @default False
   */
  use_gradient?: boolean;
  /**
   * 0= no gradient roll, range 60 secs to 1 sec
   * @default 0.0
   * @minimum 0.0
   * @maximum 1.0
   */
  roll_speed?: number;
  /**
   * Boost the brightness of the effect on a parabolic curve
   * @default 0.0
   * @minimum 0.0
   * @maximum 1.0
   */
  boost?: number;
}

/**
 * Specific configuration for the 'fire' effect.
 * @category EffectSpecificConfigs
 */
export interface FireEffectConfig {
  type: "fire";
  /**
   * @default 0.04
   * @minimum 1e-05
   * @maximum 0.5
   */
  speed?: number;
  /**
   * @default 0.15
   * @minimum 0
   * @maximum 1
   */
  color_shift?: number;
  /**
   * @default 8
   * @minimum 1
   * @maximum 30
   */
  intensity?: number;
  /**
   * @default 0.5
   * @minimum 0.05
   * @maximum 1.0
   */
  fade_chance?: number;
}

/**
 * Specific configuration for the 'flame2d' effect.
 * @category EffectSpecificConfigs
 */
export interface Flame2dEffectConfig {
  type: "flame2d";
  /**
   * Particles spawn rate
   * @default 0.5
   * @minimum 0.0
   * @maximum 1.0
   */
  spawn_rate?: number;
  /**
   * Trips to top per second
   * @default 0.3
   * @minimum 0.1
   * @maximum 1.0
   */
  velocity?: number;
  /**
   * Application of the audio power input
   * @default 0.5
   * @minimum 0.0
   * @maximum 1.0
   */
  intensity?: number;
  /**
   * Blur radius in pixels
   * @default 2
   * @minimum 0
   * @maximum 5
   */
  blur_amount?: number;
  /**
   * low band flame
   * @default '#FF0000'
   */
  low_band?: string /* Color */;
  /**
   * mid band flame
   * @default '#00FF00'
   */
  mid_band?: string /* Color */;
  /**
   * high band flame
   * @default '#0000FF'
   */
  high_band?: string /* Color */;
}

/**
 * Specific configuration for the 'game_of_life' effect.
 * @category EffectSpecificConfigs
 */
export interface GameOfLifeEffectConfig {
  type: "game_of_life";
  /**
   * Check for and correct common unhealthy states
   * @default 'All'
   */
  health_checks?: "All" | "Dead" | "Oscillating" | "None";
  /**
   * Base number of steps per second to run
   * @default 30
   * @minimum 1
   * @maximum 60
   */
  base_game_speed?: number;
  /**
   * Number of seconds between health checks
   * @default 5
   * @minimum 1
   * @maximum 30
   */
  health_check_interval?: number;
  /**
   * Frequency range for life generation impulse
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Generate entities on beat
   * @default True
   */
  beat_inject?: boolean;
  /**
   * Decay filter applied to the life generation impulse
   * @default 0.05
   * @minimum 0.01
   * @maximum 0.1
   */
  impulse_decay?: number;
}

/**
 * Specific configuration for the 'gifplayer' effect.
 * @category EffectSpecificConfigs
 */
export interface GifplayerEffectConfig {
  type: "gifplayer";
  /**
   * Load GIF from URL/local file
   * @default ''
   */
  image_location?: string;
  /**
   * Bounce the GIF instead of looping
   * @default False
   */
  bounce?: boolean;
  /**
   * How fast to play the gif
   * @default 10
   * @minimum 1
   * @maximum 60
   */
  gif_fps?: number;
}

/**
 * Specific configuration for the 'glitch' effect.
 * @category EffectSpecificConfigs
 */
export interface GlitchEffectConfig {
  type: "glitch";
  /**
   * Effect Speed modifier
   * @default 0.5
   * @minimum 1e-05
   * @maximum 10.0
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default 0.2
   * @minimum 1e-05
   * @maximum 1.0
   */
  reactivity?: number;
  /**
   * Ensure the saturation is above this value
   * @default 1
   * @minimum 0.0
   * @maximum 1.0
   */
  saturation_threshold?: number;
}

/**
 * Specific configuration for the 'gradient' effect.
 * @category EffectSpecificConfigs
 */
export interface GradientEffectConfig {
  type: "gradient";
  /**
   * Speed of the effect
   * @default 1.0
   * @minimum 0.1
   * @maximum 10
   */
  speed?: number;
}

/**
 * Specific configuration for the 'hierarchy' effect.
 * @category EffectSpecificConfigs
 */
export interface HierarchyEffectConfig {
  type: "hierarchy";
  /**
   * Color of low, bassy sounds
   * @default '#FF0000'
   */
  color_lows?: string /* Color */;
  /**
   * Color of midrange sounds
   * @default '#00FF00'
   */
  color_mids?: string /* Color */;
  /**
   * Color of high sounds
   * @default '#0000FF'
   */
  color_high?: string /* Color */;
  /**
   * Boost the brightness of the effect on a parabolic curve
   * @default 0.0
   * @minimum 0.0
   * @maximum 1.0
   */
  brightness_boost?: number;
  /**
   * If Lows are below this value, Mids are used.
   * @default 0.05
   * @minimum 0.0
   * @maximum 1.0
   */
  threshold_lows?: number;
  /**
   * If Mids are below this value, Highs are used
   * @default 0.05
   * @minimum 0.0
   * @maximum 1.0
   */
  threshold_mids?: number;
  /**
   * Time Lows/Mids have to be below threshold before switch
   * @default 0.1
   * @minimum 0.0
   * @maximum 1.0
   */
  switch_time?: number;
}

/**
 * Specific configuration for the 'imagespin' effect.
 * @category EffectSpecificConfigs
 */
export interface ImagespinEffectConfig {
  type: "imagespin";
  /**
   * use a test pattern
   * @default False
   */
  pattern?: boolean;
  /**
   * Frequency range for the beat detection
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Applied to the audio input to amplify effect
   * @default 0.5
   * @minimum 0.0
   * @maximum 1.0
   */
  multiplier?: number;
  /**
   * The minimum size multiplier for the image
   * @default 0.3
   * @minimum 0.0
   * @maximum 1.0
   */
  min_size?: number;
  /**
   * default NEAREST, use BILINEAR for smoother scaling, expensive on runtime takes a few ms
   * @default False
   */
  bilinear?: boolean;
  /**
   * spin image according to filter impulse
   * @default False
   */
  spin?: boolean;
  /**
   * When spinning the image, force fit to frame, or allow clipping
   * @default False
   */
  clip?: boolean;
  /**
   * Load image from
   * @default ''
   */
  image_source?: string;
}

/**
 * Specific configuration for the 'keybeat2d' effect.
 * @category EffectSpecificConfigs
 */
export interface Keybeat2dEffectConfig {
  type: "keybeat2d";
  /**
   * Percentage of original to matrix width
   * @default 100
   * @minimum 1
   * @maximum 200
   */
  stretch_horizontal?: number;
  /**
   * Percentage of original to matrix height
   * @default 100
   * @minimum 1
   * @maximum 200
   */
  stretch_vertical?: number;
  /**
   * Center offset in horizontal direction percent of matrix width
   * @default 0
   * @minimum -95
   * @maximum 95
   */
  center_horizontal?: number;
  /**
   * Center offset in vertical direction percent of matrix height
   * @default 0
   * @minimum -95
   * @maximum 95
   */
  center_vertical?: number;
  /**
   * Load gif from url or path
   * @default ''
   */
  image_location?: string;
  /**
   * Frame index to interpolate beats between
   * @default ''
   */
  beat_frames?: string;
  /**
   * Frames to remove from gif animation
   * @default ''
   */
  skip_frames?: string;
  /**
   * Diagnostic overlayed on matrix
   * @default False
   */
  deep_diag?: boolean;
  /**
   * Trigger test code with 0.05 beat per frame
   * @default False
   */
  fake_beat?: boolean;
  /**
   * Preserve aspect ratio if force fit
   * @default False
   */
  keep_aspect_ratio?: boolean;
  /**
   * Force fit to matrix
   * @default False
   */
  force_fit?: boolean;
  /**
   * When ping pong, skip the first beat key frame on both ends, use when key beat frames are very close to start and ends only
   * @default False
   */
  ping_pong_skip?: boolean;
  /**
   * Play gif forward and reverse, not just loop
   * @default False
   */
  ping_pong?: boolean;
  /**
   * half the beat input impulse, slow things down
   * @default False
   */
  half_beat?: boolean;
  /**
   * Image brightness
   * @default 1.0
   * @minimum 0.1
   * @maximum 3.0
   */
  image_brightness?: number;
}

/**
 * Specific configuration for the 'lava_lamp' effect.
 * @category EffectSpecificConfigs
 */
export interface LavaLampEffectConfig {
  type: "lava_lamp";
  /**
   * Effect Speed modifier
   * @default 7
   * @minimum 0.1
   * @maximum 15.0
   */
  speed?: number;
  /**
   * Difference between lighter and darker spots
   * @default 0.6
   * @minimum 0
   * @maximum 1
   */
  contrast?: number;
  /**
   * Audio Reactive modifier
   * @default 0.3
   * @minimum 1e-05
   * @maximum 0.9
   */
  reactivity?: number;
}

/**
 * Specific configuration for the 'magnitude' effect.
 * @category EffectSpecificConfigs
 */
export interface MagnitudeEffectConfig {
  type: "magnitude";
  /**
   * Frequency range for the beat detection
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
}

/**
 * Specific configuration for the 'marching' effect.
 * @category EffectSpecificConfigs
 */
export interface MarchingEffectConfig {
  type: "marching";
  /**
   * Effect Speed modifier
   * @default 0.1
   * @minimum 1e-05
   * @maximum 1.0
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default 0.2
   * @minimum 1e-05
   * @maximum 1.0
   */
  reactivity?: number;
}

/**
 * Specific configuration for the 'melt' effect.
 * @category EffectSpecificConfigs
 */
export interface MeltEffectConfig {
  type: "melt";
  /**
   * Effect Speed modifier
   * @default 0.5
   * @minimum 0.001
   * @maximum 1
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default 0.5
   * @minimum 0.0001
   * @maximum 1
   */
  reactivity?: number;
}

/**
 * Specific configuration for the 'melt_and_sparkle' effect.
 * @category EffectSpecificConfigs
 */
export interface MeltAndSparkleEffectConfig {
  type: "melt_and_sparkle";
  /**
   * Effect Speed modifier
   * @default 0.5
   * @minimum 0.001
   * @maximum 1
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default 0.5
   * @minimum 0.0001
   * @maximum 1
   */
  reactivity?: number;
  /**
   * Brightness of the melt effect
   * @default 0.4
   * @minimum 0
   * @maximum 1
   */
  bg_bright?: number;
  /**
   * Size of the melting lava sections
   * @default 0.5
   * @minimum 0
   * @maximum 1
   */
  lava_width?: number;
  /**
   * Cutoff for quiet sounds. Higher -> only loud sounds are detected
   * @default 0.75
   * @minimum 0
   * @maximum 1
   */
  strobe_threshold?: number;
  /**
   * Higher numbers -> more strobes
   * @default 0.75
   * @minimum 0
   * @maximum 1
   */
  strobe_rate?: number;
  /**
   * Percussive strobe width, from one pixel to the full length
   * @default 0.3
   * @minimum 0.0
   * @maximum 1.0
   */
  strobe_width?: number;
  /**
   * Percussive strobe decay rate. Higher -> decays faster.
   * @default 0.25
   * @minimum 0
   * @maximum 1
   */
  strobe_decay_rate?: number;
  /**
   * How much to blur the strobes
   * @default 3.5
   * @minimum 0
   * @maximum 10
   */
  strobe_blur?: number;
}

/**
 * Specific configuration for the 'metro' effect.
 * @category EffectSpecificConfigs
 */
export interface MetroEffectConfig {
  type: "metro";
  /**
   * Time between flash in seconds
   * @default 1
   * @minimum 1
   * @maximum 10
   */
  pulse_period?: number;
  /**
   * Flash to blank ratio
   * @default 0.3
   * @minimum 0.1
   * @maximum 0.9
   */
  pulse_ratio?: number;
  /**
   * Steps of pattern division to loop
   * @default 4
   * @minimum 1
   * @maximum 6
   */
  steps?: number;
  /**
   * Background color
   * @default '#000000'
   */
  background_color?: string /* Color */;
  /**
   * Flash color
   * @default '#FFFFFF'
   */
  flash_color?: string /* Color */;
  /**
   * graph capture, on to start, off to dump
   * @default True
   */
  capture?: boolean;
  /**
   * Window over which to measure CPU usage
   * @default 1.0
   * @minimum 0.1
   * @maximum 1.0
   */
  cpu_secs?: number;
}

/**
 * Specific configuration for the 'multiBar' effect.
 * @category EffectSpecificConfigs
 */
export interface MultibarEffectConfig {
  type: "multiBar";
  /**
   * Choose from different animations
   * @default 'wipe'
   */
  mode?: "cascade" | "wipe";
  /**
   * Acceleration profile of bar
   * @default 'linear'
   */
  ease_method?: "ease_in_out" | "ease_in" | "ease_out" | "linear";
  /**
   * Amount of color change per beat
   * @default 0.125
   * @minimum 0.0625
   * @maximum 0.5
   */
  color_step?: number;
}

/**
 * Specific configuration for the 'noise2d' effect.
 * @category EffectSpecificConfigs
 */
export interface Noise2dEffectConfig {
  type: "noise2d";
  /**
   * Speed of the effect
   * @default 1
   * @minimum 0
   * @maximum 5
   */
  speed?: number;
  /**
   * intensity of the effect
   * @default 128
   * @minimum 0
   * @maximum 255
   */
  intensity?: number;
  /**
   * Stretch of the effect
   * @default 1.5
   * @minimum 0.5
   * @maximum 1.5
   */
  stretch?: number;
  /**
   * zoom density
   * @default 2
   * @minimum 0.5
   * @maximum 20
   */
  zoom?: number;
  /**
   * Decay filter applied to the impulse for development
   * @default 0.06
   * @minimum 0.01
   * @maximum 0.3
   */
  impulse_decay?: number;
  /**
   * audio injection multiplier, 0 is none
   * @default 2.0
   * @minimum 0.0
   * @maximum 4.0
   */
  multiplier?: number;
}

/**
 * Specific configuration for the 'pitchSpectrum' effect.
 * @category EffectSpecificConfigs
 */
export interface PitchspectrumEffectConfig {
  type: "pitchSpectrum";
  /**
   * Amount to blur the effect
   * @default 1.0
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default True
   */
  mirror?: boolean;
  /**
   * Rate at which notes fade
   * @default 0.15
   * @minimum 0.0
   * @maximum 1.0
   */
  fade_rate?: number;
  /**
   * Responsiveness to note changes
   * @default 0.15
   * @minimum 0.0
   * @maximum 1.0
   */
  responsiveness?: number;
}

/**
 * Specific configuration for the 'pixels' effect.
 * @category EffectSpecificConfigs
 */
export interface PixelsEffectConfig {
  type: "pixels";
  /**
   * Locked to 20 fps
   * @default 20.0
   * @minimum 20
   * @maximum 20
   */
  speed?: number;
  /**
   * Time between each pixel step to light up
   * @default 1.0
   * @minimum 0.01
   * @maximum 5.0
   */
  step_period?: number;
  /**
   * Number of pixels each step
   * @default 1
   * @minimum 1
   * @maximum 32
   */
  pixels?: number;
  /**
   * Background color
   * @default '#000000'
   */
  background_color?: string /* Color */;
  /**
   * Pixel color to light up
   * @default '#FFFFFF'
   */
  pixel_color?: string /* Color */;
  /**
   * Single or building pixels
   * @default False
   */
  build_up?: boolean;
  /**
   * Restart effect on color change, for transitions
   * @default False
   */
  color_blend?: boolean;
}

/**
 * Specific configuration for the 'plasma2d' effect.
 * @category EffectSpecificConfigs
 */
export interface Plasma2dEffectConfig {
  type: "plasma2d";
  /**
   * Frequency range for the beat detection
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Lets pretend its vertical density
   * @default 0.1
   * @minimum 0.01
   * @maximum 0.3
   */
  density_vertical?: number;
  /**
   * Like a slice of lemon
   * @default 0.07
   * @minimum 0.01
   * @maximum 0.3
   */
  twist?: number;
  /**
   * If you squint its the distance from the center
   * @default 0.2
   * @minimum 0.01
   * @maximum 1.0
   */
  radius?: number;
  /**
   * kinda how small the plasma is, but who realy knows
   * @default 0.5
   * @minimum 0.001
   * @maximum 2.0
   */
  density?: number;
  /**
   * lower band of density
   * @default 0.01
   * @minimum 0.01
   * @maximum 1.0
   */
  lower?: number;
}

/**
 * Specific configuration for the 'plasmawled' effect.
 * @category EffectSpecificConfigs
 */
export interface PlasmawledEffectConfig {
  type: "plasmawled";
  /**
   * Frequency range for the beat detection
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Speed multiplier
   * @default 128
   * @minimum 0
   * @maximum 255
   */
  speed?: number;
  /**
   * Smaller is less block in horizontal dimension
   * @default 128
   * @minimum 0
   * @maximum 255
   */
  stretch_horizontal?: number;
  /**
   * Smaller is less block in vertical dimension
   * @default 128
   * @minimum 0
   * @maximum 255
   */
  stretch_vertical?: number;
  /**
   * Sound to size multiplier
   * @default 0.4
   * @minimum 0.0
   * @maximum 1.0
   */
  size_multiplication?: number;
  /**
   * Sound to speed multiplier
   * @default 0.4
   * @minimum 0.0
   * @maximum 1.0
   */
  speed_multiplication?: number;
}

/**
 * Specific configuration for the 'power' effect.
 * @category EffectSpecificConfigs
 */
export interface PowerEffectConfig {
  type: "power";
  /**
   * Mirror the effect
   * @default True
   */
  mirror?: boolean;
  /**
   * Amount to blur the effect
   * @default 0.0
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Flash on percussive hits
   * @default '#ffffff'
   */
  sparks_color?: string /* Color */;
  /**
   * Bass decay rate. Higher -> decays faster.
   * @default 0.05
   * @minimum 0
   * @maximum 1
   */
  bass_decay_rate?: number;
  /**
   * Sparks decay rate. Higher -> decays faster.
   * @default 0.15
   * @minimum 0
   * @maximum 1
   */
  sparks_decay_rate?: number;
}

/**
 * Specific configuration for the 'radial' effect.
 * @category EffectSpecificConfigs
 */
export interface RadialEffectConfig {
  type: "radial";
  /**
   * The virtual from which to source the 1d pixels
   * @default 'unknown'
   */
  source_virtual?: any;
  /**
   * Edges count of mapping
   * @default 0
   * @minimum 0
   * @maximum 8
   */
  edges?: number;
  /**
   * X offset for center point
   * @default 0.5
   * @minimum 0.0
   * @maximum 1.0
   */
  x_offset?: number;
  /**
   * Y offset for center point
   * @default 0.5
   * @minimum 0.0
   * @maximum 1.0
   */
  y_offset?: number;
  /**
   * twist that thing
   * @default 0
   * @minimum -4
   * @maximum 4
   */
  twist?: number;
  /**
   * Use polygonal or radial lobes
   * @default True
   */
  polygon?: boolean;
  /**
   * static rotation
   * @default 0
   * @minimum -0.5
   * @maximum 0.5
   */
  rotation?: number;
  /**
   * Spin the radial effect to the audio impulse
   * @default 0.0
   * @minimum -1.0
   * @maximum 1.0
   */
  spin?: number;
  /**
   * Frequency range for the spin impulse
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * pull polygon points to star shape
   * @default 0.0
   * @minimum -1.0
   * @maximum 1.0
   */
  star?: number;
}

/**
 * Specific configuration for the 'rain' effect.
 * @category EffectSpecificConfigs
 */
export interface RainEffectConfig {
  type: "rain";
  /**
   * Mirror the effect
   * @default True
   */
  mirror?: boolean;
  /**
   * color for low sounds, ie beats
   * @default 'white'
   */
  lows_color?: string /* Color */;
  /**
   * Pulse the entire strip to the beat
   * @default 'Off'
   */
  pulse_strip?: "Off" | "Lows" | "Mids" | "Highs";
  /**
   * color for mid sounds, ie vocals
   * @default 'red'
   */
  mids_color?: string /* Color */;
  /**
   * color for high sounds, ie hi hat
   * @default 'blue'
   */
  high_color?: string /* Color */;
  /**
   * Sensitivity to low sounds
   * @default 0.1
   * @minimum 0.03
   * @maximum 0.3
   */
  lows_sensitivity?: number;
  /**
   * Sensitivity to mid sounds
   * @default 0.05
   * @minimum 0.03
   * @maximum 0.3
   */
  mids_sensitivity?: number;
  /**
   * Sensitivity to high sounds
   * @default 0.1
   * @minimum 0.03
   * @maximum 0.3
   */
  high_sensitivity?: number;
  /**
   * Droplet animation style
   * @default 'Blob'
   */
  raindrop_animation?: "Blob" | "Laser" | "Ripple";
}

/**
 * Specific configuration for the 'rainbow' effect.
 * @category EffectSpecificConfigs
 */
export interface RainbowEffectConfig {
  type: "rainbow";
  /**
   * Speed of the effect
   * @default 1.0
   * @minimum 0.1
   * @maximum 20
   */
  speed?: number;
  /**
   * Frequency of the effect curve
   * @default 1.0
   * @minimum 0.1
   * @maximum 64
   */
  frequency?: number;
}

/**
 * Specific configuration for the 'random_flash' effect.
 * @category EffectSpecificConfigs
 */
export interface RandomFlashEffectConfig {
  type: "random_flash";
  /**
   * Hit color
   * @default '#FFFFFF'
   */
  hit_color?: string /* Color */;
  /**
   * Hit duration
   * @default 0.5
   * @minimum 0.1
   * @maximum 5.0
   */
  hit_duration?: number;
  /**
   * Probability of hit per second
   * @default 0.1
   * @minimum 0.01
   * @maximum 1.0
   */
  hit_probability_per_sec?: number;
  /**
   * Hit size relative to LED strip
   * @default 10
   * @minimum 1
   * @maximum 100
   */
  hit_relative_size?: number;
}

/**
 * Specific configuration for the 'real_strobe' effect.
 * @category EffectSpecificConfigs
 */
export interface RealStrobeEffectConfig {
  type: "real_strobe";
  /**
   * Color scheme for bass strobe to cycle through
   * @default 'Dancefloor'
   */
  gradient?: string /* Gradient */;
  /**
   * Amount of color change per bass strobe
   * @default 0.0625
   * @minimum 0
   * @maximum 0.25
   */
  color_step?: number;
  /**
   * Bass strobe decay rate. Higher -> decays faster.
   * @default 0.5
   * @minimum 0
   * @maximum 1
   */
  bass_strobe_decay_rate?: number;
  /**
   * color for percussive strobes
   * @default '#FFFFFF'
   */
  strobe_color?: string /* Color */;
  /**
   * Percussive strobe width, in pixels
   * @default 10
   * @minimum 0
   * @maximum 1000
   */
  strobe_width?: number;
  /**
   * Percussive strobe decay rate. Higher -> decays faster.
   * @default 0.5
   * @minimum 0
   * @maximum 1
   */
  strobe_decay_rate?: number;
  /**
   * color shift delay for percussive strobes. Lower -> more shifts
   * @default 1
   * @minimum 0
   * @maximum 1
   */
  color_shift_delay?: number;
}

/**
 * Specific configuration for the 'scan' effect.
 * @category EffectSpecificConfigs
 */
export interface ScanEffectConfig {
  type: "scan";
  /**
   * Amount to blur the effect
   * @default 3.0
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default False
   */
  mirror?: boolean;
  /**
   * bounce the scan
   * @default True
   */
  bounce?: boolean;
  /**
   * Width of scan eye in %
   * @default 30
   * @minimum 1
   * @maximum 100
   */
  scan_width?: number;
  /**
   * Scan base % per second
   * @default 50
   * @minimum 0
   * @maximum 100
   */
  speed?: number;
  /**
   * Color of scan
   * @default '#FF0000'
   */
  color_scan?: string /* Color */;
  /**
   * Frequency range for the beat detection
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Speed impact multiplier
   * @default 3.0
   * @minimum 0.0
   * @maximum 5.0
   */
  multiplier?: number;
  /**
   * Adjust color intensity based on audio power
   * @default True
   */
  color_intensity?: boolean;
  /**
   * Use colors from gradient selector
   * @default False
   */
  use_grad?: boolean;
  /**
   * spread the gradient colors across the scan
   * @default False
   */
  full_grad?: boolean;
  /**
   * Number of scan to render
   * @default 1
   * @minimum 1
   * @maximum 10
   */
  count?: number;
}

/**
 * Specific configuration for the 'scan_and_flare' effect.
 * @category EffectSpecificConfigs
 */
export interface ScanAndFlareEffectConfig {
  type: "scan_and_flare";
  /**
   * Amount to blur the effect
   * @default 3.0
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default False
   */
  mirror?: boolean;
  /**
   * bounce the scan
   * @default True
   */
  bounce?: boolean;
  /**
   * Width of scan eye in %
   * @default 30
   * @minimum 1
   * @maximum 100
   */
  scan_width?: number;
  /**
   * Scan base % per second
   * @default 50
   * @minimum 0
   * @maximum 100
   */
  speed?: number;
  /**
   * max number of sparkles
   * @default 10
   * @minimum 1
   * @maximum 20
   */
  sparkles_max?: number;
  /**
   * of scan size
   * @default 0.1
   * @minimum 0.01
   * @maximum 0.3
   */
  sparkles_size?: number;
  /**
   * secs to die off
   * @default 1.0
   * @minimum 0.01
   * @maximum 2
   */
  sparkles_time?: number;
  /**
   * level to trigger
   * @default 0.6
   * @minimum 0.1
   * @maximum 0.9
   */
  sparkles_threshold?: number;
  /**
   * Color of scan
   * @default '#FF0000'
   */
  color_scan?: string /* Color */;
  /**
   * Frequency range for the beat detection
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Speed impact multiplier
   * @default 3.0
   * @minimum 0.0
   * @maximum 5.0
   */
  multiplier?: number;
  /**
   * Adjust color intensity based on audio power
   * @default True
   */
  color_intensity?: boolean;
  /**
   * Use colors from gradient selector
   * @default False
   */
  use_grad?: boolean;
}

/**
 * Specific configuration for the 'scan_multi' effect.
 * @category EffectSpecificConfigs
 */
export interface ScanMultiEffectConfig {
  type: "scan_multi";
  /**
   * Amount to blur the effect
   * @default 3.0
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default False
   */
  mirror?: boolean;
  /**
   * bounce the scan
   * @default True
   */
  bounce?: boolean;
  /**
   * Width of scan eye in %
   * @default 30
   * @minimum 1
   * @maximum 100
   */
  scan_width?: number;
  /**
   * Scan base % per second
   * @default 50
   * @minimum 0
   * @maximum 100
   */
  speed?: number;
  /**
   * Color of low power scan
   * @default '#FF0000'
   */
  color_low?: string /* Color */;
  /**
   * Color of mid power scan
   * @default '#00FF00'
   */
  color_mid?: string /* Color */;
  /**
   * Color of high power scan
   * @default '#0000FF'
   */
  color_high?: string /* Color */;
  /**
   * Speed impact multiplier
   * @default 3.0
   * @minimum 0.0
   * @maximum 5.0
   */
  multiplier?: number;
  /**
   * Adjust color intensity based on audio power
   * @default True
   */
  color_intensity?: boolean;
  /**
   * Use colors from gradient selector
   * @default False
   */
  use_grad?: boolean;
  /**
   * Audio processing source for low, mid, high
   * @default 'Power'
   */
  input_source?: "Power" | "Melbank";
  /**
   * Filter damping on attack, lower number is more
   * @default 0.9
   * @minimum 0.01
   * @maximum 0.99999
   */
  attack?: number;
  /**
   * Filter damping on decay, lower number is more
   * @default 0.7
   * @minimum 0.01
   * @maximum 0.99999
   */
  decay?: number;
  /**
   * Enable damping filters on attack and decay
   * @default False
   */
  filter?: boolean;
}

/**
 * Specific configuration for the 'scroll' effect.
 * @category EffectSpecificConfigs
 */
export interface ScrollEffectConfig {
  type: "scroll";
  /**
   * Amount to blur the effect
   * @default 3.0
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default True
   */
  mirror?: boolean;
  /**
   * Speed of the effect
   * @default 3
   * @minimum 1
   * @maximum 10
   */
  speed?: number;
  /**
   * Decay rate of the scroll
   * @default 0.97
   * @minimum 0.8
   * @maximum 1.0
   */
  decay?: number;
  /**
   * Cutoff for quiet sounds. Higher -> only loud sounds are detected
   * @default 0.0
   * @minimum 0
   * @maximum 1
   */
  threshold?: number;
  /**
   * Color of low, bassy sounds
   * @default '#FF0000'
   */
  color_lows?: string /* Color */;
  /**
   * Color of midrange sounds
   * @default '#00FF00'
   */
  color_mids?: string /* Color */;
  /**
   * Color of high sounds
   * @default '#0000FF'
   */
  color_high?: string /* Color */;
}

/**
 * Specific configuration for the 'scroll_plus' effect.
 * @category EffectSpecificConfigs
 */
export interface ScrollPlusEffectConfig {
  type: "scroll_plus";
  /**
   * Amount to blur the effect
   * @default 3.0
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default True
   */
  mirror?: boolean;
  /**
   * Device width to scroll per second
   * @default 0.7
   * @minimum 0.01
   * @maximum 2
   */
  scroll_per_sec?: number;
  /**
   * Decay rate of the scroll per second, kind of
   * @default 0.5
   * @minimum 0.0
   * @maximum 2.0
   */
  decay_per_sec?: number;
  /**
   * Cutoff for quiet sounds. Higher -> only loud sounds are detected
   * @default 0.0
   * @minimum 0
   * @maximum 1
   */
  threshold?: number;
  /**
   * Color of low, bassy sounds
   * @default '#FF0000'
   */
  color_lows?: string /* Color */;
  /**
   * Color of midrange sounds
   * @default '#00FF00'
   */
  color_mids?: string /* Color */;
  /**
   * Color of high sounds
   * @default '#0000FF'
   */
  color_high?: string /* Color */;
}

/**
 * Specific configuration for the 'singleColor' effect.
 * @category EffectSpecificConfigs
 */
export interface SinglecolorEffectConfig {
  type: "singleColor";
  /**
   * Color of strip
   * @default '#FF0000'
   */
  color?: string /* Color */;
}

/**
 * Specific configuration for the 'soap2d' effect.
 * @category EffectSpecificConfigs
 */
export interface Soap2dEffectConfig {
  type: "soap2d";
  /**
   * Smear amplitude [0..1]
   * @default 0.5
   * @minimum 0.0
   * @maximum 1.0
   */
  density?: number;
  /**
   * Motion speed (time-invariant) [0..1]
   * @default 0.5
   * @minimum 0.0
   * @maximum 1.0
   */
  speed?: number;
  /**
   * Audio injection to speed [0..2] 0 = free run
   * @default 1.0
   * @minimum 0.0
   * @maximum 2.0
   */
  intensity?: number;
  /**
   * Frequency range for the audio impulse
   * @default 'Lows (beat+bass)'
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
}

/**
 * Specific configuration for the 'spectrum' effect.
 * @category EffectSpecificConfigs
 */
export interface SpectrumEffectConfig {
  type: "spectrum";
  /**
   * How the melbank filters are applied to the RGB values
   * @default 0
   * @minimum 0
   * @maximum 5
   */
  rgb_mix?: number;
}

/**
 * Specific configuration for the 'strobe' effect.
 * @category EffectSpecificConfigs
 */
export interface StrobeEffectConfig {
  type: "strobe";
  /**
   * How many strobes per beat
   * @default '1/2 (.-. )'
   */
  strobe_frequency?: "1/1 (.,. )" | "1/2 (.-. )" | "1/4 (.o. )" | "1/8 (◉◡◉ )" | "1/16 (◉﹏◉ )" | "1/32 (⊙▃⊙ )";
  /**
   * How rapidly a single strobe hit fades. Higher -> faster fade
   * @default 1.5
   * @minimum 1
   * @maximum 10
   */
  strobe_decay?: number;
  /**
   * How much the strobes fade across the beat. Higher -> less bright strobes towards end of beat
   * @default 2
   * @minimum 0
   * @maximum 10
   */
  beat_decay?: number;
  /**
   * When to fire (*) or skip (.) the strobe (Note that beat 1 is arbitrary)
   * @default '****'
   */
  strobe_pattern?: "****" | "*.*." | ".*.*" | "*..." | "...*";
}

/**
 * Specific configuration for the 'texter2d' effect.
 * @category EffectSpecificConfigs
 */
export interface Texter2dEffectConfig {
  type: "texter2d";
  /**
   * apply alpha effect to text
   * @default False
   */
  alpha?: boolean;
  /**
   * Text effect specific option switch
   * @default False
   */
  option_1?: boolean;
  /**
   * Text effect specific option switch
   * @default False
   */
  option_2?: boolean;
  /**
   * general value slider for text effects
   * @default 0.5
   * @minimum 0.0
   * @maximum 1.0
   */
  value_option_1?: number;
  /**
   * Font to render text with
   * @default 'Press Start 2P'
   */
  font?: "Roboto Regular" | "Roboto Bold" | "Roboto Black" | "Stop" | "Technique" | "8bitOperatorPlus8" | "Press Start 2P" | "Blade-5x8";
  /**
   * Your text to display
   * @default 'Your text here'
   */
  text?: string;
  /**
   * Font size as a percentage of the display height, fonts are unpredictable!
   * @default 100
   * @minimum 10
   * @maximum 150
   */
  height_percent?: number;
  /**
   * Color of text
   * @default '#FFFFFF'
   */
  text_color?: string /* Color */;
  /**
   * What aliasing strategy to use when manipulating text elements
   * @default 'Fast'
   */
  resize_method?: "Fastest" | "Fast" | "Slow";
  /**
   * Text effect to apply to configuration
   * @default 'Side Scroll'
   */
  text_effect?: "Side Scroll" | "Spokes" | "Carousel" | "Wave" | "Pulse" | "Fade";
  /**
   * Diagnostic overlayed on matrix
   * @default False
   */
  deep_diag?: boolean;
  /**
   * Use gradient for word colors
   * @default False
   */
  use_gradient?: boolean;
  /**
   * Decay filter applied to the impulse for development
   * @default 0.1
   * @minimum 0.01
   * @maximum 0.3
   */
  impulse_decay?: number;
  /**
   * multiplier of audio effect injection
   * @default 1
   * @minimum 0.0
   * @maximum 10
   */
  multiplier?: number;
  /**
   * general speed slider for text effects
   * @default 1
   * @minimum 0.0
   * @maximum 3
   */
  speed_option_1?: number;
}

/**
 * Specific configuration for the 'vumeter' effect.
 * @category EffectSpecificConfigs
 */
export interface VumeterEffectConfig {
  type: "vumeter";
  /**
   * Decay filter applied to raw volume to track peak, 0 is None
   * @default 0.1
   * @minimum 0.01
   * @maximum 0.3
   */
  peak_decay?: number;
  /**
   * Color of min volume cutoff
   * @default '#0000FF'
   */
  color_min?: string /* Color */;
  /**
   * Color of max volume warning
   * @default '#FF0000'
   */
  color_max?: string /* Color */;
  /**
   * Color of heathy volume range
   * @default '#00FF00'
   */
  color_mid?: string /* Color */;
  /**
   * Color of peak inidicator
   * @default '#FFFFFF'
   */
  color_peak?: string /* Color */;
  /**
   * % size of peak indicator that follows the filtered volume
   * @default 1.0
   * @minimum 0
   * @maximum 5
   */
  peak_percent?: number;
  /**
   * Cut off limit for max volume warning
   * @default 0.8
   * @minimum 0
   * @maximum 1
   */
  max_volume?: number;
}

/**
 * Specific configuration for the 'water' effect.
 * @category EffectSpecificConfigs
 */
export interface WaterEffectConfig {
  type: "water";
  /**
   * Effect Speed modifier
   * @default 1
   * @minimum 1
   * @maximum 3
   */
  speed?: number;
  /**
   * Vertical Shift
   * @default 0.12
   * @minimum -0.2
   * @maximum 1
   */
  vertical_shift?: number;
  /**
   * Size of bass ripples
   * @default 8
   * @minimum 0
   * @maximum 15
   */
  bass_size?: number;
  /**
   * Size of mids ripples
   * @default 6
   * @minimum 0
   * @maximum 15
   */
  mids_size?: number;
  /**
   * Size of high ripples
   * @default 3
   * @minimum 0
   * @maximum 15
   */
  high_size?: number;
  /**
   * Viscosity of ripples
   * @default 6
   * @minimum 2
   * @maximum 12
   */
  viscosity?: number;
}

/**
 * Specific configuration for the 'waterfall2d' effect.
 * @category EffectSpecificConfigs
 */
export interface Waterfall2dEffectConfig {
  type: "waterfall2d";
  /**
   * Center the waterfall
   * @default False
   */
  center?: boolean;
  /**
   * Use max or mean value for bar size
   * @default False
   */
  max_vs_mean?: boolean;
  /**
   * Number of frequency bands
   * @default 16
   * @minimum 1
   * @maximum 64
   */
  bands?: number;
  /**
   * Seconds for the waterfall to drop from the top to bottom of the matrix
   * @default 3.0
   * @minimum 0.1
   * @maximum 10.0
   */
  drop_secs?: number;
  /**
   * Fade out the waterfall effect
   * @default 0.0
   * @minimum 0.0
   * @maximum 1.0
   */
  fade_out?: number;
}

/**
 * Specific configuration for the 'wavelength' effect.
 * @category EffectSpecificConfigs
 */
export interface WavelengthEffectConfig {
  type: "wavelength";
  /**
   * Amount to blur the effect
   * @default 3.0
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
}

/**
 * Literal union of all known effect type strings
 * @category Types
 */
export type EffectType = "bands" | "bands_matrix" | "bar" | "blade_power_plus" | "bleep" | "blender" | "block_reflections" | "blocks" | "clone" | "concentric" | "crawler" | "digitalrain2d" | "energy" | "energy2" | "equalizer" | "equalizer2d" | "fade" | "filter" | "fire" | "flame2d" | "game_of_life" | "gifplayer" | "glitch" | "gradient" | "hierarchy" | "imagespin" | "keybeat2d" | "lava_lamp" | "magnitude" | "marching" | "melt" | "melt_and_sparkle" | "metro" | "multiBar" | "noise2d" | "pitchSpectrum" | "pixels" | "plasma2d" | "plasmawled" | "power" | "radial" | "rain" | "rainbow" | "random_flash" | "real_strobe" | "scan" | "scan_and_flare" | "scan_multi" | "scroll" | "scroll_plus" | "singleColor" | "soap2d" | "spectrum" | "strobe" | "texter2d" | "vumeter" | "water" | "waterfall2d" | "wavelength";

/**
 * Effect specific configurations
 * @category Specific
 */
export type EffectSpecificConfig = BandsEffectConfig | BandsMatrixEffectConfig | BarEffectConfig | BladePowerPlusEffectConfig | BleepEffectConfig | BlenderEffectConfig | BlockReflectionsEffectConfig | BlocksEffectConfig | CloneEffectConfig | ConcentricEffectConfig | CrawlerEffectConfig | Digitalrain2dEffectConfig | EnergyEffectConfig | Energy2EffectConfig | EqualizerEffectConfig | Equalizer2dEffectConfig | FadeEffectConfig | FilterEffectConfig | FireEffectConfig | Flame2dEffectConfig | GameOfLifeEffectConfig | GifplayerEffectConfig | GlitchEffectConfig | GradientEffectConfig | HierarchyEffectConfig | ImagespinEffectConfig | Keybeat2dEffectConfig | LavaLampEffectConfig | MagnitudeEffectConfig | MarchingEffectConfig | MeltEffectConfig | MeltAndSparkleEffectConfig | MetroEffectConfig | MultibarEffectConfig | Noise2dEffectConfig | PitchspectrumEffectConfig | PixelsEffectConfig | Plasma2dEffectConfig | PlasmawledEffectConfig | PowerEffectConfig | RadialEffectConfig | RainEffectConfig | RainbowEffectConfig | RandomFlashEffectConfig | RealStrobeEffectConfig | ScanEffectConfig | ScanAndFlareEffectConfig | ScanMultiEffectConfig | ScrollEffectConfig | ScrollPlusEffectConfig | SinglecolorEffectConfig | Soap2dEffectConfig | SpectrumEffectConfig | StrobeEffectConfig | Texter2dEffectConfig | VumeterEffectConfig | WaterEffectConfig | Waterfall2dEffectConfig | WavelengthEffectConfig;

/**
 * Universal interface merging all possible *optional* effect properties.
 * Use this for convenience when strict type checking per effect is not required.
 * @category Configs
 */
export interface EffectConfig {
  type?: EffectType; // Use the literal union for the optional type
  across?: number;
  add_speed?: number;
  advanced?: boolean;
  align?: string;
  alpha?: boolean;
  attack?: number;
  background?: string;
  background_brightness?: number;
  background_color?: string /* Color */;
  background_stretch?: string;
  band_count?: number;
  bands?: number;
  base_game_speed?: number;
  bass_decay_rate?: number;
  bass_size?: number;
  bass_strobe_decay_rate?: number;
  beat_decay?: number;
  beat_frames?: string;
  beat_inject?: boolean;
  beat_offset?: number;
  beat_skip?: string;
  bg_bright?: number;
  bilinear?: boolean;
  block_count?: number;
  blur?: number;
  blur_amount?: number;
  boost?: number;
  bounce?: boolean;
  brightness?: number;
  brightness_boost?: number;
  build_up?: boolean;
  capture?: boolean;
  center?: boolean;
  center_horizontal?: number;
  center_smoothing?: number;
  center_vertical?: number;
  chop?: number;
  clip?: boolean;
  color?: string /* Color */;
  color_blend?: boolean;
  color_cycler?: boolean;
  color_high?: string /* Color */;
  color_intensity?: boolean;
  color_low?: string /* Color */;
  color_lows?: string /* Color */;
  color_max?: string /* Color */;
  color_mid?: string /* Color */;
  color_mids?: string /* Color */;
  color_min?: string /* Color */;
  color_peak?: string /* Color */;
  color_scan?: string /* Color */;
  color_shift?: number;
  color_shift_delay?: number;
  color_step?: number;
  contrast?: number;
  count?: number;
  cpu_secs?: number;
  decay?: number;
  decay_per_sec?: number;
  deep_diag?: boolean;
  density?: number;
  density_vertical?: number;
  diag?: boolean;
  down?: number;
  draw?: string;
  drop_secs?: number;
  ease_method?: string;
  edges?: number;
  fade_chance?: number;
  fade_out?: number;
  fade_rate?: number;
  fake_beat?: boolean;
  filter?: boolean;
  flash_color?: string /* Color */;
  flip?: boolean;
  flip_gradient?: boolean;
  flip_horizontal?: boolean;
  font?: string;
  force_fit?: boolean;
  foreground?: string;
  foreground_stretch?: string;
  frequency?: number;
  frequency_range?: string;
  full_grad?: boolean;
  gif_fps?: number;
  grad_power?: boolean;
  gradient?: string /* Gradient */;
  gradient_repeat?: number;
  gradient_scale?: number;
  half_beat?: boolean;
  health_check_interval?: number;
  health_checks?: string;
  height?: number;
  height_percent?: number;
  high_band?: string /* Color */;
  high_color?: string /* Color */;
  high_sensitivity?: number;
  high_size?: number;
  hit_color?: string /* Color */;
  hit_duration?: number;
  hit_probability_per_sec?: number;
  hit_relative_size?: number;
  idle_speed?: number;
  image_brightness?: number;
  image_location?: string;
  image_source?: string;
  impulse_decay?: number;
  input_source?: string;
  intensity?: number;
  invert?: boolean;
  invert_mask?: boolean;
  keep_aspect_ratio?: boolean;
  lava_width?: number;
  low_band?: string /* Color */;
  lower?: number;
  lows_color?: string /* Color */;
  lows_sensitivity?: number;
  mask?: string;
  mask_cutoff?: number;
  mask_stretch?: string;
  max_volume?: number;
  max_vs_mean?: boolean;
  mid_band?: string /* Color */;
  mids_color?: string /* Color */;
  mids_sensitivity?: number;
  mids_size?: number;
  min_size?: number;
  mirror?: boolean;
  mirror_effect?: boolean;
  mixing_mode?: string;
  mode?: string;
  multiplier?: number;
  option_1?: boolean;
  option_2?: boolean;
  pattern?: boolean;
  peak_color?: string /* Color */;
  peak_decay?: number;
  peak_marks?: boolean;
  peak_percent?: number;
  ping_pong?: boolean;
  ping_pong_skip?: boolean;
  pixel_color?: string /* Color */;
  pixels?: number;
  points?: number;
  polygon?: boolean;
  power_multiplier?: number;
  pulse_period?: number;
  pulse_ratio?: number;
  pulse_strip?: string;
  radius?: number;
  raindrop_animation?: string;
  reactivity?: number;
  resize_method?: string;
  responsiveness?: number;
  rgb_mix?: number;
  ring?: boolean;
  roll_speed?: number;
  rotation?: number;
  run_seconds?: number;
  saturation_threshold?: number;
  scan_width?: number;
  screen?: number;
  scroll_per_sec?: number;
  scroll_time?: number;
  sensitivity?: number;
  size?: number;
  size_multiplication?: number;
  skip_every?: number;
  skip_frames?: string;
  source_virtual?: any;
  sparkles_max?: number;
  sparkles_size?: number;
  sparkles_threshold?: number;
  sparkles_time?: number;
  sparks_color?: string /* Color */;
  sparks_decay_rate?: number;
  spawn_rate?: number;
  speed?: number;
  speed_multiplication?: number;
  speed_option_1?: number;
  spin?: any;
  spin_decay?: number;
  spin_multiplier?: number;
  star?: number;
  step_period?: number;
  steps?: number;
  stretch?: number;
  stretch_height?: number;
  stretch_horizontal?: number;
  stretch_vertical?: number;
  strobe_blur?: number;
  strobe_color?: string /* Color */;
  strobe_decay?: number;
  strobe_decay_rate?: number;
  strobe_frequency?: string;
  strobe_pattern?: string;
  strobe_rate?: number;
  strobe_threshold?: number;
  strobe_width?: number;
  sway?: number;
  switch_time?: number;
  tail?: number;
  text?: string;
  text_color?: string /* Color */;
  text_effect?: string;
  threshold?: number;
  threshold_lows?: number;
  threshold_mids?: number;
  twist?: number;
  use_grad?: boolean;
  use_gradient?: boolean;
  value_option_1?: number;
  velocity?: number;
  vertical_shift?: number;
  viscosity?: number;
  width?: number;
  x_offset?: number;
  y_offset?: number;
  zoom?: number;
}

// API Response Types using the SPECIFIC Effect Config Union

/**
* Literal union of all known effect type strings
* @category Types
*/
export type Segment = [
  device: string,
  start: number,
  end: number,
  reverse: boolean
];


/**
 * Represents the active effect details within a virtual's API response.
 * Uses the specific effect config discriminated union.
 * @category Specific
 */
export interface EffectSpecific {
  config: EffectSpecificConfig;
  name: string;
  type: "bands" | "bands_matrix" | "bar" | "blade_power_plus" | "bleep" | "blender" | "block_reflections" | "blocks" | "clone" | "concentric" | "crawler" | "digitalrain2d" | "energy" | "energy2" | "equalizer" | "equalizer2d" | "fade" | "filter" | "fire" | "flame2d" | "game_of_life" | "gifplayer" | "glitch" | "gradient" | "hierarchy" | "imagespin" | "keybeat2d" | "lava_lamp" | "magnitude" | "marching" | "melt" | "melt_and_sparkle" | "metro" | "multiBar" | "noise2d" | "pitchSpectrum" | "pixels" | "plasma2d" | "plasmawled" | "power" | "radial" | "rain" | "rainbow" | "random_flash" | "real_strobe" | "scan" | "scan_and_flare" | "scan_multi" | "scroll" | "scroll_plus" | "singleColor" | "soap2d" | "spectrum" | "strobe" | "texter2d" | "vumeter" | "water" | "waterfall2d" | "wavelength";
}
/**
 * Convenience type for effect details using the universal EffectConfig.
 * @category General
 */
export interface Effect {
  config: EffectConfig | null;
  name: string;
  type: "bands" | "bands_matrix" | "bar" | "blade_power_plus" | "bleep" | "blender" | "block_reflections" | "blocks" | "clone" | "concentric" | "crawler" | "digitalrain2d" | "energy" | "energy2" | "equalizer" | "equalizer2d" | "fade" | "filter" | "fire" | "flame2d" | "game_of_life" | "gifplayer" | "glitch" | "gradient" | "hierarchy" | "imagespin" | "keybeat2d" | "lava_lamp" | "magnitude" | "marching" | "melt" | "melt_and_sparkle" | "metro" | "multiBar" | "noise2d" | "pitchSpectrum" | "pixels" | "plasma2d" | "plasmawled" | "power" | "radial" | "rain" | "rainbow" | "random_flash" | "real_strobe" | "scan" | "scan_and_flare" | "scan_multi" | "scroll" | "scroll_plus" | "singleColor" | "soap2d" | "spectrum" | "strobe" | "texter2d" | "vumeter" | "water" | "waterfall2d" | "wavelength" | null;
}

/**
 * Convenience type for the API response containing multiple Virtual objects.
 * @category Specific
 */

 export interface VirtualSpecific {
  config: VirtualConfig;
  id: string;
  is_device: string | boolean; 
  auto_generated: boolean;
  segments: Segment[];
  pixel_count: number;
  active: boolean;
  streaming: boolean;
  last_effect?: "bands" | "bands_matrix" | "bar" | "blade_power_plus" | "bleep" | "blender" | "block_reflections" | "blocks" | "clone" | "concentric" | "crawler" | "digitalrain2d" | "energy" | "energy2" | "equalizer" | "equalizer2d" | "fade" | "filter" | "fire" | "flame2d" | "game_of_life" | "gifplayer" | "glitch" | "gradient" | "hierarchy" | "imagespin" | "keybeat2d" | "lava_lamp" | "magnitude" | "marching" | "melt" | "melt_and_sparkle" | "metro" | "multiBar" | "noise2d" | "pitchSpectrum" | "pixels" | "plasma2d" | "plasmawled" | "power" | "radial" | "rain" | "rainbow" | "random_flash" | "real_strobe" | "scan" | "scan_and_flare" | "scan_multi" | "scroll" | "scroll_plus" | "singleColor" | "soap2d" | "spectrum" | "strobe" | "texter2d" | "vumeter" | "water" | "waterfall2d" | "wavelength" | null;
  effect: Partial<EffectSpecific>; 
}
/**
 * Convenience type for a Virtual object using the universal Effect type.
 * @category General
 */

 export interface Virtual {
  config: VirtualConfig;
  id: string;
  is_device: string | boolean; 
  auto_generated: boolean;
  segments: Segment[];
  pixel_count: number;
  active: boolean;
  streaming: boolean;
  last_effect?: EffectType | null;
  effect: Effect; 
}

/**
 * Response for GET /api/virtuals.
 * @category REST
 */

 export interface GetVirtualsApiResponse {
  status: "success" | "error";
  virtuals: Record<string, VirtualSpecific>;
  paused: boolean;
  message?: string;
}

/**
 * Raw response for GET /api/virtuals/{{virtual_id}}.
 * @category REST
 */

 export interface GetSingleVirtualApiResponse {
  status: "success" | "error";
  [virtualId: string]: VirtualSpecific | string | undefined; 
  message?: string;
}

/**
 * Transformed type for GET /api/virtuals/{virtual_id}.
 * @category REST
 */

 export type FetchedVirtualResult = 
  | { status: "success"; data: VirtualSpecific }
  | { status: "error"; message: string };


/**
 * Represents a single Device object using specific config types.
 * @category Specific
 */
export interface DeviceSpecific {
  config: DeviceSpecificConfig;
  id: string;
  type: "adalight" | "artnet" | "ddp" | "dummy" | "e131" | "govee" | "hue" | "launchpad" | "lifx" | "nanoleaf" | "open_pixel_control" | "openrgb" | "osc" | "rpi_ws281x" | "twinkly_squares" | "udp" | "wled" | "zengee";
  online: boolean;
  virtuals: string[]; 
  active_virtuals: string[]; 
}

/**
 * Response for GET /api/devices using specific config types.
 * @category REST
 */

 export interface GetDevicesApiResponse {
  status: "success" | "error";
  devices: Record<string, DeviceSpecific>;
  message?: string;
}

/**
 * Convenience type for a Device object using the universal DeviceConfig.
 * @category General
 */
export interface Device {
  config: DeviceConfig;
  id: string;
  type: "adalight" | "artnet" | "ddp" | "dummy" | "e131" | "govee" | "hue" | "launchpad" | "lifx" | "nanoleaf" | "open_pixel_control" | "openrgb" | "osc" | "rpi_ws281x" | "twinkly_squares" | "udp" | "wled" | "zengee";
  online: boolean;
  virtuals: string[]; 
  active_virtuals: string[]; 
}

// Scene Configuration
export interface SceneConfig {
  /**
   * Name of the scene
   */
  name: string;
  /**
   * Image or icon to display
   * @default 'Wallpaper'
   */
  scene_image?: string;
  /**
   * Tags for filtering
   */
  scene_tags?: string;
  /**
   * On Scene Activate, URL to PUT too
   */
  scene_puturl?: string;
  /**
   * On Scene Activate, send this payload to scene_puturl
   */
  scene_payload?: string;
  /**
   * On MIDI key/note, Activate a scene
   */
  scene_midiactivate?: string;
  /**
   * The effects of these virtuals will be saved
   */
  virtuals: any;
}

// Fallback Timing Jitter Config
export interface TimingJitter { enabled?: boolean; factor_min?: number; factor_max?: number; }

// Playlist Timing Configuration
export interface PlaylistTiming {
  /**
   * @default {}
   */
  jitter?: {
    /**
     * @default (computed)
     */
    enabled?: boolean;
    /**
     * @default (computed)
     * @minimum 0.0
     */
    factor_min?: number;
    /**
     * @default (computed)
     * @minimum 0.0
     */
    factor_max?: number;
  };
}

// Playlist Item Configuration
export interface PlaylistItem {
  /**
   * ID of the scene to activate
   */
  scene_id: string;
  /**
   * Duration in milliseconds to display this item
   * @minimum 500
   */
  duration_ms?: number;
}

// Playlist Configuration
export interface PlaylistConfig {
  /**
   * Unique playlist identifier
   */
  id: string;
  /**
   * Human readable name for the playlist
   */
  name: string;
  /**
   * Ordered list of items (scene_id + optional duration). Empty list = dynamic 'all scenes' resolved at start time.
   */
  items: PlaylistItem[];
  /**
   * Default duration (ms) applied to items that omit duration
   * @default 500
   * @minimum 500
   */
  default_duration_ms?: number;
  /**
   * Playback mode: 'sequence' or 'shuffle'
   * @default 'sequence'
   */
  mode?: "sequence" | "shuffle";
  /**
   * Advanced timing settings
   * @default {}
   */
  timing?: {
    /**
     * @default (computed)
     */
    jitter?: {
    /**
     * @default (computed)
     */
    enabled?: boolean;
    /**
     * @default (computed)
     * @minimum 0.0
     */
    factor_min?: number;
    /**
     * @default (computed)
     * @minimum 0.0
     */
    factor_max?: number;
  };
  };
  /**
   * Tags for filtering or grouping playlists
   * @default []
   */
  tags?: any;
  /**
   * Image or icon to display for the playlist
   * @default 'Wallpaper'
   */
  image?: any;
}

// Scene API Response Types
/**
 * Represents the effect configuration stored in a scene for a virtual.
 * @category Scenes
 */
export interface SceneVirtualEffect {
  type?: EffectType;
  config?: EffectConfig;
}

/**
 * Represents a stored scene configuration with actual effect data.
 * This is the structure used in the API responses and storage.
 * @category Scenes
 */
export interface StoredSceneConfig {
  name: string;
  scene_image?: string;
  scene_tags?: string;
  scene_puturl?: string;
  scene_payload?: string;
  scene_midiactivate?: string;
  virtuals?: Record<string, SceneVirtualEffect>; // virtual_id -> effect config
  active?: boolean;
}

/**
 * Represents a single Scene with its effect configurations including ID and active state.
 * @category Scenes
 */
export interface Scene {
  id: string;
  config: StoredSceneConfig;
  active: boolean;
}

/**
 * Response for GET /api/scenes.
 * @category REST
 */
export interface GetScenesApiResponse {
  status: "success" | "error";
  scenes: Record<string, StoredSceneConfig>;
  message?: string;
}

/**
 * Response for POST /api/scenes (scene creation).
 * @category REST
 */
export interface CreateSceneApiResponse {
  status: "success" | "error";
  scene?: Scene;
  message?: string;
}

// Playlist API Response Types
/**
 * Runtime state of an active playlist (ephemeral data).
 * @category Playlists
 */
export interface PlaylistRuntimeState {
  active_playlist: string;
  index: number;
  order: number[];
  scenes: string[];
  scene_id: string;
  mode: 'sequence' | 'shuffle';
  paused: boolean;
  remaining_ms: number;
  effective_duration_ms: number;
  timing: PlaylistTiming;
}

/**
 * Represents a single Playlist with its configuration.
 * @category Playlists
 */
export interface Playlist {
  id: string;
  config: PlaylistConfig;
}

/**
 * Response for GET /api/playlists.
 * @category REST
 */
export interface GetPlaylistsApiResponse {
  status: "success" | "error";
  playlists: Record<string, PlaylistConfig>;
  message?: string;
}

/**
 * Response for GET /api/playlists/{id}.
 * @category REST
 */
export interface GetSinglePlaylistApiResponse {
  status: "success" | "error";
  data?: { playlist: PlaylistConfig };
  message?: string;
}

/**
 * Response for POST /api/playlists (playlist creation/replacement).
 * @category REST
 */
export interface CreatePlaylistApiResponse {
  status: "success" | "error";
  data?: { playlist: PlaylistConfig };
  payload?: {
    type: "success" | "error";
    reason: string;
  };
  message?: string;
}

/**
 * Request body for playlist control actions via PUT /api/playlists.
 * @category REST
 */
export type PlaylistControlRequest = 
  | {
      action: "start";
      id: string;
      mode?: 'sequence' | 'shuffle';
      timing?: PlaylistTiming;
    }
  | { action: "stop" }
  | { action: "pause" }
  | { action: "resume" }
  | { action: "next" }
  | { action: "prev" }
  | { action: "state" };

/**
 * Response for PUT /api/playlists control actions.
 * @category REST
 */
export interface PlaylistControlApiResponse {
  status: "success" | "error";
  data?: { state: PlaylistRuntimeState };
  payload?: {
    type: "success" | "error";
    reason: string;
  };
  message?: string;
}

/**
 * Response for DELETE /api/playlists/{id}.
 * @category REST
 */
export interface DeletePlaylistApiResponse {
  status: "success" | "error";
  payload?: {
    type: "success" | "error";
    reason: string;
  };
  message?: string;
}

// Playlist Event Types
/**
 * Base payload for playlist events.
 * @category Events
 */
export interface PlaylistEventPayload {
  playlist_id: string;
  index?: number;
  scene_id?: string;
  effective_duration_ms?: number;
  remaining_ms?: number;
}

// Virtual Presets API Response Types
/**
 * Represents a single preset with its configuration and active status.
 * @category Presets
 */
export interface Preset {
  name: string;
  config: EffectConfig;
  active: boolean;
}

/**
 * Response for GET /api/virtuals/{virtual_id}/presets.
 * @category REST
 */
export interface GetVirtualPresetsApiResponse {
  status: "success" | "error";
  virtual: string;
  effect: EffectType;
  ledfx_presets: Record<string, Preset>;
  user_presets: Record<string, Preset>;
  message?: string;
}

/**
 * Request body for PUT /api/virtuals/{virtual_id}/presets.
 * @category REST
 */
export interface SetVirtualPresetRequest {
  category: "ledfx_presets" | "user_presets";
  effect_id: EffectType;
  preset_id: string; // Use "reset" with ledfx_presets to reset to defaults
}

/**
 * Response for PUT /api/virtuals/{virtual_id}/presets.
 * @category REST
 */
export interface SetVirtualPresetApiResponse {
  status: "success" | "error";
  effect: {
    config: EffectConfig;
    name: string;
    type: EffectType;
  };
  message?: string;
}

/**
 * Request body for POST /api/virtuals/{virtual_id}/presets.
 * @category REST
 */
export interface CreateVirtualPresetRequest {
  name: string;
}

/**
 * Response for POST /api/virtuals/{virtual_id}/presets.
 * @category REST
 */
export interface CreateVirtualPresetApiResponse {
  status: "success" | "error";
  preset: {
    id: string;
    name: string;
    config: EffectConfig;
  };
  message?: string;
}

/**
 * Response for DELETE /api/virtuals/{virtual_id}/presets.
 * @category REST
 */
export interface DeleteVirtualPresetApiResponse {
  status: "success" | "error";
  effect: {};
  message?: string;
}

// Convenience Type Aliases using Universal Configs
/**
 * Convenience type for the API response containing multiple Virtual objects.
 * @category General
 */
export type Virtuals = Omit<GetVirtualsApiResponse, 'virtuals'> & { virtuals: Record<string, Virtual> };
/**
 * Convenience type for the API response containing multiple Device objects.
 * @category General
 */
export type Devices = Omit<GetDevicesApiResponse, 'devices'> & { devices: Record<string, Device> };
/**
 * Convenience type for the API response containing multiple Scene objects.
 * @category General
 */
export type Scenes = GetScenesApiResponse;
/**
 * Convenience type for the API response containing multiple Playlist objects.
 * @category General
 */
export type Playlists = GetPlaylistsApiResponse;

