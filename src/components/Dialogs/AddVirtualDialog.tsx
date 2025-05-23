import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Link
} from '@mui/material'
import { Tune } from '@mui/icons-material'
import useStore from '../../store/useStore'
import BladeSchemaForm from '../SchemaForm/SchemaForm/SchemaForm'
import EditVirtuals from '../../pages/Devices/EditVirtuals/EditVirtuals'
import SeeDocs from '../SeeDocs/SeeDocs'

const AddVirtualDialog = () => {
  const addVirtual = useStore((state) => state.addVirtual)
  const getDevices = useStore((state) => state.getDevices)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const virtuals = useStore((state) => state.virtuals)
  const [expanded, setExpanded] = useState(false)

  const open = useStore((state) => state.dialogs.addVirtual?.open || false)
  const virtId = useStore((state) => state.dialogs.addVirtual?.edit || false)
  const getV = () => {
    for (const prop in virtuals) {
      if (virtuals[prop].id === virtId) {
        return virtuals[prop]
      }
    }
  }

  const virtual = getV()

  const initial = virtual || { type: '', config: {} }

  const setDialogOpenAddVirtual = useStore((state) => state.setDialogOpenAddVirtual)
  const setCurrentVirtual = useStore((state) => state.setCurrentVirtual)

  const virtualsSchemas = useStore((state) => state.schemas?.virtuals)
  const showSnackbar = useStore((state) => state.ui.showSnackbar)
  const [model, setModel] = useState<any>({})

  const currentSchema = (virtualsSchemas && virtualsSchemas.schema) || {}

  const handleClose = () => {
    setDialogOpenAddVirtual(false)
    setCurrentVirtual(null)
    setModel({})
  }
  const handleAddVirtual = () => {
    const cleanedModel = Object.fromEntries(Object.entries(model).filter(([_, v]) => v !== ''))
    const defaultModel = {} as any

    for (const key in currentSchema.properties) {
      if (currentSchema.properties[key].default !== undefined) {
        defaultModel[key] = currentSchema.properties[key].default
      }
    }

    const valid = currentSchema.required.every((val: string) =>
      Object.keys({ ...defaultModel, ...cleanedModel }).includes(val)
    )

    if (!valid) {
      showSnackbar('warning', 'Please fill in all required fields.')
    } else if (addNew) {
      // console.log("ADDING");
      addVirtual({
        config: { ...defaultModel, ...cleanedModel }
      }).then((res) => {
        // console.log(res);
        if (res !== 'failed') {
          setDialogOpenAddVirtual(false)
          getDevices()
          getVirtuals()
          setModel({})
        }
        // else {
        // }
      })
    } else {
      // console.log("EDITING");
      addVirtual({
        id: virtId,
        config: { ...model }
      }).then((res) => {
        // console.log(res);
        if (res !== 'failed') {
          setDialogOpenAddVirtual(false)
          getDevices()
          getVirtuals()
          setModel({})
        }
        // else {
        // }
      })
    }
  }

  const handleModelChange = (config: any) => {
    setModel({ ...model, ...config })
  }

  useEffect(() => {
    handleModelChange(initial.config)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtId, JSON.stringify(initial.config)])

  const addNew =
    initial.config &&
    Object.keys(initial.config).length === 0 &&
    initial.config?.constructor === Object

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {addNew ? 'Add Virtual Device' : 'Settings'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            With Virtuals, you can split devices into segments and merge several segments over
            several devices into one Virtual-Device.
            <div style={{ marginTop: '1rem', color: '#666' }}>
              {' '}
              Icons:{' '}
              <Link href="https://mui.com/material-ui/material-icons/" target="_blank">
                MUI
              </Link>
              (ie: iconName) |{' '}
              <Link href="https://pictogrammers.com/library/mdi" target="_blank">
                MDI
              </Link>
              (ie: mdi:icon-name) |{' '}
              <SeeDocs url="https://docs.ledfx.app/en/latest/howto/virtuals.html" />
            </div>
          </DialogContentText>

          <BladeSchemaForm
            schema={currentSchema}
            model={addNew ? model : { ...initial.config, ...model }}
            onModelChange={handleModelChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddVirtual} color="primary">
            {addNew ? 'Add & Setup Segments' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <EditVirtuals
        label="Edit Virtual"
        variant="text"
        color="inherit"
        virtId={virtId}
        icon={undefined}
        className={`step-devices-six-${expanded}`}
        startIcon={<Tune />}
        type="hidden"
        innerKey={undefined}
        onClick={() => setExpanded(false)}
      />
    </>
  )
}

export default AddVirtualDialog
