/* eslint-disable no-unused-vars */
type DynamicIconResolver = (args: { paused?: boolean; fallback?: any }) => string

export const commandIcons: Record<string, string | DynamicIconResolver> = {
  padscreen: 'SportsEsports',
  'scan-wled': 'wled',
  'scene-playlist': 'Collections',
  frequencies: 'mdi:sine-wave',
  transitions: 'GraphicEq',
  'copy-to': 'CopyAll',
  'brightness-up': 'BrightnessHigh',
  'brightness-down': 'BrightnessLow',
  smartbar: 'LocalPlay',
  'one-shot': 'mdi:pistol',

  // Dynamic icon names (functions return icon name based on state)
  'play/pause': ({ paused }) => (paused ? 'PlayArrow' : 'PauseOutlined'),
  effect: ({ fallback }) => {
    if (fallback === false) {
      return 'LensBlur'
    } else if (typeof fallback === 'number') {
      return 'Timer'
    } else {
      return 'TouchApp'
    }
  },

  // Static icon name
  scene: 'Wallpaper'
}
