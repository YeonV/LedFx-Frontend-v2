import { produce } from 'immer'
import type { IStore } from '../useStore'

const storeWebAudio = (set: any) => ({
  webAud: false,
  setWebAud: (newState: any) => {
    set(
      produce((state: IStore) => {
        state.webAud = newState
      }),
      false,
      'webaudio/setWebAud'
    )
  },
  webAudName: '',
  setWebAudName: (newState: any) => {
    set(
      produce((state: IStore) => {
        state.webAudName = newState
      }),
      false,
      'webaudio/setWebAudName'
    )
  },
  clientDevice: null as any,
  clientDevices: null as any,
  setClientDevice: (newState: any) => {
    set(
      produce((state: IStore) => {
        state.clientDevice = newState
      }),
      false,
      'webaudio/setClientDevice'
    )
  },
  setClientDevices: (newState: any) => {
    set(
      produce((state: IStore) => {
        state.clientDevices = newState
      }),
      false,
      'webaudio/setClientDevices'
    )
  },
  usePerDeviceDelay: false,
  setUsePerDeviceDelay: (newState: boolean) => {
    set(
      produce((state: IStore) => {
        state.usePerDeviceDelay = newState
      }),
      false,
      'webaudio/setUsePerDeviceDelay'
    )
  },
  perDeviceDelay: {} as any,
  setPerDeviceDelay: (newState: any) => {
    set(
      produce((state: IStore) => {
        state.perDeviceDelay = newState
      }),
      false,
      'webaudio/setPerDeviceDelay'
    )
  }
})

export default storeWebAudio
