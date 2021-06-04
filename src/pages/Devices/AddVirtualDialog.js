import { useState, useEffect } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import useStore from "../../utils/apiStore";
import BladeSchemaFormNew from "../../components/SchemaForm/BladeSchemaFormNew";

const AddVirtualDialog = () => {
  const addDisplay = useStore((state) => state.addDisplay);
  const getDevices = useStore((state) => state.getDevices);
  const getDisplays = useStore((state) => state.getDisplays);
  const displays = useStore((state) => state.displays);

  const open = useStore((state) => state.dialogs.addVirtual?.open || false);
  const displayId = useStore(
    (state) => state.dialogs.addVirtual?.edit || false
  );
  const initial = displays[displayId] || { type: "", config: {} };

  const setDialogOpenAddVirtual = useStore(
    (state) => state.setDialogOpenAddVirtual
  );

  const displaysSchemas = useStore((state) => state.schemas?.displays);
  const showSnackbar = useStore((state) => state.showSnackbar);
  const [model, setModel] = useState({});

  const currentSchema = (displaysSchemas && displaysSchemas.schema) || {};

  const handleClose = () => {
    setDialogOpenAddVirtual(false);
    setModel({});
  };
  const handleAddDisplay = (e) => {
    const cleanedModel = Object.fromEntries(
      Object.entries(model).filter(([_, v]) => v !== "")
    );
    const defaultModel = {};

    for (const key in currentSchema.properties) {
      currentSchema.properties[key].default !== undefined
        ? (defaultModel[key] = currentSchema.properties[key].default)
        : undefined;
    }

    const valid = currentSchema.required.every((val) =>
      Object.keys({ ...defaultModel, ...cleanedModel }).includes(val)
    );

    if (!valid) {
      showSnackbar({
        message: "Please fill in all required fields.",
        messageType: "warning",
      });
    } else {
      if (
        initial.config &&
        Object.keys(initial.config).length === 0 &&
        initial.config.constructor === Object
      ) {
        console.log("ADDING");
        addDisplay({
          config: { ...defaultModel, ...cleanedModel },
        }).then((res) => {
          console.log(res);
          if (res !== "failed") {
            setDialogOpenAddVirtual(false);
            getDevices();
            getDisplays();
          } else {
          }
        });
      } else {
        console.log("EDITING");
        addDisplay({
          id: displayId,
          config: { ...model },
        }).then((res) => {
          console.log(res);
          if (res !== "failed") {
            setDialogOpenAddVirtual(false);
            getDevices();
            getDisplays();
          } else {
          }
        });
      }
    }
  };

  const handleModelChange = (config) => {
    setModel({ ...model, ...config });
  };

  useEffect(() => {
    handleModelChange(initial.config);
  }, [displayId]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {initial.config &&
        Object.keys(initial.config).length === 0 &&
        initial.config.constructor === Object
          ? "Add"
          : "Edit"} Virtual Device
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          With Virtuals, you can split devices into segments and merge several
          segments over several devices into one Virtual-Device.
        </DialogContentText>

        <BladeSchemaFormNew
          schema={currentSchema}
          model={model}
          onModelChange={handleModelChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddDisplay} color="primary">
          {initial.config &&
          Object.keys(initial.config).length === 0 &&
          initial.config.constructor === Object
            ? "Add"
            : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVirtualDialog;
