import { SportsEsports, SportsEsportsOutlined } from '@mui/icons-material'
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Stack,
  Tab,
  Tabs,
  Tooltip
} from '@mui/material'
import { useState, SyntheticEvent as ev } from 'react'
import { useGamepads } from 'react-gamepads'
import useStore from '../../store/useStore'
import { CustomTabPanel as PN, a11yProps } from './Gamepad.props'
import PD from './PadData'
import PT from './PadTitle'
import Assign from './Assign'
import GamepadSvg from './GamepadSvg'

const Gamepad = ({ setScene }: any) => {
  const infoAlerts = useStore((state) => state.ui.infoAlerts)
  const setInfoAlerts = useStore((state) => state.ui.setInfoAlerts)
  const setFeatures = useStore((state) => state.setFeatures)

  const [open, setOpen] = useState<boolean>(false)
  const [pad0, setPad0] = useState<any>()
  const [pad1, setPad1] = useState<any>()
  const [pad2, setPad2] = useState<any>()
  const [pad3, setPad3] = useState<any>()
  const [gp, setGp] = useState<any>()
  const [currentPad, setCurrentPad] = useState<number>(0)
  const [mapping, setMapping] = useState<Record<number, string>>({})

  const handleChange = (_e: ev, v: number) => setCurrentPad(v)

  useGamepads((g) => {
    if (g[0]) setPad0(g[0])
    if (g[1]) setPad1(g[1])
    if (g[2]) setPad2(g[2])
    if (g[3]) setPad3(g[3])
    setGp(pad0?.id || pad1?.id || pad2?.id || pad3?.id)
    if (
      Object.keys(g).some(
        (k: any) => g[k]?.buttons[8].pressed && g[k]?.buttons[9].pressed
      )
    ) {
      // eslint-disable-next-line no-alert
      alert('DevMode activated!')
      setFeatures('dev', true)
    }
  })

  return gp ? (
    <div>
      <Tooltip title="Gamepad detected">
        <Fab color="primary" aria-label="gamepad" onClick={() => setOpen(true)}>
          <SportsEsports />
        </Fab>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { maxWidth: 720, minWidth: 720 } }}
      >
        <DialogTitle display="flex" alignItems="center">
          <SportsEsports sx={{ mr: 2 }} /> Gamepad detected
        </DialogTitle>
        <DialogContent>
          <Collapse in={infoAlerts.gamepad} unmountOnExit sx={{ mb: 2 }}>
            <Alert
              severity="error"
              onClose={() => {
                setInfoAlerts('gamepad', false)
              }}
            >
              Note: This is a just proof of concept! Keep this dialog open while
              using the gamepad. Mapping is NOT saved and will be lost on
              closing the dialog.
            </Alert>
          </Collapse>
          <Tabs value={currentPad} onChange={handleChange} variant="fullWidth">
            {[pad0, pad1, pad2, pad3].map((pad: any, padIndex: number) => (
              <Tab
                {...a11yProps(padIndex)}
                icon={pad?.id ? <SportsEsports /> : <SportsEsportsOutlined />}
                key={padIndex}
                value={pad?.index || padIndex}
                label={`Pad ${pad?.index || padIndex + 1}`}
                sx={{ flexDirection: 'column' }}
              />
            ))}
          </Tabs>
          {[pad0, pad1, pad2, pad3].map((pad: any, pi: number) => (
            <PN value={currentPad} index={pi} key={pi} minHeight={gp ? 875 : 0}>
              {pad?.id ? (
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="column">
                    <PT label={pad.id} />
                    <Stack direction="row" justifyContent="space-between">
                      <PD label="connected" value={pad.connected} />
                      <PD label="index" value={pad.index} />
                      <PD label="mapping" value={pad.mapping} />
                      <PD label="timestamp" value={pad.timestamp.toFixed(2)} />
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      marginTop={2}
                      marginBottom={2}
                    >
                      <PD label="axes 0" value={pad.axes[0].toFixed(5)} />
                      <PD label="axes 1" value={pad.axes[1].toFixed(5)} />
                      <PD label="axes 2" value={pad.axes[2].toFixed(5)} />
                      <PD label="axes 3" value={pad.axes[3].toFixed(5)} />
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      marginTop={2}
                      marginBottom={2}
                    >
                      <PD label="Motor" value={pad.vibrationActuator.type} />
                    </Stack>
                    <GamepadSvg pad={pad} />
                  </Stack>
                  <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
                    {pad?.buttons.map((b: any, i: number) => {
                      if (b.pressed && mapping[i] && mapping[i] !== 'none') {
                        setScene(mapping[i])
                      }
                      return (
                        <Assign
                          mapping={mapping}
                          setMapping={setMapping}
                          pressed={b.pressed}
                          index={i}
                        />
                      )
                    })}
                  </Stack>
                </Stack>
              ) : (
                <Stack direction="column" alignItems="center">
                  <h3>Connect a gamepad and press buttons to begin</h3>
                  <Box sx={{ display: 'flex' }}>
                    <CircularProgress size={100} />
                  </Box>
                </Stack>
              )}
            </PN>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  ) : null
}

export default Gamepad
