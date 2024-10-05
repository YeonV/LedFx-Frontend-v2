import { produce } from 'immer'
import type { IStore } from '../useStore'

export interface IMidiMapping {
  command?: string
  payload?: any
  colorSceneInactive?: string
  colorSceneActive?: string
  colorCommand?: string
  typeSceneInactive?: string
  typeSceneActive?: string
  typeCommand?: string
  buttonNumber?: number
}

export interface IDefaultMapping {
  [key: number]: IMidiMapping
}

export interface IMapping {
  [key: number]: IDefaultMapping
}
const baseMapping = {} as IDefaultMapping;

for (let row = 1; row <= 9; row++) {
  for (let col = 1; col <= 9; col++) {
    const key = parseInt(`${row}${col}`);
    baseMapping[key] = { buttonNumber: key };
  }
}

const presetMapping = {
  91: {
    command: 'brightness-up',
    buttonNumber: 91,
  },
  92: {
    command: 'brightness-down',
    buttonNumber: 92,
  },
  94: {
    command: 'play/pause',
    buttonNumber: 94,
  },
} as IDefaultMapping

export const defaultMapping = { ...baseMapping, ...presetMapping }

export const LpMapping = {
  LaunchpadX: [
    [11, 12, 13, 14, 15, 16, 17, 18, 19],
    [21, 22, 23, 24, 25, 26, 27, 28, 29],
    [31, 32, 33, 34, 35, 36, 37, 38, 39],
    [41, 42, 43, 44, 45, 46, 47, 48, 49],
    [51, 52, 53, 54, 55, 56, 57, 58, 59],
    [61, 62, 63, 64, 65, 66, 67, 68, 69],
    [71, 72, 73, 74, 75, 76, 77, 78, 79],
    [81, 82, 83, 84, 85, 86, 87, 88, 89],
    [91, 92, 93, 94, 95, 96, 97, 98, 99],
  ],
  LaunchpadS: [
    [112, 113, 114, 115, 116, 117, 118, 119, 120],  
    [96, 97, 98, 99, 100, 101, 102, 103, 104],
    [80, 81, 82, 83, 84, 85, 86, 87, 88],
    [64, 65, 66, 67, 68, 69, 70, 71, 72],
    [48, 49, 50, 51, 52, 53, 54, 55, 56],
    [32, 33, 34, 35, 36, 37, 38, 39, 40],
    [16, 17, 18, 19, 20, 21, 22, 23, 24],
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ]
}

export function getUiBtnNo(inputInt: number): number | null {
  for (let i = 0; i < LpMapping.LaunchpadS.length; i++) {
    for (let j = 0; j < LpMapping.LaunchpadS[i].length; j++) {
      if (LpMapping.LaunchpadS[i][j] === inputInt) {
        return LpMapping.LaunchpadX[i][j];
      }
    }
  }
  return null;
}
const storeMidi = (set: any) => ({
  lpType: 'LPX' as 'LPX' | 'LPS',
  setLpType: (type: 'LPX' | 'LPS') =>
    set(
      produce((state: IStore) => {
        state.lpType = type
      }),
      false,
      'setLpType'
    ),
  midiInputs: [] as string[],
  setMidiInputs: (inputs: string[]) =>
    set(
      produce((state: IStore) => {
        state.midiInputs = inputs
      }),
      false,
      'setMidiInputs'
    ),
  midiOutputs: [] as string[],
  setMidiOutputs: (outputs: string[]) =>
    set(
      produce((state: IStore) => {
        state.midiOutputs = outputs
      }),
      false,
      'setMidiOutputs'
    ),
  midiInput:'',
  setMidiInput: (input: string) =>
    set(
      produce((state: IStore) => {
        state.midiInput = input
      }),
      false,
      'setMidiInput'
    ),
  midiOutput:'',
  setMidiOutput: (output: string) =>
    set(
      produce((state: IStore) => {
        state.midiOutput = output
      }),
      false,
      'setMidiOutput'
    ),
  midiInitialized: false,
  initMidi: () =>
    set(
      produce((state: IStore) => {
        state.midiInitialized = !state.midiInitialized
      }),
      false,
      'setMidiInitialized'
    ),
  midiColors: {
    commandColor: '63',
    sceneActiveColor: '1E',
    sceneInactiveColor: '3C',
    commandType: '90',
    sceneActiveType: '90',
    sceneInactiveType: '90',
    pressedButtonColor: null as string | null,
  },
  setMidiCommandColor: (color: string) =>
    set(
      produce((state: IStore) => {
        state.midiColors.commandColor = color
      }),
      false,
      'setMidiCommandColor'
    ),
  setMidiSceneActiveColor: (color: string) =>
    set(
      produce((state: IStore) => {
        state.midiColors.sceneActiveColor = color
      }),
      false,
      'setMidiSceneActiveColor'
    ),
  setMidiSceneInactiveColor: (color: string) =>
    set(
      produce((state: IStore) => {
        state.midiColors.sceneInactiveColor = color
      }),
      false,
      'setMidiSceneInactiveColor'
    ),
  setPressedButtonColor: (color: string) =>
    set(
      produce((state: IStore) => {
        state.midiColors.pressedButtonColor = color
      }),
      false,
      'setPressedButtonColor'
    ),
  midiMapping: {
    0: defaultMapping,
  } as IMapping,
  setMidiMapping: (midiMapping: IMapping): void =>
    set(
      produce((state: IStore) => {
        state.midiMapping = midiMapping
      }),
      false,
      'setMidiMapping'
    ),
  setMidiMappingButtonNumbers: (inputArray: number[][]): void =>
    set(
      produce((state: IStore) => {
        if (inputArray.length !== 9 || !inputArray.every(row => row.length === 9)) {
          throw new Error('Input must be a 9x9 array')
        }
        const updatedMapping = { ...state.midiMapping }

        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            const key = (row + 1) * 10 + (col + 1)
            if (updatedMapping[0][key]) {
              updatedMapping[0][key] = { ...updatedMapping[0][key], buttonNumber: inputArray[row][col] }
            } else {
              updatedMapping[0][key] = { buttonNumber: inputArray[row][col] }
            }
          }
        }
        state.midiMapping = updatedMapping
      }),
      false,
      'updateMidiMapping'
    ),
  
  midiEvent: {
    name: '',
    note: '',
    button: -1
  },
  setMidiEvent: (midiEvent: any): void =>
    set(
      produce((state: IStore) => {
        state.midiEvent = midiEvent
      }),
      false,
      'setMidiEvent'
    )
})

export default storeMidi
