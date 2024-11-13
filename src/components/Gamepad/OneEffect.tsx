import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Edit, ExpandMore } from '@mui/icons-material'
import useStore from '../../store/useStore'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import SliderInput from '../SchemaForm/components/Number/SliderInput'
import { useHotkeys } from 'react-hotkeys-hook'

const OneEffect = ({
  setPayload,
  noButton,
}: any) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [virtId, setVirtId] = useState('')
  const [type, setType] = useState('')
  const [config, setConfig] = useState<any>({})
  const [active, setActive] = useState(false)
  const [fallbackBool, setFallbackBool] = useState(false)
  const [fallbackUseNumber, setFallbackUseNumber] = useState(false)
  const [fallbackNumber, setFallbackNumber] = useState(0)

  const effects = useStore((state) => state.schemas.effects)
  const virtuals = useStore((state) => state.virtuals)
  const presets = useStore((state) => state.presets)
  const setEffect = useStore((state) => state.setEffect)
  const getPresets = useStore((state) => state.getPresets)

  const p = { ...presets.ledfx_presets, ...presets.user_presets }

  const handleClose = () => {
    setDialogOpen(false)
  }
  const handleSave = () => {
    setPayload({  })
    setDialogOpen(false)
  }
  // const handleTest = (virtId: string, type: string, config: EffectConfig, active: boolean, fallback: boolean | number) => {
  const handleTest = () => {
    setEffect(virtId, type, JSON.parse(config), active, fallbackUseNumber ? fallbackNumber / 1000 : fallbackBool)
  }
  useHotkeys(['ctrl+alt+e'], () => setDialogOpen(!dialogOpen))

  useEffect(() => {
    if (virtId && type && virtId !== '' && type !== '') {
      getPresets(type)
    }
  }, [virtId, type])

  return (
    <>
      {!noButton && <Button variant="text" onClick={() => setDialogOpen(true)}>
        <Edit />
      </Button>}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth>
        <DialogTitle alignItems="center" display="flex">
          <BladeIcon name="LensBlur" style={{ marginRight: 16 }} />One Effect
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems={'center'}>
              <Typography flexShrink={0} flexBasis={'150px'}>Virtual ID</Typography>
              <Select
                fullWidth
                value={virtId}
                onChange={(e) => setVirtId(e.target.value)}
              >
                <MenuItem key={'noValue'} value={''}>
                  Please select
                </MenuItem>
                {Object.keys(virtuals).map((k) => (
                  <MenuItem key={k} value={k}>
                    {k}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack direction="row" spacing={2} alignItems={'center'}>
              <Typography flexShrink={0} flexBasis={'150px'}>Type</Typography>
              <Select
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
            </Stack>
            <Stack direction="row" spacing={2} alignItems={'center'}>
              <Typography flexShrink={0} flexBasis={'150px'}>Preset</Typography>
              <Select
                fullWidth
                value={typeof config === 'string' ? config : ''}
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
            </Stack>

            <Stack direction="row" spacing={2} alignItems={'center'}>
              <Typography flexShrink={0} flexBasis={'150px'}>Active</Typography>
              <ToggleButtonGroup
                fullWidth
                size='small'
                color="primary"
                value={active}
                exclusive
                onChange={(e,v) => setActive(v)}
                aria-label="Platform"
              >
                <ToggleButton value={true}>True</ToggleButton>
                <ToggleButton value={false}>False</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <Stack direction="row" spacing={2} alignItems={'center'}>
              <Typography flexShrink={0} flexBasis={'150px'}>Fallback Type</Typography>
              <ToggleButtonGroup
                fullWidth
                size='small'
                color="primary"
                value={fallbackUseNumber}
                exclusive
                onChange={(e,v) => setFallbackUseNumber(v)}
                aria-label="Platform"
              >
                <ToggleButton value={true}>Number</ToggleButton>
                <ToggleButton value={false}>Boolean</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            {fallbackUseNumber 
              ? <SliderInput title="Fallback" titleWidth={180} value={fallbackNumber} setValue={setFallbackNumber} />
              : <Stack direction="row" spacing={2} alignItems={'center'}>
                  <Typography flexShrink={0} flexBasis={'150px'}>Fallback</Typography>
                  <ToggleButtonGroup
                    fullWidth
                    size='small'
                    color="primary"
                    value={fallbackBool}
                    exclusive
                    onChange={(e,v) => setFallbackBool(v)}
                    aria-label="Platform"
                  >
                    <ToggleButton value={true}>true</ToggleButton>
                    <ToggleButton value={false}>false</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>}
          </Stack>
          <Accordion 
            disableGutters 
            elevation={0}
            sx={{
              marginTop: '1rem',
              '& .MuiAccordionSummary-root': {
                padding: 0,
              },
              '&:before': {
                  display: 'none',
              }
            }}>
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
                  overflowX: 'auto',
                }}
              ><pre>
                {`{
  "virtId": "${virtId}",
  "type": "${type}",
  "config": ${typeof config === 'string' ? JSON.stringify(JSON.parse(config), null, 4) : JSON.stringify(config, null, 4)},
  "active": ${active},
  "fallback": ${(fallbackUseNumber ? fallbackNumber / 1000 : fallbackBool)}
}`}
              </pre></code>
            </AccordionDetails>
          </Accordion>
          
          <DialogActions>
            <Button onClick={() => handleTest()}>test</Button>
            <Button onClick={handleClose}>{noButton ? 'Close' : 'Cancel'}</Button>
            {!noButton && <Button onClick={handleSave}>Save</Button>}
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default OneEffect
