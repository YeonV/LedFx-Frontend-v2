/* eslint-disable no-param-reassign */
import produce from 'immer';

const storeWebAudio = (set: any) => ({
  webAud: false,
  setWebAud: (newState: any) => {
    set(
      produce((state: any) => {
        state.webaudio.webAud = newState;
      }),
      false,
      'webaudio/setWebAud'
    );
  },
  webAudName: '',
  setWebAudName: (newState: any) => {
    set(
      produce((state: any) => {
        state.webaudio.webAudName = newState;
      }),
      false,
      'webaudio/setWebAudName'
    );
  },
  clientDevice: null,
  clientDevices: null as any,
  setClientDevice: (newState: any) => {
    set(
      produce((state: any) => {
        state.webaudio.clientDevice = newState;
      }),
      false,
      'webaudio/setClientDevice'
    );
  },
  setClientDevices: (newState: any) => {
    set(
      produce((state: any) => {
        state.webaudio.clientDevices = newState;
      }),
      false,
      'webaudio/setClientDevices'
    );
  },
});

export default storeWebAudio;
