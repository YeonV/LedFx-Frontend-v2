/* eslint-disable no-param-reassign */
import produce from 'immer';

const storeTours = (set: any) => ({
  tours: {
    home: false,
    devices: false,
    device: false,
    integrations: false,
    scenes: false,
    settings: false,
  },
  setTour: (tour: string): void =>
    set(
      produce((state: any) => {
        state.tours[tour] = true;
      }),
      false,
      'ui/setTour'
    ),
});

export default storeTours;
