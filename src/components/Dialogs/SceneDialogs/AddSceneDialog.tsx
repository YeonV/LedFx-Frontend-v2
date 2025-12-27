import { useState } from 'react'
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography
} from '@mui/material'
import useStore from '../../../store/useStore'

const AddSceneDialog = () => {
  const [name, setName] = useState('')

  const addScene = useStore((state) => state.addScene)
  const getScenes = useStore((state) => state.getScenes)
  const scenes = useStore((state) => state.scenes)
  const open = useStore((state) => state.dialogs.addScene?.open || false)

  const setDialogOpenAddScene = useStore((state) => state.setDialogOpenAddScene)

  const nameExists = Object.values(scenes).some(
    (scene: any) => scene.name.toLowerCase() === name.trim().toLowerCase()
  )

  const invalid = name.trim() === '' || nameExists

  const handleClose = () => {
    setDialogOpenAddScene(false)
  }
  const handleAddScene = () => {
    if (!invalid) {
      addScene(name).then(async () => {
        const newScenes = await getScenes()
        const sceneId = newScenes && Object.keys(newScenes).find((s) => newScenes[s].name === name)
        setName('')
        if (sceneId) setDialogOpenAddScene(true, true, sceneId, newScenes[sceneId])
      })
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Scene</DialogTitle>
      <DialogContent>
        <Typography mb={2}>
          Save all active effects of all devices with their settings into one scene.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddScene()}
          required
          fullWidth
          error={nameExists && name.trim() !== ''}
          helperText={
            nameExists && name.trim() !== '' ? 'A scene with this name already exists' : ' '
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={invalid} onClick={handleAddScene}>
          Add & Configure
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddSceneDialog
