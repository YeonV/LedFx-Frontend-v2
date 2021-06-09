import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import useStore from "../../utils/apiStore";
import BladeSchemaFormNew from "../../components/SchemaForm/BladeSchemaFormNew";
import { Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minWidth: "200px",
    padding: "16px 1.2rem 6px 1.2rem",
    border: "1px solid #999",
    borderRadius: "10px",
    position: "relative",
    margin: "1rem 0",
    display: "flex",
    alignItems: "center",
    "@media (max-width: 580px)": {
      width: "100%",
      margin: "0.5rem 0",
    },
    "& > label": {
      top: "-0.7rem",
      display: "flex",
      alignItems: "center",
      left: "1rem",
      padding: "0 0.3rem",
      position: "absolute",
      fontVariant: "all-small-caps",
      backgroundColor: theme.palette.background.paper,
      boxSizing: "border-box",
    },
  },
}));

const AddIntegrationDialog = () => {
  const classes = useStyles();

  const getIntegrations = useStore((state) => state.getIntegrations);

  const addIntegration = useStore((state) => state.addIntegration);
  const updateIntegration = useStore((state) => state.updateIntegration);
  const integrations = useStore((state) => state.integrations);
  
  const open = useStore((state) => state.dialogs.addIntegration?.open || false);
  
  const integrationId = useStore((state) => state.dialogs.addIntegration?.edit || false);
  const initial = integrations[integrationId] || { type: "", config: {} };

  const setDialogOpenAddIntegration = useStore(
    (state) => state.setDialogOpenAddIntegration
  );

  const integrationsTypes = useStore((state) => state.schemas?.integrations);
  const showSnackbar = useStore((state) => state.showSnackbar);
  const [integrationType, setIntegrationType] = useState("");
  const [model, setModel] = useState({});

  const currentSchema = integrationType ? integrationsTypes[integrationType].schema : {};

  const handleClose = () => {
    setDialogOpenAddIntegration(false);
  };
  const handleAddDevice = (e) => {
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
        // console.log("ADDING");
        addIntegration({
          type: integrationType,
          config: { ...defaultModel, ...cleanedModel },
        }).then((res) => {
          if (res !== "failed") {
            setDialogOpenAddIntegration(false);
            getIntegrations();
          } else {
          }
        });
      } else {
        // console.log("EDITING");
        updateIntegration({
          id: integrationId,
          type: integrationType,
          config: { ...model },
        }).then((res) => {
          if (res !== "failed") {
            setDialogOpenAddIntegration(false);
            getIntegrations();
          } else {
          }
        });
      }
    }
  };
  const handleTypeChange = (value, initial = {}) => {
    setIntegrationType(value);
    setModel(initial);
  };
  const handleModelChange = (config) => {
    setModel({ ...model, ...config });
  };

  useEffect(() => {
    handleTypeChange(initial.type, initial.config);
  }, [initial.type]);

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
          : "Edit"}{" "}
        {integrationType.toUpperCase()} Integration
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add an interation to LedFx, please first select the type of integration you
          wish to add then provide the necessary configuration.
        </DialogContentText>
        <div className={classes.wrapper}>
          <label>Integration Type</label>
          <Select
            label="Type"
            style={{ flexGrow: 1 }}
            disableUnderline
            value={integrationType}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            {integrationsTypes &&
              Object.keys(integrationsTypes).map((item, i) => (
                <MenuItem key={i} value={item}>
                  {item}
                </MenuItem>
              ))}
          </Select>
        </div>
        <Divider style={{ marginBottom: "1rem" }} />
        {model && (
          <BladeSchemaFormNew
            schema={currentSchema}
            model={model}
            onModelChange={handleModelChange}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddDevice} color="primary">
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

export default AddIntegrationDialog;
