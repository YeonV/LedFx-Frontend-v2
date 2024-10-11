import { produce } from 'immer'
import type { IStore } from '../useStore'
import { MidiDevices } from '../../utils/MidiDevices/MidiDevices'

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
  // 91: {
  //   command: 'brightness-up',
  //   buttonNumber: 91,
  // },
  // 92: {
  //   command: 'brightness-down',
  //   buttonNumber: 92,
  // },
  // 94: {
  //   command: 'play/pause',
  //   buttonNumber: 94,
  // },
} as IDefaultMapping

export const defaultMapping = { ...baseMapping, ...presetMapping }

const storeMidi = (set: any, get: any) => ({
  getColorFromValue: (value: string ) => {
    if (value === 'undefined') return undefined;
    const state = get() as IStore;
    const colors = MidiDevices[state.midiType][state.midiModel].colors;
    const numericValue = parseInt(value, 16);
    return Object.keys(colors).find(key => colors[key as keyof typeof colors] === numericValue) || undefined;
  },
  getUiBtnNo: (inputInt: number): number | null => {
    const state = get() as IStore;
    for (let i = 0; i < MidiDevices[state.midiType][state.midiModel].buttonNumbers.length; i++) {
      for (let j = 0; j < MidiDevices[state.midiType][state.midiModel].buttonNumbers[i].length; j++) {
        if (MidiDevices[state.midiType][state.midiModel].buttonNumbers[i][j] === inputInt) {
          return MidiDevices.Launchpad.X.buttonNumbers[i][j];
        }
      }
    }
    return null;
  },
  blockMidiHandler: false,
  setBlockMidiHandler: (block: boolean) =>
    set(
      produce((state: IStore) => {
        state.blockMidiHandler = block
      }),
      false,
      'setBlockMidiHandler'
    ),
  midiType: 'Launchpad' as keyof typeof MidiDevices,
  setMidiType: (type: keyof typeof MidiDevices) =>
    set(
      produce((state: IStore) => {
        state.midiType = type
      }),
      false,
      'setMidiType'
    ),
  midiModel: 'X' as keyof typeof MidiDevices[keyof typeof MidiDevices],
  setMidiModel: (model: keyof typeof MidiDevices[keyof typeof MidiDevices]) =>
    set(
      produce((state: IStore) => {
        state.midiModel = model
      }),
      false,
      'setMidiModel'
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
  setMidiCommandType: (type: string) =>
    set(
      produce((state: IStore) => {
        state.midiColors.commandType = type
      }),
      false,
      'setMidiCommandType'
    ),
  setMidiSceneActiveType: (type: string) =>
    set(
      produce((state: IStore) => {
        state.midiColors.sceneActiveType = type
      }),
      false,
      'setMidiSceneActiveType'
    ),
  setMidiSceneInactiveType: (type: string) =>
    set(
      produce((state: IStore) => {
        state.midiColors.sceneInactiveType = type
      }),
      false,
      'setMidiSceneInactiveType'
    ),
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
        updatedMapping[0] = { ...state.midiMapping[0] }

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
