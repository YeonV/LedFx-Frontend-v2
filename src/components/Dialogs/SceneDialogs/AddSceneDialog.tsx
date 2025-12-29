import { useState } from 'react'
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  FormControlLabel,
  Switch,
  Stack,
  Chip
} from '@mui/material'
import useStore from '../../../store/useStore'

const AddSceneDialog = () => {
  const [name, setName] = useState('')
  const [includeVisualiser, setIncludeVisualiser] = useState(false)

  const addScene = useStore((state) => state.addScene)
  const getScenes = useStore((state) => state.getScenes)
  const scenes = useStore((state) => state.scenes)
  const open = useStore((state) => state.dialogs.addScene?.open || false)
  const features = useStore((state) => state.features)
  const visualiser = useStore((state) => state.visualiser)

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
      // Build visualiser settings if toggle is enabled
      const visualiserToSave = includeVisualiser && visualiser
        ? {
            type: visualiser.type,
            config: visualiser.config,
            audioSource: visualiser.audioSource
          }
        : null

      addScene(
        name,
        null, // scene_image
        null, // scene_tags
        null, // scene_puturl
        null, // scene_payload
        null, // scene_midiactivate
        undefined, // virtuals
        visualiserToSave
      ).then(async () => {
        const newScenes = await getScenes()
        const sceneId = newScenes && Object.keys(newScenes).find((s) => newScenes[s].name === name)
        setName('')
        setIncludeVisualiser(false)
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
        {features && features.showVisualiserInBottomBar && (
          <FormControlLabel
            control={
              <Switch
                checked={includeVisualiser}
                onChange={(e) => setIncludeVisualiser(e.target.checked)}
              />
            }
            label={
              <Stack direction="row" alignItems="center" gap={1}>
                <span>Include Visualiser Settings</span>
                {includeVisualiser && visualiser && (
                  <Chip size="small" label={visualiser.type} variant="outlined" />
                )}
              </Stack>
            }
            sx={{ mt: 1 }}
          />
        )}
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
