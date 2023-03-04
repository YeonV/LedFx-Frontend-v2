/* eslint-disable no-param-reassign */
import produce from 'immer';
import type { IStore } from '../useStore';
// eslint-disable-next-line prettier/prettier
type ITours = 'home' | 'devices' | 'device' | 'integrations' | 'scenes' | 'settings';

const storeTours = (set: any) => ({
  tours: {
    home: false,
    devices: false,
    device: false,
    integrations: false,
    scenes: false,
    settings: false,
  },
  setTour: (tour: ITours): void =>
    set(
      produce((state: IStore) => {
        state.tours[tour] = true;
      }),
      false,
      'ui/setTour'
    ),
});

export default storeTours;
