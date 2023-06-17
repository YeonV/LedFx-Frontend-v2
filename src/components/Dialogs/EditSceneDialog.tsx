/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react'
import {
  Link,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Divider,
} from '@mui/material'
import { WebMidi, Input, NoteMessageEvent } from 'webmidi'
import useStore from '../../store/useStore'

const EditSceneDialog = () => {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [tags, setTags] = useState('')
  const [url, setUrl] = useState('')
  const [payload, setPayload] = useState('')
  const [invalid, setInvalid] = useState(false)
  const addScene = useStore((state) => state.addScene)
  const getScenes = useStore((state) => state.getScenes)
  const scenes = useStore((state) => state.scenes)
  const open = useStore((state) => state.dialogs.addScene?.edit || false)
  // const key = useStore((state: any) => state.dialogs.addScene?.sceneKey || '');
  const data = useStore((state: any) => state.dialogs.addScene?.editData)
  const features = useStore((state) => state.features)
  const [midiInput, setmidiInput] = useState('')

  const setDialogOpenAddScene = useStore((state) => state.setDialogOpenAddScene)

  useEffect(() => {
    setInvalid(false)

    WebMidi.enable({
      callback(err: Error) {
        if (err) {
          console.log('WebMidi could not be enabled:', err)
        } else {
          // Get all input devices
          const { inputs } = WebMidi

          if (inputs.length > 0) {
            // Listen for MIDI messages on all channels and all input devices
            inputs.forEach((input: Input) =>
              input.addListener('noteon', (event: NoteMessageEvent) => {
                setmidiInput(
                  `${input.name} Note: ${event.note.name}${event.note.octave}`
                ) // Set the latest note on in state
              })
            )
          }
        }
      },
    })
  }, [])

  function isValidURL(string: string) {
    const res = string.match(
      /(?![\s\S])|\d(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g
    )
    return res !== null
  }

  useEffect(() => {
    if (data) {
      setName(data?.name)
      setImage(data?.scene_image)
      setTags(data?.scene_tags)
      setUrl(data?.scene_puturl)
      setPayload(data?.scene_payload)
    }
  }, [data])
  const handleClose = () => {
    setDialogOpenAddScene(false, false)
  }

  const handleAddScene = () => {
    addScene(name, image, tags, url, payload).then(() => {
      getScenes()
    })
    setName('')
    setImage('')
    setTags('')
    setUrl('')
    setPayload('')
    setDialogOpenAddScene(false, false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Scene</DialogTitle>
      <DialogContent>
        {!data && (
          <>
            Image is optional and can be one of:
            <ul style={{ paddingLeft: '1rem' }}>
              <li>
                iconName{' '}
                <Link
                  href="https://material-ui.com/components/material-icons/"
                  target="_blank"
                >
                  Find MUI icons here
                </Link>
                <Typography color="textSecondary" variant="subtitle1">
                  <em>eg. flare, AccessAlarms</em>
                </Typography>
              </li>
              <li>
                mdi:icon-name{' '}
                <Link href="https://materialdesignicons.com" target="_blank">
                  Find Material Design icons here
                </Link>
                <Typography color="textSecondary" variant="subtitle1">
                  <em>eg. mdi:balloon, mdi:led-strip-variant</em>
                </Typography>
              </li>
              <li>
                image:custom-url
                <Typography
                  color="textSecondary"
                  variant="subtitle1"
                  style={{ wordBreak: 'break-all' }}
                >
                  <em>
                    eg.
                    image:https://i.ytimg.com/vi/4G2unzNoOnY/maxresdefault.jpg
                  </em>
                </Typography>
              </li>
            </ul>
          </>
        )}
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled
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
        {features.sceneexternal ? (
          <>
            <TextField
              margin="dense"
              id="url"
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
              id="payload"
              label="Payload"
              type="text"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              fullWidth
            />
          </>
        ) : (
          <></>
        )}
        <Divider sx={{ mt: '1rem' }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontVariant: 'all-small-caps',
          }}
        >
          <span>Device</span>
          <span>Effect</span>
        </div>
        <Divider />
        {data &&
          scenes &&
          scenes[data.name.toLowerCase()] &&
          Object.keys(scenes[data.name.toLowerCase()].virtuals)
            .filter((d) => !!scenes[data.name.toLowerCase()].virtuals[d].type)
            .map((dev, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontVariant: 'all-small-caps',
                }}
              >
                <span>{dev}</span>
                <span>
                  {scenes[data.name.toLowerCase()].virtuals[dev].type}
                </span>
              </div>
            ))}
        {/* Display all input devices */}
        {WebMidi.inputs.length > 0 ? (
          <>
            <Typography variant="subtitle1" gutterBottom>
              MIDI Device/s detected. Press a MIDI button to assign to this
              scene.
            </Typography>
          </>
        ) : (
          <Typography color="error">No MIDI input devices found</Typography>
        )}
        {/* Display latest MIDI note on */}
        {midiInput && (
          <TextField
            margin="dense"
            id="latest_note_on"
            label="MIDI Note to activate scene"
            type="text"
            value={midiInput}
            fullWidth
            disabled
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddScene}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditSceneDialog
