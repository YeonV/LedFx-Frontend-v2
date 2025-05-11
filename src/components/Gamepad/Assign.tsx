import {
  Fab,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import {
  BrightnessHigh,
  BrightnessLow,
  Collections,
  CopyAll,
  GraphicEq,
  LensBlur,
  LocalPlay,
  PlayArrow,
  QuestionMark,
  SportsEsports,
  Wallpaper
} from '@mui/icons-material'
import useStore from '../../store/useStore'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import OneShot from './OneShot'
import OneEffect from './OneEffect'

const Assign = ({
  type,
  mapping,
  setMapping,
  pressed,
  index,
  padIndex,
  disabled,
  compact = true
}: any) => {
  // console.log('mapping', mapping)
  const theme = useTheme()
  const scenes = useStore((state) => state.scenes)
  const commands = {
    scene: <Wallpaper />,
    smartbar: <LocalPlay />,
    'play/pause': <PlayArrow />,
    'brightness-up': <BrightnessHigh />,
    'brightness-down': <BrightnessLow />,
    'copy-to': <CopyAll />,
    transitions: <GraphicEq />,
    frequencies: <BladeIcon name="mdi:sine-wave" />,
    'scene-playlist': <Collections />,
    padscreen: <SportsEsports />,
    'one-shot': <BladeIcon name="mdi:pistol" />,
    'scan-wled': <BladeIcon name="wled" />,
    effect: <LensBlur />
  }

  return (
    <Stack
      key={index}
      direction={compact ? 'row' : 'column'}
      alignItems={compact ? 'center' : 'stretch'}
      spacing={compact ? 1 : 0}
    >
      {compact && (
        <Fab
          size="small"
          color={pressed ? 'primary' : 'inherit'}
          sx={[
            {
              m: 1,
              width: 40,
              height: 40,
              flexShrink: 0,
              pointerEvents: 'none'
            },
            pressed
              ? {
                  background: theme.palette.primary.main
                }
              : {
                  background: '#333'
                },
            disabled
              ? {
                  color: '#999'
                }
              : {
                  color: 'inherit'
                }
          ]}
        >
          {index}
        </Fab>
      )}
      {!compact ? (
        <Stack
          direction="row"
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography>Command</Typography>
          <FormControl>
            <Select
              disableUnderline
              disabled={
                disabled || mapping[padIndex][index]?.command === 'scene'
              }
              // IconComponent={() => null}
              style={{
                textAlign: 'right',
                color:
                  mapping[padIndex]?.[index]?.command &&
                  mapping[padIndex]?.[index]?.command !== 'none'
                    ? 'white'
                    : 'grey'
              }}
              sx={{
                '& .MuiSelect-select': {
                  marginTop: '3px'
                }
              }}
              labelId="command-select-label"
              label="command"
              // renderValue={(v) =>
              //   v === 'scene' ? <Wallpaper sx={{ pr: 0 }} /> : v
              // }
              value={mapping[padIndex]?.[index]?.command || 'none'}
              onChange={(e) =>
                setMapping({
                  ...mapping,
                  [padIndex]: {
                    ...mapping[padIndex],
                    [index]: {
                      ...mapping[padIndex]?.[index],
                      command: e.target.value
                    }
                  }
                })
              }
            >
              <MenuItem value="none" key="none">
                <Stack direction="row" spacing={1}>
                  <QuestionMark />
                  <span>{disabled ? 'used by LedFx' : 'choose command'}</span>
                </Stack>
              </MenuItem>
              {Object.keys(commands).map((s) => (
                <MenuItem
                  key={s}
                  value={s}
                  disabled={type === 'midi' && s === 'scene'}
                >
                  <Stack direction="row" spacing={1}>
                    {commands[s as keyof typeof commands] || ''}
                    <span>{s || 'none'}</span>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {mapping[padIndex]?.[index]?.command === 'one-shot' && (
            <OneShot
              size={compact ? 'small' : 'large'}
              defaultColor={mapping[padIndex]?.[index]?.payload?.color}
              defaultRamp={mapping[padIndex]?.[index]?.payload?.ramp}
              defaultFate={mapping[padIndex]?.[index]?.payload?.fade}
              defaultHold={mapping[padIndex]?.[index]?.payload?.hold}
              setPayload={(v: any) =>
                setMapping({
                  ...mapping,
                  [padIndex]: {
                    ...mapping[padIndex],
                    [index]: {
                      ...mapping[padIndex]?.[index],
                      payload: v
                    }
                  }
                })
              }
            />
          )}
          {mapping[padIndex]?.[index]?.command === 'effect' && (
            <OneEffect
              size={compact ? 'small' : 'large'}
              initialPayload={mapping[padIndex]?.[index]?.payload}
              setPayload={(v: any) =>
                setMapping({
                  ...mapping,
                  [padIndex]: {
                    ...mapping[padIndex],
                    [index]: {
                      ...mapping[padIndex]?.[index],
                      payload: v
                    }
                  }
                })
              }
            />
          )}
        </Stack>
      ) : (
        <FormControl fullWidth>
          <Select
            fullWidth
            disableUnderline
            disabled={
              disabled ||
              (type === 'midi' && mapping[padIndex][index]?.command === 'scene')
            }
            // IconComponent={() => null}
            style={{
              color:
                mapping[padIndex]?.[index]?.command &&
                mapping[padIndex]?.[index]?.command !== 'none'
                  ? 'white'
                  : 'grey'
            }}
            sx={{
              '& .MuiSelect-select': {
                marginTop: '3px'
              }
            }}
            labelId="command-select-label"
            label="command"
            renderValue={(v) =>
              v === 'scene' ? <Wallpaper sx={{ pr: 4 }} /> : v
            }
            value={mapping[padIndex]?.[index]?.command || 'none'}
            onChange={(e) =>
              setMapping({
                ...mapping,
                [padIndex]: {
                  ...mapping[padIndex],
                  [index]: { command: e.target.value }
                }
              })
            }
          >
            <MenuItem value="none" key="none">
              <Stack direction="row" spacing={1}>
                <QuestionMark />
                <span>{disabled ? 'used by LedFx' : 'choose command'}</span>
              </Stack>
            </MenuItem>
            {Object.keys(commands).map((s) => (
              <MenuItem
                key={s}
                value={s}
                disabled={type === 'midi' && s === 'scene'}
              >
                <Stack direction="row" spacing={1}>
                  {commands[s as keyof typeof commands] || ''}
                  <span>{s || 'none'}</span>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {mapping[padIndex]?.[index]?.command === 'scene' &&
        (!compact ? (
          <Stack
            direction="row"
            justifyContent={'space-between'}
            alignItems={'center'}
            mt={0.5}
          >
            <Typography>Scene</Typography>
            <FormControl sx={{ maxWidth: 150, minWidth: 150 }}>
              <Select
                disableUnderline
                disabled={
                  disabled || mapping[padIndex][index]?.command === 'scene'
                }
                // IconComponent={() => null}
                style={{
                  textAlign: 'right',
                  color:
                    mapping[padIndex]?.[index]?.payload &&
                    mapping[padIndex]?.[index]?.payload !== 'choose scene'
                      ? 'white'
                      : 'grey'
                }}
                sx={{
                  '& .MuiSelect-select': {
                    // paddingRight: '0 !important',
                    marginTop: '3px'
                  }
                }}
                labelId="scene-select-label"
                label="Scene"
                value={mapping[padIndex]?.[index]?.payload?.scene || 'none'}
                onChange={(e) =>
                  setMapping({
                    ...mapping,
                    [padIndex]: {
                      ...mapping[padIndex],
                      [index]: {
                        ...mapping[padIndex]?.[index],
                        payload: { scene: e.target.value }
                      }
                    }
                  })
                }
              >
                <MenuItem value="none" key="none">
                  {disabled ? 'used by LedFx' : 'choose scene'}
                </MenuItem>
                {Object.keys(scenes).map((s: string) => (
                  <MenuItem key={s} value={s}>
                    {scenes[s]?.name || s || 'none'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        ) : (
          <FormControl sx={{ maxWidth: 150, minWidth: 150 }} fullWidth>
            <Select
              fullWidth
              disableUnderline
              disabled={
                disabled ||
                (type === 'midi' &&
                  mapping[padIndex][index]?.command === 'scene')
              }
              // IconComponent={() => null}
              style={{
                color:
                  mapping[padIndex]?.[index]?.payload &&
                  mapping[padIndex]?.[index]?.payload !== 'choose scene'
                    ? 'white'
                    : 'grey'
              }}
              sx={{
                '& .MuiSelect-select': {
                  // paddingRight: '0 !important',
                  marginTop: '3px'
                }
              }}
              labelId="scene-select-label"
              label="Scene"
              value={mapping[padIndex]?.[index]?.payload?.scene || 'none'}
              onChange={(e) =>
                setMapping({
                  ...mapping,
                  [padIndex]: {
                    ...mapping[padIndex],
                    [index]: {
                      ...mapping[padIndex]?.[index],
                      payload: { scene: e.target.value }
                    }
                  }
                })
              }
            >
              <MenuItem value="none" key="none">
                {disabled ? 'used by LedFx' : 'choose scene'}
              </MenuItem>
              {Object.keys(scenes).map((s: string) => (
                <MenuItem key={s} value={s}>
                  {scenes[s]?.name || s || 'none'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      {compact && mapping[padIndex]?.[index]?.command === 'one-shot' && (
        <OneShot
          defaultColor={mapping[padIndex]?.[index]?.payload?.color}
          defaultRamp={mapping[padIndex]?.[index]?.payload?.ramp}
          defaultFate={mapping[padIndex]?.[index]?.payload?.fade}
          defaultHold={mapping[padIndex]?.[index]?.payload?.hold}
          setPayload={(v: any) =>
            setMapping({
              ...mapping,
              [padIndex]: {
                ...mapping[padIndex],
                [index]: {
                  ...mapping[padIndex]?.[index],
                  payload: v
                }
              }
            })
          }
        />
      )}
    </Stack>
  )
}

export default Assign
