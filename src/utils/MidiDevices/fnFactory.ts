export const createLedFunctions = (
  solid_mode: number,
  flash_mode: number,
  pulse_mode: number,
  colors: Record<string, number>
) => ({
  ledOff: (buttonNumber: number) => [solid_mode, buttonNumber, 0x00],
  ledOn: (
    buttonNumber: number,
    color: keyof typeof colors | number,
    mode: 'solid' | 'flash' | 'pulse' = 'solid'
  ) => [
    mode === 'pulse' ? pulse_mode : mode === 'flash' ? flash_mode : solid_mode,
    buttonNumber,
    typeof color === 'number' ? color : colors[color as keyof typeof colors]
  ],
  ledSolid: (buttonNumber: number, color: keyof typeof colors | number) => [
    solid_mode,
    buttonNumber,
    typeof color === 'number' ? color : colors[color as keyof typeof colors]
  ],
  ledFlash: (buttonNumber: number, color: keyof typeof colors | number) => [
    flash_mode,
    buttonNumber,
    typeof color === 'number' ? color : colors[color as keyof typeof colors]
  ],
  ledPulse: (buttonNumber: number, color: keyof typeof colors | number) => [
    pulse_mode,
    buttonNumber,
    typeof color === 'number' ? color : colors[color as keyof typeof colors]
  ]
})

export const rgbFunction = (buttonNumber: number, r: number, g: number, b: number) => [
  240,
  0,
  32,
  41,
  2,
  12,
  3,
  3,
  buttonNumber,
  Math.floor(r / 2),
  Math.floor(g / 2),
  Math.floor(b / 2),
  247
]

export const textFunction = (
  text: string,
  r: number,
  g: number,
  b: number,
  loop?: boolean,
  speed: number = 7
) => [
  240,
  0,
  32,
  41,
  2,
  12,
  7,
  loop ? 1 : 0,
  speed,
  1,
  Math.floor(r / 2),
  Math.floor(g / 2),
  Math.floor(b / 2),
  ...text.split('').map((char) => char.charCodeAt(0)),
  247
]

export const launchkeyTextFunction = (text: string) => [
  240,
  0,
  32,
  41,
  2,
  15,
  4,
  ...text.split('').map((char) => char.charCodeAt(0)),
  247
]

export const createLaunchpadSFn = (colors: Record<string, number>) => ({
  ledOff: (buttonNumber: number) => [0x90, buttonNumber, 0x0c],
  ledOn: (buttonNumber: number, color: keyof typeof colors | number) => [
    0x90,
    buttonNumber,
    typeof color === 'number' ? color : colors[color as keyof typeof colors]
  ]
})
