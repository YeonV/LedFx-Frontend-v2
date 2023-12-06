import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slider,
  Stack,
  Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Delete, Edit, GitHub, Save, UploadFile } from '@mui/icons-material'
import { getCroppedImg } from './canvasUtils'

function readFile(file: any) {
  return new Promise((_resolve) => {
    const reader = new FileReader()
    // reader.addEventListener(
    //   'load',
    //   (event) => {
    //     if (event.target?.result && typeof event.target.result === 'string') {
    //       localStorage.setItem('ledfx-cloud-avatar', event.target.result) // THIS IS WRONG IT SAVES THE NON-CROPPED IMAGE
    //     }
    //     return resolve(reader.result)
    //   },
    //   false
    // )
    reader.readAsDataURL(file)
  })
}

const AvatarPicker = ({
  defaultIcon = <GitHub sx={{ fontSize: 'min(25vw, 25vh, 150px)' }} />,
  editIcon = (
    <Edit
      sx={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        padding: '3rem',
        opacity: 0,
        borderRadius: '50%',
        background: '#0009',
        '&:hover': { opacity: 1 }
      }}
    />
  ),
  avatarSrc = localStorage.getItem('ledfx-cloud-avatar')?.toString() || '',
  size = 150,
  initialZoom = 1,
  minZoom = 0.01,
  maxZoom = 3,
  stepZoom = 0.01,
  minRotation = 0,
  maxRotation = 360,
  stepRotation = 0.01,
  ...props
}: {
  defaultIcon?: any
  editIcon?: any
  avatarSrc?: string
  size?: number
  initialZoom?: number
  minZoom?: number
  maxZoom?: number
  stepZoom?: number
  minRotation?: number
  maxRotation?: number
  stepRotation?: number
  props?: any
}) => {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [imageSrc, setImageSrc] = useState<any>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(initialZoom)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = (_croppedArea: Area, newcroppedAreaPixels: Area) => {
    setCroppedAreaPixels(newcroppedAreaPixels)
  }

  const showCroppedImage = async () => {
    try {
      const newcroppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      )

      fetch(newcroppedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader()
          // eslint-disable-next-line func-names
          reader.onloadend = function () {
            if (reader.result) {
              localStorage.setItem(
                'ledfx-cloud-avatar',
                reader.result.toString()
              )
            }
          }
          reader.readAsDataURL(blob)
        })
    } catch (e) {
      console.error(e)
    }
    setOpen(false)
    window.location.reload()
  }

  const onFileChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const imageDataUrl = await readFile(file)
      setImageSrc(imageDataUrl)
    }
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.click()
      }, 200)
    }
  }, [open])

  return (
    <div>
      <Button
        onClick={() => {
          setOpen(true)
        }}
        sx={{ borderRadius: '50%', padding: 0 }}
        {...props}
      >
        {localStorage.getItem('ledfx-cloud-avatar') ? (
          <>
            <Avatar
              src={avatarSrc}
              sx={{ width: size, height: size, '&:hover': { opacity: 0.4 } }}
            />
            {editIcon}
          </>
        ) : (
          defaultIcon
        )}
      </Button>
      <Dialog
        fullWidth
        open={open}
        sx={{ '.MuiPaper-root': { height: 'min(80vh, 700px)' } }}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>Choose Avatar</DialogTitle>
        <DialogContent>
          {imageSrc ? (
            <Stack>
              <div>
                <div>
                  <Typography variant="overline">Zoom</Typography>
                  <Slider
                    value={zoom}
                    min={minZoom} //  0.01
                    max={maxZoom} // 3
                    step={stepZoom} // 0.01
                    aria-labelledby="Zoom"
                    onChange={(e, newzoom) =>
                      typeof newzoom === 'number' && setZoom(newzoom)
                    }
                  />
                </div>
                <div>
                  <Typography variant="overline">Rotation</Typography>
                  <Slider
                    value={rotation}
                    min={minRotation} // 0
                    max={maxRotation} // 360
                    step={stepRotation} // 0.1
                    aria-labelledby="Rotation"
                    onChange={(e, newrotation) =>
                      typeof newrotation === 'number' &&
                      setRotation(newrotation)
                    }
                  />
                </div>
                <Button
                  startIcon={<Save />}
                  onClick={showCroppedImage}
                  variant="contained"
                  color="primary"
                >
                  Save Avatar
                </Button>
                <Button
                  startIcon={<Delete />}
                  onClick={() => {
                    localStorage.removeItem('ledfx-cloud-avatar')
                    setOpen(false)
                  }}
                  variant="contained"
                  color="inherit"
                >
                  Clear Avatar
                </Button>
              </div>

              <div>
                <Cropper
                  cropShape="round"
                  cropSize={{ width: size, height: size }}
                  style={{
                    containerStyle: {
                      width: '100%',
                      height: 450,
                      marginTop: 240
                    }
                  }}
                  image={imageSrc}
                  crop={crop}
                  rotation={rotation}
                  zoom={zoom}
                  minZoom={minZoom}
                  aspect={1 / 1}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
            </Stack>
          ) : (
            <Box
              sx={{
                flex: '1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <IconButton
                onClick={() => {
                  if (inputRef.current) inputRef.current.click()
                }}
              >
                <UploadFile
                  sx={{
                    fontSize: `min(25vw, 25vh, ${size}px)`
                  }}
                />
              </IconButton>
              <input
                style={{ display: 'none' }}
                hidden
                type="file"
                ref={inputRef}
                onChange={onFileChange}
                accept="image/*"
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

AvatarPicker.defaultProps = {
  size: 150,
  defaultIcon: <GitHub sx={{ fontSize: 'min(25vw, 25vh, 150px)' }} />,
  editIcon: <GitHub sx={{ fontSize: 'min(25vw, 25vh, 150px)' }} />,
  avatarSrc: localStorage.getItem('ledfx-cloud-avatar')?.toString() || '',
  initialZoom: 1,
  minZoom: 0.01,
  maxZoom: 3,
  stepZoom: 0.01,
  minRotation: 0,
  maxRotation: 360,
  stepRotation: 0.01,
  props: {}
}

export default AvatarPicker
