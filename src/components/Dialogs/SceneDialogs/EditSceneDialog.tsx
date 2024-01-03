/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  Link,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Toolbar,
  Divider,
  useTheme,
  CardMedia,
  Chip,
  Select,
  MenuItem,
  ListSubheader,
  Alert,
  InputAdornment,
  Stack,
  InputLabel,
  FormControl,
  Avatar,
  useMediaQuery,
  Autocomplete
} from '@mui/material'
import { Clear, Undo, NavigateBefore, MusicNote } from '@mui/icons-material'
import { WebMidi, Input, NoteMessageEvent } from 'webmidi'
import { filterKeys, ordered } from '../../../utils/helpers'
import useStore from '../../../store/useStore'
import BladeIcon from '../../Icons/BladeIcon/BladeIcon'
import TooltipImage from './TooltipImage'
import TooltipTags from './TooltipTags'
import TooltipMidi from './TooltipMidi'

const EditSceneDialog = () => {
  const theme = useTheme()
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [tags, setTags] = useState('')
  const [url, setUrl] = useState('')
  const [payload, setPayload] = useState('')
  const [midiActivate, setMIDIActivate] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [lp, setLp] = useState(undefined as any)
  const [disabledPSelector, setDisabledPSelector] = useState([] as string[])
  const [scVirtualsToIgnore, setScVirtualsToIgnore] = useState<string[]>([])
  const medium = useMediaQuery('(max-width: 920px )')
  const small = useMediaQuery('(max-width: 580px )')
  const xsmall = useMediaQuery('(max-width: 480px )')

  const { user_presets } = useStore((state) => state.config)
  const { effects } = useStore((state) => state.schemas)
  const scenes = useStore((state) => state.scenes)
  const open = useStore((state) => state.dialogs.addScene?.edit || false)
  const data = useStore((state: any) => state.dialogs.addScene?.editData)
  const features = useStore((state) => state.features)
  const sceneActiveTags = useStore((state) => state.ui.sceneActiveTags)

  const setDialogOpenAddScene = useStore((state) => state.setDialogOpenAddScene)
  const setEffect = useStore((state) => state.setEffect)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const activatePreset = useStore((state) => state.activatePreset)
  const activateScene = useStore((state) => state.activateScene)
  const addScene = useStore((state) => state.addScene)
  const getScenes = useStore((state) => state.getScenes)
  const getLedFxPresets = useStore((state) => state.getLedFxPresets)

  const toggletSceneActiveTag = useStore(
    (state) => state.ui.toggletSceneActiveTag
  )

  const sceneImage = (iconName: string) =>
    iconName && iconName.startsWith('image:') ? (
      <div>
        <CardMedia
          style={{
            height: tags?.split(',')[0].length > 0 ? 140 : 125,
            maxWidth: 334,
            width: small ? '100%' : 334,
            marginTop: '1rem'
          }}
          image={iconName?.split('image:')[1]}
          title="Contemplative Reptile"
        />
      </div>
    ) : (
      <div>
        <BladeIcon
          scene
          style={{
            height: 140,
            maxWidth: 334,
            width: small ? '100%' : 334,
            display: 'flex',
            alignItems: 'center',
            margin: `${tags?.split(',')[0].length > 0 ? 0 : '1.25rem'} auto 0`,
            justifyContent: 'center',
            fontSize: 140,
            '& > span:before': {
              position: 'relative'
            }
          }}
          name={iconName}
        />
      </div>
    )

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
      setMIDIActivate(data?.scene_midiactivate)
    }
  }, [data])

  const handleClose = () => {
    setDialogOpenAddScene(false, false)
  }

  const handleAddScene = () => {
    addScene(name, image, tags, url, payload, midiActivate).then(() => {
      getScenes()
    })
    setName('')
    setImage('')
    setTags('')
    setUrl('')
    setPayload('')
    setMIDIActivate('')
    setDisabledPSelector([])
    setScVirtualsToIgnore([])
    setDialogOpenAddScene(false, false)
  }

  const sVirtuals =
    scenes[data.name?.toLowerCase().replaceAll(' ', '-')]?.virtuals || {}

  const handleAddSceneWithVirtuals = () => {
    addScene(
      name,
      image,
      tags,
      url,
      payload,
      midiActivate,
      filterKeys(sVirtuals, scVirtualsToIgnore)
    ).then(() => {
      getScenes()
    })
    setName('')
    setImage('')
    setTags('')
    setUrl('')
    setPayload('')
    setMIDIActivate('')
    setDisabledPSelector([])
    setScVirtualsToIgnore([])
    setDialogOpenAddScene(false, false)
  }

  useEffect(() => {
    getLedFxPresets().then((ledfx_presets) => {
      setLp(ledfx_presets)
    })
  }, [])

  useEffect(() => {
    if (open) activateScene(data.name?.toLowerCase().replaceAll(' ', '-'))
  }, [open])

  useEffect(() => {
    if (features.scenemidi) {
      const handleMidiEvent = (input: Input, event: NoteMessageEvent) => {
        setMIDIActivate(
          `${input.name} Note: ${event.note.identifier} buttonNumber: ${event.note.number}`
        )
      }
      WebMidi.enable({
        callback(err: Error) {
          if (err) {
            // eslint-disable-next-line no-console
            console.error('WebMidi could not be enabled:', err)
          } else {
            // Get all input devices
            const { inputs } = WebMidi
            if (inputs.length > 0) {
              // Listen for MIDI messages on all channels and all input devices
              inputs.forEach((input: Input) =>
                input.addListener('noteon', (event: NoteMessageEvent) => {
                  handleMidiEvent(input, event)
                })
              )
            }
          }
        }
      })
    }
  }, [])

  const renderPresets = (ledfx_presets: any, dev: string, effectId: string) => {
    if (ledfx_presets) {
      const ledfxPreset =
        ledfx_presets &&
        Object.keys(ledfx_presets).length > 0 &&
        Object.keys(ledfx_presets).find(
          (k) =>
            JSON.stringify(ordered((ledfx_presets[k] as any).config)) ===
            JSON.stringify(ordered(sVirtuals[dev].config))
        )
      const userPresets =
        user_presets[effectId] &&
        Object.keys(user_presets[effectId])
          .map(
            (k) =>
              JSON.stringify(
                ordered((user_presets[effectId][k] as any).config)
              ) === JSON.stringify(ordered(sVirtuals[dev].config)) && k
          )
          .filter((n) => !!n)
      const userPreset =
        userPresets && userPresets.length === 1 && userPresets[0]

      return ledfxPreset || userPreset ? (
        <Select
          defaultValue={ledfxPreset || userPreset}
          onChange={(e) => {
            let category = 'ledfx_presets'
            if (
              user_presets &&
              user_presets[effectId] &&
              Object.prototype.hasOwnProperty.call(
                user_presets[effectId],
                e.target.value
              )
            ) {
              category = 'user_presets'
            }

            return (
              e.target.value &&
              activatePreset(
                dev,
                category,
                sVirtuals[dev].type,
                e.target.value
              ).then(() => getVirtuals())
            )
          }}
          disabled={
            scVirtualsToIgnore.indexOf(dev) > -1 ||
            disabledPSelector.indexOf(dev) > -1
          }
          disableUnderline
          sx={{
            textDecoration:
              scVirtualsToIgnore.indexOf(dev) > -1 ? 'line-through' : ''
          }}
        >
          {ledfx_presets && <ListSubheader>LedFx Presets</ListSubheader>}
          {ledfx_presets &&
            Object.keys(ledfx_presets)
              .sort((k) => (k === 'reset' ? -1 : 1))
              .map((ke, i) => (
                <MenuItem key={ke + i} value={ke}>
                  {ke === 'reset' ? 'Default' : ke}
                </MenuItem>
              ))}
          {user_presets && <ListSubheader>User Presets</ListSubheader>}
          {user_presets &&
            user_presets[effectId] &&
            Object.keys(user_presets[effectId]).map((ke, i) => (
              <MenuItem key={ke + i} value={ke}>
                {ke}
              </MenuItem>
            ))}
        </Select>
      ) : (
        <Select value="Not saved as Preset" disableUnderline>
          <MenuItem value="Not saved as Preset">Not saved as Preset</MenuItem>
        </Select>
      )
    }
    return <></>
  }
  const renderEffects = (effect: string, dev: string) => {
    return (
      effects && (
        <Select
          defaultValue={effect}
          onChange={(e) => {
            setEffect(dev, e.target.value, {}, true)
            setDisabledPSelector([...disabledPSelector, dev])
          }}
          disabled={scVirtualsToIgnore.indexOf(dev) > -1}
          disableUnderline
          sx={{
            textDecoration:
              scVirtualsToIgnore.indexOf(dev) > -1 ? 'line-through' : ''
          }}
        >
          {Object.keys(effects).map((ke, i) => (
            <MenuItem key={ke + i} value={ke}>
              {ke}
            </MenuItem>
          ))}
        </Select>
      )
    )
  }

  return (
    <Dialog
      fullScreen={!!data}
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <AppBar
        enableColorOnDark
        // className={classes.appBar}
      >
        <Toolbar>
          <Button
            autoFocus
            color="primary"
            variant="contained"
            startIcon={<NavigateBefore />}
            onClick={() => {
              setDisabledPSelector([])
              setScVirtualsToIgnore([])
              handleClose()
            }}
            style={{ marginRight: '1rem' }}
          >
            back
          </Button>
          <Typography
            variant="h6"
            // className={classes.title}
          >
            Edit Scene: {name}
          </Typography>
        </Toolbar>
      </AppBar>
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
        <div
          style={{
            display: 'flex',
            margin: '0 auto',
            maxWidth: '960px',
            flexDirection: medium ? 'column-reverse' : 'row'
          }}
        >
          <div style={{ flexGrow: 1, paddingRight: medium ? 0 : '2rem' }}>
            <TextField
              sx={{ mt: data ? '2rem' : '' }}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <TooltipImage />
                  </InputAdornment>
                )
              }}
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              fullWidth
            />

            <Autocomplete
              onChange={(e, a) => setTags(a.join(','))}
              multiple
              limitTags={4}
              id="tags"
              options={
                Object.values(scenes)
                  .flatMap((s: any) => s.scene_tags?.split(','))
                  .filter((n) => !!n) || []
              }
              defaultValue={tags?.split(',').filter((n) => !!n) || []}
              freeSolo
              renderTags={(value: readonly string[], getTagProps) =>
                value.map(
                  (option: string, index: number) =>
                    option &&
                    option.length > 0 && (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    )
                )
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tags"
                  sx={{
                    mt: '0.5rem',
                    mb: '0.5rem',
                    '& .MuiInputBase-root': { pr: '9px !important' }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mr: '5px' }}>
                        <TooltipTags />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            {features.sceneexternal ? (
              <div
                style={{ display: 'flex', margin: '0 auto', maxWidth: '960px' }}
              >
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
              </div>
            ) : (
              <></>
            )}
            {features && features.scenemidi && WebMidi.inputs.length > 0 ? (
              <>
                <Stack direction={small ? 'column' : 'row'} gap={1}>
                  <FormControl sx={{ mt: 1, width: small ? '100%' : '130px' }}>
                    <InputLabel id="midi-label">Connected To</InputLabel>
                    <Select
                      variant="outlined"
                      defaultValue="Client"
                      label="Connected To"
                    >
                      <MenuItem value="Client">Client</MenuItem>
                      <MenuItem value="Core" disabled>
                        Core
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    margin="dense"
                    id="latest_note_on"
                    label="MIDI Note to activate scene"
                    error={
                      midiActivate !== null &&
                      midiActivate !== '' &&
                      Object.keys(scenes)
                        .filter(
                          (k) =>
                            k !== data.name?.toLowerCase().replaceAll(' ', '-')
                        )
                        .some(
                          (sceneId: any) =>
                            scenes[sceneId]?.scene_midiactivate === midiActivate
                        )
                    }
                    helperText={
                      midiActivate !== null &&
                      midiActivate !== '' &&
                      Object.keys(scenes)
                        .filter(
                          (k) =>
                            k !== data.name?.toLowerCase().replaceAll(' ', '-')
                        )
                        .some(
                          (sceneId: any) =>
                            scenes[sceneId]?.scene_midiactivate === midiActivate
                        ) && (
                        <Typography>
                          Please select another MIDI key/button. Already
                          assigned to{' '}
                          {
                            scenes[
                              Object.keys(scenes)
                                .filter(
                                  (k) =>
                                    k !==
                                    data.name
                                      ?.toLowerCase()
                                      .replaceAll(' ', '-')
                                )
                                .find(
                                  (sceneId: any) =>
                                    scenes[sceneId]?.scene_midiactivate ===
                                    midiActivate
                                )!
                            ]!.name
                          }
                        </Typography>
                      )
                    }
                    type="text"
                    // value={midiActivate}
                    fullWidth
                    disabled
                    sx={{
                      color: 'transparent',
                      '& input': {
                        width: xsmall ? '5px' : '100%',
                        height: xsmall ? '5rem' : ''
                      }
                    }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <TooltipMidi />
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            flexWrap: xsmall ? 'wrap' : '',
                            mt: xsmall ? -8 : ''
                          }}
                        >
                          {midiActivate?.split(' ')?.length > 1 && (
                            <>
                              <Chip
                                label={midiActivate
                                  ?.split(' ')[0]
                                  .replace('MIDI', '')}
                                avatar={
                                  <Avatar>
                                    <BladeIcon name="mdi:midi" />
                                  </Avatar>
                                }
                              />
                              {/* <Chip
                            label={/\((.*?)\)/.exec(midiActivate)?.[1]}
                            onDelete={() => setMIDIActivate('')}
                            avatar={
                              <Avatar>
                                {/\((.*?)\)/.exec(midiActivate)?.[1]}
                              </Avatar>
                            }
                          /> */}
                              <Chip
                                label={
                                  midiActivate
                                    ?.split('Note: ')[1]
                                    ?.split(' ')[0]
                                }
                                avatar={
                                  <Avatar>
                                    <MusicNote />
                                  </Avatar>
                                }
                              />
                              <Chip
                                // onDelete={() => setMIDIActivate('')}
                                label={
                                  midiActivate
                                    ?.split('buttonNumber: ')[1]
                                    ?.split(' ')[0]
                                }
                                avatar={<Avatar>No</Avatar>}
                              />
                              <Chip
                                onDelete={() => setMIDIActivate('')}
                                label={/\((.*?)\)/
                                  .exec(midiActivate)?.[1]
                                  .replace('MIDI', '')}
                                icon={<BladeIcon name="mdi:midi" />}
                              />
                            </>
                          )}
                        </InputAdornment>
                      )
                    }}
                  />
                </Stack>
              </>
            ) : (
              <></>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignmentBaseline: 'central'
            }}
          >
            {sceneImage(image || 'Wallpaper')}
            {scenes &&
            Object.keys(scenes).length &&
            features.scenechips &&
            tags?.split(',').length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  maxWidth: '344px',
                  width: '100%'
                }}
              >
                {tags?.split(',').map((t: string) => (
                  <Chip
                    variant={
                      sceneActiveTags.includes(t) ? 'filled' : 'outlined'
                    }
                    sx={{
                      flexGrow: 0,
                      minWidth: 50,
                      ml: 1,
                      mt: 1,
                      mr: 1,
                      cursor: sceneActiveTags.includes(t)
                        ? 'zoom-out'
                        : 'zoom-in'
                    }}
                    key={t}
                    label={t}
                    onClick={() => toggletSceneActiveTag(t)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <Divider sx={{ margin: '2rem auto 0', maxWidth: '960px' }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontVariant: 'all-small-caps',
            textAlign: 'right',
            margin: '0 auto',
            maxWidth: '960px'
          }}
        >
          <span>Device</span>
          <span style={{ flexGrow: 1, textAlign: 'right' }}>Effect</span>
          <div style={{ marginRight: '4rem', width: 180 }}>
            <span style={{ width: 180 }}>Preset</span>
          </div>
        </div>
        <Divider sx={{ margin: '0 auto', maxWidth: '960px' }} />
        {data &&
          scenes &&
          data.name?.toLowerCase().replaceAll(' ', '-') &&
          scenes[data.name?.toLowerCase().replaceAll(' ', '-')] &&
          Object.keys(sVirtuals)
            .filter(
              (d) =>
                !!scenes[data.name?.toLowerCase().replaceAll(' ', '-')]
                  .virtuals[d].type
            )
            .map((dev, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontVariant: 'all-small-caps',
                  margin: '0 auto',
                  maxWidth: '960px',
                  color:
                    scVirtualsToIgnore.indexOf(dev) > -1
                      ? theme.palette.text.disabled
                      : '',
                  textDecoration:
                    scVirtualsToIgnore.indexOf(dev) > -1 ? 'line-through' : ''
                }}
              >
                <span>{dev}</span>
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  {renderEffects(
                    scenes[data.name?.toLowerCase().replaceAll(' ', '-')]
                      .virtuals[dev].type,
                    dev
                  )}
                  <span style={{ width: 180, textAlign: 'right' }}>
                    {lp &&
                      renderPresets(
                        lp[
                          scenes[data.name?.toLowerCase().replaceAll(' ', '-')]
                            .virtuals[dev].type
                        ],
                        dev,
                        scenes[data.name?.toLowerCase().replaceAll(' ', '-')]
                          .virtuals[dev].type
                      )}
                  </span>
                  <Box
                    sx={{ ml: 2, cursor: 'pointer' }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onClick={() => {
                      setScVirtualsToIgnore((p) => {
                        return p.indexOf(dev) > -1
                          ? [...p.filter((v) => v !== dev)]
                          : [...p, dev]
                      })
                    }}
                  >
                    {scVirtualsToIgnore.indexOf(dev) > -1 ? (
                      <Undo />
                    ) : (
                      <Clear />
                    )}
                  </Box>
                </span>
              </div>
            ))}
        {disabledPSelector.length > 0 && (
          <Alert severity="info" sx={{ margin: '2rem auto', maxWidth: 960 }}>
            <Typography>
              Effect-Type Changed! Preset-Selectors disabled until saved or
              canceled
            </Typography>
          </Alert>
        )}
        {scVirtualsToIgnore.length > 0 && (
          <Alert severity="info" sx={{ margin: '2rem auto', maxWidth: 960 }}>
            <Typography>
              Removing detected: <br />
              You can use this to make this scene ignore disabled Virtuals, so
              it will not overwrite those on activation.
              <br />
              However, once saved you can <b>not</b> undo it. You would need to
              add a new Scene.
            </Typography>
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() =>
            scVirtualsToIgnore.length > 0
              ? handleAddSceneWithVirtuals()
              : handleAddScene()
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditSceneDialog
