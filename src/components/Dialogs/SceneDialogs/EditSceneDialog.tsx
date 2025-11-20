import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AppBar,
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
  CardMedia,
  Chip,
  Select,
  MenuItem,
  ListSubheader,
  InputAdornment,
  Stack,
  InputLabel,
  FormControl,
  Avatar,
  useMediaQuery,
  Autocomplete,
  CircularProgress,
  Tooltip,
  Box
} from '@mui/material'
import { NavigateBefore, MusicNote, InfoOutlined } from '@mui/icons-material'
import { useDropzone } from 'react-dropzone'
import isElectron from 'is-electron'
import useStore from '../../../store/useStore'
import BladeIcon from '../../Icons/BladeIcon/BladeIcon'
import TooltipImage from './TooltipImage'
import TooltipTags from './TooltipTags'
import TooltipMidi from './TooltipMidi'
import MidiInputDialog from '../../Midi/MidiInputDialog'
import { IMapping } from '../../../store/ui/storeMidi'
import { WebMidi } from 'webmidi'
import { IMidiDevice, MidiDevices } from '../../../utils/MidiDevices/MidiDevices'

const EditSceneDialog = () => {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [tags, setTags] = useState('')
  const [url, setUrl] = useState('')
  const [payload, setPayload] = useState('')
  const [midiActivate, setMIDIActivate] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [ledfx_presets, setLedFxPresets] = useState({} as any)
  const [user_presets, setUserPresets] = useState({} as any)
  const [isLoadingScene, setIsLoadingScene] = useState(false)
  const [sceneVirtuals, setSceneVirtuals] = useState<
    Record<
      string,
      | {
          config: any
          type: string
          preset?: string
          preset_category?: 'ledfx_presets' | 'user_presets'
          action?: 'activate' | 'ignore' | 'forceblack' | 'stop'
        }
      | object
    >
  >({})
  const medium = useMediaQuery('(max-width: 920px )')
  const small = useMediaQuery('(max-width: 580px )')
  const xsmall = useMediaQuery('(max-width: 480px )')
  const midiMapping = useStore((state) => state.midiMapping)
  const setMidiMapping = useStore((state) => state.setMidiMapping)
  const initMidi = useStore((state) => state.initMidi)

  const effects = useStore((state) => state.schemas.effects)
  const scenes = useStore((state) => state.scenes)
  const virtuals = useStore((state) => state.virtuals)
  const open = useStore((state) => state.dialogs.addScene?.edit || false)
  const sceneId = useStore((state: any) => state.dialogs.addScene?.sceneKey)
  const features = useStore((state) => state.features)
  const sceneActiveTags = useStore((state) => state.ui.sceneActiveTags)

  const setDialogOpenAddScene = useStore((state) => state.setDialogOpenAddScene)
  const getImage = useStore((state) => state.getImage)
  const getLedFxPresets = useStore((state) => state.getLedFxPresets)
  const getUserPresets = useStore((state) => state.getUserPresets)
  const updateScene = useStore((state) => state.updateScene)
  const getScenes = useStore((state) => state.getScenes)
  const getScene = useStore((state) => state.getScene)
  const [imageData, setImageData] = useState(null)
  const midiEvent = useStore((state) => state.midiEvent)
  const midiOutput = useStore((state) => state.midiOutput)
  const midiType = useStore((state) => state.midiType)
  const midiModel = useStore((state) => state.midiModel)
  const lastButton = useRef(-1)

  const setBlockMidiHandler = useStore((state) => state.setBlockMidiHandler)
  const getFullConfig = useStore((state) => state.getFullConfig)

  const toggletSceneActiveTag = useStore((state) => state.ui.toggletSceneActiveTag)
  const fetchImage = useCallback(async (ic: string) => {
    const result = await getImage(ic.split('image:')[1]?.replaceAll('file:///', ''))
    setImageData(result.image)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (image?.startsWith('image:')) {
      fetchImage(image)
    }
  }, [image, fetchImage])

  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: any) => {
      setImage(`image:file:///${file.path.replaceAll('\\', '/')}`)
    })
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const sceneImage = (iconName: string) => {
    return iconName && iconName.startsWith('image:') ? (
      isElectron() ? (
        <div>
          <CardMedia
            style={{
              height: tags?.split(',')[0].length > 0 ? 140 : 125,
              maxWidth: 334,
              width: small ? '100%' : 334,
              marginTop: '1rem'
            }}
            image={iconName?.split('image:')[1]}
            title="SceneImage"
          />
        </div>
      ) : (
        <div
          style={{
            height: tags?.split(',')[0].length > 0 ? 140 : 125,
            maxWidth: 334,
            width: small ? '100%' : 334,
            marginTop: '1rem',
            backgroundSize: 'cover',
            backgroundImage: `url("data:image/png;base64,${imageData}")`
          }}
          title="SceneImage"
        />
      )
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
  }

  function isValidURL(string: string) {
    const res = string.match(
      /(?![\s\S])|\d(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g
    )
    return res !== null
  }

  useEffect(() => {
    const theScene = async () => {
      if (!sceneId) return

      setIsLoadingScene(true)
      const result = await getScene(sceneId)
      if (result) {
        console.log('Loaded scene:', result)
        setName(result.config.name)
        setImage(result.config.scene_image)
        setTags(result.config.scene_tags)
        setUrl(result.config.scene_puturl)
        setPayload(result.config.scene_payload)
        setMIDIActivate(result.config.scene_midiactivate)

        // Load scene virtuals with proper action initialization
        const virtualsWithActions = Object.entries(result.config.virtuals || {}).reduce(
          (acc, [virtualId, virtualData]) => {
            // Check if this is an empty/ignored virtual
            const isEmptyVirtual = Object.keys(virtualData as any).length === 0

            if (isEmptyVirtual) {
              // Initialize empty virtuals with action = 'ignore'
              acc[virtualId] = {
                config: {},
                type: '',
                action: 'ignore'
              }
            } else {
              // Normal virtuals with data
              acc[virtualId] = {
                ...(virtualData as any),
                action: (virtualData as any).action || 'activate' // Use saved action or default to 'activate'
              }
            }

            return acc
          },
          {} as typeof sceneVirtuals
        )
        setSceneVirtuals(virtualsWithActions)
      }
      setIsLoadingScene(false)
    }

    if (open && sceneId) {
      theScene()
    }
  }, [sceneId, getScene, open])

  const handleClose = () => {
    setDialogOpenAddScene(false, false)
  }

  const handleEditSceneWithVirtuals = () => {
    // Transform sceneVirtuals - keep action field for backend
    const virtualsToSave = Object.entries(sceneVirtuals).reduce((acc, [virtualId, virtualData]) => {
      if (Object.keys(virtualData).length === 0) {
        // Keep empty objects for ignored virtuals
        acc[virtualId] = {}
      } else {
        // Keep all fields including action
        acc[virtualId] = virtualData
      }
      return acc
    }, {} as any)

    updateScene(name, sceneId, image, tags, url, payload, midiActivate, virtualsToSave).then(() => {
      getScenes()
    })

    setName('')
    setImage('')
    setTags('')
    setUrl('')
    setPayload('')
    setMIDIActivate('')
    setSceneVirtuals({})
    setDialogOpenAddScene(false, false)
  }

  useEffect(() => {
    getFullConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (features.scenemidi && midiEvent.button > -1) {
      setMIDIActivate(`${midiEvent.name} Note: ${midiEvent.note} buttonNumber: ${midiEvent.button}`)
    }
  }, [midiEvent, features.scenemidi])

  useEffect(() => {
    if (features.scenemidi && open && scenes[sceneId].scene_midiactivate) {
      initMidi()
      const output = midiOutput !== '' ? WebMidi.getOutputByName(midiOutput) : WebMidi.outputs[1]
      const currentBtnNumber = parseInt(
        scenes[sceneId].scene_midiactivate?.split('buttonNumber: ')[1]
      )
      const lp = (MidiDevices[midiType][midiModel] as IMidiDevice).fn
      if (currentBtnNumber > -1) {
        setTimeout(() => {
          if ('ledPulse' in lp) {
            output.send(lp.ledPulse(currentBtnNumber, 99))
          } else {
            output.send(lp.ledOn(currentBtnNumber, 99))
          }
        }, 100)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, features.scenemidi])

  useEffect(() => {
    if (features.scenemidi && open && scenes[sceneId].scene_midiactivate) {
      setBlockMidiHandler(true)
      const output = midiOutput !== '' ? WebMidi.getOutputByName(midiOutput) : WebMidi.outputs[1]
      const currentBtnNumber = parseInt(
        scenes[sceneId].scene_midiactivate?.split('buttonNumber: ')[1]
      )
      const newBtnNumber = parseInt(midiActivate?.split('buttonNumber: ')[1])
      const lp = (MidiDevices[midiType][midiModel] as IMidiDevice).fn
      if (newBtnNumber > -1) {
        setTimeout(() => {
          if (!currentBtnNumber) {
            if ('ledPulse' in lp) {
              output.send(lp.ledPulse(newBtnNumber, 57))
            } else {
              output.send(lp.ledOn(newBtnNumber, 57))
            }
            if (lastButton.current !== newBtnNumber && lastButton.current > -1) {
              output.send(lp.ledOff(lastButton.current))
            }
          }
          if (currentBtnNumber > -1 && newBtnNumber !== currentBtnNumber) {
            if ('ledPulse' in lp) {
              output.send(lp.ledPulse(currentBtnNumber, 99))
              output.send(lp.ledPulse(newBtnNumber, 57))
            } else {
              output.send(lp.ledOn(currentBtnNumber, 99))
              output.send(lp.ledOn(newBtnNumber, 57))
            }
          }
          if (
            currentBtnNumber > -1 &&
            lastButton.current > -1 &&
            lastButton.current !== newBtnNumber &&
            lastButton.current !== currentBtnNumber
          ) {
            output.send(lp.ledOff(lastButton.current))
          }
          lastButton.current = newBtnNumber
        }, 100)
      }
    }
    if (!open) {
      lastButton.current = -1
      setBlockMidiHandler(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, features.scenemidi, midiEvent])

  const handleActionChange = (
    virtualId: string,
    newAction: 'activate' | 'ignore' | 'forceblack' | 'stop'
  ) => {
    setSceneVirtuals((prev) => ({
      ...prev,
      [virtualId]: {
        ...prev[virtualId],
        action: newAction
      }
    }))
  }

  const handleEffectTypeChange = (virtualId: string, newEffectType: string) => {
    setSceneVirtuals((prev) => ({
      ...prev,
      [virtualId]: {
        ...prev[virtualId],
        type: newEffectType,
        preset: undefined, // Clear preset when effect type changes
        preset_category: undefined
      }
    }))
  }

  const handlePresetChange = (
    virtualId: string,
    presetId: string,
    category: 'ledfx_presets' | 'user_presets'
  ) => {
    setSceneVirtuals((prev) => {
      const currentVirtual = prev[virtualId] as {
        config: any
        type: string
        preset?: string
        preset_category?: 'ledfx_presets' | 'user_presets'
        action?: 'activate' | 'ignore' | 'forceblack' | 'stop'
      }

      // Get the preset's config
      const presetSource = category === 'ledfx_presets' ? ledfx_presets : user_presets
      const presetConfig = presetSource[currentVirtual.type]?.[presetId]?.config

      return {
        ...prev,
        [virtualId]: {
          ...currentVirtual,
          config: presetConfig || currentVirtual.config, // Update config from preset
          preset: presetId,
          preset_category: category
        }
      }
    })
  }

  // Load presets for all effect types
  useEffect(() => {
    const loadPresets = async () => {
      const ledfx = await getLedFxPresets()
      const user = await getUserPresets()
      setLedFxPresets(ledfx)
      setUserPresets(user)
    }

    if (open) {
      loadPresets()
    }
  }, [open, getLedFxPresets, getUserPresets])

  return (
    <Dialog
      fullScreen={Object.keys(sceneVirtuals).length > 0}
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <AppBar
        enableColorOnDark
        color="secondary"
        // className={classes.appBar}
      >
        <Toolbar>
          <Button
            autoFocus
            color="primary"
            variant="contained"
            startIcon={<NavigateBefore />}
            onClick={() => {
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
        {isLoadingScene && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Loading scene data...
            </Typography>
          </div>
        )}

        {!isLoadingScene && (
          <>
            {Object.keys(sceneVirtuals).length === 0 && (
              <>
                Image is optional and can be one of:
                <ul style={{ paddingLeft: '1rem' }}>
                  <li>
                    iconName{' '}
                    <Link href="https://mui.com/material-ui/material-icons/" target="_blank">
                      Find MUI icons here
                    </Link>
                    <Typography color="textSecondary" variant="subtitle1">
                      <em>eg. flare, AccessAlarms</em>
                    </Typography>
                  </li>
                  <li>
                    mdi:icon-name{' '}
                    <Link href="https://pictogrammers.com/library/mdi" target="_blank">
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
                        eg. image:file:///C:/Users/username/Pictures/scene.png or
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
                  sx={[
                    {
                      '& .MuiInputBase-root': { paddingRight: '6px' }
                    },
                    Object.keys(sceneVirtuals).length > 0
                      ? {
                          mt: '2rem'
                        }
                      : {
                          mt: ''
                        }
                  ]}
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="scene_image"
                  label="Image"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <TooltipImage />
                        </InputAdornment>
                      )
                    }
                  }}
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  fullWidth
                />
                <Stack direction="row" gap={1}>
                  <FormControl sx={{ mt: 1, minWidth: 120 }} disabled>
                    <InputLabel id="scene_image">Image Type</InputLabel>
                    <Select
                      labelId="scene_image"
                      label="Image Type"
                      variant="outlined"
                      value={
                        image?.startsWith('image:file:///')
                          ? 'image:file:///'
                          : image?.startsWith('image:https://')
                            ? 'image:https://'
                            : image?.startsWith('mdi:')
                              ? 'mdi:'
                              : ''
                      }
                      onChange={(e) => {
                        setImage(e.target.value)
                      }}
                    >
                      <MenuItem value="">MUI-Icon</MenuItem>
                      <MenuItem value="mdi:">MDI-Icon</MenuItem>
                      <MenuItem value="image:https://">External</MenuItem>
                      <MenuItem value="image:file:///">Local</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    disabled
                    margin="dense"
                    id="scene_image"
                    label="Image"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <TooltipImage />
                          </InputAdornment>
                        )
                      }
                    }}
                    type="text"
                    value={image
                      ?.replace('image:file:///', '')
                      ?.replace('image:https://', '')
                      ?.replace('mdi:', '')}
                    onChange={(e) => setImage(e.target.value)}
                    fullWidth
                  />
                </Stack>

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
                          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
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
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          endAdornment: (
                            <InputAdornment position="end" sx={{ mr: '5px' }}>
                              <TooltipTags />
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  )}
                />
                {features.sceneexternal ? (
                  <div style={{ display: 'flex', margin: '0 auto', maxWidth: '960px' }}>
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
                {features && features.scenemidi ? (
                  <>
                    <Stack direction={small ? 'column' : 'row'} gap={1}>
                      <FormControl
                        sx={[
                          {
                            mt: 1
                          },
                          small
                            ? {
                                width: '100%'
                              }
                            : {
                                width: '130px'
                              }
                        ]}
                      >
                        <InputLabel id="midi-label">Connected To</InputLabel>
                        <Select variant="outlined" defaultValue="Client" label="Connected To">
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
                            .filter((k) => k !== sceneId)
                            .some(
                              (sceneId: any) => scenes[sceneId]?.scene_midiactivate === midiActivate
                            )
                        }
                        helperText={
                          midiActivate !== null &&
                          midiActivate !== '' &&
                          Object.keys(scenes)
                            .filter((k) => k !== sceneId)
                            .some(
                              (sceneId: any) => scenes[sceneId]?.scene_midiactivate === midiActivate
                            ) && (
                            <Typography>
                              Please select another MIDI key/button. Already assigned to{' '}
                              {
                                scenes[
                                  Object.keys(scenes)
                                    .filter((k) => k !== sceneId)
                                    .find(
                                      (sceneId: any) =>
                                        scenes[sceneId]?.scene_midiactivate === midiActivate
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
                        sx={[
                          {
                            color: 'transparent'
                          },
                          xsmall
                            ? {
                                '& input': {
                                  width: '5px'
                                }
                              }
                            : {
                                '& input': {
                                  width: '100%'
                                }
                              },
                          xsmall
                            ? {
                                '& input': {
                                  height: '5rem'
                                }
                              }
                            : {
                                '& input': {
                                  height: ''
                                }
                              }
                        ]}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <TooltipMidi />
                              </InputAdornment>
                            ),
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={[
                                  xsmall
                                    ? {
                                        flexWrap: 'wrap'
                                      }
                                    : {
                                        flexWrap: ''
                                      },
                                  xsmall
                                    ? {
                                        mt: -8
                                      }
                                    : {
                                        mt: ''
                                      }
                                ]}
                              >
                                {midiActivate?.split(' ')?.length > 1 && (
                                  <>
                                    <Chip
                                      label={midiActivate?.split(' ')[0].replace('MIDI', '')}
                                      avatar={
                                        <Avatar>
                                          <BladeIcon name="mdi:midi" />
                                        </Avatar>
                                      }
                                    />
                                    <Chip
                                      label={midiActivate?.split('Note: ')[1]?.split(' ')[0]}
                                      avatar={
                                        <Avatar>
                                          <MusicNote />
                                        </Avatar>
                                      }
                                    />
                                    <Chip
                                      label={
                                        midiActivate?.split('buttonNumber: ')[1]?.split(' ')[0]
                                      }
                                      avatar={<Avatar>No</Avatar>}
                                    />
                                    <Chip
                                      onDelete={() => setMIDIActivate('')}
                                      label={/\((.*?)\)/
                                        .exec(midiActivate)?.[1]
                                        .replace(' MIDI', '')
                                        .trim()}
                                      icon={<BladeIcon name="mdi:midi" />}
                                    />
                                  </>
                                )}
                              </InputAdornment>
                            )
                          },
                          inputLabel: { shrink: true }
                        }}
                      />
                      {/\((.*?)\)/.exec(midiActivate)?.[1].replace(' MIDI', '').trim() ===
                        'LPX' && <MidiInputDialog />}
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
                {isElectron() ? (
                  <div
                    {...getRootProps()}
                    style={{
                      width: '100%',
                      textAlign: 'center'
                    }}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop image here ...</p>
                    ) : (
                      <p>Drop image here, or click to select files</p>
                    )}
                    {sceneImage(image || 'Wallpaper')}
                  </div>
                ) : (
                  sceneImage(image || 'Wallpaper')
                )}
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
                        variant={sceneActiveTags.includes(t) ? 'filled' : 'outlined'}
                        sx={{
                          flexGrow: 0,
                          minWidth: 50,
                          ml: 1,
                          mt: 1,
                          mr: 1,
                          cursor: sceneActiveTags.includes(t) ? 'zoom-out' : 'zoom-in'
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
                margin: '0 auto',
                maxWidth: '960px',
                gap: '1rem'
              }}
            >
              <span style={{ width: 'calc(100% - 500px - 3rem)' }}>Device</span>
              <span style={{ width: '200px' }}>Effect</span>
              <span style={{ width: '200px' }}>Preset</span>
              <span style={{ width: '100px' }}>
                Action
                <Tooltip
                  title={
                    <Box>
                      <Typography variant="body2">Activate</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        activates the selected effect and preset.
                      </Typography>
                      <Typography variant="body2">Ignore</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        does not touch this virtuals
                      </Typography>
                      <Typography variant="body2">Turn Black</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        actively sends black.
                      </Typography>
                      <Typography variant="body2">Stop</Typography>
                      <Typography variant="body2">stop any effect and return to WLED</Typography>
                    </Box>
                  }
                >
                  <InfoOutlined fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
                </Tooltip>
              </span>
            </div>
            <Divider sx={{ margin: '0 auto', maxWidth: '960px' }} />
            {scenes &&
              sceneId &&
              scenes[sceneId] &&
              Object.entries(sceneVirtuals).map(([virtualId, virtualData], i) => {
                // Check if this virtual is ignored (empty object)
                const isIgnored = Object.keys(virtualData).length === 0

                const vData = isIgnored
                  ? {
                      config: {},
                      type: '',
                      action: 'ignore' as const
                    }
                  : (virtualData as {
                      config: any
                      type: string
                      preset?: string
                      preset_category?: 'ledfx_presets' | 'user_presets'
                      action?: 'activate' | 'ignore' | 'forceblack' | 'stop'
                    })

                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      margin: '1rem auto',
                      maxWidth: '960px',
                      gap: '1rem',
                      opacity: isIgnored ? 0.5 : 1, // Dim ignored virtuals
                      textDecoration: 'none'
                      // textDecoration: isIgnored ? 'line-through' : 'none'
                    }}
                  >
                    {/* Column 1: Device Name */}
                    <Typography
                      variant="body2"
                      sx={{
                        width: 'calc(100% - 500px - 3rem)',
                        color:
                          !vData.type || vData.action === 'ignore'
                            ? 'text.disabled'
                            : 'text.primary'
                      }}
                    >
                      {virtuals[virtualId].config.name || virtualId}
                    </Typography>

                    {/* Column 2: Effect Type Selector */}
                    {!vData.type || vData.action !== 'activate' ? null : (
                      <FormControl sx={{ width: '200px' }} size="small">
                        <Select
                          disableUnderline
                          value={vData.type || ''}
                          onChange={(e) => handleEffectTypeChange(virtualId, e.target.value)}
                          displayEmpty
                          disabled={vData.action !== 'activate'} // Disable if action is not 'activate'
                        >
                          <MenuItem value="" disabled>
                            {vData.action !== 'activate' ? 'N/A' : 'Select Effect'}
                          </MenuItem>
                          {effects &&
                            Object.keys(effects)
                              .sort()
                              .map((effectType) => (
                                <MenuItem key={effectType} value={effectType}>
                                  {effectType}
                                </MenuItem>
                              ))}
                        </Select>
                      </FormControl>
                    )}
                    {/* Column 3: Preset Selector */}
                    {/* Hide if no effect type OR action is not 'activate' */}
                    {!vData.type || vData.action !== 'activate' ? null : (
                      <FormControl sx={{ width: '200px' }} size="small">
                        <Select
                          disableUnderline
                          value={
                            vData.preset && vData.preset_category
                              ? `${vData.preset_category}:${vData.preset}`
                              : ''
                          }
                          onChange={(e) => {
                            const [category, presetId] = e.target.value.split(':')
                            handlePresetChange(
                              virtualId,
                              presetId,
                              category as 'ledfx_presets' | 'user_presets'
                            )
                          }}
                          displayEmpty
                          disabled={!vData.type || vData.action !== 'activate'}
                        >
                          <MenuItem value="">
                            <em>{vData.action !== 'activate' ? 'N/A' : 'Not saved as Preset'}</em>
                          </MenuItem>

                          {/* LedFx Presets */}
                          {ledfx_presets[vData.type] && (
                            <ListSubheader>LedFx Presets</ListSubheader>
                          )}
                          {ledfx_presets[vData.type] &&
                            Object.keys(ledfx_presets[vData.type]).map((presetId) => (
                              <MenuItem
                                key={`ledfx:${presetId}`}
                                value={`ledfx_presets:${presetId}`}
                              >
                                {ledfx_presets[vData.type][presetId].name || presetId}
                              </MenuItem>
                            ))}

                          {/* User Presets */}
                          {user_presets[vData.type] && <ListSubheader>User Presets</ListSubheader>}
                          {user_presets[vData.type] &&
                            Object.keys(user_presets[vData.type]).map((presetId) => (
                              <MenuItem key={`user:${presetId}`} value={`user_presets:${presetId}`}>
                                {user_presets[vData.type][presetId].name || presetId}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    )}

                    {/* Column 4: Action Selector */}
                    <FormControl
                      sx={{
                        width: '100px'
                      }}
                      size="small"
                    >
                      <Select
                        disableUnderline
                        value={vData.action || 'activate'}
                        sx={{
                          color:
                            !vData.type || vData.action === 'ignore'
                              ? 'text.disabled'
                              : 'text.primary'
                        }}
                        onChange={(e) => {
                          const newAction = e.target.value as
                            | 'activate'
                            | 'ignore'
                            | 'forceblack'
                            | 'stop'

                          // If changing FROM ignore TO something else, need to restore virtual data
                          if (isIgnored && newAction !== 'ignore') {
                            // TODO: How do we restore the virtual? Need original config/type
                            // For now, just set action
                            handleActionChange(virtualId, newAction)
                          } else if (!isIgnored && newAction === 'ignore') {
                            // If changing TO ignore, convert to empty object
                            setSceneVirtuals((prev) => ({
                              ...prev,
                              [virtualId]: {}
                            }))
                          } else {
                            handleActionChange(virtualId, newAction)
                          }
                          // If changing to forceblack set effect type to singleColor and  config to
                          // {
                          //     "color": "#000000"
                          // }
                          if (newAction === 'forceblack') {
                            setSceneVirtuals((prev) => ({
                              ...prev,
                              [virtualId]: {
                                type: 'singleColor',
                                config: {
                                  color: '#000000'
                                },
                                action: 'forceblack'
                              }
                            }))
                          }
                        }}
                      >
                        <MenuItem value="activate">Activate</MenuItem>
                        <MenuItem value="ignore">Ignore</MenuItem>
                        <MenuItem value="forceblack">Turn Black</MenuItem>
                        <MenuItem value="stop">Stop</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                )
              })}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          disabled={
            name === '' ||
            Object.entries(sceneVirtuals).some(([_, vData]) => {
              if (Object.keys(vData).length === 0) return false // Ignored is OK
              const data = vData as any
              return !data.type && data.action !== 'ignore' // Must have effect type unless ignored
            })
          }
          onClick={() => {
            const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj))
            const newMapping = deepCopy(midiMapping) as IMapping
            const newBtnNumber = parseInt(midiActivate?.split('buttonNumber: ')[1])
            const currentBtnNumber = parseInt(
              scenes[sceneId].scene_midiactivate?.split('buttonNumber: ')[1] || '-1'
            )
            const item = parseInt(
              Object.keys(newMapping[0]).find(
                (k) => newMapping[0][parseInt(k)].buttonNumber === currentBtnNumber
              ) || ''
            )

            handleEditSceneWithVirtuals()
            if (currentBtnNumber && newBtnNumber && currentBtnNumber !== newBtnNumber) {
              if (item) {
                newMapping[0][item] = { buttonNumber: currentBtnNumber }
                setMidiMapping(newMapping)
              }
            }
            if (features.scenemidi) {
              setTimeout(() => {
                getScenes()
                initMidi()
              }, 100)
            }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditSceneDialog
