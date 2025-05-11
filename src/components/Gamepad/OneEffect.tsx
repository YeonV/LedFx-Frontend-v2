import {
  // Accordion,
  // AccordionDetails,
  // AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup
  // Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Edit } from '@mui/icons-material'
import useStore from '../../store/useStore'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import SliderInput from '../SchemaForm/components/Number/SliderInput'
import { useHotkeys } from 'react-hotkeys-hook'
import { log } from '../../utils/log'
import VirtualPicker from '../SchemaForm/components/VirtualPicker/VirtualPicker'
import BladeFrame from '../SchemaForm/components/BladeFrame'

const OneEffect = ({ initialPayload, setPayload, noButton }: any) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [virtId, setVirtId] = useState('')
  const [type, setType] = useState('')
  const [config, setConfig] = useState<any>({})
  const [active, setActive] = useState(true)
  const [fallback, setFallback] = useState(2)
  const [fallbackBool, setFallbackBool] = useState(false)
  const [fallbackUseNumber, setFallbackUseNumber] = useState(true)
  const [fallbackNumber, setFallbackNumber] = useState(20)

  const effects = useStore((state) => state.schemas.effects)
  const presets = useStore((state) => state.presets)
  const setEffect = useStore((state) => state.setEffect)
  const getPresets = useStore((state) => state.getPresets)
  const setEffectFallback = useStore((state) => state.setEffectFallback)

  log.purple('OneEffect', initialPayload)

  const p = { ...presets.ledfx_presets, ...presets.user_presets }

  const handleClose = () => {
    setDialogOpen(false)
  }
  const handleSave = () => {
    let finalConfigString
    if (config && config !== '') {
      // config state is a non-empty JSON string
      try {
        // Parse and re-stringify to ensure consistent formatting (e.g., pretty print)
        finalConfigString = JSON.stringify(JSON.parse(config), null, 4)
      } catch (e) {
        log.error('OneEffect', 'Error parsing config state before save:', config, e)
        finalConfigString = JSON.stringify({}, null, 4) // Fallback to empty object string
      }
    } else {
      finalConfigString = JSON.stringify({}, null, 4) // Represents an empty config
    }
    log.purple('OneEffect', 'Final config string:', fallbackUseNumber, fallbackNumber, fallbackBool)
    setPayload({
      virtId,
      type,
      config: finalConfigString,
      active,
      fallback: fallbackUseNumber ? fallbackNumber / 1000 : fallbackBool // Ensure fallbackNumber is scaled (0-1)
    })
    setDialogOpen(false)
  }

  useHotkeys(['ctrl+alt+e'], () => setDialogOpen(!dialogOpen))

  useEffect(() => {
    if (virtId && type && virtId !== '' && type !== '') {
      getPresets(type)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtId, type])

  const handleFallbackChange = (newValue: number | null) => {
    if (newValue === null) {
      return
    }

    setFallback(newValue) // Update the main selector state

    switch (newValue) {
      case 1: // "No Fallback"
        setFallbackUseNumber(false)
        setFallbackBool(false)
        break
      case 2: // "Timeout"
        setFallbackUseNumber(true)
        setFallbackBool(false)
        break
      case 3: // "Button-Release"
        setFallbackUseNumber(false)
        setFallbackBool(true)
        break
      default:
        // Should not happen
        break
    }
  }

  // Initializing the dialog state when it opens
  useEffect(() => {
    if (dialogOpen) {
      log.purple('OneEffect', 'Dialog opened, initializing with initialPayload:', initialPayload)
      setVirtId(initialPayload?.virtId || '')
      setType(initialPayload?.type || '')

      const initialConfigStr = initialPayload?.config
      if (initialConfigStr) {
        try {
          JSON.parse(initialConfigStr)
          setConfig(JSON.stringify(JSON.parse(initialConfigStr)))
        } catch (e) {
          console.warn('Initial payload config is not a valid JSON string:', initialConfigStr, e)
          setConfig('')
        }
      } else {
        setConfig('')
      }

      setActive(initialPayload?.active !== undefined ? initialPayload.active : false)

      // Handle fallback logic
      if (initialPayload && initialPayload.fallback !== undefined) {
        if (typeof initialPayload.fallback === 'number') {
          setFallback(2)
          setFallbackUseNumber(true)
          setFallbackNumber(initialPayload.fallback * 1000)
          setFallbackBool(true)
        } else {
          // Assuming boolean
          setFallbackUseNumber(false)
          setFallbackBool(Boolean(initialPayload.fallback))
          setFallback(initialPayload.fallback ? 3 : 1)
        }
      } else {
        // Defaults for create mode or if initialPayload.fallback is undefined
        setFallbackUseNumber(true) // Default to number type
        setFallbackNumber(20) // Default value for number (0-1000 scale)
        setFallbackBool(false) // Default value for bool
      }
    }
    // Rerun this effect when the dialog opens or the initialPayload changes.
  }, [dialogOpen, initialPayload])

  return (
    <>
      {!noButton && (
        <IconButton onClick={() => setDialogOpen(true)}>
          <Edit />
        </IconButton>
      )}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth>
        <DialogTitle alignItems="center" display="flex">
          <BladeIcon name="LensBlur" style={{ marginRight: 16 }} />
          One Effect
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <VirtualPicker title="Virtual" value={virtId} onChange={(v) => setVirtId(v)} showAll />
            <Stack direction="row" spacing={2} alignItems={'center'} pb={2}>
              <BladeFrame
                title="Type"
                style={{
                  flexBasis: '100%',
                  width: 'unset'
                }}
              >
                <Select
                  disableUnderline
                  fullWidth
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem key={'noValue'} value={''}>
                    Please select
                  </MenuItem>
                  {effects &&
                    Object.keys(effects).map((k) => (
                      <MenuItem key={k} value={k}>
                        {effects[k].name}
                      </MenuItem>
                    ))}
                </Select>
              </BladeFrame>
              <BladeFrame
                title="Preset"
                style={{
                  // margin: '0.5rem 0',
                  flexBasis: '100%',
                  width: 'unset'
                }}
              >
                <Select
                  disableUnderline
                  fullWidth
                  value={config}
                  onChange={(e) => setConfig(e.target.value)}
                >
                  <MenuItem key={'noValue'} value={''}>
                    Please select
                  </MenuItem>
                  {presets &&
                    Object.values(p).map((k) => (
                      <MenuItem key={k.name} value={JSON.stringify(k.config)}>
                        {k.name}
                      </MenuItem>
                    ))}
                </Select>
              </BladeFrame>
            </Stack>
            <BladeFrame
              title="Fallback"
              style={{
                margin: '0.5rem 0',
                paddingBottom: '0.7rem',
                flexBasis: '100%',
                width: 'unset',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <ToggleButtonGroup
                fullWidth
                size="small"
                color="primary"
                value={fallback}
                exclusive
                onChange={(e, v) => handleFallbackChange(v)}
                aria-label="Platform"
              >
                <ToggleButton value={1}>No Fallback</ToggleButton>
                <ToggleButton value={2}>Timeout</ToggleButton>
                <ToggleButton value={3}>Button-Release</ToggleButton>
              </ToggleButtonGroup>
              {fallback === 2 && (
                <SliderInput
                  value={fallbackNumber}
                  setValue={setFallbackNumber}
                  sx={{ width: '95%', mt: 1 }}
                  units="ms"
                />
              )}
            </BladeFrame>

            {/* <Stack direction="row" spacing={2} alignItems={'center'}>
              <Typography flexShrink={0} flexBasis={'150px'}>
                Active
              </Typography>
              <ToggleButtonGroup
                fullWidth
                size="small"
                color="primary"
                value={active}
                exclusive
                onChange={(e, v) => setActive(v)}
                aria-label="Platform"
              >
                <ToggleButton value={true}>True</ToggleButton>
                <ToggleButton value={false}>False</ToggleButton>
              </ToggleButtonGroup>
            </Stack> */}
          </Stack>
          {/* <Accordion
            disableGutters
            elevation={0}
            sx={{
              marginTop: '1rem',
              '& .MuiAccordionSummary-root': {
                padding: 0
              },
              '&:before': {
                display: 'none'
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Output JSON
            </AccordionSummary>
            <AccordionDetails>
              <code
                style={{
                  display: 'block',
                  margin: '1rem 0',
                  padding: '1rem',
                  background: '#333',
                  color: '#ffffff',
                  overflowX: 'auto'
                }}
              >
                <pre>
                  {`{
"virtId": "${virtId}",
"type": "${type}",
"config": ${(() => {
                    if (config && config !== '') {
                      try {
                        return JSON.stringify(JSON.parse(config), null, 4)
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
                      } catch (e) {
                        return '"Error: Invalid config format"'
                      }
                    }
                    return JSON.stringify({}, null, 4)
                  })()},
"active": ${active},
"fallback": ${fallbackUseNumber ? fallbackNumber / 1000 : fallbackBool}
}`}
                </pre>
              </code>
            </AccordionDetails>
          </Accordion> */}

          <DialogActions>
            <Button
              // onClick={() => handleTest()}
              onMouseDownCapture={() => {
                let effectConfigObject = {}
                if (config && config !== '') {
                  try {
                    effectConfigObject = JSON.parse(config)
                  } catch (e) {
                    log.error('OneEffect', 'Error parsing config for test:', config, e)
                    // effectConfigObject remains {}
                  }
                }
                setEffect(
                  virtId,
                  type,
                  effectConfigObject, // Pass parsed object
                  active,
                  fallbackUseNumber ? fallbackNumber / 1000 : fallbackBool // Ensure fallbackNumber is scaled (0-1)
                )
              }}
              onMouseUpCapture={() => {
                // log.purple('onMouseUp', e)
                setEffectFallback(virtId)
              }}
            >
              test
            </Button>
            <Button onClick={handleClose}>{noButton ? 'Close' : 'Cancel'}</Button>
            {!noButton && <Button onClick={handleSave}>Save</Button>}
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default OneEffect
