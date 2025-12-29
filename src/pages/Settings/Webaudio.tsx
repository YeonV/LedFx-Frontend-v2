import { Button, Fab, TextField, Popover, Select, MenuItem, Stack } from '@mui/material'
import { Check, Close } from '@mui/icons-material'
import { useState, useEffect, CSSProperties } from 'react'
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon'
import useStore from '../../store/useStore'
import { useWebSocket } from '../../utils/Websocket/WebSocketProvider'

const getMedia = async (clientDevice: MediaDeviceInfo | null) => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const audioSetting =
      clientDevice === null || !devices.some((d) => d.deviceId === clientDevice.deviceId)
        ? true
        : { deviceId: { exact: clientDevice.deviceId } }
    return await navigator.mediaDevices.getUserMedia({ audio: audioSetting, video: false })
  } catch (err) {
    console.error('Error getting media stream:', err)
    return null
  }
}

const Webaudio = ({ style }: { style: CSSProperties }) => {
  const {
    webAud,
    setWebAud,
    webAudName,
    setWebAudName,
    getSchemas,
    clientDevice,
    setClientDevices
  } = useStore()
  const { send, isConnected, getSocket } = useWebSocket()

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const webAudTypes = [
    {
      label: 'WebSocket v2',
      value: 'audio_stream_data_v2',
      description: '16-bit, binary - Best balance of quality & efficiency'
    },
    {
      label: 'WebSocket v1',
      value: 'audio_stream_data',
      description: '32-bit, JSON - Highest quality, more bandwidth'
    },
    {
      label: 'UDP Stream',
      value: 'audio_stream_data_udp',
      description: '8-bit - Lowest latency, reduced quality'
    }
  ]
  const [webAudType, setWebAudType] = useState(webAudTypes[0].value)
  const [webAudConfig, setWebAudConfig] = useState({
    sampleRate: 44100,
    bufferSize: 1024,
    udpPort: 8000
  })
  const [bit, setBit] = useState(16)

  // Update bit based on webAudType
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // This is intentional configuration sync
    if (webAudType === 'audio_stream_data_udp') {
      setBit(8)
    } else if (webAudType === 'audio_stream_data_v1') {
      setBit(32)
    } else {
      setBit(16)
    }
  }, [webAudType])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!webAud || !isConnected) {
      return
    }

    let audioContext: AudioContext | null = null
    let stream: MediaStream | null = null
    let scriptNode: ScriptProcessorNode | null = null

    const startStreaming = async () => {
      stream = await getMedia(clientDevice)
      if (!stream) {
        setWebAud(false)
        return
      }

      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const source = audioContext.createMediaStreamSource(stream)
      scriptNode = audioContext.createScriptProcessor(1024, 1, 1)

      source.connect(scriptNode)
      scriptNode.connect(audioContext.destination)

      send({
        data: {
          sampleRate: scriptNode.context.sampleRate,
          bufferSize: scriptNode.bufferSize,
          ...(webAudType === 'audio_stream_data_udp' ? { udpPort: webAudConfig.udpPort, bit } : {})
        },
        client: webAudName,
        id: 8000,
        type: 'audio_stream_config'
      })

      const rawSocket = getSocket()
      scriptNode.onaudioprocess = (e) => {
        if (!rawSocket) return

        if (webAudType === 'audio_stream_data_v2') {
          const floatData = e.inputBuffer.getChannelData(0)
          const int16Array = new Int16Array(floatData.length)
          for (let j = 0; j < floatData.length; j++) {
            int16Array[j] = floatData[j] * 32767
          }
          // The Sockette `send` method can handle ArrayBuffer directly.
          rawSocket.send(int16Array.buffer)
        } else {
          send({
            data: Array.from(e.inputBuffer.getChannelData(0)),
            client: webAudName,
            id: 8000,
            type: 'audio_stream_data'
          })
        }
      }
    }

    startStreaming()

    return () => {
      send({
        client: webAudName,
        id: 8200,
        type: 'audio_stream_stop'
      })
      stream?.getTracks().forEach((track) => track.stop())
      if (audioContext?.state !== 'closed') {
        audioContext?.close()
      }
      getSchemas()
    }
  }, [
    webAud,
    isConnected,
    clientDevice,
    webAudName,
    webAudType,
    webAudConfig,
    bit,
    send,
    getSocket,
    setWebAud,
    getSchemas
  ])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleStartClick = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      setClientDevices(devices)
    } catch (err) {
      console.log(`${(err as Error).name}: ${(err as Error).message}`)
    }
    send({
      data: {},
      client: webAudName,
      id: 8499,
      type: 'audio_stream_start'
    })
    setAnchorEl(null)
    setWebAud(true)
  }

  const handleStopClick = () => {
    setWebAud(false)
  }

  return (
    <>
      <Fab
        aria-describedby={id}
        size="large"
        color={webAud ? 'inherit' : 'secondary'}
        onClick={webAud ? handleStopClick : handleClick}
        data-webaud={webAud}
        style={style}
      >
        {!webAud ? (
          <>
            <BladeIcon
              name="mdi:wifi"
              colorIndicator={webAud}
              style={{
                position: 'relative',
                transform: 'scale(0.8) translate(20%,-30%)'
              }}
            />
            <BladeIcon
              name="mdi:microphone"
              colorIndicator={webAud}
              style={{
                position: 'absolute',
                transform: 'scale(0.7) translate(-20%,50%)'
              }}
            />
          </>
        ) : (
          <BladeIcon name="mdi:stop" colorIndicator={webAud} style={{ position: 'relative' }} />
        )}
      </Fab>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
      >
        <Stack spacing={2} sx={{ p: 2 }}>
          <TextField
            id="client-name"
            label="Client Name"
            value={webAudName}
            onChange={(e) => setWebAudName(e.target.value)}
            variant="outlined"
          />
          <Select
            value={webAudType}
            variant="outlined"
            onChange={(e) => setWebAudType(e.target.value)}
          >
            {webAudTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{type.label}</div>
                  <div style={{ fontSize: '0.8em', color: 'text.secondary', opacity: 0.7 }}>
                    {type.description}
                  </div>
                </div>
              </MenuItem>
            ))}
          </Select>
          <TextField
            disabled
            id="sample-rate"
            label="Sample Rate"
            value={webAudConfig.sampleRate}
            type="number"
            onChange={(e) =>
              setWebAudConfig({
                ...webAudConfig,
                sampleRate: parseInt(e.target.value, 10)
              })
            }
            variant="outlined"
          />
          <TextField
            disabled
            id="buffer-size"
            label="Buffer Size"
            value={webAudConfig.bufferSize}
            onChange={(e) =>
              setWebAudConfig({
                ...webAudConfig,
                bufferSize: parseInt(e.target.value, 10)
              })
            }
            variant="outlined"
          />
          {webAudType === 'audio_stream_data_udp' && (
            <TextField
              id="udp-port"
              label="UDP Port"
              value={webAudConfig.udpPort}
              onChange={(e) =>
                setWebAudConfig({
                  ...webAudConfig,
                  udpPort: parseInt(e.target.value, 10)
                })
              }
              variant="outlined"
            />
          )}
          <TextField
            id="bit"
            disabled
            label="Bit"
            value={bit}
            onChange={(e) => setBit(parseInt(e.target.value, 10))}
            variant="outlined"
          />
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button aria-describedby={id} variant="contained" color="primary" onClick={handleClose}>
              <Close />
            </Button>
            <Button
              aria-describedby={id}
              variant="contained"
              color="primary"
              onClick={handleStartClick}
            >
              <Check />
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  )
}

export default Webaudio
