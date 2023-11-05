/* eslint-disable no-param-reassign */
import { produce } from 'immer'
import type { IStore } from '../useStore'

const storeDialogs = (set: any) => ({
  dialogs: {
    nohost: {
      open: false,
      edit: false
    },
    addScene: {
      open: false,
      edit: false,
      sceneKey: '',
      editData: '' as string | Record<string, any>
    },
    addDevice: {
      open: false,
      edit: {} as any
    },
    addVirtual: {
      open: false,
      edit: {} as any
    },
    editVirtual: {
      open: false,
      edit: {} as any
    },
    addIntegration: {
      open: false,
      edit: {} as any
    }
  },
  assistant: {
    wled: true,
    wledSegments: true,
    openRgb: true,
    launchpad: true
  },
  setAssistant: (
    kind: 'wled' | 'wledSegments' | 'openRgb' | 'launchpad',
    val: boolean
  ) =>
    set(
      produce((state: IStore) => {
        state.assistant[kind] = val
      }),
      false,
      'api/dialog/nohost'
    ),
  setDialogOpen: (open: boolean, edit?: boolean) =>
    set(
      produce((state: IStore) => {
        state.dialogs.nohost = {
          open,
          edit: edit || false
        }
      }),
      false,
      'api/dialog/nohost'
    ),
  setDialogOpenAddScene: (
    open: boolean,
    edit?: boolean,
    sceneKey?: string,
    editData?: string | Record<string, any>
  ) =>
    set(
      produce((state: IStore) => {
        state.dialogs.addScene = {
          open,
          edit: edit || false,
          sceneKey: sceneKey || '',
          editData: editData || ''
        }
      }),
      false,
      'api/dialog/AddScene'
    ),
  setDialogOpenAddDevice: (open: boolean, edit?: boolean) =>
    set(
      produce((state: IStore) => {
        state.dialogs.addDevice = {
          open,
          edit
        }
      }),
      false,
      'api/dialog/AddDevice'
    ),
  setDialogOpenAddVirtual: (open: boolean, edit?: boolean) =>
    set(
      produce((state: IStore) => {
        state.dialogs.addVirtual = {
          open,
          edit
        }
      }),
      false,
      'api/dialog/AddVirtual'
    ),
  setDialogOpenEditVirtual: (open: boolean, edit?: boolean) =>
    set(
      produce((state: IStore) => {
        state.dialogs.editVirtual = {
          open,
          edit
        }
      }),
      false,
      'api/dialog/EditVirtual'
    ),
  setDialogOpenAddIntegration: (open: boolean, edit?: boolean) =>
    set(
      produce((state: IStore) => {
        state.dialogs.addIntegration = {
          open,
          edit
        }
      }),
      false,
      'api/dialog/AddIntegration'
    )
})

export default storeDialogs
