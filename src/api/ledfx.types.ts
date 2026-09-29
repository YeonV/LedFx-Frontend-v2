/**
 * Config types are generated from the backend schemas (ledfx.config.types.ts).
 * Everything below is hand-written: REST responses and runtime entities.
 */

import type {
  DeviceConfig,
  DeviceSpecificConfig,
  EffectConfig,
  EffectSpecificConfig,
  EffectType,
  VirtualConfig
} from './ledfx.config.types'

export type * from './ledfx.config.types'

/* eslint-disable */
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
  type: EffectType;
}
/**
 * Convenience type for effect details using the universal EffectConfig.
 * @category General
 */
export interface Effect {
  config: EffectConfig | null;
  name: string;
  type: EffectType | null;
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
  last_effect?: EffectType | null;
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

// Cache API Response Types
/**
 * Represents a single cached image entry with metadata.
 * @category Cache
 */
export interface CacheEntry {
  url: string;
  size: number;
  cached_at: string;
}

/**
 * Response for GET /api/cache/images.
 * @category REST
 */
export interface GetCacheImagesApiResponse {
  total_size: number;
  total_count: number;
  entries: CacheEntry[];
  cache_policy: {
    expiration: string;
    refresh: string;
    eviction: string;
  };
}

/**
 * Response for DELETE /api/cache/images.
 * @category REST
 */
export interface DeleteCacheApiResponse {
  status: "success" | "failed";
  data?: {
    cleared_count?: number;
    freed_bytes?: number;
  };
  payload?: {
    type: "success" | "warning" | "error";
    reason: string;
  };
}

/**
 * Response for POST /api/cache/images/refresh.
 * @category REST
 */
export interface RefreshCacheApiResponse {
  status: "success" | "failed";
  data?: {
    url: string;
  };
  payload?: {
    type: "success" | "info" | "error";
    reason: string;
  };
}

// Assets API Response Types
/**
 * Represents a single asset with metadata.
 * @category Assets
 */
export interface AssetMetadata {
  path: string;
  size: number;
  modified: string;
  width: number;
  height: number;
}

/**
 * Response for GET /api/assets.
 * @category REST
 */
export interface GetAssetsApiResponse {
  assets: AssetMetadata[];
}

/**
 * Response for POST /api/assets (asset upload).
 * @category REST
 */
export interface UploadAssetApiResponse {
  status: "success" | "failed";
  data?: {
    path: string;
  };
  payload?: {
    type: "success" | "error";
    reason: string;
  };
}

/**
 * Response for DELETE /api/assets.
 * @category REST
 */
export interface DeleteAssetApiResponse {
  status: "success" | "failed";
  data?: {
    deleted: boolean;
  };
  payload?: {
    type: "success" | "error";
    reason: string;
  };
}

/**
 * Request body for POST /api/assets/thumbnail.
 * @category REST
 */
export interface ThumbnailRequest {
  path: string;
  size?: number; // 16-512, default 128
  dimension?: 'max' | 'width' | 'height'; // default 'max'
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
/**
 * Convenience type for the API response containing cache statistics.
 * @category General
 */
export type CacheStats = GetCacheImagesApiResponse;
/**
 * Convenience type for the API response containing multiple Asset objects.
 * @category General
 */
export type Assets = GetAssetsApiResponse;


/**
 * One property of a `/api/schemas` object schema: the JSON Schema 2020-12 keys the
 * forms read, plus the keys of the frontend's own hand-built schemas.
 */
export interface FieldSchema {
  type?: string
  title?: string
  description?: string
  default?: any
  minimum?: number
  maximum?: number
  enum?: any[]
  format?: string
  anyOf?: FieldSchema[]
  $ref?: string
  [key: string]: any
}

export interface ObjectSchema {
  $schema?: string
  type?: string
  title?: string
  properties?: Record<string, FieldSchema>
  required?: string[]
  permitted_keys?: string[]
}

export interface SchemaEntry {
  schema: ObjectSchema
}
export interface PluginSchemaEntry extends SchemaEntry {
  id: string
}
export interface IntegrationSchemaEntry extends PluginSchemaEntry {
  name: string
  description: string
  beta: boolean
}
export interface EffectSchemaEntry extends PluginSchemaEntry {
  name: string
  category: string
  uses_melbank_range: boolean
  hidden_keys?: string[]
  advanced_keys?: string[]
  permitted_keys?: string[]
}

/** GET /api/schemas */
export interface Schemas {
  audio: SchemaEntry
  melbanks: SchemaEntry
  melbank_collection: SchemaEntry
  wled_preferences: SchemaEntry
  virtuals: SchemaEntry
  core: SchemaEntry
  devices: Record<string, PluginSchemaEntry>
  integrations: Record<string, IntegrationSchemaEntry>
  effects: Record<string, EffectSchemaEntry>
}
