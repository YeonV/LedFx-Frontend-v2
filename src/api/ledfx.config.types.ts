/**
 * AUTO-GENERATED from `ledfx --dump-schemas`. Do not edit.
 * Regenerate: yarn generate:types <schemas.json>
 */

/* eslint-disable */

/**
 * The persisted config.json (minus schema_version/configuration_version).
 */
export interface CoreConfig {
  host?: string;
  port?: number;
  port_s?: number;
  dev_mode?: boolean;
  devices?: DeviceEntry[];
  virtuals?: VirtualEntry[];
  audio?: AudioConfig;
  melbank_collection?: MelbankCollectionEntry[];
  melbanks?: MelbanksConfig;
  user_presets?: {
    [k: string]: {
      [k: string]: Preset;
    };
  };
  scenes?: {
    [k: string]: Scene;
  };
  playlists?: {
    [k: string]: Playlist;
  };
  integrations?: IntegrationEntry[];
  transmission_mode?: "compressed" | "uncompressed";
  visualisation_fps?: number;
  visualisation_maxlen?: number;
  /**
   * Changes to any virtual's transitions apply to all other virtuals
   */
  global_transitions?: boolean;
  user_colors?: {
    [k: string]: string;
  };
  user_gradients?: {
    [k: string]: string;
  };
  scan_on_startup?: boolean;
  create_segments?: boolean;
  flush_on_deactivate?: boolean;
  wled_preferences?: WledPreferences;
  global_brightness?: number;
  ui_brightness_boost?: number;
  startup_scene_id?: string;
  startup_playlist_id?: string;
  lifx_broadcast_address?: string;
  lifx_discovery_timeout?: number;
  instance_id?: string;
  sendspin_servers?: {
    [k: string]: SendspinServerConfig;
  };
  sendspin_always_on?: boolean;
  now_playing?: NowPlayingConfig;
  debug_asyncio?: boolean;
  image_cache?: ImageCacheConfig;
}
export interface DeviceEntry {
  id: string;
  type: string;
  config: {
    [k: string]: unknown;
  };
}
export interface VirtualEntry {
  id: string;
  config: VirtualConfig;
  segments?: unknown[][];
  is_device?: string | false;
  auto_generated?: boolean;
  active?: boolean | null;
  effect?: EffectEntry | null;
  effects?: {
    [k: string]: EffectEntry;
  };
  last_effect?: string | null;
}
export interface VirtualConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * Span: Effect spans all segments. Copy: Effect copied on each segment
   */
  mapping?: "span" | "copy";
  /**
   * Use complex segment mapping mode for performance
   */
  complex_segments?: boolean;
  /**
   * Number of physical pixels to combine into larger virtual pixel groups
   */
  grouping?: number;
  /**
   * Icon for the device*
   */
  icon_name?: string;
  /**
   * Max brightness for the device
   */
  max_brightness?: number;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Preview the pixels without updating the devices
   */
  preview_only?: boolean;
  /**
   * Length of transition between effects
   */
  transition_time?: number;
  /**
   * Type of transition between effects
   */
  transition_mode?: "Add" | "Dissolve" | "Push" | "Slide" | "Iris" | "Through White" | "Through Black" | "None";
  /**
   * Lowest frequency for this virtual's audio reactive effects
   */
  frequency_min?: number;
  /**
   * Highest frequency for this virtual's audio reactive effects
   */
  frequency_max?: number;
  /**
   * Amount of rows. > 1 if this virtual is a matrix
   */
  rows?: number;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
}
export interface EffectEntry {
  type: string;
  config?: {
    [k: string]: unknown;
  };
}
/**
 * Persisted audio section: input and analysis settings together.
 */
export interface AudioConfig {
  /**
   * Method to detect pitch
   */
  pitch_method?: "yinfft" | "yin" | "yinfast" | "schmitt" | "specacf";
  /**
   * Method used to detect onsets
   */
  onset_method?: "energy" | "hfc" | "complex" | "phase" | "wphase" | "specdiff" | "kl" | "mkl" | "specflux";
  /**
   * Pitch detection tolerance
   */
  pitch_tolerance?: number;
  sample_rate?: number;
  mic_rate?: number;
  fft_size?: number;
  min_volume?: number;
  audio_device?: number | null;
  audio_device_name?: string;
  /**
   * Add a delay to LedFx's output to sync with your audio. Useful for Bluetooth devices which typically have a short audio lag.
   */
  delay_ms?: number;
  [k: string]: unknown;
}
export interface MelbankCollectionEntry {
  id: string;
  config: MelbankConfig;
}
export interface MelbankConfig {
  name?: string | null;
  min_frequency?: number;
  max_frequency?: number;
  [k: string]: unknown;
}
export interface MelbanksConfig {
  samples?: number;
  peak_isolation?: number;
  coeffs_type?: "matt_mel" | "triangle" | "bark" | "mel" | "htk" | "scott" | "scott_mel";
  max_frequencies?: number[];
  min_frequency?: number;
  [k: string]: unknown;
}
export interface Preset {
  name: string;
  config?: {
    [k: string]: unknown;
  };
}
export interface Scene {
  name: string;
  scene_image?: string;
  scene_tags?: string | null;
  scene_puturl?: string | null;
  scene_payload?: string | null;
  scene_midiactivate?: string | null;
  virtuals?: {
    [k: string]: SceneVirtual;
  };
}
export interface SceneVirtual {
  type?: string | null;
  config?: {
    [k: string]: unknown;
  } | null;
  action?: string | null;
  preset?: string | null;
}
export interface Playlist {
  id: string;
  name: string;
  items: PlaylistItem[];
  default_duration_ms?: number;
  mode?: "sequence" | "shuffle";
  timing?: PlaylistTiming;
  tags?: unknown[];
  image?: string | null;
  [k: string]: unknown;
}
export interface PlaylistItem {
  scene_id: string;
  duration_ms?: number | null;
}
export interface PlaylistTiming {
  jitter?: Jitter;
  [k: string]: unknown;
}
export interface Jitter {
  enabled?: boolean;
  factor_min?: number;
  factor_max?: number;
  [k: string]: unknown;
}
export interface IntegrationEntry {
  id: string;
  type: string;
  active?: boolean;
  data?:
    | unknown[]
    | {
        [k: string]: unknown;
      };
  config?: {
    [k: string]: unknown;
  };
}
export interface WledPreferences {
  wled_preferred_mode?: WledStrSetting;
  realtime_gamma_enabled?: WledBoolSetting;
  force_max_brightness?: WledBoolSetting1;
  realtime_dmx_mode?: WledStrSetting1;
  start_universe_setting?: WledIntSetting;
  dmx_address_start?: WledIntSetting1;
  inactivity_timeout?: WledIntSetting2;
}
export interface WledStrSetting {
  setting?: string | null;
  user_enabled?: boolean | null;
}
export interface WledBoolSetting {
  setting?: boolean | null;
  user_enabled?: boolean | null;
}
export interface WledBoolSetting1 {
  setting?: boolean | null;
  user_enabled?: boolean | null;
}
export interface WledStrSetting1 {
  setting?: string | null;
  user_enabled?: boolean | null;
}
export interface WledIntSetting {
  setting?: number | null;
  user_enabled?: boolean | null;
}
export interface WledIntSetting1 {
  setting?: number | null;
  user_enabled?: boolean | null;
}
export interface WledIntSetting2 {
  setting?: number | null;
  user_enabled?: boolean | null;
}
export interface SendspinServerConfig {
  server_url?: string;
  client_name?: string;
}
export interface NowPlayingConfig {
  gradient?: NowPlayingGradient;
  track_text?: NowPlayingTrackText;
  album_art?: NowPlayingAlbumArt;
}
export interface NowPlayingGradient {
  enabled?: boolean;
  variant?: "led_safe" | "led_punchy" | "led_max";
  virtual_ids?: string[];
}
export interface NowPlayingTrackText {
  enabled?: boolean;
  duration?: number;
  virtual_ids?: string[];
  preset?: string;
}
export interface NowPlayingAlbumArt {
  enabled?: boolean;
  duration?: number;
  virtual_ids?: string[];
}
export interface ImageCacheConfig {
  max_size_mb?: number;
  max_items?: number;
  [k: string]: unknown;
}

export interface AdalightDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * COM port for Adalight compatible device
   */
  com_port?: string;
  /**
   * baudrate
   */
  baudrate?: number;
  /**
   * Number of individual pixels
   */
  pixel_count?: number;
  /**
   * Color order
   */
  color_order?: "RGB" | "RBG" | "GRB" | "BRG" | "GBR" | "BGR";
  [k: string]: unknown;
}

export interface ArtnetDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Number of individual pixels
   */
  pixel_count?: number;
  /**
   * DMX universe for the device
   */
  universe?: number;
  /**
   * Size of each DMX universe
   */
  packet_size?: number;
  /**
   * Channel bytes to insert before the RGB data
   */
  pre_amble?: string;
  /**
   * Channel bytes to insert after the RGB data
   */
  post_amble?: string;
  /**
   * Number of pixels to consume per device. Pre and post ambles are repeated per device. By default (0) all pixels will be used by one instance
   */
  pixels_per_device?: number;
  /**
   * The start address within the universe
   */
  dmx_start_address?: number;
  /**
   * Whether to use even packet size
   */
  even_packet_size?: boolean;
  /**
   * RGB data order mode, supported for physical hardware that just doesn't play by the rules
   */
  rgb_order?: "RGB" | "RBG" | "GRB" | "GBR" | "BRG" | "BGR";
  /**
   * White channel handling mode, if RGB leave as None. Commonly written as RGBW or RGBA
   */
  white_mode?: "None" | "Zero" | "Brighter" | "Accurate";
  /**
   * port
   */
  port?: number;
  [k: string]: unknown;
}

export interface DdpDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Number of individual pixels
   */
  pixel_count?: number;
  /**
   * Port for the UDP device
   */
  port?: number;
  /**
   * DDP destination ID (1=default, 2-249=custom, 250=config, 251=status, 254=DMX, 255=all)
   */
  destination_id?: number;
  [k: string]: unknown;
}

export interface DummyDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Number of individual pixels
   */
  pixel_count?: number;
  [k: string]: unknown;
}

export interface E131DeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Number of individual pixels
   */
  pixel_count?: number;
  /**
   * DMX universe for the device
   */
  universe?: number;
  /**
   * Size of each DMX universe
   */
  universe_size?: number;
  /**
   * Channel offset within the DMX universe
   */
  channel_offset?: number;
  /**
   * Priority given to the sACN packets for this device
   */
  packet_priority?: number;
  [k: string]: unknown;
}

export interface GoveeDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Number of segments (seen in app)
   */
  pixel_count?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Bypass check for device status check response on port 4003
   */
  ignore_status?: boolean;
  /**
   * Some archane setting to make the pixel pattern stretch to fit the device
   */
  stretch_to_fit?: boolean;
  [k: string]: unknown;
}

export interface HueDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
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
   */
  udp_port?: number;
  [k: string]: unknown;
}

export interface LaunchpadDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Number of individual pixels
   */
  pixel_count?: number;
  /**
   * Number of individual rows
   */
  rows?: number;
  /**
   * Icon for the device*
   */
  icon_name?: string;
  /**
   * Auto-Generate a virtual for each segments
   */
  create_segments?: boolean;
  /**
   * Dark and dangerous features of the damned
   */
  alpha_options?: boolean;
  /**
   * enable timing diagnostics in logger
   */
  diag?: boolean;
  [k: string]: unknown;
}

export interface LifxDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Number of pixels (auto-detected on connect)
   */
  pixel_count?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  [k: string]: unknown;
}

export interface NanoleafDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * port
   */
  port?: number;
  /**
   * port
   */
  udp_port?: number;
  /**
   * Auth token
   */
  auth_token?: string | null;
  /**
   * Streaming protocol to Nanoleaf device
   */
  sync_mode?: "TCP" | "UDP";
  [k: string]: unknown;
}

export interface OpenPixelControlDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Number of individual pixels
   */
  pixel_count?: number;
  /**
   * Channel to send pixel data
   */
  channel?: number;
  [k: string]: unknown;
}

export interface OpenrgbDeviceConfig {
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * ID of OpenRGB device (within OpenRGB).
   */
  openrgb_id?: number;
  /**
   * Number of individual pixels
   */
  pixel_count?: number;
  /**
   * Port for the UDP device
   */
  port?: number;
  [k: string]: unknown;
}

export interface OscDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Port of the OSC server
   */
  port?: number;
  /**
   * The amount of channels OR if address_type == Three_addresses then this is the amount of RGB subsequent addresses (set to 3 if your addresses are defined like R,G,B,R,G,B)
   */
  pixel_count?: number;
  /**
   * One_Argument -> <addr> [R, G, B]; Three_Arguments -> <addr> R G B; Three_Addresses -> <addr> R, <addr+1> G, <addr+2> B; All_To_One -> <addr> [[R, G, B], [R, G, B], [R, G, B]]
   */
  send_type?: "One_Argument" | "Three_Arguments" | "Three_Addresses" | "All_To_One";
  /**
   * Starting address/id of the OSC device
   */
  starting_addr?: number;
  /**
   * The OSC Path to send to - Placeholders: {address} -> this will start at the starting_addr and count up
   */
  path?: string;
  [k: string]: unknown;
}

export interface RpiWs281xDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Number of individual pixels
   */
  pixel_count?: number;
  /**
   * Raspberry Pi GPIO pin your LEDs are connected to
   */
  gpio_pin?: 10 | 12 | 13 | 18 | 21;
  /**
   * RGB data order mode, supported for physical hardware that just doesn't play by the rules
   */
  color_order?: "RGB" | "RBG" | "GRB" | "GBR" | "BRG" | "BGR";
  /**
   * White channel handling mode, if RGB leave as None. Commonly written as RGBW or RGBA
   */
  white_mode?: "None" | "Zero" | "Brighter" | "Accurate";
  [k: string]: unknown;
}

export interface TwinklySquaresDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Number of 8x8 Twinkly Squares panels
   */
  panel_count?: number;
  [k: string]: unknown;
}

export interface UdpDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Number of individual pixels
   */
  pixel_count?: number;
  /**
   * Port for the UDP device
   */
  port?: number;
  /**
   * RGB packet encoding
   */
  udp_packet_type?: "DRGB" | "WARLS" | "DRGBW" | "DNRGB" | "adaptive_smallest" | "RGB (HyperHDR)";
  /**
   * Seconds to wait after the last received packet to yield device control
   */
  timeout?: number;
  /**
   * Won't send updates if nothing has changed on the LED device
   */
  minimise_traffic?: boolean;
  [k: string]: unknown;
}

export interface WledDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Streaming protocol to WLED device. Recommended: DDP for 0.13 or later. Use UDP for older versions.
   */
  sync_mode?: "DDP" | "UDP" | "E131";
  /**
   * Time between LedFx effect off and WLED effect activate
   */
  timeout?: number;
  /**
   * Import WLED segments into LedFx
   */
  create_segments?: boolean;
  /**
   * Icon for the device*
   */
  icon_name?: string;
  [k: string]: unknown;
}

export interface ZengeeDeviceConfig {
  /**
   * Friendly name for the device
   */
  name: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * Hostname or IP address of the device
   */
  ip_address: string;
  /**
   * Number of individual pixels
   */
  pixel_count?: number;
  [k: string]: unknown;
}

export type DeviceType = "adalight" | "artnet" | "ddp" | "dummy" | "e131" | "govee" | "hue" | "launchpad" | "lifx" | "nanoleaf" | "open_pixel_control" | "openrgb" | "osc" | "rpi_ws281x" | "twinkly_squares" | "udp" | "wled" | "zengee"

export interface DeviceConfigByType {
  "adalight": AdalightDeviceConfig
  "artnet": ArtnetDeviceConfig
  "ddp": DdpDeviceConfig
  "dummy": DummyDeviceConfig
  "e131": E131DeviceConfig
  "govee": GoveeDeviceConfig
  "hue": HueDeviceConfig
  "launchpad": LaunchpadDeviceConfig
  "lifx": LifxDeviceConfig
  "nanoleaf": NanoleafDeviceConfig
  "open_pixel_control": OpenPixelControlDeviceConfig
  "openrgb": OpenrgbDeviceConfig
  "osc": OscDeviceConfig
  "rpi_ws281x": RpiWs281xDeviceConfig
  "twinkly_squares": TwinklySquaresDeviceConfig
  "udp": UdpDeviceConfig
  "wled": WledDeviceConfig
  "zengee": ZengeeDeviceConfig
}

export type DeviceSpecificConfig = DeviceConfigByType[DeviceType]

export interface DeviceConfig {
  type?:
    | "adalight"
    | "artnet"
    | "ddp"
    | "dummy"
    | "e131"
    | "govee"
    | "hue"
    | "launchpad"
    | "lifx"
    | "nanoleaf"
    | "open_pixel_control"
    | "openrgb"
    | "osc"
    | "rpi_ws281x"
    | "twinkly_squares"
    | "udp"
    | "wled"
    | "zengee";
  /**
   * Friendly name for the device
   */
  name?: string;
  /**
   * https://material-ui.com/components/material-icons/
   */
  icon_name?: string;
  /**
   * Number of pixels from the perceived center of the device
   */
  center_offset?: number;
  /**
   * Target rate that pixels are sent to the device
   */
  refresh_rate?: number;
  /**
   * COM port for Adalight compatible device
   */
  com_port?: string;
  /**
   * baudrate
   */
  baudrate?: number;
  /**
   * Number of individual pixels
   */
  pixel_count?: number;
  /**
   * Color order
   */
  color_order?: "RGB" | "RBG" | "GRB" | "BRG" | "GBR" | "BGR";
  /**
   * Hostname or IP address of the device
   */
  ip_address?: string;
  /**
   * DMX universe for the device
   */
  universe?: number;
  /**
   * Size of each DMX universe
   */
  packet_size?: number;
  /**
   * Channel bytes to insert before the RGB data
   */
  pre_amble?: string;
  /**
   * Channel bytes to insert after the RGB data
   */
  post_amble?: string;
  /**
   * Number of pixels to consume per device. Pre and post ambles are repeated per device. By default (0) all pixels will be used by one instance
   */
  pixels_per_device?: number;
  /**
   * The start address within the universe
   */
  dmx_start_address?: number;
  /**
   * Whether to use even packet size
   */
  even_packet_size?: boolean;
  /**
   * RGB data order mode, supported for physical hardware that just doesn't play by the rules
   */
  rgb_order?: "RGB" | "RBG" | "GRB" | "GBR" | "BRG" | "BGR";
  /**
   * White channel handling mode, if RGB leave as None. Commonly written as RGBW or RGBA
   */
  white_mode?: "None" | "Zero" | "Brighter" | "Accurate";
  /**
   * port
   */
  port?: number;
  /**
   * DDP destination ID (1=default, 2-249=custom, 250=config, 251=status, 254=DMX, 255=all)
   */
  destination_id?: number;
  /**
   * Size of each DMX universe
   */
  universe_size?: number;
  /**
   * Channel offset within the DMX universe
   */
  channel_offset?: number;
  /**
   * Priority given to the sACN packets for this device
   */
  packet_priority?: number;
  /**
   * Bypass check for device status check response on port 4003
   */
  ignore_status?: boolean;
  /**
   * Some archane setting to make the pixel pattern stretch to fit the device
   */
  stretch_to_fit?: boolean;
  /**
   * Entertainment zone group name
   */
  group_name?: string;
  /**
   * port
   */
  udp_port?: number;
  /**
   * Number of individual rows
   */
  rows?: number;
  /**
   * Auto-Generate a virtual for each segments
   */
  create_segments?: boolean;
  /**
   * Dark and dangerous features of the damned
   */
  alpha_options?: boolean;
  /**
   * enable timing diagnostics in logger
   */
  diag?: boolean;
  /**
   * Auth token
   */
  auth_token?: string | null;
  /**
   * Streaming protocol to Nanoleaf device
   */
  sync_mode?: "TCP" | "UDP";
  /**
   * Channel to send pixel data
   */
  channel?: number;
  /**
   * ID of OpenRGB device (within OpenRGB).
   */
  openrgb_id?: number;
  /**
   * One_Argument -> <addr> [R, G, B]; Three_Arguments -> <addr> R G B; Three_Addresses -> <addr> R, <addr+1> G, <addr+2> B; All_To_One -> <addr> [[R, G, B], [R, G, B], [R, G, B]]
   */
  send_type?: "One_Argument" | "Three_Arguments" | "Three_Addresses" | "All_To_One";
  /**
   * Starting address/id of the OSC device
   */
  starting_addr?: number;
  /**
   * The OSC Path to send to - Placeholders: {address} -> this will start at the starting_addr and count up
   */
  path?: string;
  /**
   * Raspberry Pi GPIO pin your LEDs are connected to
   */
  gpio_pin?: 10 | 12 | 13 | 18 | 21;
  /**
   * Number of 8x8 Twinkly Squares panels
   */
  panel_count?: number;
  /**
   * RGB packet encoding
   */
  udp_packet_type?: "DRGB" | "WARLS" | "DRGBW" | "DNRGB" | "adaptive_smallest" | "RGB (HyperHDR)";
  /**
   * Seconds to wait after the last received packet to yield device control
   */
  timeout?: number;
  /**
   * Won't send updates if nothing has changed on the LED device
   */
  minimise_traffic?: boolean;
  [k: string]: unknown;
}

export interface MqttIntegrationConfig {
  /**
   * Name of this integration instance and associated settings
   */
  name?: string;
  /**
   * Description of this integration
   */
  topic?: string;
  /**
   * MQTT ip address
   */
  ip_address?: string;
  /**
   * MQTT port
   */
  port?: number;
  /**
   * MQTT username
   */
  username?: string;
  /**
   * MQTT password
   */
  password?: string;
  [k: string]: unknown;
}

export interface MqttHassIntegrationConfig {
  /**
   * Name of this HomeAssistant instance
   */
  name?: string;
  /**
   * HomeAssistant's discovery prefix
   */
  topic?: string;
  /**
   * MQTT ip address
   */
  ip_address?: string;
  /**
   * MQTT port
   */
  port?: number;
  /**
   * MQTT username
   */
  username?: string;
  /**
   * MQTT password
   */
  password?: string;
  /**
   * Internal Description
   */
  description?: string;
  [k: string]: unknown;
}

export interface QlcIntegrationConfig {
  /**
   * Name of this integration instance and associated settings
   */
  name?: string;
  /**
   * Description of this integration
   */
  description?: string;
  /**
   * QLC+ ip address
   */
  ip_address?: string;
  /**
   * QLC+ port
   */
  port?: number;
  [k: string]: unknown;
}

export interface SpotifyIntegrationConfig {
  /**
   * Name of this integration instance and associated settings
   */
  name?: string;
  /**
   * Description of this integration
   */
  description?: string;
  [k: string]: unknown;
}

export type IntegrationType = "mqtt" | "mqtt_hass" | "qlc" | "spotify"

export interface IntegrationConfigByType {
  "mqtt": MqttIntegrationConfig
  "mqtt_hass": MqttHassIntegrationConfig
  "qlc": QlcIntegrationConfig
  "spotify": SpotifyIntegrationConfig
}

export type IntegrationSpecificConfig = IntegrationConfigByType[IntegrationType]

export interface IntegrationConfig {
  type?: "mqtt" | "mqtt_hass" | "qlc" | "spotify";
  /**
   * Name of this integration instance and associated settings
   */
  name?: string;
  /**
   * Description of this integration
   */
  topic?: string;
  /**
   * MQTT ip address
   */
  ip_address?: string;
  /**
   * MQTT port
   */
  port?: number;
  /**
   * MQTT username
   */
  username?: string;
  /**
   * MQTT password
   */
  password?: string;
  /**
   * Internal Description
   */
  description?: string;
  [k: string]: unknown;
}

export interface BandsEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Number of bands
   */
  band_count?: number;
  /**
   * Alignment of bands
   */
  align?: "left" | "right" | "invert" | "center";
  [k: string]: unknown;
}

export interface BandsMatrixEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Number of bands
   */
  band_count?: number;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Flip Gradient
   */
  flip_gradient?: boolean;
  /**
   * Flip horizontally
   */
  flip_horizontal?: boolean;
  [k: string]: unknown;
}

export interface BarEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Choose from different animations
   */
  mode?: "bounce" | "wipe" | "in-out";
  /**
   * Acceleration profile of bar
   */
  ease_method?: "ease_in_out" | "ease_in" | "ease_out" | "linear";
  /**
   * Amount of color change per beat
   */
  color_step?: number;
  /**
   * Skips odd or even beats
   */
  beat_skip?: "none" | "odds" | "even";
  /**
   * Offset the beat
   */
  beat_offset?: number;
  /**
   * If skipping beats, skip every
   */
  skip_every?: 1 | 2;
  [k: string]: unknown;
}

export interface BladePowerPlusEffectConfig {
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Use perceptually even hue distribution
   */
  fix_hues?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Rate of color decay
   */
  decay?: number;
  /**
   * Make the reactive bar bigger/smaller
   */
  multiplier?: number;
  /**
   * Color of Background
   */
  background_color?: string;
  /**
   * Frequency range for the beat detection
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  [k: string]: unknown;
}

export interface BleepEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * mirror effect
   */
  mirror_effect?: boolean;
  /**
   * Use gradient in power dimension instead of time
   */
  grad_power?: boolean;
  /**
   * Time to scroll the bleep
   */
  scroll_time?: number;
  /**
   * Frequency range for the beat detection
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * How to plot the data
   */
  draw?: "Points" | "Lines" | "Fill";
  /**
   * How many historical points to capture
   */
  points?: number;
  /**
   * Line width only
   */
  size?: number;
  [k: string]: unknown;
}

export interface BlenderEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * How to stretch the mask source pixles to the effect pixels
   */
  mask_stretch?: "2d full" | "2d tile";
  /**
   * How to stretch the background source pixles to the effect pixels
   */
  background_stretch?: "2d full" | "2d tile";
  /**
   * How to stretch the foreground source pixles to the effect pixels
   */
  foreground_stretch?: "2d full" | "2d tile";
  /**
   * The virtual from which to source the mask
   */
  mask?: string;
  /**
   * The virtual from which to source the foreground
   */
  foreground?: string;
  /**
   * The virtual from which to source the background
   */
  background?: string;
  /**
   * Switch Foreground and Background
   */
  invert_mask?: boolean;
  /**
   * 1 default = luminance as alpha, anything below 1 is mask cutoff
   */
  mask_cutoff?: number;
  [k: string]: unknown;
}

export interface BlockReflectionsEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Use perceptually even hue distribution
   */
  fix_hues?: boolean;
  /**
   * Effect Speed modifier
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   */
  reactivity?: number;
  [k: string]: unknown;
}

export interface BlocksEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Number of color blocks
   */
  block_count?: number;
  [k: string]: unknown;
}

export interface CloneEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Source screen for grab
   */
  screen?: number;
  /**
   * pixels down offset of grab
   */
  down?: number;
  /**
   * pixels across offset of grab
   */
  across?: number;
  /**
   * width of grab
   */
  width?: number;
  /**
   * height of grab
   */
  height?: number;
  [k: string]: unknown;
}

export interface ConcentricEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Frequency range for beat detection
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Invert propagation direction
   */
  invert?: boolean;
  /**
   * Frequency range's power multiplier
   */
  power_multiplier?: number;
  /**
   * Scales the gradient
   */
  gradient_scale?: number;
  /**
   * Stretches the gradient vertically
   */
  stretch_height?: number;
  /**
   * Soften the center point
   */
  center_smoothing?: number;
  /**
   * Idle motion speed
   */
  idle_speed?: number;
  [k: string]: unknown;
}

export interface CrawlerEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Use perceptually even hue distribution
   */
  fix_hues?: boolean;
  /**
   * Effect Speed modifier
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   */
  reactivity?: number;
  /**
   * Sway modifier
   */
  sway?: number;
  /**
   * Chop modifier
   */
  chop?: number;
  /**
   * Stretch modifier
   */
  stretch?: number;
  [k: string]: unknown;
}

export interface Digitalrain2dEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Number of code lines in the matrix as a multiplier of matrix pixel width
   */
  count?: number;
  /**
   * Number of code lines to add per second
   */
  add_speed?: number;
  /**
   * Width of code lines as % of matrix
   */
  width?: number;
  /**
   * Minimum number of seconds for a code line to run from top to bottom
   */
  run_seconds?: number;
  /**
   * Code line tail length as a % of the matrix
   */
  tail?: number;
  /**
   * Number of tail segments
   */
  tail_segments?: number;
  /**
   * Decay filter applied to the impulse for development
   */
  impulse_decay?: number;
  /**
   * audio injection multiplier, 0 is none
   */
  multiplier?: number;
  [k: string]: unknown;
}

export interface EnergyEffectConfig {
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Change colors in time with the beat
   */
  color_cycler?: boolean;
  /**
   * Color of low, bassy sounds
   */
  color_lows?: string;
  /**
   * Color of midrange sounds
   */
  color_mids?: string;
  /**
   * Color of high sounds
   */
  color_high?: string;
  /**
   * Responsiveness to changes in sound
   */
  sensitivity?: number;
  /**
   * Mode of combining each frequencies' colors
   */
  mixing_mode?: "additive" | "overlap";
  [k: string]: unknown;
}

export interface Energy2EffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Use perceptually even hue distribution
   */
  fix_hues?: boolean;
  /**
   * Effect Speed modifier
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   */
  reactivity?: number;
  [k: string]: unknown;
}

export interface EqualizerEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Alignment of bands
   */
  align?: "left" | "right" | "invert" | "center";
  /**
   * Repeat the gradient into segments
   */
  gradient_repeat?: number;
  [k: string]: unknown;
}

export interface Equalizer2dEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Size of the tracer bar that follows a filtered value
   */
  peak_percent?: number;
  /**
   * Decay filter applied to the peak value
   */
  peak_decay?: number;
  /**
   * Turn on white peak markers that follow a freq value filtered with decay
   */
  peak_marks?: boolean;
  /**
   * Peak mark color
   */
  peak_color?: string;
  /**
   * Center the equalizer bar
   */
  center?: boolean;
  /**
   * Use max or mean value for bar size
   */
  max_vs_mean?: boolean;
  /**
   * Why be so square?
   */
  ring?: boolean;
  /**
   * Weeeeeeeeeee
   */
  spin?: boolean;
  /**
   * Number of freq bands
   */
  bands?: number;
  /**
   * Frequency range for spin impulse
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Spin impulse multiplier
   */
  spin_multiplier?: number;
  /**
   * Decay filter applied to the spin impulse
   */
  spin_decay?: number;
  /**
   * Color bars by power level: various algorithms
   */
  power_gradient?: "Off" | "Solid" | "Progressive" | "Stretch";
  /**
   * Enable default melbank pipeline filtering
   */
  filtered?: boolean;
  [k: string]: unknown;
}

export interface FadeEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Rate of change of color
   */
  speed?: number;
  [k: string]: unknown;
}

export interface FilterEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Simple color selector
   */
  color?: string;
  /**
   * Frequency range for derived brightness
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Use gradient instead of color
   */
  use_gradient?: boolean;
  /**
   * 0= no gradient roll, range 60 secs to 1 sec
   */
  roll_speed?: number;
  /**
   * Boost the brightness of the effect on a parabolic curve
   */
  boost?: number;
  [k: string]: unknown;
}

export interface FireEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Use perceptually even hue distribution
   */
  fix_hues?: boolean;
  speed?: number;
  color_shift?: number;
  intensity?: number;
  fade_chance?: number;
  [k: string]: unknown;
}

export interface Flame2dEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Particles spawn rate
   */
  spawn_rate?: number;
  /**
   * Trips to top per second
   */
  velocity?: number;
  /**
   * Application of the audio power input
   */
  intensity?: number;
  /**
   * Blur radius in pixels
   */
  blur_amount?: number;
  /**
   * low band flame
   */
  low_band?: string;
  /**
   * mid band flame
   */
  mid_band?: string;
  /**
   * high band flame
   */
  high_band?: string;
  [k: string]: unknown;
}

export interface FrontendEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  [k: string]: unknown;
}

export interface GameOfLifeEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Check for and correct common unhealthy states
   */
  health_checks?: "All" | "Dead" | "Oscillating" | "None";
  /**
   * Base number of steps per second to run
   */
  base_game_speed?: number;
  /**
   * Number of seconds between health checks
   */
  health_check_interval?: number;
  /**
   * Frequency range for life generation impulse
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Generate entities on beat
   */
  beat_inject?: boolean;
  /**
   * Decay filter applied to the life generation impulse
   */
  impulse_decay?: number;
  [k: string]: unknown;
}

export interface GifplayerEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * What strategy to use when resizing GIF
   */
  resize_method?: "Fastest" | "Fast" | "Slow" | "Slowest";
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Load GIF from URL/local file
   */
  image_location?: string;
  /**
   * Bounce the GIF instead of looping
   */
  bounce?: boolean;
  /**
   * How fast to play the gif
   */
  gif_fps?: number;
  [k: string]: unknown;
}

export interface GlitchEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Use perceptually even hue distribution
   */
  fix_hues?: boolean;
  /**
   * Effect Speed modifier
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   */
  reactivity?: number;
  /**
   * Ensure the saturation is above this value
   */
  saturation_threshold?: number;
  [k: string]: unknown;
}

export interface GradientEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Brightness modulation
   */
  modulate?: boolean;
  /**
   * Choose an animation
   */
  modulation_effect?: "sine" | "breath";
  /**
   * Animation speed
   */
  modulation_speed?: number;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Speed of the effect
   */
  speed?: number;
  [k: string]: unknown;
}

export interface HierarchyEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color of low, bassy sounds
   */
  color_lows?: string;
  /**
   * Color of midrange sounds
   */
  color_mids?: string;
  /**
   * Color of high sounds
   */
  color_high?: string;
  /**
   * Boost the brightness of the effect on a parabolic curve
   */
  brightness_boost?: number;
  /**
   * If Lows are below this value, Mids are used.
   */
  threshold_lows?: number;
  /**
   * If Mids are below this value, Highs are used
   */
  threshold_mids?: number;
  /**
   * Time Lows/Mids have to be below threshold before switch
   */
  switch_time?: number;
  [k: string]: unknown;
}

export interface ImagespinEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * use a test pattern
   */
  pattern?: boolean;
  /**
   * Frequency range for the beat detection
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Applied to the audio input to amplify effect
   */
  multiplier?: number;
  /**
   * The minimum size multiplier for the image
   */
  min_size?: number;
  /**
   * default NEAREST, use BILINEAR for smoother scaling, expensive on runtime takes a few ms
   */
  bilinear?: boolean;
  /**
   * spin image according to filter impulse
   */
  spin?: boolean;
  /**
   * When spinning the image, force fit to frame, or allow clipping
   */
  clip?: boolean;
  /**
   * Load image from
   */
  image_source?: string;
  /**
   * Configuration for Album art display
   */
  album_art?: boolean;
  [k: string]: unknown;
}

export interface Keybeat2dEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * What strategy to use when resizing GIF
   */
  resize_method?: "Fastest" | "Fast" | "Slow" | "Slowest";
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Percentage of original to matrix width
   */
  stretch_horizontal?: number;
  /**
   * Percentage of original to matrix height
   */
  stretch_vertical?: number;
  /**
   * Center offset in horizontal direction percent of matrix width
   */
  center_horizontal?: number;
  /**
   * Center offset in vertical direction percent of matrix height
   */
  center_vertical?: number;
  /**
   * Load gif from url or path
   */
  image_location?: string;
  /**
   * Frame index to interpolate beats between
   */
  beat_frames?: string;
  /**
   * Frames to remove from gif animation
   */
  skip_frames?: string;
  /**
   * Diagnostic overlayed on matrix
   */
  deep_diag?: boolean;
  /**
   * Trigger test code with 0.05 beat per frame
   */
  fake_beat?: boolean;
  /**
   * Preserve aspect ratio if force fit
   */
  keep_aspect_ratio?: boolean;
  /**
   * Force fit to matrix
   */
  force_fit?: boolean;
  /**
   * When ping pong, skip the first beat key frame on both ends, use when key beat frames are very close to start and ends only
   */
  ping_pong_skip?: boolean;
  /**
   * Play gif forward and reverse, not just loop
   */
  ping_pong?: boolean;
  /**
   * half the beat input impulse, slow things down
   */
  half_beat?: boolean;
  /**
   * Image brightness
   */
  image_brightness?: number;
  [k: string]: unknown;
}

export interface LavaLampEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Use perceptually even hue distribution
   */
  fix_hues?: boolean;
  /**
   * Effect Speed modifier
   */
  speed?: number;
  /**
   * Difference between lighter and darker spots
   */
  contrast?: number;
  /**
   * Audio Reactive modifier
   */
  reactivity?: number;
  [k: string]: unknown;
}

export interface MagnitudeEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Frequency range for the beat detection
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  [k: string]: unknown;
}

export interface MarchingEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Use perceptually even hue distribution
   */
  fix_hues?: boolean;
  /**
   * Effect Speed modifier
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   */
  reactivity?: number;
  [k: string]: unknown;
}

export interface MeltEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Use perceptually even hue distribution
   */
  fix_hues?: boolean;
  /**
   * Effect Speed modifier
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   */
  reactivity?: number;
  [k: string]: unknown;
}

export interface MeltAndSparkleEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Use perceptually even hue distribution
   */
  fix_hues?: boolean;
  /**
   * Effect Speed modifier
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   */
  reactivity?: number;
  /**
   * Brightness of the melt effect
   */
  bg_bright?: number;
  /**
   * Size of the melting lava sections
   */
  lava_width?: number;
  /**
   * Cutoff for quiet sounds. Higher -> only loud sounds are detected
   */
  strobe_threshold?: number;
  /**
   * Higher numbers -> more strobes
   */
  strobe_rate?: number;
  /**
   * Percussive strobe width, from one pixel to the full length
   */
  strobe_width?: number;
  /**
   * Percussive strobe decay rate. Higher -> decays faster.
   */
  strobe_decay_rate?: number;
  /**
   * How much to blur the strobes
   */
  strobe_blur?: number;
  [k: string]: unknown;
}

export interface MetroEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Time between flash in seconds
   */
  pulse_period?: number;
  /**
   * Flash to blank ratio
   */
  pulse_ratio?: number;
  /**
   * Steps of pattern division to loop
   */
  steps?: number;
  /**
   * Background color
   */
  background_color?: string;
  /**
   * Flash color
   */
  flash_color?: string;
  /**
   * graph capture, on to start, off to dump
   */
  capture?: boolean;
  /**
   * Window over which to measure CPU usage
   */
  cpu_secs?: number;
  [k: string]: unknown;
}

export interface MultibarEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Choose from different animations
   */
  mode?: "cascade" | "wipe";
  /**
   * Acceleration profile of bar
   */
  ease_method?: "ease_in_out" | "ease_in" | "ease_out" | "linear";
  /**
   * Amount of color change per beat
   */
  color_step?: number;
  [k: string]: unknown;
}

export interface Noise2dEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Speed of the effect
   */
  speed?: number;
  /**
   * intensity of the effect
   */
  intensity?: number;
  /**
   * Stretch of the effect
   */
  stretch?: number;
  /**
   * zoom density
   */
  zoom?: number;
  /**
   * Decay filter applied to the impulse for development
   */
  impulse_decay?: number;
  /**
   * audio injection multiplier, 0 is none
   */
  multiplier?: number;
  [k: string]: unknown;
}

export interface NumberEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * apply alpha effect to text
   */
  alpha?: boolean;
  /**
   * Text effect specific option switch
   */
  option_1?: boolean;
  /**
   * Text effect specific option switch
   */
  option_2?: boolean;
  /**
   * general value slider for text effects
   */
  value_option_1?: number;
  /**
   * Font to render text with
   */
  font?:
    | "Roboto Regular"
    | "Roboto Bold"
    | "Roboto Black"
    | "Stop"
    | "Technique"
    | "8bitOperatorPlus8"
    | "Press Start 2P"
    | "Blade-5x8";
  /**
   * Your text to display
   */
  text?: string;
  /**
   * Font size as a percentage of the display height, fonts are unpredictable!
   */
  height_percent?: number;
  /**
   * Color of text
   */
  text_color?: string;
  /**
   * What aliasing strategy to use when manipulating text elements
   */
  resize_method?: "Fastest" | "Fast" | "Slow";
  /**
   * Text effect to apply to configuration
   */
  text_effect?: "Side Scroll" | "Spokes" | "Carousel" | "Wave" | "Pulse" | "Fade";
  /**
   * Diagnostic overlayed on matrix
   */
  deep_diag?: boolean;
  /**
   * Use gradient for word colors
   */
  use_gradient?: boolean;
  /**
   * Decay filter applied to the impulse for development
   */
  impulse_decay?: number;
  /**
   * multiplier of audio effect injection
   */
  multiplier?: number;
  /**
   * general speed slider for text effects
   */
  speed_option_1?: number;
  /**
   * Source of the value to display
   */
  value_source?: "BPM" | "BPM Confidence" | "Time (HH:MM)" | "Time (HH:MM:SS)";
  /**
   * Number of digits to reserve before decimal point (for stable text size)
   */
  whole_digits?: number;
  /**
   * Number of digits to display after decimal point (for stable text size)
   */
  decimal_digits?: number;
  /**
   * Support negative values (include negative sign in sizing)
   */
  negative?: boolean;
  [k: string]: unknown;
}

export interface PitchspectrumEffectConfig {
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Rate at which notes fade
   */
  fade_rate?: number;
  /**
   * Responsiveness to note changes
   */
  responsiveness?: number;
  [k: string]: unknown;
}

export interface PixelsEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Locked to 20 fps
   */
  speed?: number;
  /**
   * Time between each pixel step to light up
   */
  step_period?: number;
  /**
   * Number of pixels each step
   */
  pixels?: number;
  /**
   * Background color
   */
  background_color?: string;
  /**
   * Pixel color to light up
   */
  pixel_color?: string;
  /**
   * Single or building pixels
   */
  build_up?: boolean;
  /**
   * Restart effect on color change, for transitions
   */
  color_blend?: boolean;
  [k: string]: unknown;
}

export interface Plasma2dEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Frequency range for the beat detection
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Lets pretend its vertical density
   */
  density_vertical?: number;
  /**
   * Like a slice of lemon
   */
  twist?: number;
  /**
   * If you squint its the distance from the center
   */
  radius?: number;
  /**
   * kinda how small the plasma is, but who realy knows
   */
  density?: number;
  /**
   * lower band of density
   */
  lower?: number;
  [k: string]: unknown;
}

export interface PlasmawledEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Frequency range for the beat detection
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Speed multiplier
   */
  speed?: number;
  /**
   * Smaller is less block in horizontal dimension
   */
  stretch_horizontal?: number;
  /**
   * Smaller is less block in vertical dimension
   */
  stretch_vertical?: number;
  /**
   * Sound to size multiplier
   */
  size_multiplication?: number;
  /**
   * Sound to speed multiplier
   */
  speed_multiplication?: number;
  [k: string]: unknown;
}

export interface PowerEffectConfig {
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flash on percussive hits
   */
  sparks_color?: string;
  /**
   * Bass decay rate. Higher -> decays faster.
   */
  bass_decay_rate?: number;
  /**
   * Sparks decay rate. Higher -> decays faster.
   */
  sparks_decay_rate?: number;
  [k: string]: unknown;
}

export interface RadialEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * The virtual from which to source the 1d pixels
   */
  source_virtual?: string;
  /**
   * Edges count of mapping
   */
  edges?: number;
  /**
   * X offset for center point
   */
  x_offset?: number;
  /**
   * Y offset for center point
   */
  y_offset?: number;
  /**
   * twist that thing
   */
  twist?: number;
  /**
   * Use polygonal or radial lobes
   */
  polygon?: boolean;
  /**
   * static rotation
   */
  rotation?: number;
  /**
   * Spin the radial effect to the audio impulse
   */
  spin?: number;
  /**
   * Frequency range for the spin impulse
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * pull polygon points to star shape
   */
  star?: number;
  [k: string]: unknown;
}

export interface RainEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * color for low sounds, ie beats
   */
  lows_color?: string;
  /**
   * Pulse the entire strip to the beat
   */
  pulse_strip?: "Off" | "Lows" | "Mids" | "Highs";
  /**
   * color for mid sounds, ie vocals
   */
  mids_color?: string;
  /**
   * color for high sounds, ie hi hat
   */
  high_color?: string;
  /**
   * Sensitivity to low sounds
   */
  lows_sensitivity?: number;
  /**
   * Sensitivity to mid sounds
   */
  mids_sensitivity?: number;
  /**
   * Sensitivity to high sounds
   */
  high_sensitivity?: number;
  /**
   * Droplet animation style
   */
  raindrop_animation?: "Blob" | "Laser" | "Ripple";
  [k: string]: unknown;
}

export interface RainbowEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Speed of the effect
   */
  speed?: number;
  /**
   * Frequency of the effect curve
   */
  frequency?: number;
  [k: string]: unknown;
}

export interface RandomFlashEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Speed of the effect
   */
  speed?: number;
  /**
   * Hit color
   */
  hit_color?: string;
  /**
   * Hit duration
   */
  hit_duration?: number;
  /**
   * Probability of hit per second
   */
  hit_probability_per_sec?: number;
  /**
   * Hit size relative to LED strip
   */
  hit_relative_size?: number;
  [k: string]: unknown;
}

export interface RealStrobeEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Color scheme for bass strobe to cycle through
   */
  gradient?: string;
  /**
   * Amount of color change per bass strobe
   */
  color_step?: number;
  /**
   * Bass strobe decay rate. Higher -> decays faster.
   */
  bass_strobe_decay_rate?: number;
  /**
   * color for percussive strobes
   */
  strobe_color?: string;
  /**
   * Percussive strobe width, in pixels
   */
  strobe_width?: number;
  /**
   * Percussive strobe decay rate. Higher -> decays faster.
   */
  strobe_decay_rate?: number;
  /**
   * color shift delay for percussive strobes. Lower -> more shifts
   */
  color_shift_delay?: number;
  [k: string]: unknown;
}

export interface ScanEffectConfig {
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Brightness modulation
   */
  modulate?: boolean;
  /**
   * Choose an animation
   */
  modulation_effect?: "sine" | "breath";
  /**
   * Animation speed
   */
  modulation_speed?: number;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * bounce the scan
   */
  bounce?: boolean;
  /**
   * Width of scan eye in %
   */
  scan_width?: number;
  /**
   * Scan base % per second
   */
  speed?: number;
  /**
   * Color of scan
   */
  color_scan?: string;
  /**
   * Frequency range for the beat detection
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Speed impact multiplier
   */
  multiplier?: number;
  /**
   * Adjust color intensity based on audio power
   */
  color_intensity?: boolean;
  /**
   * Use colors from gradient selector
   */
  use_grad?: boolean;
  /**
   * spread the gradient colors across the scan
   */
  full_grad?: boolean;
  /**
   * Number of scan to render
   */
  count?: number;
  [k: string]: unknown;
}

export interface ScanAndFlareEffectConfig {
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * bounce the scan
   */
  bounce?: boolean;
  /**
   * Width of scan eye in %
   */
  scan_width?: number;
  /**
   * Scan base % per second
   */
  speed?: number;
  /**
   * max number of sparkles
   */
  sparkles_max?: number;
  /**
   * of scan size
   */
  sparkles_size?: number;
  /**
   * secs to die off
   */
  sparkles_time?: number;
  /**
   * level to trigger
   */
  sparkles_threshold?: number;
  /**
   * Color of scan
   */
  color_scan?: string;
  /**
   * Frequency range for the beat detection
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * Speed impact multiplier
   */
  multiplier?: number;
  /**
   * Adjust color intensity based on audio power
   */
  color_intensity?: boolean;
  /**
   * Use colors from gradient selector
   */
  use_grad?: boolean;
  [k: string]: unknown;
}

export interface ScanMultiEffectConfig {
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * bounce the scan
   */
  bounce?: boolean;
  /**
   * Width of scan eye in %
   */
  scan_width?: number;
  /**
   * Scan base % per second
   */
  speed?: number;
  /**
   * Color of low power scan
   */
  color_low?: string;
  /**
   * Color of mid power scan
   */
  color_mid?: string;
  /**
   * Color of high power scan
   */
  color_high?: string;
  /**
   * Speed impact multiplier
   */
  multiplier?: number;
  /**
   * Adjust color intensity based on audio power
   */
  color_intensity?: boolean;
  /**
   * Use colors from gradient selector
   */
  use_grad?: boolean;
  /**
   * Audio processing source for low, mid, high
   */
  input_source?: "Power" | "Melbank";
  /**
   * Filter damping on attack, lower number is more
   */
  attack?: number;
  /**
   * Filter damping on decay, lower number is more
   */
  decay?: number;
  /**
   * Enable damping filters on attack and decay
   */
  filter?: boolean;
  [k: string]: unknown;
}

export interface ScrollEffectConfig {
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Speed of the effect
   */
  speed?: number;
  /**
   * Decay rate of the scroll
   */
  decay?: number;
  /**
   * Cutoff for quiet sounds. Higher -> only loud sounds are detected
   */
  threshold?: number;
  /**
   * Color of low, bassy sounds
   */
  color_lows?: string;
  /**
   * Color of midrange sounds
   */
  color_mids?: string;
  /**
   * Color of high sounds
   */
  color_high?: string;
  [k: string]: unknown;
}

export interface ScrollPlusEffectConfig {
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Device width to scroll per second
   */
  scroll_per_sec?: number;
  /**
   * Decay rate of the scroll per second, kind of
   */
  decay_per_sec?: number;
  /**
   * Cutoff for quiet sounds. Higher -> only loud sounds are detected
   */
  threshold?: number;
  /**
   * Color of low, bassy sounds
   */
  color_lows?: string;
  /**
   * Color of midrange sounds
   */
  color_mids?: string;
  /**
   * Color of high sounds
   */
  color_high?: string;
  [k: string]: unknown;
}

export interface SinglecolorEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Brightness modulation
   */
  modulate?: boolean;
  /**
   * Choose an animation
   */
  modulation_effect?: "sine" | "breath";
  /**
   * Animation speed
   */
  modulation_speed?: number;
  /**
   * Speed of the effect
   */
  speed?: number;
  /**
   * Color of strip
   */
  color?: string;
  [k: string]: unknown;
}

export interface Smoke2dEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Speed of movement through noise space
   */
  speed?: number;
  /**
   * Stretch of the noise before mapping to gradient (contrast-like)
   */
  stretch?: number;
  /**
   * Zoom density (higher = denser detail)
   */
  zoom?: number;
  /**
   * Decay filter applied to the impulse for development
   */
  impulse_decay?: number;
  /**
   * Audio injection multiplier, 0 is none
   */
  multiplier?: number;
  [k: string]: unknown;
}

export interface Soap2dEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Smear amplitude [0..1]
   */
  density?: number;
  /**
   * Motion speed (time-invariant) [0..1]
   */
  speed?: number;
  /**
   * Audio injection to speed [0..2] 0 = free run
   */
  intensity?: number;
  /**
   * Frequency range for the audio impulse
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  [k: string]: unknown;
}

export interface SpectrumEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * How the melbank filters are applied to the RGB values
   */
  rgb_mix?: number;
  [k: string]: unknown;
}

export interface SpotlightEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Spotlight width relative to strip length (%)
   */
  spot_width?: number;
  /**
   * How long a spotlight fades out in seconds
   */
  fade_time?: number;
  /**
   * Maximum simultaneous fading spotlights
   */
  max_active_spots?: number;
  /**
   * Use LedFx gradient instead of fixed spotlight colors
   */
  use_gradient?: boolean;
  /**
   * How fast the gradient color advances (cycles per second)
   */
  gradient_speed?: number;
  /**
   * Color spread from center to edge when using gradient
   */
  spot_color_span?: number;
  /**
   * Color at spotlight center when gradient is disabled
   */
  center_color?: string;
  /**
   * Color at spotlight edge when gradient is disabled
   */
  edge_color?: string;
  [k: string]: unknown;
}

export interface StrobeEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * How many strobes per beat
   */
  strobe_frequency?: "1/1 (.,. )" | "1/2 (.-. )" | "1/4 (.o. )" | "1/8 (◉◡◉ )" | "1/16 (◉﹏◉ )" | "1/32 (⊙▃⊙ )";
  /**
   * How rapidly a single strobe hit fades. Higher -> faster fade
   */
  strobe_decay?: number;
  /**
   * How much the strobes fade across the beat. Higher -> less bright strobes towards end of beat
   */
  beat_decay?: number;
  /**
   * When to fire (*) or skip (.) the strobe (Note that beat 1 is arbitrary)
   */
  strobe_pattern?: "****" | "*.*." | ".*.*" | "*..." | "...*";
  [k: string]: unknown;
}

export interface Texter2dEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * apply alpha effect to text
   */
  alpha?: boolean;
  /**
   * Text effect specific option switch
   */
  option_1?: boolean;
  /**
   * Text effect specific option switch
   */
  option_2?: boolean;
  /**
   * general value slider for text effects
   */
  value_option_1?: number;
  /**
   * Font to render text with
   */
  font?:
    | "Roboto Regular"
    | "Roboto Bold"
    | "Roboto Black"
    | "Stop"
    | "Technique"
    | "8bitOperatorPlus8"
    | "Press Start 2P"
    | "Blade-5x8";
  /**
   * Your text to display
   */
  text?: string;
  /**
   * Font size as a percentage of the display height, fonts are unpredictable!
   */
  height_percent?: number;
  /**
   * Color of text
   */
  text_color?: string;
  /**
   * What aliasing strategy to use when manipulating text elements
   */
  resize_method?: "Fastest" | "Fast" | "Slow";
  /**
   * Text effect to apply to configuration
   */
  text_effect?: "Side Scroll" | "Spokes" | "Carousel" | "Wave" | "Pulse" | "Fade";
  /**
   * Diagnostic overlayed on matrix
   */
  deep_diag?: boolean;
  /**
   * Use gradient for word colors
   */
  use_gradient?: boolean;
  /**
   * Decay filter applied to the impulse for development
   */
  impulse_decay?: number;
  /**
   * multiplier of audio effect injection
   */
  multiplier?: number;
  /**
   * general speed slider for text effects
   */
  speed_option_1?: number;
  [k: string]: unknown;
}

export interface VumeterEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Decay filter applied to raw volume to track peak, 0 is None
   */
  peak_decay?: number;
  /**
   * Color of min volume cutoff
   */
  color_min?: string;
  /**
   * Color of max volume warning
   */
  color_max?: string;
  /**
   * Color of heathy volume range
   */
  color_mid?: string;
  /**
   * Color of peak inidicator
   */
  color_peak?: string;
  /**
   * % size of peak indicator that follows the filtered volume
   */
  peak_percent?: number;
  /**
   * Cut off limit for max volume warning
   */
  max_volume?: number;
  [k: string]: unknown;
}

export interface WaterEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Use perceptually even hue distribution
   */
  fix_hues?: boolean;
  /**
   * Effect Speed modifier
   */
  speed?: number;
  /**
   * Vertical Shift
   */
  vertical_shift?: number;
  /**
   * Size of bass ripples
   */
  bass_size?: number;
  /**
   * Size of mids ripples
   */
  mids_size?: number;
  /**
   * Size of high ripples
   */
  high_size?: number;
  /**
   * Viscosity of ripples
   */
  viscosity?: number;
  [k: string]: unknown;
}

export interface Waterfall2dEffectConfig {
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * flip the image horizontally
   */
  flip_horizontal?: boolean;
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * Center the waterfall
   */
  center?: boolean;
  /**
   * Use max or mean value for bar size
   */
  max_vs_mean?: boolean;
  /**
   * Number of frequency bands
   */
  bands?: number;
  /**
   * Seconds for the waterfall to drop from the top to bottom of the matrix
   */
  drop_secs?: number;
  /**
   * Fade out the waterfall effect
   */
  fade_out?: number;
  [k: string]: unknown;
}

export interface WavelengthEffectConfig {
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Amount to blur the effect
   */
  blur?: number;
  [k: string]: unknown;
}

export type EffectType = "bands" | "bands_matrix" | "bar" | "blade_power_plus" | "bleep" | "blender" | "block_reflections" | "blocks" | "clone" | "concentric" | "crawler" | "digitalrain2d" | "energy" | "energy2" | "equalizer" | "equalizer2d" | "fade" | "filter" | "fire" | "flame2d" | "frontend" | "game_of_life" | "gifplayer" | "glitch" | "gradient" | "hierarchy" | "imagespin" | "keybeat2d" | "lava_lamp" | "magnitude" | "marching" | "melt" | "melt_and_sparkle" | "metro" | "multiBar" | "noise2d" | "number" | "pitchSpectrum" | "pixels" | "plasma2d" | "plasmawled" | "power" | "radial" | "rain" | "rainbow" | "random_flash" | "real_strobe" | "scan" | "scan_and_flare" | "scan_multi" | "scroll" | "scroll_plus" | "singleColor" | "smoke2d" | "soap2d" | "spectrum" | "spotlight" | "strobe" | "texter2d" | "vumeter" | "water" | "waterfall2d" | "wavelength"

export interface EffectConfigByType {
  "bands": BandsEffectConfig
  "bands_matrix": BandsMatrixEffectConfig
  "bar": BarEffectConfig
  "blade_power_plus": BladePowerPlusEffectConfig
  "bleep": BleepEffectConfig
  "blender": BlenderEffectConfig
  "block_reflections": BlockReflectionsEffectConfig
  "blocks": BlocksEffectConfig
  "clone": CloneEffectConfig
  "concentric": ConcentricEffectConfig
  "crawler": CrawlerEffectConfig
  "digitalrain2d": Digitalrain2dEffectConfig
  "energy": EnergyEffectConfig
  "energy2": Energy2EffectConfig
  "equalizer": EqualizerEffectConfig
  "equalizer2d": Equalizer2dEffectConfig
  "fade": FadeEffectConfig
  "filter": FilterEffectConfig
  "fire": FireEffectConfig
  "flame2d": Flame2dEffectConfig
  "frontend": FrontendEffectConfig
  "game_of_life": GameOfLifeEffectConfig
  "gifplayer": GifplayerEffectConfig
  "glitch": GlitchEffectConfig
  "gradient": GradientEffectConfig
  "hierarchy": HierarchyEffectConfig
  "imagespin": ImagespinEffectConfig
  "keybeat2d": Keybeat2dEffectConfig
  "lava_lamp": LavaLampEffectConfig
  "magnitude": MagnitudeEffectConfig
  "marching": MarchingEffectConfig
  "melt": MeltEffectConfig
  "melt_and_sparkle": MeltAndSparkleEffectConfig
  "metro": MetroEffectConfig
  "multiBar": MultibarEffectConfig
  "noise2d": Noise2dEffectConfig
  "number": NumberEffectConfig
  "pitchSpectrum": PitchspectrumEffectConfig
  "pixels": PixelsEffectConfig
  "plasma2d": Plasma2dEffectConfig
  "plasmawled": PlasmawledEffectConfig
  "power": PowerEffectConfig
  "radial": RadialEffectConfig
  "rain": RainEffectConfig
  "rainbow": RainbowEffectConfig
  "random_flash": RandomFlashEffectConfig
  "real_strobe": RealStrobeEffectConfig
  "scan": ScanEffectConfig
  "scan_and_flare": ScanAndFlareEffectConfig
  "scan_multi": ScanMultiEffectConfig
  "scroll": ScrollEffectConfig
  "scroll_plus": ScrollPlusEffectConfig
  "singleColor": SinglecolorEffectConfig
  "smoke2d": Smoke2dEffectConfig
  "soap2d": Soap2dEffectConfig
  "spectrum": SpectrumEffectConfig
  "spotlight": SpotlightEffectConfig
  "strobe": StrobeEffectConfig
  "texter2d": Texter2dEffectConfig
  "vumeter": VumeterEffectConfig
  "water": WaterEffectConfig
  "waterfall2d": Waterfall2dEffectConfig
  "wavelength": WavelengthEffectConfig
}

export type EffectSpecificConfig = EffectConfigByType[EffectType]

export interface EffectConfig {
  type?:
    | "bands"
    | "bands_matrix"
    | "bar"
    | "blade_power_plus"
    | "bleep"
    | "blender"
    | "block_reflections"
    | "blocks"
    | "clone"
    | "concentric"
    | "crawler"
    | "digitalrain2d"
    | "energy"
    | "energy2"
    | "equalizer"
    | "equalizer2d"
    | "fade"
    | "filter"
    | "fire"
    | "flame2d"
    | "frontend"
    | "game_of_life"
    | "gifplayer"
    | "glitch"
    | "gradient"
    | "hierarchy"
    | "imagespin"
    | "keybeat2d"
    | "lava_lamp"
    | "magnitude"
    | "marching"
    | "melt"
    | "melt_and_sparkle"
    | "metro"
    | "multiBar"
    | "noise2d"
    | "number"
    | "pitchSpectrum"
    | "pixels"
    | "plasma2d"
    | "plasmawled"
    | "power"
    | "radial"
    | "rain"
    | "rainbow"
    | "random_flash"
    | "real_strobe"
    | "scan"
    | "scan_and_flare"
    | "scan_multi"
    | "scroll"
    | "scroll_plus"
    | "singleColor"
    | "smoke2d"
    | "soap2d"
    | "spectrum"
    | "spotlight"
    | "strobe"
    | "texter2d"
    | "vumeter"
    | "water"
    | "waterfall2d"
    | "wavelength";
  /**
   * Amount to blur the effect
   */
  blur?: number;
  /**
   * Flip the effect
   */
  flip?: boolean;
  /**
   * Mirror the effect
   */
  mirror?: boolean;
  /**
   * Brightness of strip
   */
  brightness?: number;
  /**
   * Apply a background color
   */
  background_color?: string;
  /**
   * Brightness of the background color
   */
  background_brightness?: number;
  /**
   * Enable diagnostic logging
   */
  diag?: boolean;
  advanced?: boolean | null;
  /**
   * Color gradient to display
   */
  gradient?: string;
  /**
   * Amount to shift the gradient
   */
  gradient_roll?: number;
  /**
   * Number of bands
   */
  band_count?: number;
  /**
   * Alignment of bands
   */
  align?: "left" | "right" | "invert" | "center";
  /**
   * Flip Gradient
   */
  flip_gradient?: boolean;
  /**
   * Flip horizontally
   */
  flip_horizontal?: boolean;
  /**
   * Choose from different animations
   */
  mode?: "bounce" | "wipe" | "in-out";
  /**
   * Acceleration profile of bar
   */
  ease_method?: "ease_in_out" | "ease_in" | "ease_out" | "linear";
  /**
   * Amount of color change per beat
   */
  color_step?: number;
  /**
   * Skips odd or even beats
   */
  beat_skip?: "none" | "odds" | "even";
  /**
   * Offset the beat
   */
  beat_offset?: number;
  /**
   * If skipping beats, skip every
   */
  skip_every?: 1 | 2;
  /**
   * Use perceptually even hue distribution
   */
  fix_hues?: boolean;
  /**
   * Rate of color decay
   */
  decay?: number;
  /**
   * Make the reactive bar bigger/smaller
   */
  multiplier?: number;
  /**
   * Frequency range for the beat detection
   */
  frequency_range?: "Beat" | "Bass" | "Lows (beat+bass)" | "Mids" | "High";
  /**
   * flip the image vertically
   */
  flip_vertical?: boolean;
  /**
   * 90 Degree rotations
   */
  rotate?: number;
  /**
   * ignore audio input
   */
  test?: boolean;
  /**
   * dump image
   */
  dump?: boolean;
  background_mode?: "additive" | "overwrite";
  /**
   * mirror effect
   */
  mirror_effect?: boolean;
  /**
   * Use gradient in power dimension instead of time
   */
  grad_power?: boolean;
  /**
   * Time to scroll the bleep
   */
  scroll_time?: number;
  /**
   * How to plot the data
   */
  draw?: "Points" | "Lines" | "Fill";
  /**
   * How many historical points to capture
   */
  points?: number;
  /**
   * Line width only
   */
  size?: number;
  /**
   * How to stretch the mask source pixles to the effect pixels
   */
  mask_stretch?: "2d full" | "2d tile";
  /**
   * How to stretch the background source pixles to the effect pixels
   */
  background_stretch?: "2d full" | "2d tile";
  /**
   * How to stretch the foreground source pixles to the effect pixels
   */
  foreground_stretch?: "2d full" | "2d tile";
  /**
   * The virtual from which to source the mask
   */
  mask?: string;
  /**
   * The virtual from which to source the foreground
   */
  foreground?: string;
  /**
   * The virtual from which to source the background
   */
  background?: string;
  /**
   * Switch Foreground and Background
   */
  invert_mask?: boolean;
  /**
   * 1 default = luminance as alpha, anything below 1 is mask cutoff
   */
  mask_cutoff?: number;
  /**
   * Effect Speed modifier
   */
  speed?: number;
  /**
   * Audio Reactive modifier
   */
  reactivity?: number;
  /**
   * Number of color blocks
   */
  block_count?: number;
  /**
   * Source screen for grab
   */
  screen?: number;
  /**
   * pixels down offset of grab
   */
  down?: number;
  /**
   * pixels across offset of grab
   */
  across?: number;
  /**
   * width of grab
   */
  width?: number;
  /**
   * height of grab
   */
  height?: number;
  /**
   * Invert propagation direction
   */
  invert?: boolean;
  /**
   * Frequency range's power multiplier
   */
  power_multiplier?: number;
  /**
   * Scales the gradient
   */
  gradient_scale?: number;
  /**
   * Stretches the gradient vertically
   */
  stretch_height?: number;
  /**
   * Soften the center point
   */
  center_smoothing?: number;
  /**
   * Idle motion speed
   */
  idle_speed?: number;
  /**
   * Sway modifier
   */
  sway?: number;
  /**
   * Chop modifier
   */
  chop?: number;
  /**
   * Stretch modifier
   */
  stretch?: number;
  /**
   * Number of code lines in the matrix as a multiplier of matrix pixel width
   */
  count?: number;
  /**
   * Number of code lines to add per second
   */
  add_speed?: number;
  /**
   * Minimum number of seconds for a code line to run from top to bottom
   */
  run_seconds?: number;
  /**
   * Code line tail length as a % of the matrix
   */
  tail?: number;
  /**
   * Number of tail segments
   */
  tail_segments?: number;
  /**
   * Decay filter applied to the impulse for development
   */
  impulse_decay?: number;
  /**
   * Change colors in time with the beat
   */
  color_cycler?: boolean;
  /**
   * Color of low, bassy sounds
   */
  color_lows?: string;
  /**
   * Color of midrange sounds
   */
  color_mids?: string;
  /**
   * Color of high sounds
   */
  color_high?: string;
  /**
   * Responsiveness to changes in sound
   */
  sensitivity?: number;
  /**
   * Mode of combining each frequencies' colors
   */
  mixing_mode?: "additive" | "overlap";
  /**
   * Repeat the gradient into segments
   */
  gradient_repeat?: number;
  /**
   * Size of the tracer bar that follows a filtered value
   */
  peak_percent?: number;
  /**
   * Decay filter applied to the peak value
   */
  peak_decay?: number;
  /**
   * Turn on white peak markers that follow a freq value filtered with decay
   */
  peak_marks?: boolean;
  /**
   * Peak mark color
   */
  peak_color?: string;
  /**
   * Center the equalizer bar
   */
  center?: boolean;
  /**
   * Use max or mean value for bar size
   */
  max_vs_mean?: boolean;
  /**
   * Why be so square?
   */
  ring?: boolean;
  /**
   * Weeeeeeeeeee
   */
  spin?: boolean;
  /**
   * Number of freq bands
   */
  bands?: number;
  /**
   * Spin impulse multiplier
   */
  spin_multiplier?: number;
  /**
   * Decay filter applied to the spin impulse
   */
  spin_decay?: number;
  /**
   * Color bars by power level: various algorithms
   */
  power_gradient?: "Off" | "Solid" | "Progressive" | "Stretch";
  /**
   * Enable default melbank pipeline filtering
   */
  filtered?: boolean;
  /**
   * Simple color selector
   */
  color?: string;
  /**
   * Use gradient instead of color
   */
  use_gradient?: boolean;
  /**
   * 0= no gradient roll, range 60 secs to 1 sec
   */
  roll_speed?: number;
  /**
   * Boost the brightness of the effect on a parabolic curve
   */
  boost?: number;
  color_shift?: number;
  intensity?: number;
  fade_chance?: number;
  /**
   * Particles spawn rate
   */
  spawn_rate?: number;
  /**
   * Trips to top per second
   */
  velocity?: number;
  /**
   * Blur radius in pixels
   */
  blur_amount?: number;
  /**
   * low band flame
   */
  low_band?: string;
  /**
   * mid band flame
   */
  mid_band?: string;
  /**
   * high band flame
   */
  high_band?: string;
  /**
   * Check for and correct common unhealthy states
   */
  health_checks?: "All" | "Dead" | "Oscillating" | "None";
  /**
   * Base number of steps per second to run
   */
  base_game_speed?: number;
  /**
   * Number of seconds between health checks
   */
  health_check_interval?: number;
  /**
   * Generate entities on beat
   */
  beat_inject?: boolean;
  /**
   * What strategy to use when resizing GIF
   */
  resize_method?: "Fastest" | "Fast" | "Slow" | "Slowest";
  /**
   * Load GIF from URL/local file
   */
  image_location?: string;
  /**
   * Bounce the GIF instead of looping
   */
  bounce?: boolean;
  /**
   * How fast to play the gif
   */
  gif_fps?: number;
  /**
   * Ensure the saturation is above this value
   */
  saturation_threshold?: number;
  /**
   * Brightness modulation
   */
  modulate?: boolean;
  /**
   * Choose an animation
   */
  modulation_effect?: "sine" | "breath";
  /**
   * Animation speed
   */
  modulation_speed?: number;
  /**
   * Boost the brightness of the effect on a parabolic curve
   */
  brightness_boost?: number;
  /**
   * If Lows are below this value, Mids are used.
   */
  threshold_lows?: number;
  /**
   * If Mids are below this value, Highs are used
   */
  threshold_mids?: number;
  /**
   * Time Lows/Mids have to be below threshold before switch
   */
  switch_time?: number;
  /**
   * use a test pattern
   */
  pattern?: boolean;
  /**
   * The minimum size multiplier for the image
   */
  min_size?: number;
  /**
   * default NEAREST, use BILINEAR for smoother scaling, expensive on runtime takes a few ms
   */
  bilinear?: boolean;
  /**
   * When spinning the image, force fit to frame, or allow clipping
   */
  clip?: boolean;
  /**
   * Load image from
   */
  image_source?: string;
  /**
   * Configuration for Album art display
   */
  album_art?: boolean;
  /**
   * Percentage of original to matrix width
   */
  stretch_horizontal?: number;
  /**
   * Percentage of original to matrix height
   */
  stretch_vertical?: number;
  /**
   * Center offset in horizontal direction percent of matrix width
   */
  center_horizontal?: number;
  /**
   * Center offset in vertical direction percent of matrix height
   */
  center_vertical?: number;
  /**
   * Frame index to interpolate beats between
   */
  beat_frames?: string;
  /**
   * Frames to remove from gif animation
   */
  skip_frames?: string;
  /**
   * Diagnostic overlayed on matrix
   */
  deep_diag?: boolean;
  /**
   * Trigger test code with 0.05 beat per frame
   */
  fake_beat?: boolean;
  /**
   * Preserve aspect ratio if force fit
   */
  keep_aspect_ratio?: boolean;
  /**
   * Force fit to matrix
   */
  force_fit?: boolean;
  /**
   * When ping pong, skip the first beat key frame on both ends, use when key beat frames are very close to start and ends only
   */
  ping_pong_skip?: boolean;
  /**
   * Play gif forward and reverse, not just loop
   */
  ping_pong?: boolean;
  /**
   * half the beat input impulse, slow things down
   */
  half_beat?: boolean;
  /**
   * Image brightness
   */
  image_brightness?: number;
  /**
   * Difference between lighter and darker spots
   */
  contrast?: number;
  /**
   * Brightness of the melt effect
   */
  bg_bright?: number;
  /**
   * Size of the melting lava sections
   */
  lava_width?: number;
  /**
   * Cutoff for quiet sounds. Higher -> only loud sounds are detected
   */
  strobe_threshold?: number;
  /**
   * Higher numbers -> more strobes
   */
  strobe_rate?: number;
  /**
   * Percussive strobe width, from one pixel to the full length
   */
  strobe_width?: number;
  /**
   * Percussive strobe decay rate. Higher -> decays faster.
   */
  strobe_decay_rate?: number;
  /**
   * How much to blur the strobes
   */
  strobe_blur?: number;
  /**
   * Time between flash in seconds
   */
  pulse_period?: number;
  /**
   * Flash to blank ratio
   */
  pulse_ratio?: number;
  /**
   * Steps of pattern division to loop
   */
  steps?: number;
  /**
   * Flash color
   */
  flash_color?: string;
  /**
   * graph capture, on to start, off to dump
   */
  capture?: boolean;
  /**
   * Window over which to measure CPU usage
   */
  cpu_secs?: number;
  /**
   * zoom density
   */
  zoom?: number;
  /**
   * apply alpha effect to text
   */
  alpha?: boolean;
  /**
   * Text effect specific option switch
   */
  option_1?: boolean;
  /**
   * Text effect specific option switch
   */
  option_2?: boolean;
  /**
   * general value slider for text effects
   */
  value_option_1?: number;
  /**
   * Font to render text with
   */
  font?:
    | "Roboto Regular"
    | "Roboto Bold"
    | "Roboto Black"
    | "Stop"
    | "Technique"
    | "8bitOperatorPlus8"
    | "Press Start 2P"
    | "Blade-5x8";
  /**
   * Your text to display
   */
  text?: string;
  /**
   * Font size as a percentage of the display height, fonts are unpredictable!
   */
  height_percent?: number;
  /**
   * Color of text
   */
  text_color?: string;
  /**
   * Text effect to apply to configuration
   */
  text_effect?: "Side Scroll" | "Spokes" | "Carousel" | "Wave" | "Pulse" | "Fade";
  /**
   * general speed slider for text effects
   */
  speed_option_1?: number;
  /**
   * Source of the value to display
   */
  value_source?: "BPM" | "BPM Confidence" | "Time (HH:MM)" | "Time (HH:MM:SS)";
  /**
   * Number of digits to reserve before decimal point (for stable text size)
   */
  whole_digits?: number;
  /**
   * Number of digits to display after decimal point (for stable text size)
   */
  decimal_digits?: number;
  /**
   * Support negative values (include negative sign in sizing)
   */
  negative?: boolean;
  /**
   * Rate at which notes fade
   */
  fade_rate?: number;
  /**
   * Responsiveness to note changes
   */
  responsiveness?: number;
  /**
   * Time between each pixel step to light up
   */
  step_period?: number;
  /**
   * Number of pixels each step
   */
  pixels?: number;
  /**
   * Pixel color to light up
   */
  pixel_color?: string;
  /**
   * Single or building pixels
   */
  build_up?: boolean;
  /**
   * Restart effect on color change, for transitions
   */
  color_blend?: boolean;
  /**
   * Lets pretend its vertical density
   */
  density_vertical?: number;
  /**
   * Like a slice of lemon
   */
  twist?: number;
  /**
   * If you squint its the distance from the center
   */
  radius?: number;
  /**
   * kinda how small the plasma is, but who realy knows
   */
  density?: number;
  /**
   * lower band of density
   */
  lower?: number;
  /**
   * Sound to size multiplier
   */
  size_multiplication?: number;
  /**
   * Sound to speed multiplier
   */
  speed_multiplication?: number;
  /**
   * Flash on percussive hits
   */
  sparks_color?: string;
  /**
   * Bass decay rate. Higher -> decays faster.
   */
  bass_decay_rate?: number;
  /**
   * Sparks decay rate. Higher -> decays faster.
   */
  sparks_decay_rate?: number;
  /**
   * The virtual from which to source the 1d pixels
   */
  source_virtual?: string;
  /**
   * Edges count of mapping
   */
  edges?: number;
  /**
   * X offset for center point
   */
  x_offset?: number;
  /**
   * Y offset for center point
   */
  y_offset?: number;
  /**
   * Use polygonal or radial lobes
   */
  polygon?: boolean;
  /**
   * static rotation
   */
  rotation?: number;
  /**
   * pull polygon points to star shape
   */
  star?: number;
  /**
   * color for low sounds, ie beats
   */
  lows_color?: string;
  /**
   * Pulse the entire strip to the beat
   */
  pulse_strip?: "Off" | "Lows" | "Mids" | "Highs";
  /**
   * color for mid sounds, ie vocals
   */
  mids_color?: string;
  /**
   * color for high sounds, ie hi hat
   */
  high_color?: string;
  /**
   * Sensitivity to low sounds
   */
  lows_sensitivity?: number;
  /**
   * Sensitivity to mid sounds
   */
  mids_sensitivity?: number;
  /**
   * Sensitivity to high sounds
   */
  high_sensitivity?: number;
  /**
   * Droplet animation style
   */
  raindrop_animation?: "Blob" | "Laser" | "Ripple";
  /**
   * Frequency of the effect curve
   */
  frequency?: number;
  /**
   * Hit color
   */
  hit_color?: string;
  /**
   * Hit duration
   */
  hit_duration?: number;
  /**
   * Probability of hit per second
   */
  hit_probability_per_sec?: number;
  /**
   * Hit size relative to LED strip
   */
  hit_relative_size?: number;
  /**
   * Bass strobe decay rate. Higher -> decays faster.
   */
  bass_strobe_decay_rate?: number;
  /**
   * color for percussive strobes
   */
  strobe_color?: string;
  /**
   * color shift delay for percussive strobes. Lower -> more shifts
   */
  color_shift_delay?: number;
  /**
   * Width of scan eye in %
   */
  scan_width?: number;
  /**
   * Color of scan
   */
  color_scan?: string;
  /**
   * Adjust color intensity based on audio power
   */
  color_intensity?: boolean;
  /**
   * Use colors from gradient selector
   */
  use_grad?: boolean;
  /**
   * spread the gradient colors across the scan
   */
  full_grad?: boolean;
  /**
   * max number of sparkles
   */
  sparkles_max?: number;
  /**
   * of scan size
   */
  sparkles_size?: number;
  /**
   * secs to die off
   */
  sparkles_time?: number;
  /**
   * level to trigger
   */
  sparkles_threshold?: number;
  /**
   * Color of low power scan
   */
  color_low?: string;
  /**
   * Color of mid power scan
   */
  color_mid?: string;
  /**
   * Audio processing source for low, mid, high
   */
  input_source?: "Power" | "Melbank";
  /**
   * Filter damping on attack, lower number is more
   */
  attack?: number;
  /**
   * Enable damping filters on attack and decay
   */
  filter?: boolean;
  /**
   * Cutoff for quiet sounds. Higher -> only loud sounds are detected
   */
  threshold?: number;
  /**
   * Device width to scroll per second
   */
  scroll_per_sec?: number;
  /**
   * Decay rate of the scroll per second, kind of
   */
  decay_per_sec?: number;
  /**
   * How the melbank filters are applied to the RGB values
   */
  rgb_mix?: number;
  /**
   * Spotlight width relative to strip length (%)
   */
  spot_width?: number;
  /**
   * How long a spotlight fades out in seconds
   */
  fade_time?: number;
  /**
   * Maximum simultaneous fading spotlights
   */
  max_active_spots?: number;
  /**
   * How fast the gradient color advances (cycles per second)
   */
  gradient_speed?: number;
  /**
   * Color spread from center to edge when using gradient
   */
  spot_color_span?: number;
  /**
   * Color at spotlight center when gradient is disabled
   */
  center_color?: string;
  /**
   * Color at spotlight edge when gradient is disabled
   */
  edge_color?: string;
  /**
   * How many strobes per beat
   */
  strobe_frequency?: "1/1 (.,. )" | "1/2 (.-. )" | "1/4 (.o. )" | "1/8 (◉◡◉ )" | "1/16 (◉﹏◉ )" | "1/32 (⊙▃⊙ )";
  /**
   * How rapidly a single strobe hit fades. Higher -> faster fade
   */
  strobe_decay?: number;
  /**
   * How much the strobes fade across the beat. Higher -> less bright strobes towards end of beat
   */
  beat_decay?: number;
  /**
   * When to fire (*) or skip (.) the strobe (Note that beat 1 is arbitrary)
   */
  strobe_pattern?: "****" | "*.*." | ".*.*" | "*..." | "...*";
  /**
   * Color of min volume cutoff
   */
  color_min?: string;
  /**
   * Color of max volume warning
   */
  color_max?: string;
  /**
   * Color of peak inidicator
   */
  color_peak?: string;
  /**
   * Cut off limit for max volume warning
   */
  max_volume?: number;
  /**
   * Vertical Shift
   */
  vertical_shift?: number;
  /**
   * Size of bass ripples
   */
  bass_size?: number;
  /**
   * Size of mids ripples
   */
  mids_size?: number;
  /**
   * Size of high ripples
   */
  high_size?: number;
  /**
   * Viscosity of ripples
   */
  viscosity?: number;
  /**
   * Seconds for the waterfall to drop from the top to bottom of the matrix
   */
  drop_secs?: number;
  /**
   * Fade out the waterfall effect
   */
  fade_out?: number;
  [k: string]: unknown;
}
