import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import Webc from 'react-webcam'
import { useCallback, useEffect, useRef, useState } from 'react'
import useStore from '../../store/useStore'
import { adjust, calibrate, initialize, preadjust } from './pixelMapper'
import { getLedCount, oneLed } from './pixelUtils'

const Webcam = ({ colN, rowN }: { colN: number; rowN: number }) => {
  const webcamRef = useRef<any>(null)
  const pointsRef = useRef<any>(null)
  const setPoints = useStore((state) => state.setPoints)
  const addPoint = useStore((state) => state.addPoint)
  const devices = useStore((state) => state.devices)
  const wledIps = Object.keys(devices)
    .filter((d) => devices[d].type === 'wled')
    .map((d) => devices[d].config.ip_address)

  const [deviceId, setDeviceId] = useState('')
  const [mDevices, setMDevices] = useState<MediaDeviceInfo[]>([])
  const [ip, setIp] = useState('')
  const wledIp = useStore((state) => state.videoMapper.wledIp)
  const wledDeviceId = Object.keys(devices).find(
    (d) => devices[d].config.ip_address === wledIp
  )
  const setWledIp = useStore((state) => state.setWledIp)
  // const [imageSrc, setImageSrc] = useState('')
  // const [imageSrcs, setImageSrcs] = useState<string[]>([])
  const [threshold, setThreshold] = useState(128)
  const [singleLed, setSingleLed] = useState(0)
  const [baseImage, setBaseImage] = useState('')
  const [maxLed, setMaxLed] = useState(0)
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [ignoreTop, setIgnoreTop] = useState(0)
  const [ignoreLeft, setIgnoreLeft] = useState(0)
  const [ignoreBottom, setIgnoreBottom] = useState(0)
  const [ignoreRight, setIgnoreRight] = useState(0)

  const isCalibrating = useStore((state) => state.videoMapper.calibrating)
  const setIsCalibrating = useStore((state) => state.setCalibrating)

  const handleDevices = useCallback(
    (mediaDevices: MediaDeviceInfo[]) => {
      const videoDevices = mediaDevices.filter(
        ({ kind }) => kind === 'videoinput'
      )
      if (deviceId === '' && videoDevices.length > 0) {
        setDeviceId(videoDevices[0].deviceId)
      }
      setMDevices(videoDevices)
    },
    [setMDevices, deviceId]
  )
  const capture = useCallback(async () => {
    const img = webcamRef.current?.getScreenshot()
    return img
  }, [webcamRef])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices)
  }, [handleDevices])

  useEffect(() => {
    setIp(wledIp)
    const getCount = async () => {
      if (wledIp && wledIp !== '') {
        const c = await getLedCount(wledIp)
        setMaxLed(c)
      }
    }
    getCount()
    // return () => {
    //   setIp('')
    //   setWledIp('')
    //   setMaxLed(0)
    // }
  }, [wledIp])

  // useEffect(() => {
  //   setIp('')
  //   setWledIp('')
  //   setMaxLed(0)
  // }, [])

  useEffect(() => {
    let animationFrameId: number | null = null
    let isCancelled = false

    const adjustFrame = async () => {
      if (!isAdjusting || isCancelled) return
      await adjust(
        capture,
        baseImage,
        threshold,
        ignoreTop,
        ignoreLeft,
        ignoreBottom,
        ignoreRight,
        pointsRef
      )
      animationFrameId = requestAnimationFrame(adjustFrame)
    }
    preadjust()
    adjustFrame()

    return () => {
      isCancelled = true
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [
    isAdjusting,
    threshold,
    baseImage,
    capture,
    ignoreTop,
    ignoreLeft,
    ignoreBottom,
    ignoreRight
  ])

  useEffect(() => {
    if (isCalibrating) {
      calibrate(
        wledIp,
        100,
        pointsRef,
        400 - ignoreLeft - ignoreRight,
        300 - ignoreBottom - ignoreTop,
        colN,
        rowN,
        setPoints,
        addPoint,
        wledDeviceId
      ).then(() => {
        setIsCalibrating(false)
      })
    }
  }, [
    isCalibrating,
    wledIp,
    ignoreTop,
    ignoreLeft,
    ignoreBottom,
    ignoreRight,
    wledDeviceId,
    colN,
    rowN,
    setPoints,
    addPoint,
    setIsCalibrating
  ])

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        width: 400
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="wled">WLED Devices</InputLabel>
        {wledIps.length > 0 && (
          <Select
            variant="outlined"
            label="WLED Devices"
            labelId="wled"
            value={wledIp}
            onChange={(e) => setWledIp(e.target.value)}
          >
            <MenuItem key="" value="" disabled>
              Select WLED Device
            </MenuItem>
            {wledIps.map((wledip) => (
              <MenuItem key={wledip} value={wledip}>
                {wledip}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>
      <TextField
        fullWidth
        sx={{ display: 'none' }}
        label="IP"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
      />
      <FormControl fullWidth>
        <InputLabel id="camera">Camera</InputLabel>
        <Select
          label="Camera"
          labelId="camera"
          variant="outlined"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
        >
          {mDevices.map((device, key) => (
            <MenuItem key={device.deviceId} value={device.deviceId}>
              {device.label || `Device ${key + 1}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction="row" spacing={2}>
        <Button
          onClick={async () => {
            const img = await initialize(capture)
            setBaseImage(img)
          }}
        >
          Initialize
        </Button>
        <Button onClick={() => setIsAdjusting(!isAdjusting)}>
          {isAdjusting ? 'Stop Adjust' : 'Adjust'}
        </Button>
        <Button
          disabled={isCalibrating || !isAdjusting}
          onClick={() => setIsCalibrating(true)}
        >
          {isCalibrating ? 'Calibrating' : 'Calibrate'}
        </Button>
      </Stack>
      <Webc
        ref={webcamRef}
        width="100%"
        mirrored={false}
        audio={false}
        videoConstraints={{ deviceId }}
      />
      {/* <Button
        onClick={async () => {
          const img = await capture()
          setImageSrc(img)
        }}
      >
        Capture
      </Button>
      Capture:
      {imageSrc && <img src={imageSrc} alt="webcam" />} */}
      {/* Test Images
      {imageSrcs.map((img, key) => (
        <img key={key} src={img} alt="webcam" />
      ))} */}
      <br />
      {!isCalibrating && !isAdjusting && (
        <>
          <Stack direction="row" spacing={2}>
            <Typography width={120}>Cut Top</Typography>
            <Slider
              min={0}
              max={150}
              value={ignoreTop}
              onChange={(_, v) => setIgnoreTop(v as number)}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography width={120}>Cut Left</Typography>
            <Slider
              min={0}
              max={200}
              value={ignoreLeft}
              onChange={(_, v) => setIgnoreLeft(v as number)}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography width={120}>Cut Bottom</Typography>
            <Slider
              min={0}
              max={150}
              value={ignoreBottom}
              onChange={(_, v) => setIgnoreBottom(v as number)}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography width={120}>Cut Right</Typography>
            <Slider
              min={0}
              max={200}
              value={ignoreRight}
              onChange={(_, v) => setIgnoreRight(v as number)}
            />
          </Stack>
        </>
      )}
      {!isCalibrating && isAdjusting && (
        <>
          <Stack direction="row" spacing={2}>
            <Typography width={120}>Threshold</Typography>
            <Slider
              min={0}
              max={255}
              value={threshold}
              onChange={(_, v) => setThreshold(v as number)}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography width={120}>Led</Typography>
            <Slider
              min={0}
              step={1}
              max={maxLed}
              value={singleLed}
              onChange={(_, v) => {
                setSingleLed(v as number)
                oneLed(v as number)
              }}
            />
          </Stack>
        </>
      )}

      {!isAdjusting && (
        <>
          <br />
          Base Image:
          <div style={{ position: 'relative', margin: 0, height: 300 }}>
            <img key={'baseImage'} src={baseImage} alt="baseImage" />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 400 - ignoreLeft,
                background: '#444'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 300 - ignoreBottom,
                left: 0,
                bottom: 0,
                right: 0,
                background: '#444'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 300 - ignoreTop,
                right: 0,
                background: '#444'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 400 - ignoreRight,
                bottom: 0,
                right: 0,
                background: '#444'
              }}
            />
          </div>
        </>
      )}
      {isAdjusting && (
        <>
          Diff Image:
          <img id="diffImage" alt="diff" />
        </>
      )}
    </Stack>
  )
}

export default Webcam
