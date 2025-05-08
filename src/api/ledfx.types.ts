/**
 * Type: AUTO-GENERATED FILE
 * Tool: LedFx TypeScript Generator
 * Author: YeonV
 */

/* eslint-disable */

// --- Base Device Schema Generation --- 
// Base configuration shared by all devices
export interface BaseDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   * @default (computed)
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   * @default (computed)
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   * @default (computed)
   */
  refresh_rate?: number /* FPS */;
}

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
   * @default (computed)
   */
  icon_name?: string;
  /**
   * Max brightness for the device
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  max_brightness?: number;
  /**
   * Number of pixels from the perceived center of the device
   * @default (computed)
   */
  center_offset?: number;
  /**
   * Preview the pixels without updating the devices
   * @default (computed)
   */
  preview_only?: boolean;
  /**
   * Length of transition between effects
   * @default (computed)
   * @minimum 0
   * @maximum 5
   */
  transition_time?: number;
  /**
   * Type of transition between effects
   * @default (computed)
   */
  transition_mode?: "Add" | "Dissolve" | "Push" | "Slide" | "Iris" | "Through White" | "Through Black" | "None";
  /**
   * Lowest frequency for this virtual's audio reactive effects
   * @default (computed)
   * @minimum 20
   * @maximum 15000
   */
  frequency_min?: number;
  /**
   * Highest frequency for this virtual's audio reactive effects
   * @default (computed)
   * @minimum 20
   * @maximum 15000
   */
  frequency_max?: number;
  /**
   * Amount of rows. > 1 if this virtual is a matrix
   * @default (computed)
   */
  rows?: number;
}

// Config for device type: artnet
export interface ArtnetDeviceConfig extends BaseDeviceConfig {
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
  /**
   * DMX universe for the device
   * @default (computed)
   * @minimum 0
   */
  universe?: number;
  /**
   * Size of each DMX universe
   * @default (computed)
   * @minimum 1
   * @maximum 512
   */
  packet_size?: number;
  /**
   * Channel bytes to insert before the RGB data
   * @default (computed)
   */
  pre_amble?: string;
  /**
   * Channel bytes to insert after the RGB data
   * @default (computed)
   */
  post_amble?: string;
  /**
   * Number of pixels to consume per device. Pre and post ambles are repeated per device. By default (0) all pixels will be used by one instance
   * @default (computed)
   * @minimum 0
   */
  pixels_per_device?: number;
  /**
   * The start address within the universe
   * @default (computed)
   * @minimum 1
   * @maximum 512
   */
  dmx_start_address?: number;
  /**
   * Whether to use even packet size
   * @default (computed)
   */
  even_packet_size?: boolean;
  /**
   * Output mode for RGB or RGBW data
   * @default (computed)
   */
  output_mode?: string;
  /**
   * port
   * @default (computed)
   */
  port?: number;
}

// Config for device type: ddp
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
}

// Config for device type: dummy
export interface DummyDeviceConfig extends BaseDeviceConfig {
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
}

// Config for device type: e131
export interface E131DeviceConfig extends BaseDeviceConfig {
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
  /**
   * DMX universe for the device
   * @default (computed)
   * @minimum 1
   */
  universe?: number;
  /**
   * Size of each DMX universe
   * @default (computed)
   * @minimum 1
   */
  universe_size?: number;
  /**
   * Channel offset within the DMX universe
   * @default (computed)
   * @minimum 0
   */
  channel_offset?: number;
  /**
   * Priority given to the sACN packets for this device
   * @default (computed)
   * @minimum 0
   * @maximum 200
   */
  packet_priority?: number;
}

// Config for device type: govee
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
   * @default (computed)
   */
  ignore_status?: boolean;
  /**
   * Some archane setting to make the pixel pattern stretch to fit the device
   * @default (computed)
   */
  stretch_to_fit?: boolean;
}

// Config for device type: hue
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
   * @default (computed)
   */
  udp_port?: number;
}

// Config for device type: lifx
export interface LifxDeviceConfig extends BaseDeviceConfig {
  /**
   * Number of individual pixels
   * @minimum 1
   */
  pixel_count: number;
}

// Config for device type: nanoleaf
export interface NanoleafDeviceConfig extends BaseDeviceConfig {
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * port
   * @default (computed)
   */
  port?: number;
  /**
   * port
   * @default (computed)
   */
  udp_port?: number;
  /**
   * Auth token
   */
  auth_token?: string;
  /**
   * Streaming protocol to Nanoleaf device
   * @default (computed)
   */
  sync_mode?: "TCP" | "UDP";
}

// Config for device type: open_pixel_control
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

// Config for device type: osc
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

// Config for device type: rpi_ws281x
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

// Config for device type: udp
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
   * @default (computed)
   * @minimum 1
   * @maximum 255
   */
  timeout?: number;
  /**
   * Won't send updates if nothing has changed on the LED device
   * @default (computed)
   */
  minimise_traffic?: boolean;
}

// Config for device type: wled
export interface WledDeviceConfig extends BaseDeviceConfig {
  /**
   * Streaming protocol to WLED device. Recommended: DDP for 0.13 or later. Use UDP for older versions.
   * @default (computed)
   */
  sync_mode?: "DDP" | "UDP" | "E131";
  /**
   * Time between LedFx effect off and WLED effect activate
   * @default (computed)
   * @minimum 0
   * @maximum 255
   */
  timeout?: number;
  /**
   * Import WLED segments into LedFx
   * @default (computed)
   */
  create_segments?: boolean;
}

// Config for device type: zengee
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

// Literal union of all known device type strings
export type DeviceType = "adalight" | "artnet" | "ddp" | "dummy" | "e131" | "govee" | "hue" | "launchpad" | "lifx" | "nanoleaf" | "open_pixel_control" | "openrgb" | "osc" | "rpi_ws281x" | "udp" | "wled" | "zengee";

export type DeviceConfigUnion = ArtnetDeviceConfig | DdpDeviceConfig | DummyDeviceConfig | E131DeviceConfig | GoveeDeviceConfig | HueDeviceConfig | LifxDeviceConfig | NanoleafDeviceConfig | OpenPixelControlDeviceConfig | OscDeviceConfig | RpiWs281xDeviceConfig | UdpDeviceConfig | WledDeviceConfig | ZengeeDeviceConfig;

// Universal interface merging all possible *optional* device properties (using snake_case)
export interface DeviceConfig {
  type?: DeviceType; // Optional device type identifier
  /** Property from the universal set. */
  auth_token?: string;
  /** Property from the universal set. */
  center_offset?: number;
  /** Property from the universal set. */
  channel?: number;
  /** Property from the universal set. */
  channel_offset?: number;
  /** Property from the universal set. */
  color_order?: string;
  /** Property from the universal set. */
  create_segments?: boolean;
  /** Property from the universal set. */
  dmx_start_address?: number;
  /** Property from the universal set. */
  even_packet_size?: boolean;
  /** Property from the universal set. */
  gpio_pin?: number;
  /** Property from the universal set. */
  group_name?: string;
  /** Property from the universal set. */
  icon_name?: string;
  /** Property from the universal set. */
  ignore_status?: boolean;
  /** Property from the universal set. */
  ip_address?: string;
  /** Property from the universal set. */
  minimise_traffic?: boolean;
  /** Property from the universal set. */
  name?: string;
  /** Property from the universal set. */
  output_mode?: string;
  /** Property from the universal set. */
  packet_priority?: number;
  /** Property from the universal set. */
  packet_size?: number;
  /** Property from the universal set. */
  path?: string;
  /** Property from the universal set. */
  pixel_count?: number;
  /** Property from the universal set. */
  pixels_per_device?: number;
  /** Property from the universal set. */
  port?: number;
  /** Property from the universal set. */
  post_amble?: string;
  /** Property from the universal set. */
  pre_amble?: string;
  /** Property from the universal set. */
  refresh_rate?: number /* FPS */;
  /** Property from the universal set. */
  send_type?: string;
  /** Property from the universal set. */
  starting_addr?: number;
  /** Property from the universal set. */
  stretch_to_fit?: boolean;
  /** Property from the universal set. */
  sync_mode?: string;
  /** Property from the universal set. */
  timeout?: number;
  /** Property from the universal set. */
  udp_packet_type?: string;
  /** Property from the universal set. */
  udp_port?: number;
  /** Property from the universal set. */
  universe?: number;
  /** Property from the universal set. */
  universe_size?: number;
}

// Specific Effect Configurations (for Discriminated Union)
export interface BandsEffectConfig {
  type: "bands";
  /**
   * Number of bands
   * @default (computed)
   * @minimum 1
   * @maximum 16
   */
  band_count?: number;
  /**
   * Alignment of bands
   * @default (computed)
   */
  align?: "left" | "right" | "invert" | "center";
}

export interface BandsMatrixEffectConfig {
  type: "bands_matrix";
  /**
   * Number of bands
   * @default (computed)
   * @minimum 1
   * @maximum 16
   */
  band_count?: number;
  /**
   * Mirror the effect
   * @default (computed)
   */
  mirror?: boolean;
  /**
   * Flip Gradient
   * @default (computed)
   */
  flip_gradient?: boolean;
  /**
   * Flip horizontally
   * @default (computed)
   */
  flip_horizontal?: boolean;
}

export interface BarEffectConfig {
  type: "bar";
  /**
   * Choose from different animations
   * @default (computed)
   */
  mode?: "bounce" | "wipe" | "in-out";
  /**
   * Acceleration profile of bar
   * @default (computed)
   */
  ease_method?: "ease_in_out" | "ease_in" | "ease_out" | "linear";
  /**
   * Amount of color change per beat
   * @default (computed)
   * @minimum 0.0625
   * @maximum 0.5
   */
  color_step?: number;
  /**
   * Skips odd or even beats
   * @default (computed)
   */
  beat_skip?: "none" | "odds" | "even";
  /**
   * Offset the beat
   * @default (computed)
   * @minimum 0.0
   * @maximum 1.0
   */
  beat_offset?: number;
  /**
   * If skipping beats, skip every
   * @default (computed)
   */
  skip_every?: 1 | 2;
}

export interface BladePowerPlusEffectConfig {
  type: "blade_power_plus";
  /**
   * Mirror the effect
   * @default (computed)
   */
  mirror?: boolean;
  /**
   * Amount to blur the effect
   * @default (computed)
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Rate of color decay
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  decay?: number;
  /**
   * Make the reactive bar bigger/smaller
   * @default (computed)
   * @minimum 0.0
   * @maximum 1.0
   */
  multiplier?: number;
  /**
   * Color of Background
   * @default (computed)
   */
  background_color?: string /* Color */;
  /**
   * Frequency range for the beat detection
   * @default (computed)
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
}

export interface BleepEffectConfig {
  type: "bleep";
  /**
   * mirror effect
   * @default (computed)
   */
  mirror_effect?: boolean;
  /**
   * Use gradient in power dimension instead of time
   * @default (computed)
   */
  grad_power?: boolean;
  /**
   * Time to scroll the bleep
   * @default (computed)
   * @minimum 0.1
   * @maximum 5.0
   */
  scroll_time?: number;
  /**
   * Frequency range for the beat detection
   * @default (computed)
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * How to plot the data
   * @default (computed)
   */
  draw?: "Points" | "Lines" | "Fill";
  /**
   * How many historical points to capture
   * @default (computed)
   * @minimum 2
   * @maximum 64
   */
  points?: number;
  /**
   * Line width only
   * @default (computed)
   * @minimum 1
   * @maximum 8
   */
  size?: number;
}

export interface BlenderEffectConfig {
  type: "blender";
  /**
   * How to stretch the mask source pixles to the effect pixels
   * @default (computed)
   */
  mask_stretch?: "2d full" | "2d tile";
  /**
   * How to stretch the background source pixles to the effect pixels
   * @default (computed)
   */
  background_stretch?: "2d full" | "2d tile";
  /**
   * How to stretch the foreground source pixles to the effect pixels
   * @default (computed)
   */
  foreground_stretch?: "2d full" | "2d tile";
  /**
   * The virtual from which to source the mask
   * @default (computed)
   */
  mask?: string;
  /**
   * The virtual from which to source the foreground
   * @default (computed)
   */
  foreground?: string;
  /**
   * The virtual from which to source the background
   * @default (computed)
   */
  background?: string;
  /**
   * Switch Foreground and Background
   * @default (computed)
   */
  invert_mask?: boolean;
  /**
   * 1 default = luminance as alpha, anything below 1 is mask cutoff
   * @default (computed)
   * @minimum 0.01
   * @maximum 1.0
   */
  mask_cutoff?: number;
}

export interface BlockReflectionsEffectConfig {
  type: "block_reflections";
  /**
   * Effect Speed modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 1.0
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 1.0
   */
  reactivity?: number;
}

export interface BlocksEffectConfig {
  type: "blocks";
  /**
   * Number of color blocks
   * @default (computed)
   * @minimum 1
   * @maximum 10
   */
  block_count?: number;
}

export interface CloneEffectConfig {
  type: "clone";
  /**
   * Source screen for grab
   * @default (computed)
   * @minimum 0
   * @maximum 4
   */
  screen?: number;
  /**
   * pixels down offset of grab
   * @default (computed)
   * @minimum 0
   * @maximum 1080
   */
  down?: number;
  /**
   * pixels across offset of grab
   * @default (computed)
   * @minimum 0
   * @maximum 1920
   */
  across?: number;
  /**
   * width of grab
   * @default (computed)
   * @minimum 1
   * @maximum 1920
   */
  width?: number;
  /**
   * height of grab
   * @default (computed)
   * @minimum 1
   * @maximum 1080
   */
  height?: number;
}

export interface CrawlerEffectConfig {
  type: "crawler";
  /**
   * Effect Speed modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 1.0
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 1.0
   */
  reactivity?: number;
  /**
   * Sway modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 50
   */
  sway?: number;
  /**
   * Chop modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 100
   */
  chop?: number;
  /**
   * Stretch modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 10
   */
  stretch?: number;
}

export interface Digitalrain2dEffectConfig {
  type: "digitalrain2d";
  /**
   * Color gradient to display
   * @default (computed)
   */
  gradient?: string /* Gradient */;
  /**
   * Number of code lines in the matrix as a multiplier of matrix pixel width
   * @default (computed)
   * @minimum 0.01
   * @maximum 4.0
   */
  count?: number;
  /**
   * Number of code lines to add per second
   * @default (computed)
   * @minimum 0.1
   * @maximum 30.0
   */
  add_speed?: number;
  /**
   * Width of code lines as % of matrix
   * @default (computed)
   * @minimum 1
   * @maximum 30
   */
  width?: number;
  /**
   * Minimum number of seconds for a code line to run from top to bottom
   * @default (computed)
   * @minimum 1
   * @maximum 10.0
   */
  run_seconds?: number;
  /**
   * Code line tail length as a % of the matrix
   * @default (computed)
   * @minimum 1
   * @maximum 100
   */
  tail?: number;
  /**
   * Decay filter applied to the impulse for development
   * @default (computed)
   * @minimum 0.01
   * @maximum 0.3
   */
  impulse_decay?: number;
  /**
   * audio injection multiplier, 0 is none
   * @default (computed)
   * @minimum 0.0
   * @maximum 10
   */
  multiplier?: number;
}

export interface EnergyEffectConfig {
  type: "energy";
  /**
   * Amount to blur the effect
   * @default (computed)
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default (computed)
   */
  mirror?: boolean;
  /**
   * Change colors in time with the beat
   * @default (computed)
   */
  color_cycler?: boolean;
  /**
   * Color of low, bassy sounds
   * @default (computed)
   */
  color_lows?: string /* Color */;
  /**
   * Color of midrange sounds
   * @default (computed)
   */
  color_mids?: string /* Color */;
  /**
   * Color of high sounds
   * @default (computed)
   */
  color_high?: string /* Color */;
  /**
   * Responsiveness to changes in sound
   * @default (computed)
   * @minimum 0.3
   * @maximum 0.99
   */
  sensitivity?: number;
  /**
   * Mode of combining each frequencies' colors
   * @default (computed)
   */
  mixing_mode?: "additive" | "overlap";
}

export interface Energy2EffectConfig {
  type: "energy2";
  /**
   * Effect Speed modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 1.0
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 1.0
   */
  reactivity?: number;
}

export interface EqualizerEffectConfig {
  type: "equalizer";
  /**
   * Alignment of bands
   * @default (computed)
   */
  align?: "left" | "right" | "invert" | "center";
  /**
   * Repeat the gradient into segments
   * @default (computed)
   * @minimum 1
   * @maximum 16
   */
  gradient_repeat?: number;
}

export interface Equalizer2dEffectConfig {
  type: "equalizer2d";
  /**
   * Size of the tracer bar that follows a filtered value
   * @default (computed)
   * @minimum 0
   * @maximum 5
   */
  peak_percent?: number;
  /**
   * Decay filter applied to the peak value
   * @default (computed)
   * @minimum 0.01
   * @maximum 0.1
   */
  peak_decay?: number;
  /**
   * Turn on white peak markers that follow a freq value filtered with decay
   * @default (computed)
   */
  peak_marks?: boolean;
  /**
   * Center the equalizer bar
   * @default (computed)
   */
  center?: boolean;
  /**
   * Use max or mean value for bar size
   * @default (computed)
   */
  max_vs_mean?: boolean;
  /**
   * Why be so square?
   * @default (computed)
   */
  ring?: boolean;
  /**
   * Weeeeeeeeeee
   * @default (computed)
   */
  spin?: boolean;
  /**
   * Number of freq bands
   * @default (computed)
   * @minimum 1
   * @maximum 64
   */
  bands?: number;
  /**
   * Frequency range for spin impulse
   * @default (computed)
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Spin impulse multiplier
   * @default (computed)
   * @minimum 0
   * @maximum 5
   */
  spin_multiplier?: number;
  /**
   * Decay filter applied to the spin impulse
   * @default (computed)
   * @minimum 0.01
   * @maximum 0.3
   */
  spin_decay?: number;
}

export interface FadeEffectConfig {
  type: "fade";
  /**
   * Rate of change of color
   * @default (computed)
   * @minimum 0.1
   * @maximum 10
   */
  speed?: number;
}

export interface FireEffectConfig {
  type: "fire";
  /**
   * Effect Speed modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 0.5
   */
  speed?: number;
  /**
   * Fire color
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  color_shift?: number;
  /**
   * Fire intensity
   * @default (computed)
   * @minimum 1
   * @maximum 30
   */
  intensity?: number;
}

export interface GameOfLifeEffectConfig {
  type: "game_of_life";
  /**
   * Check for and correct common unhealthy states
   * @default (computed)
   */
  health_checks?: "All" | "Dead" | "Oscillating" | "None";
  /**
   * Base number of steps per second to run
   * @default (computed)
   * @minimum 1
   * @maximum 60
   */
  base_game_speed?: number;
  /**
   * Number of seconds between health checks
   * @default (computed)
   * @minimum 1
   * @maximum 30
   */
  health_check_interval?: number;
  /**
   * Frequency range for life generation impulse
   * @default (computed)
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Generate entities on beat
   * @default (computed)
   */
  beat_inject?: boolean;
  /**
   * Decay filter applied to the life generation impulse
   * @default (computed)
   * @minimum 0.01
   * @maximum 0.1
   */
  impulse_decay?: number;
}

export interface GifplayerEffectConfig {
  type: "gifplayer";
  /**
   * Load GIF from URL/local file
   * @default (computed)
   */
  image_location?: string;
  /**
   * Bounce the GIF instead of looping
   * @default (computed)
   */
  bounce?: boolean;
  /**
   * How fast to play the gif
   * @default (computed)
   * @minimum 1
   * @maximum 60
   */
  gif_fps?: number;
}

export interface GlitchEffectConfig {
  type: "glitch";
  /**
   * Effect Speed modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 10.0
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 1.0
   */
  reactivity?: number;
  /**
   * Ensure the saturation is above this value
   * @default (computed)
   * @minimum 0.0
   * @maximum 1.0
   */
  saturation_threshold?: number;
}

export interface GradientEffectConfig {
  type: "gradient";
  /**
   * Speed of the effect
   * @default (computed)
   * @minimum 0.1
   * @maximum 10
   */
  speed?: number;
}

export interface ImagespinEffectConfig {
  type: "imagespin";
  /**
   * use a test pattern
   * @default (computed)
   */
  pattern?: boolean;
  /**
   * Frequency range for the beat detection
   * @default (computed)
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Applied to the audio input to amplify effect
   * @default (computed)
   * @minimum 0.0
   * @maximum 1.0
   */
  multiplier?: number;
  /**
   * The minimum size multiplier for the image
   * @default (computed)
   * @minimum 0.0
   * @maximum 1.0
   */
  min_size?: number;
  /**
   * default NEAREST, use BILINEAR for smoother scaling, expensive on runtime takes a few ms
   * @default (computed)
   */
  bilinear?: boolean;
  /**
   * spin image according to filter impulse
   * @default (computed)
   */
  spin?: boolean;
  /**
   * When spinning the image, force fit to frame, or allow clipping
   * @default (computed)
   */
  clip?: boolean;
  /**
   * Load image from
   * @default (computed)
   */
  image_source?: string;
}

export interface Keybeat2dEffectConfig {
  type: "keybeat2d";
  /**
   * Percentage of original to matrix width
   * @default (computed)
   * @minimum 1
   * @maximum 200
   */
  stretch_horizontal?: number;
  /**
   * Percentage of original to matrix height
   * @default (computed)
   * @minimum 1
   * @maximum 200
   */
  stretch_vertical?: number;
  /**
   * Center offset in horizontal direction percent of matrix width
   * @default (computed)
   * @minimum -95
   * @maximum 95
   */
  center_horizontal?: number;
  /**
   * Center offset in vertical direction percent of matrix height
   * @default (computed)
   * @minimum -95
   * @maximum 95
   */
  center_vertical?: number;
  /**
   * Load gif from url or path
   * @default (computed)
   */
  image_location?: string;
  /**
   * Frame index to interpolate beats between
   * @default (computed)
   */
  beat_frames?: string;
  /**
   * Frames to remove from gif animation
   * @default (computed)
   */
  skip_frames?: string;
  /**
   * Diagnostic overlayed on matrix
   * @default (computed)
   */
  deep_diag?: boolean;
  /**
   * Trigger test code with 0.05 beat per frame
   * @default (computed)
   */
  fake_beat?: boolean;
  /**
   * Preserve aspect ratio if force fit
   * @default (computed)
   */
  keep_aspect_ratio?: boolean;
  /**
   * Force fit to matrix
   * @default (computed)
   */
  force_fit?: boolean;
  /**
   * When ping pong, skip the first beat key frame on both ends, use when key beat frames are very close to start and ends only
   * @default (computed)
   */
  ping_pong_skip?: boolean;
  /**
   * Play gif forward and reverse, not just loop
   * @default (computed)
   */
  ping_pong?: boolean;
  /**
   * half the beat input impulse, slow things down
   * @default (computed)
   */
  half_beat?: boolean;
  /**
   * Image brightness
   * @default (computed)
   * @minimum 0.1
   * @maximum 3.0
   */
  image_brightness?: number;
}

export interface LavaLampEffectConfig {
  type: "lava_lamp";
  /**
   * Effect Speed modifier
   * @default (computed)
   * @minimum 0.1
   * @maximum 15.0
   */
  speed?: number;
  /**
   * Difference between lighter and darker spots
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  contrast?: number;
  /**
   * Audio Reactive modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 0.9
   */
  reactivity?: number;
}

export interface MagnitudeEffectConfig {
  type: "magnitude";
  /**
   * Frequency range for the beat detection
   * @default (computed)
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
}

export interface MarchingEffectConfig {
  type: "marching";
  /**
   * Effect Speed modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 1.0
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default (computed)
   * @minimum 1e-05
   * @maximum 1.0
   */
  reactivity?: number;
}

export interface MeltEffectConfig {
  type: "melt";
  /**
   * Effect Speed modifier
   * @default (computed)
   * @minimum 0.001
   * @maximum 1
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default (computed)
   * @minimum 0.0001
   * @maximum 1
   */
  reactivity?: number;
}

export interface MeltAndSparkleEffectConfig {
  type: "melt_and_sparkle";
  /**
   * Effect Speed modifier
   * @default (computed)
   * @minimum 0.001
   * @maximum 1
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   * @default (computed)
   * @minimum 0.0001
   * @maximum 1
   */
  reactivity?: number;
  /**
   * Brightness of the melt effect
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  bg_bright?: number;
  /**
   * Size of the melting lava sections
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  lava_width?: number;
  /**
   * Cutoff for quiet sounds. Higher -> only loud sounds are detected
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  strobe_threshold?: number;
  /**
   * Higher numbers -> more strobes
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  strobe_rate?: number;
  /**
   * Percussive strobe width, from one pixel to the full length
   * @default (computed)
   * @minimum 0.0
   * @maximum 1.0
   */
  strobe_width?: number;
  /**
   * Percussive strobe decay rate. Higher -> decays faster.
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  strobe_decay_rate?: number;
  /**
   * How much to blur the strobes
   * @default (computed)
   * @minimum 0
   * @maximum 10
   */
  strobe_blur?: number;
}

export interface MetroEffectConfig {
  type: "metro";
  /**
   * Time between flash in seconds
   * @default (computed)
   * @minimum 1
   * @maximum 10
   */
  pulse_period?: number;
  /**
   * Flash to blank ratio
   * @default (computed)
   * @minimum 0.1
   * @maximum 0.9
   */
  pulse_ratio?: number;
  /**
   * Steps of pattern division to loop
   * @default (computed)
   * @minimum 1
   * @maximum 6
   */
  steps?: number;
  /**
   * Background color
   * @default (computed)
   */
  background_color?: string /* Color */;
  /**
   * Flash color
   * @default (computed)
   */
  flash_color?: string /* Color */;
  /**
   * graph capture, on to start, off to dump
   * @default (computed)
   */
  capture?: boolean;
  /**
   * Window over which to measure CPU usage
   * @default (computed)
   * @minimum 0.1
   * @maximum 1.0
   */
  cpu_secs?: number;
}

export interface MultibarEffectConfig {
  type: "multiBar";
  /**
   * Choose from different animations
   * @default (computed)
   */
  mode?: "cascade" | "wipe";
  /**
   * Acceleration profile of bar
   * @default (computed)
   */
  ease_method?: "ease_in_out" | "ease_in" | "ease_out" | "linear";
  /**
   * Amount of color change per beat
   * @default (computed)
   * @minimum 0.0625
   * @maximum 0.5
   */
  color_step?: number;
}

export interface Noise2dEffectConfig {
  type: "noise2d";
  /**
   * Speed of the effect
   * @default (computed)
   * @minimum 0
   * @maximum 5
   */
  speed?: number;
  /**
   * intensity of the effect
   * @default (computed)
   * @minimum 0
   * @maximum 255
   */
  intensity?: number;
  /**
   * Stretch of the effect
   * @default (computed)
   * @minimum 0.5
   * @maximum 1.5
   */
  stretch?: number;
  /**
   * zoom density
   * @default (computed)
   * @minimum 0.5
   * @maximum 20
   */
  zoom?: number;
  /**
   * Decay filter applied to the impulse for development
   * @default (computed)
   * @minimum 0.01
   * @maximum 0.3
   */
  impulse_decay?: number;
  /**
   * audio injection multiplier, 0 is none
   * @default (computed)
   * @minimum 0.0
   * @maximum 4.0
   */
  multiplier?: number;
  /**
   * Add soap smear to noise
   * @default (computed)
   */
  soap?: boolean;
}

export interface PitchspectrumEffectConfig {
  type: "pitchSpectrum";
  /**
   * Amount to blur the effect
   * @default (computed)
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default (computed)
   */
  mirror?: boolean;
  /**
   * Rate at which notes fade
   * @default (computed)
   * @minimum 0.0
   * @maximum 1.0
   */
  fade_rate?: number;
  /**
   * Responsiveness to note changes
   * @default (computed)
   * @minimum 0.0
   * @maximum 1.0
   */
  responsiveness?: number;
}

export interface PixelsEffectConfig {
  type: "pixels";
  /**
   * Locked to 20 fps
   * @default (computed)
   * @minimum 20
   * @maximum 20
   */
  speed?: number;
  /**
   * Time between each pixel step to light up
   * @default (computed)
   * @minimum 0.1
   * @maximum 5.0
   */
  step_period?: number;
  /**
   * Number of pixels each step
   * @default (computed)
   * @minimum 1
   * @maximum 32
   */
  pixels?: number;
  /**
   * Background color
   * @default (computed)
   */
  background_color?: string /* Color */;
  /**
   * Pixel color to light up
   * @default (computed)
   */
  pixel_color?: string /* Color */;
  /**
   * Single or building pixels
   * @default (computed)
   */
  build_up?: boolean;
}

export interface Plasma2dEffectConfig {
  type: "plasma2d";
  /**
   * Frequency range for the beat detection
   * @default (computed)
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Lets pretend its vertical density
   * @default (computed)
   * @minimum 0.01
   * @maximum 0.3
   */
  density_vertical?: number;
  /**
   * Like a slice of lemon
   * @default (computed)
   * @minimum 0.01
   * @maximum 0.3
   */
  twist?: number;
  /**
   * If you squint its the distance from the center
   * @default (computed)
   * @minimum 0.01
   * @maximum 1.0
   */
  radius?: number;
  /**
   * kinda how small the plasma is, but who realy knows
   * @default (computed)
   * @minimum 0.001
   * @maximum 2.0
   */
  density?: number;
  /**
   * lower band of density
   * @default (computed)
   * @minimum 0.01
   * @maximum 1.0
   */
  lower?: number;
}

export interface PlasmawledEffectConfig {
  type: "plasmawled";
  /**
   * Frequency range for the beat detection
   * @default (computed)
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Speed multiplier
   * @default (computed)
   * @minimum 0
   * @maximum 255
   */
  speed?: number;
  /**
   * Smaller is less block in horizontal dimension
   * @default (computed)
   * @minimum 0
   * @maximum 255
   */
  stretch_horizontal?: number;
  /**
   * Smaller is less block in vertical dimension
   * @default (computed)
   * @minimum 0
   * @maximum 255
   */
  stretch_vertical?: number;
  /**
   * Sound to size multiplier
   * @default (computed)
   * @minimum 0.0
   * @maximum 1.0
   */
  size_multiplication?: number;
  /**
   * Sound to speed multiplier
   * @default (computed)
   * @minimum 0.0
   * @maximum 1.0
   */
  speed_multiplication?: number;
}

export interface PowerEffectConfig {
  type: "power";
  /**
   * Mirror the effect
   * @default (computed)
   */
  mirror?: boolean;
  /**
   * Amount to blur the effect
   * @default (computed)
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Flash on percussive hits
   * @default (computed)
   */
  sparks_color?: string /* Color */;
  /**
   * Bass decay rate. Higher -> decays faster.
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  bass_decay_rate?: number;
  /**
   * Sparks decay rate. Higher -> decays faster.
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  sparks_decay_rate?: number;
}

export interface RainEffectConfig {
  type: "rain";
  /**
   * Mirror the effect
   * @default (computed)
   */
  mirror?: boolean;
  /**
   * color for low sounds, ie beats
   * @default (computed)
   */
  lows_color?: string /* Color */;
  /**
   * Pulse the entire strip to the beat
   * @default (computed)
   */
  pulse_strip?: "Off" | "Lows" | "Mids" | "Highs";
  /**
   * color for mid sounds, ie vocals
   * @default (computed)
   */
  mids_color?: string /* Color */;
  /**
   * color for high sounds, ie hi hat
   * @default (computed)
   */
  high_color?: string /* Color */;
  /**
   * Sensitivity to low sounds
   * @default (computed)
   * @minimum 0.03
   * @maximum 0.3
   */
  lows_sensitivity?: number;
  /**
   * Sensitivity to mid sounds
   * @default (computed)
   * @minimum 0.03
   * @maximum 0.3
   */
  mids_sensitivity?: number;
  /**
   * Sensitivity to high sounds
   * @default (computed)
   * @minimum 0.03
   * @maximum 0.3
   */
  high_sensitivity?: number;
  /**
   * Droplet animation style
   * @default (computed)
   */
  raindrop_animation?: "Blob" | "Laser" | "Ripple";
}

export interface RainbowEffectConfig {
  type: "rainbow";
  /**
   * Speed of the effect
   * @default (computed)
   * @minimum 0.1
   * @maximum 20
   */
  speed?: number;
  /**
   * Frequency of the effect curve
   * @default (computed)
   * @minimum 0.1
   * @maximum 64
   */
  frequency?: number;
}

export interface RandomFlashEffectConfig {
  type: "random_flash";
  /**
   * Hit color
   * @default (computed)
   */
  hit_color?: string /* Color */;
  /**
   * Hit duration
   * @default (computed)
   * @minimum 0.1
   * @maximum 5.0
   */
  hit_duration?: number;
  /**
   * Probability of hit per second
   * @default (computed)
   * @minimum 0.01
   * @maximum 1.0
   */
  hit_probability_per_sec?: number;
  /**
   * Hit size relative to LED strip
   * @default (computed)
   * @minimum 1
   * @maximum 100
   */
  hit_relative_size?: number;
}

export interface RealStrobeEffectConfig {
  type: "real_strobe";
  /**
   * Color scheme for bass strobe to cycle through
   * @default (computed)
   */
  gradient?: string /* Gradient */;
  /**
   * Amount of color change per bass strobe
   * @default (computed)
   * @minimum 0
   * @maximum 0.25
   */
  color_step?: number;
  /**
   * Bass strobe decay rate. Higher -> decays faster.
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  bass_strobe_decay_rate?: number;
  /**
   * color for percussive strobes
   * @default (computed)
   */
  strobe_color?: string /* Color */;
  /**
   * Percussive strobe width, in pixels
   * @default (computed)
   * @minimum 0
   * @maximum 1000
   */
  strobe_width?: number;
  /**
   * Percussive strobe decay rate. Higher -> decays faster.
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  strobe_decay_rate?: number;
  /**
   * color shift delay for percussive strobes. Lower -> more shifts
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  color_shift_delay?: number;
}

export interface ScanEffectConfig {
  type: "scan";
  /**
   * Amount to blur the effect
   * @default (computed)
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default (computed)
   */
  mirror?: boolean;
  /**
   * bounce the scan
   * @default (computed)
   */
  bounce?: boolean;
  /**
   * Width of scan eye in %
   * @default (computed)
   * @minimum 1
   * @maximum 100
   */
  scan_width?: number;
  /**
   * Scan base % per second
   * @default (computed)
   * @minimum 0
   * @maximum 100
   */
  speed?: number;
  /**
   * Color of scan
   * @default (computed)
   */
  color_scan?: string /* Color */;
  /**
   * Frequency range for the beat detection
   * @default (computed)
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Speed impact multiplier
   * @default (computed)
   * @minimum 0.0
   * @maximum 5.0
   */
  multiplier?: number;
  /**
   * Adjust color intensity based on audio power
   * @default (computed)
   */
  color_intensity?: boolean;
  /**
   * Use colors from gradient selector
   * @default (computed)
   */
  use_grad?: boolean;
  /**
   * spread the gradient colors across the scan
   * @default (computed)
   */
  full_grad?: boolean;
  /**
   * enable advanced options
   * @default (computed)
   */
  advanced?: boolean;
  /**
   * Number of scan to render
   * @default (computed)
   * @minimum 1
   * @maximum 10
   */
  count?: number;
}

export interface ScanAndFlareEffectConfig {
  type: "scan_and_flare";
  /**
   * Amount to blur the effect
   * @default (computed)
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default (computed)
   */
  mirror?: boolean;
  /**
   * bounce the scan
   * @default (computed)
   */
  bounce?: boolean;
  /**
   * Width of scan eye in %
   * @default (computed)
   * @minimum 1
   * @maximum 100
   */
  scan_width?: number;
  /**
   * Scan base % per second
   * @default (computed)
   * @minimum 0
   * @maximum 100
   */
  speed?: number;
  /**
   * max number of sparkles
   * @default (computed)
   * @minimum 1
   * @maximum 20
   */
  sparkles_max?: number;
  /**
   * of scan size
   * @default (computed)
   * @minimum 0.01
   * @maximum 0.3
   */
  sparkles_size?: number;
  /**
   * secs to die off
   * @default (computed)
   * @minimum 0.01
   * @maximum 2
   */
  sparkles_time?: number;
  /**
   * level to trigger
   * @default (computed)
   * @minimum 0.1
   * @maximum 0.9
   */
  sparkles_threshold?: number;
  /**
   * Color of scan
   * @default (computed)
   */
  color_scan?: string /* Color */;
  /**
   * Frequency range for the beat detection
   * @default (computed)
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Speed impact multiplier
   * @default (computed)
   * @minimum 0.0
   * @maximum 5.0
   */
  multiplier?: number;
  /**
   * Adjust color intensity based on audio power
   * @default (computed)
   */
  color_intensity?: boolean;
  /**
   * Use colors from gradient selector
   * @default (computed)
   */
  use_grad?: boolean;
}

export interface ScanMultiEffectConfig {
  type: "scan_multi";
  /**
   * Amount to blur the effect
   * @default (computed)
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default (computed)
   */
  mirror?: boolean;
  /**
   * bounce the scan
   * @default (computed)
   */
  bounce?: boolean;
  /**
   * Width of scan eye in %
   * @default (computed)
   * @minimum 1
   * @maximum 100
   */
  scan_width?: number;
  /**
   * Scan base % per second
   * @default (computed)
   * @minimum 0
   * @maximum 100
   */
  speed?: number;
  /**
   * Color of low power scan
   * @default (computed)
   */
  color_low?: string /* Color */;
  /**
   * Color of mid power scan
   * @default (computed)
   */
  color_mid?: string /* Color */;
  /**
   * Color of high power scan
   * @default (computed)
   */
  color_high?: string /* Color */;
  /**
   * Speed impact multiplier
   * @default (computed)
   * @minimum 0.0
   * @maximum 5.0
   */
  multiplier?: number;
  /**
   * Adjust color intensity based on audio power
   * @default (computed)
   */
  color_intensity?: boolean;
  /**
   * Use colors from gradient selector
   * @default (computed)
   */
  use_grad?: boolean;
  /**
   * enable advanced options
   * @default (computed)
   */
  advanced?: boolean;
  /**
   * Audio processing source for low, mid, high
   * @default (computed)
   */
  input_source?: "Power" | "Melbank";
  /**
   * Filter damping on attack, lower number is more
   * @default (computed)
   * @minimum 0.01
   * @maximum 0.99999
   */
  attack?: number;
  /**
   * Filter damping on decay, lower number is more
   * @default (computed)
   * @minimum 0.01
   * @maximum 0.99999
   */
  decay?: number;
  /**
   * Enable damping filters on attack and decay
   * @default (computed)
   */
  filter?: boolean;
}

export interface ScrollEffectConfig {
  type: "scroll";
  /**
   * Amount to blur the effect
   * @default (computed)
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default (computed)
   */
  mirror?: boolean;
  /**
   * Speed of the effect
   * @default (computed)
   * @minimum 1
   * @maximum 10
   */
  speed?: number;
  /**
   * Decay rate of the scroll
   * @default (computed)
   * @minimum 0.8
   * @maximum 1.0
   */
  decay?: number;
  /**
   * Cutoff for quiet sounds. Higher -> only loud sounds are detected
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  threshold?: number;
  /**
   * Color of low, bassy sounds
   * @default (computed)
   */
  color_lows?: string /* Color */;
  /**
   * Color of midrange sounds
   * @default (computed)
   */
  color_mids?: string /* Color */;
  /**
   * Color of high sounds
   * @default (computed)
   */
  color_high?: string /* Color */;
}

export interface ScrollPlusEffectConfig {
  type: "scroll_plus";
  /**
   * Amount to blur the effect
   * @default (computed)
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
  /**
   * Mirror the effect
   * @default (computed)
   */
  mirror?: boolean;
  /**
   * Device width to scroll per second
   * @default (computed)
   * @minimum 0.01
   * @maximum 2
   */
  scroll_per_sec?: number;
  /**
   * Decay rate of the scroll per second, kind of
   * @default (computed)
   * @minimum 0.0
   * @maximum 2.0
   */
  decay_per_sec?: number;
  /**
   * Cutoff for quiet sounds. Higher -> only loud sounds are detected
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  threshold?: number;
  /**
   * Color of low, bassy sounds
   * @default (computed)
   */
  color_lows?: string /* Color */;
  /**
   * Color of midrange sounds
   * @default (computed)
   */
  color_mids?: string /* Color */;
  /**
   * Color of high sounds
   * @default (computed)
   */
  color_high?: string /* Color */;
}

export interface SinglecolorEffectConfig {
  type: "singleColor";
  /**
   * Color of strip
   * @default (computed)
   */
  color?: string /* Color */;
}

export interface SpectrumEffectConfig {
  type: "spectrum";
  /**
   * How the melbank filters are applied to the RGB values
   * @default (computed)
   * @minimum 0
   * @maximum 5
   */
  rgb_mix?: number;
}

export interface StrobeEffectConfig {
  type: "strobe";
  /**
   * How many strobes per beat
   * @default (computed)
   */
  strobe_frequency?: "1/1 (.,. )" | "1/2 (.-. )" | "1/4 (.o. )" | "1/8 (◉◡◉ )" | "1/16 (◉﹏◉ )" | "1/32 (⊙▃⊙ )";
  /**
   * How rapidly a single strobe hit fades. Higher -> faster fade
   * @default (computed)
   * @minimum 1
   * @maximum 10
   */
  strobe_decay?: number;
  /**
   * How much the strobes fade across the beat. Higher -> less bright strobes towards end of beat
   * @default (computed)
   * @minimum 0
   * @maximum 10
   */
  beat_decay?: number;
  /**
   * When to fire (*) or skip (.) the strobe (Note that beat 1 is arbitrary)
   * @default (computed)
   */
  strobe_pattern?: "****" | "*.*." | ".*.*" | "*..." | "...*";
}

export interface Texter2dEffectConfig {
  type: "texter2d";
  /**
   * apply alpha effect to text
   * @default (computed)
   */
  alpha?: boolean;
  /**
   * Text effect specific option switch
   * @default (computed)
   */
  option_1?: boolean;
  /**
   * Text effect specific option switch
   * @default (computed)
   */
  option_2?: boolean;
  /**
   * general value slider for text effects
   * @default (computed)
   * @minimum 0.0
   * @maximum 1.0
   */
  value_option_1?: number;
  /**
   * Font to render text with
   * @default (computed)
   */
  font?: "Roboto Regular" | "Roboto Bold" | "Roboto Black" | "Stop" | "Technique" | "8bitOperatorPlus8" | "Press Start 2P" | "Blade-5x8";
  /**
   * Your text to display
   * @default (computed)
   */
  text?: string;
  /**
   * Font size as a percentage of the display height, fonts are unpredictable!
   * @default (computed)
   * @minimum 10
   * @maximum 150
   */
  height_percent?: number;
  /**
   * Color of text
   * @default (computed)
   */
  text_color?: string /* Color */;
  /**
   * What aliasing strategy to use when manipulating text elements
   * @default (computed)
   */
  resize_method?: "Fastest" | "Fast" | "Slow";
  /**
   * Text effect to apply to configuration
   * @default (computed)
   */
  text_effect?: "Side Scroll" | "Spokes" | "Carousel" | "Wave" | "Pulse" | "Fade";
  /**
   * Diagnostic overlayed on matrix
   * @default (computed)
   */
  deep_diag?: boolean;
  /**
   * Use gradient for word colors
   * @default (computed)
   */
  use_gradient?: boolean;
  /**
   * Decay filter applied to the impulse for development
   * @default (computed)
   * @minimum 0.01
   * @maximum 0.3
   */
  impulse_decay?: number;
  /**
   * multiplier of audio effect injection
   * @default (computed)
   * @minimum 0.0
   * @maximum 10
   */
  multiplier?: number;
  /**
   * general speed slider for text effects
   * @default (computed)
   * @minimum 0.0
   * @maximum 3
   */
  speed_option_1?: number;
}

export interface VumeterEffectConfig {
  type: "vumeter";
  /**
   * Decay filter applied to raw volume to track peak, 0 is None
   * @default (computed)
   * @minimum 0.01
   * @maximum 0.3
   */
  peak_decay?: number;
  /**
   * Color of min volume cutoff
   * @default (computed)
   */
  color_min?: string /* Color */;
  /**
   * Color of max volume warning
   * @default (computed)
   */
  color_max?: string /* Color */;
  /**
   * Color of heathy volume range
   * @default (computed)
   */
  color_mid?: string /* Color */;
  /**
   * Color of peak inidicator
   * @default (computed)
   */
  color_peak?: string /* Color */;
  /**
   * % size of peak indicator that follows the filtered volume
   * @default (computed)
   * @minimum 0
   * @maximum 5
   */
  peak_percent?: number;
  /**
   * Cut off limit for max volume warning
   * @default (computed)
   * @minimum 0
   * @maximum 1
   */
  max_volume?: number;
}

export interface WaterEffectConfig {
  type: "water";
  /**
   * Effect Speed modifier
   * @default (computed)
   * @minimum 1
   * @maximum 3
   */
  speed?: number;
  /**
   * Vertical Shift
   * @default (computed)
   * @minimum -0.2
   * @maximum 1
   */
  vertical_shift?: number;
  /**
   * Size of bass ripples
   * @default (computed)
   * @minimum 0
   * @maximum 15
   */
  bass_size?: number;
  /**
   * Size of mids ripples
   * @default (computed)
   * @minimum 0
   * @maximum 15
   */
  mids_size?: number;
  /**
   * Size of high ripples
   * @default (computed)
   * @minimum 0
   * @maximum 15
   */
  high_size?: number;
  /**
   * Viscosity of ripples
   * @default (computed)
   * @minimum 2
   * @maximum 12
   */
  viscosity?: number;
}

export interface Waterfall2dEffectConfig {
  type: "waterfall2d";
  /**
   * Center the waterfall
   * @default (computed)
   */
  center?: boolean;
  /**
   * Use max or mean value for bar size
   * @default (computed)
   */
  max_vs_mean?: boolean;
  /**
   * Number of frequency bands
   * @default (computed)
   * @minimum 1
   * @maximum 64
   */
  bands?: number;
  /**
   * Seconds for the waterfall to drop from the top to bottom of the matrix
   * @default (computed)
   * @minimum 0.1
   * @maximum 10.0
   */
  drop_secs?: number;
}

export interface WavelengthEffectConfig {
  type: "wavelength";
  /**
   * Amount to blur the effect
   * @default (computed)
   * @minimum 0.0
   * @maximum 10
   */
  blur?: number;
}

// Literal union of all known effect type strings
export type EffectType = "bands" | "bands_matrix" | "bar" | "blade_power_plus" | "bleep" | "blender" | "block_reflections" | "blocks" | "clone" | "crawler" | "digitalrain2d" | "energy" | "energy2" | "equalizer" | "equalizer2d" | "fade" | "fire" | "game_of_life" | "gifplayer" | "glitch" | "gradient" | "imagespin" | "keybeat2d" | "lava_lamp" | "magnitude" | "marching" | "melt" | "melt_and_sparkle" | "metro" | "multiBar" | "noise2d" | "pitchSpectrum" | "pixels" | "plasma2d" | "plasmawled" | "power" | "rain" | "rainbow" | "random_flash" | "real_strobe" | "scan" | "scan_and_flare" | "scan_multi" | "scroll" | "scroll_plus" | "singleColor" | "spectrum" | "strobe" | "texter2d" | "vumeter" | "water" | "waterfall2d" | "wavelength";

export type SpecificEffectConfig = BandsEffectConfig | BandsMatrixEffectConfig | BarEffectConfig | BladePowerPlusEffectConfig | BleepEffectConfig | BlenderEffectConfig | BlockReflectionsEffectConfig | BlocksEffectConfig | CloneEffectConfig | CrawlerEffectConfig | Digitalrain2dEffectConfig | EnergyEffectConfig | Energy2EffectConfig | EqualizerEffectConfig | Equalizer2dEffectConfig | FadeEffectConfig | FireEffectConfig | GameOfLifeEffectConfig | GifplayerEffectConfig | GlitchEffectConfig | GradientEffectConfig | ImagespinEffectConfig | Keybeat2dEffectConfig | LavaLampEffectConfig | MagnitudeEffectConfig | MarchingEffectConfig | MeltEffectConfig | MeltAndSparkleEffectConfig | MetroEffectConfig | MultibarEffectConfig | Noise2dEffectConfig | PitchspectrumEffectConfig | PixelsEffectConfig | Plasma2dEffectConfig | PlasmawledEffectConfig | PowerEffectConfig | RainEffectConfig | RainbowEffectConfig | RandomFlashEffectConfig | RealStrobeEffectConfig | ScanEffectConfig | ScanAndFlareEffectConfig | ScanMultiEffectConfig | ScrollEffectConfig | ScrollPlusEffectConfig | SinglecolorEffectConfig | SpectrumEffectConfig | StrobeEffectConfig | Texter2dEffectConfig | VumeterEffectConfig | WaterEffectConfig | Waterfall2dEffectConfig | WavelengthEffectConfig;

// Universal interface merging all possible *optional* effect properties (using snake_case)
export interface EffectConfig {
  type?: EffectType; // Use the literal union for the optional type
  across?: number;
  add_speed?: number;
  advanced?: boolean;
  align?: string;
  alpha?: boolean;
  attack?: number;
  background?: string;
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
  bounce?: boolean;
  build_up?: boolean;
  capture?: boolean;
  center?: boolean;
  center_horizontal?: number;
  center_vertical?: number;
  chop?: number;
  clip?: boolean;
  color?: string /* Color */;
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
  down?: number;
  draw?: string;
  drop_secs?: number;
  ease_method?: string;
  fade_rate?: number;
  fake_beat?: boolean;
  filter?: boolean;
  flash_color?: string /* Color */;
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
  half_beat?: boolean;
  health_check_interval?: number;
  health_checks?: string;
  height?: number;
  height_percent?: number;
  high_color?: string /* Color */;
  high_sensitivity?: number;
  high_size?: number;
  hit_color?: string /* Color */;
  hit_duration?: number;
  hit_probability_per_sec?: number;
  hit_relative_size?: number;
  image_brightness?: number;
  image_location?: string;
  image_source?: string;
  impulse_decay?: number;
  input_source?: string;
  intensity?: number;
  invert_mask?: boolean;
  keep_aspect_ratio?: boolean;
  lava_width?: number;
  lower?: number;
  lows_color?: string /* Color */;
  lows_sensitivity?: number;
  mask?: string;
  mask_cutoff?: number;
  mask_stretch?: string;
  max_volume?: number;
  max_vs_mean?: boolean;
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
  peak_decay?: number;
  peak_marks?: boolean;
  peak_percent?: number;
  ping_pong?: boolean;
  ping_pong_skip?: boolean;
  pixel_color?: string /* Color */;
  pixels?: number;
  points?: number;
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
  soap?: boolean;
  sparkles_max?: number;
  sparkles_size?: number;
  sparkles_threshold?: number;
  sparkles_time?: number;
  sparks_color?: string /* Color */;
  sparks_decay_rate?: number;
  speed?: number;
  speed_multiplication?: number;
  speed_option_1?: number;
  spin?: boolean;
  spin_decay?: number;
  spin_multiplier?: number;
  step_period?: number;
  steps?: number;
  stretch?: number;
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
  tail?: number;
  text?: string;
  text_color?: string /* Color */;
  text_effect?: string;
  threshold?: number;
  twist?: number;
  use_grad?: boolean;
  use_gradient?: boolean;
  value_option_1?: number;
  vertical_shift?: number;
  viscosity?: number;
  width?: number;
  zoom?: number;
}

// API Response Types using the SPECIFIC Effect Config Union

// Represents a segment mapping [deviceId, startPixel, endPixel, isReversed]
export type Segment = [
  device: string,
  start: number,
  end: number,
  reverse: boolean
];


export interface ActiveEffectInVirtual {
  config: SpecificEffectConfig;
  name: string;
  type: "bands" | "bands_matrix" | "bar" | "blade_power_plus" | "bleep" | "blender" | "block_reflections" | "blocks" | "clone" | "crawler" | "digitalrain2d" | "energy" | "energy2" | "equalizer" | "equalizer2d" | "fade" | "fire" | "game_of_life" | "gifplayer" | "glitch" | "gradient" | "imagespin" | "keybeat2d" | "lava_lamp" | "magnitude" | "marching" | "melt" | "melt_and_sparkle" | "metro" | "multiBar" | "noise2d" | "pitchSpectrum" | "pixels" | "plasma2d" | "plasmawled" | "power" | "rain" | "rainbow" | "random_flash" | "real_strobe" | "scan" | "scan_and_flare" | "scan_multi" | "scroll" | "scroll_plus" | "singleColor" | "spectrum" | "strobe" | "texter2d" | "vumeter" | "water" | "waterfall2d" | "wavelength";
}


// Represents a single Virtual object
export interface VirtualApiResponseItem {
  config: VirtualConfig;
  id: string;
  is_device: string | boolean; 
  auto_generated: boolean;
  segments: Segment[];
  pixel_count: number;
  active: boolean;
  streaming: boolean;
  last_effect?: "bands" | "bands_matrix" | "bar" | "blade_power_plus" | "bleep" | "blender" | "block_reflections" | "blocks" | "clone" | "crawler" | "digitalrain2d" | "energy" | "energy2" | "equalizer" | "equalizer2d" | "fade" | "fire" | "game_of_life" | "gifplayer" | "glitch" | "gradient" | "imagespin" | "keybeat2d" | "lava_lamp" | "magnitude" | "marching" | "melt" | "melt_and_sparkle" | "metro" | "multiBar" | "noise2d" | "pitchSpectrum" | "pixels" | "plasma2d" | "plasmawled" | "power" | "rain" | "rainbow" | "random_flash" | "real_strobe" | "scan" | "scan_and_flare" | "scan_multi" | "scroll" | "scroll_plus" | "singleColor" | "spectrum" | "strobe" | "texter2d" | "vumeter" | "water" | "waterfall2d" | "wavelength" | null;
  effect: Partial<ActiveEffectInVirtual>; 
}


// Response for GET /api/virtuals
export interface GetVirtualsApiResponse {
  status: "success" | "error";
  virtuals: Record<string, VirtualApiResponseItem>;
  paused: boolean;
  message?: string;
}


// Raw response for GET /api/virtuals/{{virtual_id}}
export interface GetSingleVirtualApiResponse {
  status: "success" | "error";
  [virtualId: string]: VirtualApiResponseItem | string | undefined; 
  message?: string;
}

// Transformed type for GET /api/virtuals/{virtual_id}
export type FetchedVirtualResult = 
  | { status: "success"; data: VirtualApiResponseItem }
  | { status: "error"; message: string };



// Represents a single Device object using specific config types
export interface DeviceInfo {
  config: DeviceConfigUnion;
  id: string;
  type: "adalight" | "artnet" | "ddp" | "dummy" | "e131" | "govee" | "hue" | "launchpad" | "lifx" | "nanoleaf" | "open_pixel_control" | "openrgb" | "osc" | "rpi_ws281x" | "udp" | "wled" | "zengee";
  online: boolean;
  virtuals: string[]; 
  active_virtuals: string[]; 
}


// Response for GET /api/devices using specific config types
export interface GetDevicesApiResponse {
  status: "success" | "error";
  devices: Record<string, DeviceInfo>;
  message?: string;
}

// Convenience Type Aliases using Universal Configs
export type Effect = Omit<Omit<ActiveEffectInVirtual, 'config'> & { config: EffectConfig }, 'type'> & { type?: EffectType | null };
export type Virtual = Omit<VirtualApiResponseItem, 'effect' | 'last_effect'> & { effect: Partial<Effect>; last_effect?: EffectType | null };
export type Virtuals = Omit<GetVirtualsApiResponse, 'virtuals'> & { virtuals: Record<string, Virtual> };
export type Device = Omit<DeviceInfo, 'config'> & { config: DeviceConfig };
export type Devices = Omit<GetDevicesApiResponse, 'devices'> & { devices: Record<string, Device> };

