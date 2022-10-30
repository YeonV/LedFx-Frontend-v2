/* eslint-disable no-param-reassign */
import produce from 'immer';

const storeDialogs = (set: any) => ({
  dialogs: {
    nohost: {
      open: false,
      edit: false,
    },
    addScene: {
      open: false,
      edit: false,
      sceneKey: '',
      editData: '',
    },
    addDevice: {
      open: false,
      edit: {} as any,
    },
    addVirtual: {
      open: false,
      edit: {} as any,
    },
    addIntegration: {
      open: false,
      edit: {} as any,
    },
  },
  setDialogOpen: (open: boolean, edit?: boolean) =>
    set(
      produce((state: any) => {
        state.dialogs.nohost = {
          open,
          edit,
        };
      }),
      false,
      'api/dialog/nohost'
    ),
  setDialogOpenAddScene: (
    open: boolean,
    edit?: boolean,
    sceneKey?: string,
    editData?: object
  ) =>
    set(
      produce((state: any) => {
        state.dialogs.addScene = {
          open,
          edit,
          sceneKey,
          editData,
        };
      }),
      false,
      'api/dialog/AddScene'
    ),
  setDialogOpenAddDevice: (open: boolean, edit?: boolean) =>
    set(
      produce((state: any) => {
        state.dialogs.addDevice = {
          open,
          edit,
        };
      }),
      false,
      'api/dialog/AddDevice'
    ),
  setDialogOpenAddVirtual: (open: boolean, edit?: boolean) =>
    set(
      produce((state: any) => {
        state.dialogs.addVirtual = {
          open,
          edit,
        };
      }),
      false,
      'api/dialog/AddVirtual'
    ),
  setDialogOpenAddIntegration: (open: boolean, edit?: boolean) =>
    set(
      produce((state: any) => {
        state.dialogs.addIntegration = {
          open,
          edit,
        };
      }),
      false,
      'api/dialog/AddIntegration'
    ),
});

export default storeDialogs;
