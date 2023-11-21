/* eslint-disable no-param-reassign */
import { produce } from 'immer'
import type { IStore } from '../useStore'

const storePad = (set: any) => ({
  mapping: {
    0: {},
    1: {},
    2: {},
    3: {}
  } as any,
  setMapping: (mapping: any): void =>
    set(
      produce((state: IStore) => {
        state.mapping = mapping
      }),
      false,
      'setMapping'
    )
})

export default storePad
