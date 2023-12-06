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
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener(
      'load',
      (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          //   localStorage.setItem('ledfx-cloud-avatar', event.target.result) // THIS IS WRONG IT SAVES THE NON-CROPPED IMAGE
        }
        return resolve(reader.result)
      },
      false
    )

    reader.readAsDataURL(file)
  })
}

const AvatarPicker = () => {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [imageSrc, setImageSrc] = useState<any>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
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
      >
        {localStorage.getItem('ledfx-cloud-avatar') ? (
          <>
            <Avatar
              src={localStorage.getItem('ledfx-cloud-avatar')?.toString()}
              sx={{ width: 150, height: 150, '&:hover': { opacity: 0.4 } }}
            />
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
          </>
        ) : (
          <GitHub sx={{ fontSize: 'min(25vw, 25vh, 150px)' }} />
        )}
      </Button>
      <Dialog
        fullWidth
        open={open}
        sx={{ '.MuiPaper-root': { height: 'min(80vh, 720px)' } }}
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
                    min={0}
                    max={3}
                    step={0.1}
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
                    min={0}
                    max={360}
                    step={0.1}
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
                  cropSize={{ width: 150, height: 150 }}
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
                  minZoom={0.01}
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
                    fontSize: 'min(25vw, 25vh, 150px)'
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

export default AvatarPicker
