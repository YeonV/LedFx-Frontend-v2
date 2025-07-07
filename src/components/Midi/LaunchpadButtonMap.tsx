import {
  ArrowForwardIos,
  BrightnessHigh,
  Collections,
  Pause,
  PlayArrow,
  ViewSidebar,
  Menu as MenuIcon,
  Save,
  Delete,
  DeleteForever,
  Visibility,
  Autorenew,
  Fullscreen,
  FullscreenExit,
  BugReport,
  Send
} from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import useStore from '../../store/useStore'
import Assign from '../Gamepad/Assign'
import { useEffect, useRef, useState } from 'react'
import { WebMidi } from 'webmidi'
import LaunchpadButton from './LaunchpadButton'
import { defaultMapping, IMapping } from '../../store/ui/storeMidi'
import LaunchpadColors from './LaunchpadColors'
import { download } from '../../utils/helpers'
import { Launchpad, MidiDevices } from '../../utils/MidiDevices/MidiDevices'
import LaunchpadSettings from './LaunchpadSettings'
import { commandIcons } from '../../utils/commandIcons'

const LaunchpadButtonMap = ({
  toggleSidebar,
  sideBarOpen,
  fullScreen,
  setFullScreen
}: {
  toggleSidebar: () => void
  sideBarOpen: boolean
  fullScreen?: boolean
  setFullScreen: (_f: boolean) => void
}) => {
  const theme = useTheme()
  const parentRef = useRef<HTMLDivElement>(null)
  const childRef = useRef<HTMLDivElement>(null)
  const [midiMessageToSend, setMidiMessageToSend] = useState<string>('')
  const [scale, setScale] = useState(1)
  const [midiLogs, setMidiLogs] = useState<
    {
      name: string
      note: string
      button: number
    }[]
  >([])
  const [showMidiLogs, setShowMidiLogs] = useState(false)
  const [showMapping, setShowMapping] = useState(false)
  const setMidiMappingButtonNumbers = useStore((state) => state.setMidiMappingButtonNumbers)
  const getColorFromValue = useStore((state) => state.getColorFromValue)
  const initMidi = useStore((state) => state.initMidi)
  const setMidiType = useStore((state) => state.setMidiType)
  const setMidiModel = useStore((state) => state.setMidiModel)
  const midiModel = useStore((state) => state.midiModel)
  const midiType = useStore((state) => state.midiType)
  const midiEvent = useStore((state) => state.midiEvent)
  const midiOutput = useStore((state) => state.midiOutput)
  const recentScenes = useStore((state) => state.recentScenes)
  const midiMapping = useStore((state) => state.midiMapping)
  const setMidiMapping = useStore((state) => state.setMidiMapping)
  const setMidiSceneActiveColor = useStore((state) => state.setMidiSceneActiveColor)
  const setMidiSceneInactiveColor = useStore((state) => state.setMidiSceneInactiveColor)
  const setMidiCommandColor = useStore((state) => state.setMidiCommandColor)
  const midiSceneActiveColor = useStore((state) => state.midiColors.sceneActiveColor)
  const midiSceneInactiveColor = useStore((state) => state.midiColors.sceneInactiveColor)
  const midiCommandColor = useStore((state) => state.midiColors.commandColor)
  const setMidiSceneActiveType = useStore((state) => state.setMidiSceneActiveType)
  const setMidiSceneInactiveType = useStore((state) => state.setMidiSceneInactiveType)
  const setMidiCommandType = useStore((state) => state.setMidiCommandType)
  const pressedButtonColor = useStore((state) => state.midiColors.pressedButtonColor)
  const integrations = useStore((state) => state.integrations)
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const spAuthenticated = useStore((state) => state.spotify.spAuthenticated)
  const sendSpotifyTrack = useStore((state) => state.spotify.sendSpotifyTrack)
  const setSendSpotifyTrack = useStore((state) => state.setSendSpotifyTrack)
  const paused = useStore((state) => state.paused)
  const matrix = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const lp = MidiDevices[midiType][midiModel]
  const isRgb = 'rgb' in lp.fn && lp.fn.rgb

  const output =
    WebMidi.enabled &&
    (midiOutput !== '' ? WebMidi.getOutputByName(midiOutput) : WebMidi.outputs[1])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const gotMidiMapping = async (e: any) => {
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], 'UTF-8')
    fileReader.onload = (ev: any) => {
      if (ev.target.result && JSON.parse(ev.target.result).midiMapping)
        setMidiMapping(JSON.parse(ev.target.result).midiMapping)
      handleClose()
    }
  }
  const RightButton = ({ children }: { children: React.ReactNode }) => (
    <Box
      position={'relative'}
      alignSelf={'stretch'}
      justifySelf={'stretch'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <ArrowForwardIos />
      <Typography
        textTransform={'none'}
        variant="caption"
        color={'InactiveCaptionText'}
        position={'absolute'}
        bottom={0}
      >
        {children}
      </Typography>
    </Box>
  )
  const labels = (rowI: number, butI: number) => {
    if (rowI === 0 && butI === 0)
      return (
        <Stack>
          <PlayArrow sx={{ transform: 'rotate(270deg)' }} />
          {showMapping && <BrightnessHigh />}
        </Stack>
      )
    if (rowI === 0 && butI === 1)
      return (
        <Stack>
          <PlayArrow sx={{ transform: 'rotate(90deg)' }} />
          {showMapping && <BrightnessHigh />}
        </Stack>
      )
    if (rowI === 0 && butI === 2)
      return (
        <Stack>
          <PlayArrow sx={{ transform: 'rotate(180deg)' }} />
          {showMapping && <Collections />}
        </Stack>
      )
    if (rowI === 0 && butI === 3)
      return (
        <Stack>
          <PlayArrow sx={{ transform: 'rotate(0deg)' }} />
          {showMapping && <Pause />}
        </Stack>
      )
    if (rowI === 0 && butI === 3) return <PlayArrow />
    if (rowI === 0 && butI === 4)
      return (
        <Typography textTransform={'none'} variant="caption" color={'InactiveCaptionText'}>
          <br />
          Session Mixer
        </Typography>
      )
    if (rowI === 0 && butI === 5)
      return (
        <Typography textTransform={'none'} variant="caption" color={'InactiveCaptionText'}>
          Note
        </Typography>
      )
    if (rowI === 0 && butI === 6)
      return (
        <Typography textTransform={'none'} variant="caption" color={'InactiveCaptionText'}>
          Custom
        </Typography>
      )
    if (rowI === 0 && butI === 7)
      return (
        <Typography textTransform={'none'} variant="caption" color={'InactiveCaptionText'}>
          <br />
          Capture MIDI
        </Typography>
      )
    if (rowI === 0 && butI === 8)
      return (
        <BladeIcon
          sx={{
            fontSize: '58px !important',
            '& svg': { width: '54px', height: '54px' }
          }}
          name="launchpad"
        />
      )
    if (rowI === 1 && butI === 8) return <RightButton>Volume</RightButton>
    if (rowI === 2 && butI === 8) return <RightButton>Pan</RightButton>
    if (rowI === 3 && butI === 8) return <RightButton>Send&nbsp;B</RightButton>
    if (rowI === 4 && butI === 8) return <RightButton>Send&nbsp;A</RightButton>
    if (rowI === 5 && butI === 8) return <RightButton>Stop&nbsp;Clip</RightButton>
    if (rowI === 6 && butI === 8) return <RightButton>Mute</RightButton>
    if (rowI === 7 && butI === 8) return <RightButton>Solo</RightButton>
    if (rowI === 8 && butI === 8) return <RightButton>Record&nbsp;Arm</RightButton>

    if (showMapping) {
      const uiButtonNumberStr = `${9 - rowI}${butI + 1}`
      const mappingEntry = midiMapping[0][parseInt(uiButtonNumberStr)]
      const cmd = mappingEntry?.command
      const payload = mappingEntry?.payload

      if (cmd && commandIcons[cmd]) {
        const configEntry = commandIcons[cmd]
        const iconName =
          typeof configEntry === 'function'
            ? configEntry({ paused, fallback: payload?.fallback }) // Pass args as needed
            : configEntry

        return <BladeIcon name={iconName} sx={{ color: '#000' }} />
      }
      return uiButtonNumberStr
    }
    return null
  }
  // console.log(midiMapping)

  const setMode = (mode: 'programmer' | 'live' | 'standalone' | 'daw') => {
    initMidi()
    const output = midiOutput !== '' ? WebMidi.getOutputByName(midiOutput) : WebMidi.outputs[1]
    if (!output) return
    switch (mode) {
      case 'programmer':
        if ('programmer' in lp.command)
          output.send(lp.command?.programmer ?? [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0c, 0x0e, 0x01, 0xf7])
        break
      case 'live':
        if ('live' in lp.command)
          output.send(lp.command?.live ?? [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0c, 0x0e, 0x00, 0xf7])
        break
      case 'standalone':
        if ('standalone' in lp.command)
          output.send(lp.command?.standalone ?? [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0c, 0x10, 0x00, 0xf7])
        break
      case 'daw':
        if ('daw' in lp.command)
          output.send(lp.command?.daw ?? [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0c, 0x10, 0x01, 0xf7])
        break
      default:
        break
    }
  }

  useEffect(() => {
    const parent = parentRef.current
    const child = childRef.current

    if (parent && child) {
      const scaleX = parent.clientWidth / child.clientWidth
      const scaleY = parent.clientHeight / child.clientHeight
      const scale = Math.min(scaleX, scaleY)
      setScale(scale)
    }
  }, [matrix])

  useEffect(() => {
    initMidi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (midiEvent.button === -1) return
    setMidiLogs((prev) => [...prev, midiEvent])
  }, [midiEvent])

  useEffect(() => {
    if (output && sendSpotifyTrack && currentTrack !== '' && 'text' in lp.fn && lp.fn.text) {
      output.send(lp.fn.text(currentTrack, 128, 0, 0, false, 10))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, sendSpotifyTrack])

  return (
    <>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        mb={fullScreen ? '5px' : 2}
      >
        <Stack direction={'row'} alignItems={'center'} spacing={2}>
          <Stack direction={'row'} alignItems={'center'} spacing={0}>
            {'programmer' in lp.command && (
              <Button onClick={() => setMode('programmer')}>Programmer</Button>
            )}
            {'live' in lp.command && (
              <Button onClick={() => setMode('live')}>Live</Button>
            )}
            {'standalone' in lp.command && (
              <Button onClick={() => setMode('standalone')}>Standalone</Button>
            )}
            {'daw' in lp.command && (
              <Button onClick={() => setMode('daw')}>DAW</Button>
            )}
          </Stack>
        </Stack>
        <Stack direction={'row'} alignItems={'center'} spacing={0}>
          {integrations.spotify?.active && spAuthenticated && 'text' in lp.fn && (
            <Tooltip title="Automagically show artist & title on spotify song change">
              <Button onClick={() => setSendSpotifyTrack(!sendSpotifyTrack)}>
                <BladeIcon
                  name="mdi:spotify"
                  sx={[
                    sendSpotifyTrack
                      ? {
                          color: theme.palette.primary.main
                        }
                      : {
                          color: 'GrayText'
                        }
                  ]}
                />
              </Button>
            </Tooltip>
          )}
          <Button onClick={() => initMidi()}>
            <Autorenew />
          </Button>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MenuIcon />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            slotProps={{
              list: {
                'aria-labelledby': 'basic-button'
              }
            }}
          >
            <LaunchpadColors component="MenuItem" />
            <MenuItem
              onClick={() => {
                setFullScreen(!fullScreen)
                handleClose()
              }}
            >
              <ListItemIcon>{fullScreen ? <FullscreenExit /> : <Fullscreen />}</ListItemIcon>
              <ListItemText primary="Fullscreen" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                toggleSidebar()
                handleClose()
              }}
            >
              <ListItemIcon>
                <ViewSidebar />
              </ListItemIcon>
              <ListItemText primary="Show Sidebar" />
            </MenuItem>

            <MenuItem onClick={() => setShowMapping(!showMapping)}>
              <ListItemIcon>
                <Visibility />
              </ListItemIcon>
              <ListItemText primary="Show Mapping" />
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                download({ midiMapping }, 'midiMapping.json', 'application/json')
                handleClose()
              }}
            >
              <ListItemIcon>
                <Save />
              </ListItemIcon>
              <ListItemText primary="Save Mapping" />
            </MenuItem>
            <MenuItem>
              <input
                hidden
                accept="application/json"
                id="get-midi-mapping"
                type="file"
                onChange={(e) => {
                  gotMidiMapping(e)
                }}
              />
              <label htmlFor="get-midi-mapping" style={{ width: '100%', display: 'flex' }}>
                <ListItemIcon>
                  <BladeIcon name="mdi:folder-open" />
                </ListItemIcon>
                <ListItemText primary="Load Mapping" />
              </label>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                setMidiMapping({ 0: defaultMapping } as IMapping)
                setTimeout(() => {
                  window.location.reload()
                }, 100)
              }}
            >
              <ListItemIcon>
                <DeleteForever />
              </ListItemIcon>
              <ListItemText primary="Reset Mapping" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                const m = JSON.parse(JSON.stringify(midiMapping))
                Object.keys(m).forEach((mappingKey) => {
                  const nestedMapping = m[parseInt(mappingKey) as keyof typeof m]
                  Object.keys(nestedMapping).forEach((key) => {
                    const b = nestedMapping[parseInt(key) as keyof typeof nestedMapping]
                    delete b.colorCommand
                    delete b.colorSceneActive
                    delete b.colorSceneInactive
                  })
                })
                setMidiMapping(m)
                setTimeout(() => {
                  initMidi()
                }, 100)
                handleClose()
              }}
            >
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText primary="Reset Colors" />
            </MenuItem>
            <Divider />
            <MenuItem sx={{ position: 'absolute', pointerEvents: 'none' }}>
              <ListItemIcon>
                <BladeIcon name={midiType === 'Launchpad' ? 'launchpad' : 'midi'} />
              </ListItemIcon>
              <ListItemText primary={midiType + ' ' + midiModel} />
            </MenuItem>
            <Stack sx={{ pl: 2, pr: 1, mb: 1 }}>
              <Select fullWidth disableUnderline defaultValue={'Preconfigured'}>
                {Object.keys(MidiDevices).map((mType) => (
                  <Box key={mType}>
                    <ListSubheader>{mType}</ListSubheader>
                    {Object.keys(MidiDevices[mType as keyof typeof MidiDevices]).map((model) => (
                      <MenuItem
                        key={model}
                        onClick={() => {
                          const lp =
                            MidiDevices[mType as keyof typeof MidiDevices][
                              model as keyof (typeof MidiDevices)[keyof typeof MidiDevices]
                            ]

                          setMidiMappingButtonNumbers(lp.buttonNumbers)
                          setMidiType(mType as keyof typeof MidiDevices)
                          setMidiModel(
                            model as keyof (typeof MidiDevices)[keyof typeof MidiDevices]
                          )
                          setMidiSceneActiveColor(lp.globalColors.sceneActiveColor)
                          setMidiSceneInactiveColor(lp.globalColors.sceneInactiveColor)
                          setMidiCommandColor(lp.globalColors.commandColor)
                          setMidiSceneActiveType(lp.globalColors.sceneActiveType)
                          setMidiSceneInactiveType(lp.globalColors.sceneInactiveType)
                          setMidiCommandType(lp.globalColors.commandType)
                          initMidi()
                        }}
                        value={model}
                      >
                        {model}
                      </MenuItem>
                    ))}
                  </Box>
                ))}
              </Select>
            </Stack>
            {localStorage.getItem('ledfx-cloud-role') === 'creator' && (
              <LaunchpadSettings onClick={() => {}} />
            )}
            <Divider />
            <MenuItem
              onClick={() => {
                setShowMidiLogs(!showMidiLogs)
                handleClose()
              }}
            >
              <ListItemIcon>
                <BugReport />
              </ListItemIcon>
              <ListItemText primary={`${showMidiLogs ? 'Hide' : 'Show'} MIDI Logs`} />
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
      <Stack
        direction={'row'}
        spacing={2}
        mb={fullScreen ? 0 : 2}
        ref={parentRef}
        sx={
          fullScreen
            ? {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'calc(100% - 40px)'
              }
            : {}
        }
      >
        <Stack
          direction={'column'}
          spacing={1}
          ref={childRef}
          sx={{ transform: `scale(${scale})` }}
        >
          {matrix.map((row, rowIndex) => {
            return (
              <Stack key={'row' + rowIndex} direction={'row'} spacing={1}>
                {row.map((_button, buttonIndex) => {
                  const row = 9 - rowIndex
                  const column = buttonIndex + 1
                  const uiButtonNumber = `${row}${column}`
                  const uiBtnNumberInt = parseInt(uiButtonNumber)
                  const btn = midiMapping[0][uiBtnNumberInt]
                  const buttonNumber = btn?.buttonNumber

                  const sceneActiveColor =
                    btn?.colorSceneActive ||
                    midiSceneActiveColor ||
                    lp.globalColors.sceneActiveColor
                  const sceneInactiveColor =
                    btn?.colorSceneInactive ||
                    midiSceneInactiveColor ||
                    lp.globalColors.sceneInactiveColor
                  const commandColor =
                    btn?.colorCommand || midiCommandColor || lp.globalColors.commandColor
                  const command = btn?.command
                  const sceneActive = btn?.payload?.scene === recentScenes[0]

                  const clr = (color: string) =>
                    isRgb && color.startsWith('rgb') ? color : getColorFromValue(color) || '#000'

                  const bgColor =
                    buttonNumber === -1
                      ? '#000'
                      : midiEvent.button === buttonNumber
                        ? pressedButtonColor || theme.palette.primary.main
                        : command && command === 'scene' && sceneActive
                          ? clr(sceneActiveColor)
                          : command && command === 'scene'
                            ? clr(sceneInactiveColor)
                            : command && command !== 'none' && rowIndex !== 0
                              ? clr(commandColor)
                              : rowIndex === 0 || buttonIndex === 8
                                ? '#000'
                                : '#ccc'

                  return (
                    <LaunchpadButton
                      showMidiLogs={showMidiLogs}
                      hidden={buttonNumber === -1}
                      uiButtonNumber={uiBtnNumberInt}
                      active={!!(rowIndex === 0 && btn?.command && btn?.command !== 'none')}
                      bgColor={bgColor}
                      key={'button' + buttonIndex}
                      borderless={rowIndex === 0 && buttonIndex === 8}
                    >
                      {labels(rowIndex, buttonIndex)}
                    </LaunchpadButton>
                  )
                })}
              </Stack>
            )
          })}
        </Stack>

        {sideBarOpen && (
          <Stack
            direction={'column'}
            spacing={1}
            maxHeight={694}
            width={300}
            sx={{ overflowY: 'scroll' }}
          >
            {matrix.map((row, rowIndex) =>
              row.map((button, buttonIndex) => {
                return (
                  <Assign
                    type={'midi'}
                    padIndex={0}
                    mapping={midiMapping}
                    setMapping={setMidiMapping}
                    pressed={midiEvent.button === parseInt(`${rowIndex + 1}${buttonIndex + 1}`)}
                    index={`${rowIndex + 1}${buttonIndex + 1}`}
                    key={`${rowIndex + 1}${buttonIndex + 1}`}
                  />
                )
              })
            )}
          </Stack>
        )}
      </Stack>
      {showMidiLogs && (
        <Box>
          <Stack direction={'row'}>
            <Typography width={200} textAlign={'left'} variant="caption">
              Name
            </Typography>
            <Typography width={50} variant="caption">
              Note
            </Typography>
            <Typography width={50} variant="caption">
              Button
            </Typography>
            <Typography
              variant="caption"
              sx={{ cursor: 'pointer' }}
              onClick={() => setMidiLogs([])}
            >
              Clear Logs
            </Typography>
          </Stack>
          <Divider sx={{ mb: 0.5 }} />
          <Stack>
            <Box sx={{ overflowY: 'auto', height: 120 }}>
              {midiLogs.map((log, index) => (
                <Stack key={index} direction={'row'}>
                  <Typography key={'name' + index} width={200} variant="caption">
                    {log.name}
                  </Typography>
                  <Typography key={'note' + index} width={50} variant="caption">
                    {log.note}
                  </Typography>
                  <Typography key={'button' + index} width={50} variant="caption">
                    {log.button}
                  </Typography>
                </Stack>
              ))}
            </Box>
            <Stack direction={'row'}>
              {Object.keys(Launchpad.X.command).length && (
                <Select
                  variant="outlined"
                  size="small"
                  sx={{ width: 200 }}
                  onChange={(e: SelectChangeEvent) => {
                    setMidiMessageToSend(
                      Launchpad.X.command[e.target.value as keyof typeof Launchpad.X.command]
                        .map((v: any) => `0x${v.toString(16)}`)
                        .join(', ')
                    )
                  }}
                >
                  <MenuItem key={'none'} value={''}>
                    {''}
                  </MenuItem>
                  {Object.entries(Launchpad.X.command).map(([key, _value]) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              )}
              <TextField
                label="Send raw MIDI message"
                variant="outlined"
                size="small"
                fullWidth
                value={midiMessageToSend}
                onChange={(e) => setMidiMessageToSend(e.target.value)}
              />
              <Button
                onClick={() => {
                  const output =
                    midiOutput !== '' ? WebMidi.getOutputByName(midiOutput) : WebMidi.outputs[1]
                  if (!output) return
                  output.send(
                    midiMessageToSend
                      .replaceAll(', ', ' ')
                      .split(' ')
                      .map((v: any) => parseInt(v)) || []
                  )
                }}
                onContextMenu={() => {
                  const output =
                    midiOutput !== '' ? WebMidi.getOutputByName(midiOutput) : WebMidi.outputs[1]
                  if (!output) return
                  if ('text' in lp.fn && lp.fn.text)
                    output.send(lp.fn.text('Hacked by Blade!', 128, 0, 0))
                }}
              >
                <Send />
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  )
}

export default LaunchpadButtonMap
