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
export const defaultMapping = {
  0: {
    mode: 'command',
    command: 'play/pause',
    buttonNumber: 0,
  },
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

const storeMidi = (set: any) => ({
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
