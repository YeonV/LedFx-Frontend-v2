import { produce } from 'immer'
import type { IStore } from '../useStore'
type ITours =
  | 'home'
  | 'devices'
  | 'device'
  | 'effect'
  | 'integrations'
  | 'scenes'
  | 'settings'
  | '2d-virtual'

const storeTours = (set: any) => ({
  tours: {
    home: false,
    devices: false,
    device: false,
    effect: false,
    integrations: false,
    scenes: false,
    settings: false,
    '2d-virtual': false
  },
  setTour: (tour: ITours): void =>
    set(
      produce((state: IStore) => {
        state.tours[tour] = true
      }),
      false,
      'ui/setTour'
    ),
  setTourOpen: (tour: ITours, open: boolean): void =>
    set(
      produce((state: IStore) => {
        state.tours[tour] = open
      }),
      false,
      'ui/setTour'
    )
})

export default storeTours
