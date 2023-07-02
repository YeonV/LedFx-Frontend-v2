import { useState, useEffect } from 'react'
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material'
import { WebMidi, Input, NoteMessageEvent } from 'webmidi'
import useStore from '../../store/useStore'

const AddSceneDialog = () => {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [tags, setTags] = useState('')
  const [url, setUrl] = useState('')
  const [payload, setPayload] = useState('')
  const [midiActivate, setMIDIActivate] = useState('')
  const [overwrite, setOverwrite] = useState(false)
  const [invalid, setInvalid] = useState(false)

  const addScene = useStore((state) => state.addScene)
  const getScenes = useStore((state) => state.getScenes)
  const scenes = useStore((state) => state.scenes)
  const open = useStore((state) => state.dialogs.addScene?.open || false)
  const features = useStore((state) => state.features)
  const setDialogOpenAddScene = useStore((state) => state.setDialogOpenAddScene)

  function isValidURL(string: string) {
    const res = string.match(
      /(?![\s\S])|\d(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g
    )
    return res !== null
  }

  const handleClose = () => {
    setDialogOpenAddScene(false)
  }

  const handleAddScene = () => {
    if (!invalid) {
      addScene(name, image, tags, url, payload, midiActivate).then(() => {
        getScenes()
      })
      setName('')
      setImage('')
      setTags('')
      setUrl('')
      setPayload('')
      setMIDIActivate('')
      setDialogOpenAddScene(false)
    }
  }

  useEffect(() => {
    const handleMidiEvent = (input: Input, event: NoteMessageEvent) => {
      setMIDIActivate(`${input.name} Note: ${event.note.identifier}`)
    }
    WebMidi.enable({
      callback(err: Error) {
        if (err) {
          console.log('WebMidi could not be enabled:', err)
        } else {
          console.log(WebMidi.inputs.length)
          // Get all input devices
          const { inputs } = WebMidi
          if (inputs.length > 0) {
            // Listen for MIDI messages on all channels and all input devices
            inputs.forEach((input: Input) =>
              input.addListener('noteon', (event: NoteMessageEvent) => {
                handleMidiEvent(input, event)
                // console.log(`${input.name}: Note: ${event.note.identifier}`);
              })
            )
          }
        }
      },
    })
  }, [])

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Scene</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">
          Image is optional and can be one of:
        </Typography>
        <ul style={{ paddingLeft: '1rem' }}>
          <li>iconName - Find MUI icons here, eg. flare, AccessAlarms</li>
          <li>
            mdi:icon-name - Find Material Design icons here, eg. mdi:balloon,
            mdi:led-strip-variant
          </li>
          <li>
            image:custom-url -
            eg.image:https://i.ytimg.com/vi/4G2unzNoOnY/maxresdefault.jpg
          </li>
        </ul>

        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => {
            setOverwrite(
              Object.keys(scenes).indexOf(e.target.value.toLowerCase()) > -1
            )
          }}
          error={overwrite}
          helperText={overwrite && 'Scene already existing!'}
          required
          fullWidth
        />
        <TextField
          margin="dense"
          id="scene_image"
          label="Image"
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          fullWidth
        />
        <TextField
          margin="dense"
          id="scene_tags"
          label="Tags"
          type="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          fullWidth
        />

        {features.sceneexternal && (
          <>
            <TextField
              margin="dense"
              id="scene_url"
              label="Url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              error={invalid}
              helperText={invalid && 'Enter valid URL!'}
              onBlur={(e) => {
                setInvalid(!isValidURL(e.target.value))
              }}
            />
            <TextField
              margin="dense"
              id="scene_payload"
              label="Payload"
              type="text"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              fullWidth
            />
          </>
        )}
        {WebMidi.inputs.length > 0 ? (
          <>
            <Typography>
              MIDI Device/s detected. Press a MIDI button to assign to this
              scene.
            </Typography>
            {scenes &&
              Array.isArray(scenes) &&
              scenes.map(
                (scene) =>
                  scene.midiactivate && (
                    <Typography key={scene.name}>
                      Please select another MIDI key/button. Already assigned to{' '}
                      {scene.name}
                    </Typography>
                  )
              )}
          </>
        ) : (
          <Typography>No MIDI input devices found.</Typography>
        )}

        <TextField
          margin="dense"
          id="latest_note_on"
          label="MIDI Note to activate scene"
          type="text"
          value={midiActivate}
          fullWidth
          disabled
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddScene}>
          {overwrite ? 'Overwrite' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddSceneDialog
