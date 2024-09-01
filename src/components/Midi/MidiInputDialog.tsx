import { SportsEsports, SportsEsportsOutlined } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  // Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Tooltip
} from '@mui/material'
import { useState, SyntheticEvent as ev, useEffect } from 'react'
import useStore from '../../store/useStore'


import { sleep } from '../../utils/helpers'
import MuiSwitch from '../MuiSwitch'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import LaunchpadButtonMap from './LaunchpadButtonMap'

const MidiInputDialog = ({ variant }: any) => {
    const midiEvent = useStore((state) => state.midiEvent)

  const infoAlerts = useStore((state) => state.ui.infoAlerts)
  const setInfoAlerts = useStore((state) => state.ui.setInfoAlerts)
  const setFeatures = useStore((state) => state.setFeatures)
  const smartBarPadOpen = useStore((state) => state.ui.bars.smartBarPad.open)
  const setSmartBarPadOpen = useStore(
    (state) => state.ui.bars && state.ui.setSmartBarPadOpen
  )
  const [open, setOpen] = useState<boolean>(false)

  const mapping = useStore((state) => state.mapping)
  const setMapping = useStore((state) => state.setMapping)
  const analogBrightness = useStore((state) => state.analogBrightness)
  const setAnalogBrightness = useStore((state) => state.setAnalogBrightness)


  const blocked = useStore((state) => state.blocked)
  const setBlocked = useStore((state) => state.setBlocked)
  const togglePause = useStore((state) => state.togglePause)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const brightness = useStore((state) => state.config.global_brightness)
  const setSystemSetting = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig())
  }
  const [scanning, setScanning] = useState(-1)
  const scanForDevices = useStore((state) => state.scanForDevices)
  const getDevices = useStore((state) => state.getDevices)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const toggleScenePLplay = useStore((state) => state.toggleScenePLplay)
  const oneShotAll = useStore((state) => state.oneShotAll)

  const features = useStore((state) => state.features)

  const handleScan = () => {
    setScanning(0)
    scanForDevices()
      .then(async () => {
        for (let sec = 1; sec <= 30; sec += 1) {
          if (scanning === -1) break
          sleep(1000).then(() => {
            getDevices()
            getVirtuals()
            if (scanning !== -1) setScanning(sec)
          })
        }
      })
      .then(() => {
        setScanning(-1)
      })
  }


//   useEffect(() => {
//     if (!blocked) {
//       const m = [pad0, pad1, pad2, pad3]
//       m.map((pad: any) =>
//         pad?.buttons.map((b: any, i: number) => {
//           const test =
//             b.pressed &&
//             b.value === 1 &&
//             mapping[pad.index][i] &&
//             mapping[pad.index][i].command &&
//             mapping[pad.index][i].command !== 'none'
//           if (test) {
//             if (
//               mapping[pad.index][i].command === 'scene' &&
//               mapping[pad.index][i].payload?.scene
//             ) {
//               setScene(mapping[pad.index][i].payload.scene)
//             } else if (mapping[pad.index][i].command === 'padscreen') {
//               setOpen(!open)
//             } else if (mapping[pad.index][i].command === 'smartbar') {
//               setSmartBarPadOpen(!smartBarPadOpen)
//             } else if (mapping[pad.index][i].command === 'play/pause') {
//               togglePause()
//             } else if (mapping[pad.index][i].command === 'brightness-up') {
//               setSystemSetting(
//                 'global_brightness',
//                 Math.min(brightness + 0.1, 1).toFixed(2)
//               )
//             } else if (mapping[pad.index][i].command === 'brightness-down') {
//               setSystemSetting(
//                 'global_brightness',
//                 Math.max(brightness - 0.1, 0).toFixed(2)
//               )
//             } else if (mapping[pad.index][i].command === 'scan-wled') {
//               handleScan()
//             } else if (mapping[pad.index][i].command === 'copy-to') {
//               setFeatures('streamto', !features.streamto)
//             } else if (mapping[pad.index][i].command === 'transitions') {
//               setFeatures('transitions', !features.transitions)
//             } else if (mapping[pad.index][i].command === 'frequencies') {
//               setFeatures('frequencies', !features.frequencies)
//             } else if (mapping[pad.index][i].command === 'scene-playlist') {
//               toggleScenePLplay()
//             } else if (mapping[pad.index][i].command === 'one-shot') {
//               oneShotAll(
//                 mapping[pad.index][i].payload?.color || '#0dbedc',
//                 mapping[pad.index][i].payload?.ramp || 10,
//                 mapping[pad.index][i].payload?.hold || 200,
//                 mapping[pad.index][i].payload?.fade || 2000
//               )
//             }
//           } else if (pad.axes[0] === 1 && analogBrightness[0]) {
//             setSystemSetting(
//               'global_brightness',
//               Math.min(brightness + 0.1, 1).toFixed(2)
//             )
//           } else if (pad.axes[0] === -1 && analogBrightness[0]) {
//             setSystemSetting(
//               'global_brightness',
//               Math.max(brightness - 0.1, 0).toFixed(2)
//             )
//           } else if (pad.axes[1] === -1 && analogBrightness[1]) {
//             setSystemSetting(
//               'global_brightness',
//               Math.min(brightness + 0.1, 1).toFixed(2)
//             )
//           } else if (pad.axes[1] === 1 && analogBrightness[1]) {
//             setSystemSetting(
//               'global_brightness',
//               Math.max(brightness - 0.1, 0).toFixed(2)
//             )
//           } else if (pad.axes[2] === 1 && analogBrightness[2]) {
//             setSystemSetting(
//               'global_brightness',
//               Math.min(brightness + 0.1, 1).toFixed(2)
//             )
//           } else if (pad.axes[2] === -1 && analogBrightness[2]) {
//             setSystemSetting(
//               'global_brightness',
//               Math.max(brightness - 0.1, 0).toFixed(2)
//             )
//           } else if (pad.axes[3] === -1 && analogBrightness[3]) {
//             setSystemSetting(
//               'global_brightness',
//               Math.min(brightness + 0.1, 1).toFixed(2)
//             )
//           } else if (pad.axes[3] === 1 && analogBrightness[3]) {
//             setSystemSetting(
//               'global_brightness',
//               Math.max(brightness - 0.1, 0).toFixed(2)
//             )
//           }
//           return null
//         })
//       )
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pad0, pad1, pad2, pad3])

  return (
    <div style={{ alignSelf: 'center' }}>
      <Tooltip title="MIDI Input Configuration">
        <IconButton onClick={() => setOpen(true)}>
            <BladeIcon name="mdi:midi" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            maxWidth: 'min(95vw, 1200px)',
            minWidth: 'min(95vw, 750px)',
            width: '100%'
          }
        }}
      >
        <DialogTitle display="flex" alignItems="center">
            <BladeIcon name="mdi:midi" style={{ marginRight: '1rem'}} /> {/\((.*?)\)/.exec(midiEvent.name)?.[1]} Input Configuration
        </DialogTitle>
        <DialogContent>
            <LaunchpadButtonMap />
        
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MidiInputDialog
