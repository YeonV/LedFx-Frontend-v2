import { produce } from 'immer'
import type { IStore } from '../useStore'

interface IMidiMapping {
  command?: string
  payload?: any
}

interface IDefaultMapping {
  [key: number]: IMidiMapping
}

interface IMapping {
  [key: number]: IDefaultMapping
}
const defaultMapping = {
  0: {
    mode: 'command',
    command: 'play/pause'
  },
  91: {
    command: 'brightness-up',
  },
  92: {
    command: 'brightness-down',
  },
  94: {
    command: 'play/pause',
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
