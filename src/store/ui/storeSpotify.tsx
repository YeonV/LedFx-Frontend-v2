interface Section {
  start: number;
  duration: number;
  confidence: number;
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
}

interface Segment {
  start: number;
  duration: number;
  confidence: number;
  loudness_start: number;
  loudness_max_time: number;
  loudness_max: number;
  loudness_end: number;
  pitches: number[];
  timbre: number[];
}
interface Artist {
  name: string;
  uri: string;
  url: string;
}
interface Image {
  url: string;
  height: number;
  width: number;
  size: string;
}
interface Currentitem {
  name: string;
  uri: string;
  url: string;
  uid: string;
  content_type: string;
  artists: Artist[];
  images: Image[];
  estimated_duration: number;
  group: Artist;
}
interface Restrictions {
  pause: any[];
  resume: any[];
  seek: any[];
  skip_next: any[];
  skip_prev: string[];
  toggle_repeat_context: any[];
  toggle_repeat_track: any[];
  toggle_shuffle: any[];
  peek_next: any[];
  peek_prev: any[];
}

interface Options {
  shuffled: boolean;
  repeat_mode: string;
}

interface Metadata {
  name: string;
  uri: string;
  url: string;
  current_item: Currentitem;
  previous_items: any[];
  next_items: any[];
  options: Options;
  restrictions: Restrictions;
}
interface Context {
  uri: string;
  metadata: Metadata;
}
interface Playbackfeatures {
  hifi_status: string;
}

interface Disallows {
  seeking: boolean;
  skipping_next: boolean;
  skipping_prev: boolean;
  toggling_repeat_context: boolean;
  toggling_repeat_track: boolean;
  toggling_shuffle: boolean;
  peeking_next: boolean;
  peeking_prev: boolean;
  resuming: boolean;
}

interface Restrictions2 {
  disallow_seeking_reasons: any[];
  disallow_skipping_next_reasons: any[];
  disallow_skipping_prev_reasons: string[];
  disallow_toggling_repeat_context_reasons: any[];
  disallow_toggling_repeat_track_reasons: any[];
  disallow_toggling_shuffle_reasons: any[];
  disallow_peeking_next_reasons: any[];
  disallow_peeking_prev_reasons: any[];
  disallow_resuming_reasons: string[];
}
interface Album {
  name: string;
  uri: string;
  images: Image[];
}

interface Linkedfrom {
  uri?: any;
  id?: any;
}
interface Currenttrack {
  id: string;
  uri: string;
  type: string;
  uid: string;
  linked_from: Linkedfrom;
  media_type: string;
  track_type: string;
  name: string;
  duration_ms: number;
  artists: Artist[];
  album: Album;
  is_playable: boolean;
}

interface Trackwindow {
  current_track: Currenttrack;
  next_tracks: any[];
  previous_tracks: any[];
}

interface PlayerState {
  timestamp: number;
  context: Context;
  duration: number;
  paused: boolean;
  shuffle: boolean;
  position: number;
  loading: boolean;
  repeat_mode: number;
  track_window: Trackwindow;
  restrictions: Restrictions2;
  disallows: Disallows;
  playback_id: string;
  playback_quality: string;
  playback_features: Playbackfeatures;
}

const storeSpotify = () => ({
  spotifyEmbedUrl:
    'https://open.spotify.com/embed/playlist/4sXMBGaUBF2EjPvrq2Z3US?',
  spotifyAuthToken: '',
  player: null as any,
  swSize: 'small',
  swX: 50,
  swY: 200,
  swWidth: 300,
  spotifyVol: 0,
  spotifyPos: 0 as any,
  spNetworkTime: 1000,
  spAuthenticated: false,
  spotifyData: {
    trackAnalysis: {
      segments: [] as Segment[],
      sections: [] as Section[],
    },
    playerState: {} as PlayerState,
  } as any,
  spotifyDevice: {} as any,
  spotifytriggers: {},
  spTriggersList: [] as any,
  spActTriggers: [] as string[],
  playlist: [] as any,
});

export default storeSpotify;
