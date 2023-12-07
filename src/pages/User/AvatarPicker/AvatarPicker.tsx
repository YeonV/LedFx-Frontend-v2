import { useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Delete, Save, UploadFile } from '@mui/icons-material'
import setupIndexedDB, { useIndexedDBStore } from 'use-indexeddb'
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
import { getCroppedImg, idbConfig, readFile } from './avatarUtils'
import {
  AvatarPickerDefaults,
  AvatarPickerProps
} from './AvatarPicker.interface'

const AvatarPicker = ({
  defaultIcon,
  editIcon,
  avatar,
  setAvatar,
  size = 150,
  initialZoom = 1,
  minZoom = 0.01,
  maxZoom = 3,
  stepZoom = 0.01,
  minRotation = 0,
  maxRotation = 360,
  stepRotation = 0.01,
  useLocalStorage,
  storageKey = 'avatar',
  ...props
}: AvatarPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<any>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(initialZoom)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = (_croppedArea: Area, newcroppedAreaPixels: Area) => {
    setCroppedAreaPixels(newcroppedAreaPixels)
  }

  useEffect(() => {
    if (!useLocalStorage && !setAvatar) {
      setupIndexedDB(idbConfig)
        .then(() => console.log('indexedDB setup complete'))
        .catch((e) => console.error('indexedDb error:', e))
    }
  }, [])

  const { getByID, update } =
    !useLocalStorage && !setAvatar
      ? useIndexedDBStore('avatars')
      : { getByID: null, update: null }

  const setAvatarIndexedDb = (a: string) => {
    if (!useLocalStorage && !setAvatar && update) {
      update({ id: 1, [storageKey]: a }).then(() =>
        console.log('avatar updated')
      )
    }
  }
  const [avatarSrc, setAvatarSrc] = useState<null | string>(null)

  if (!useLocalStorage && !setAvatar && getByID) {
    getByID(1).then(
      (avatarFromDB: any) => {
        if (avatarFromDB && avatarFromDB[storageKey])
          setAvatarSrc(avatarFromDB[storageKey])
      },
      (error) => {
        console.log('Error: ', error)
      }
    )
  }
  const showCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      return
    }
    try {
      const newcroppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      )

      fetch(newcroppedImage as any)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader()
          reader.onloadend = function () {
            if (reader.result) {
              if (setAvatar) {
                setAvatar(reader.result.toString())
              } else if (useLocalStorage) {
                localStorage.setItem(storageKey, reader.result.toString())
              } else {
                setAvatarIndexedDb(reader.result.toString())
              }
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
        {avatarSrc || avatar ? (
          <>
            <Avatar
              src={avatarSrc || avatar}
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
                    min={minZoom}
                    max={maxZoom}
                    step={stepZoom}
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
                    min={minRotation}
                    max={maxRotation}
                    step={stepRotation}
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
                    localStorage.removeItem(storageKey)
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

AvatarPicker.defaultProps = AvatarPickerDefaults

export default AvatarPicker
