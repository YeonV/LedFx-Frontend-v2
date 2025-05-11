/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Delete, Edit, GitHub, Save, UploadFile } from '@mui/icons-material'
import setupIndexedDB, { useIndexedDBStore } from 'use-indexeddb'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  // Select,
  Slider,
  Stack,
  Typography
} from '@mui/material'
import { getCroppedImg, idbConfig, readFile } from './avatarUtils'
import { AvatarPickerProps } from './AvatarPicker.interface'
import { backendUrl, cloud } from '../../Device/Cloud/CloudComponents'

const AvatarPicker = ({
  size = 150,
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
  avatar = undefined,
  initialZoom = 1,
  minZoom = 0.01,
  maxZoom = 3,
  stepZoom = 0.01,
  minRotation = 0,
  maxRotation = 360,
  stepRotation = 0.01,
  setAvatar = null,
  storage = 'indexedDb',
  storageKey = 'avatar',
  ...props
}: AvatarPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)

  const [newStorage] = useState(storage)
  const [imageSrc, setImageSrc] = useState<any>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(initialZoom)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const userName = localStorage.getItem('username')
  const isLogged = !!localStorage.getItem('jwt')
  const [avatarSrc, setAvatarSrc] = useState<null | string>(null)

  const onCropComplete = (_croppedArea: Area, newcroppedAreaPixels: Area) => {
    setCroppedAreaPixels(newcroppedAreaPixels)
  }
  const getUserDetails = async () => {
    try {
      const response = await cloud.get(
        `user-details?user.username=${localStorage.getItem('username')}`
      )
      if (response.status !== 200) {
        alert('No Access')
        return
      }
      const res = await response.data

      return res
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    if (
      isLogged &&
      localStorage.getItem('ledfx-cloud-role') === 'creator' &&
      newStorage === 'cloud'
    ) {
      try {
        cloud.get(`user-details?user.username=${userName}`).then((res: any) => {
          if (res.data.length > 0 && res.data[0].avatarUrl) {
            setAvatarSrc(`${backendUrl}${res.data[0].avatarUrl.url}`)
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (newStorage === 'indexedDb' && !setAvatar) {
      setupIndexedDB(idbConfig)
        .then(() => console.log('indexedDB setup complete'))
        .catch((e) => console.error('indexedDb error:', e))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { getByID, update } =
    newStorage === 'indexedDb' && !setAvatar
      ? useIndexedDBStore('avatars')
      : { getByID: null, update: null }

  const setAvatarIndexedDb = (a: string) => {
    if (newStorage === 'indexedDb' && !setAvatar && update) {
      update({ id: 1, [storageKey]: a }).then(() => console.log('avatar updated'))
    }
  }

  if (newStorage === 'indexedDb' && !setAvatar && getByID) {
    getByID(1).then(
      (avatarFromDB: any) => {
        if (avatarFromDB && avatarFromDB[storageKey]) setAvatarSrc(avatarFromDB[storageKey])
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
      const newcroppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)

      fetch(newcroppedImage as any)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader()

          reader.onloadend = async function () {
            if (reader.result) {
              if (newStorage === 'custom' && setAvatar) {
                setAvatar(reader.result.toString())
              } else if (newStorage === 'localStorage') {
                localStorage.setItem(storageKey, reader.result.toString())
              } else if (newStorage === 'indexedDb' && !setAvatar) {
                setAvatarIndexedDb(reader.result.toString())
              } else if (newStorage === 'cloud') {
                const userDetails = await getUserDetails()
                const hasAvatar = !!userDetails?.[0]?.avatarUrl?.url
                let newUserDetail
                if (hasAvatar) {
                  await cloud.delete(`upload/files/${userDetails?.[0]?.avatarUrl?.id}`)
                }
                if (!userDetails?.[0]?.id) {
                  const getNewUserDetail = cloud.post('user-details', {
                    user: localStorage.getItem('ledfx-cloud-userid')
                  })
                  newUserDetail = await getNewUserDetail
                }
                const formData = new FormData()
                // resize blob to 150x150
                // const resizedBlob = new Promise((resolve) => {
                //   const img = new Image()
                //   img.src = URL.createObjectURL(blob)
                //   img.onload = () => {
                //     const elem = document.createElement('canvas')
                //     const ctx = elem.getContext('2d')
                //     if (ctx) {
                //       ctx.drawImage(img, 0, 0, 150, 150)
                //       ctx.canvas.toBlob(
                //         (blobb) => {
                //           resolve(blobb)
                //         },
                //         'image/png',
                //         1
                //       )
                //     }
                //   }
                // })

                // const resizedBlob2 = await resizedBlob
                formData.append('files', blob, `${userName}.png`)
                formData.append('ref', 'application::user-details.user-details')
                formData.append('refId', `${userDetails?.[0]?.id || newUserDetail!.data.id}`)
                formData.append('field', 'avatarUrl')
                const imageUploaded = await fetch(`${backendUrl}/upload`, {
                  method: 'POST',
                  body: formData
                })

                const uploaded = await imageUploaded.json()

                setAvatarSrc(`${backendUrl}${uploaded[0].url}`)
              }
            }
          }
          reader.readAsDataURL(blob)
        })
    } catch (e) {
      console.error(e)
    }
    setOpen(false)
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
                    onChange={(e, newzoom) => typeof newzoom === 'number' && setZoom(newzoom)}
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
                      typeof newrotation === 'number' && setRotation(newrotation)
                    }
                  />
                </div>
                {/* <Select value={newStorage}>
                  {storageOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                      onClick={() => setNewStorage(option)}
                    >
                      {option}
                    </option>
                  ))}
                </Select> */}
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
                  onClick={async () => {
                    localStorage.removeItem(storageKey)
                    if (storage === 'indexedDb' && !setAvatar && update) {
                      update({ id: 1, [storageKey]: null }).then(() =>
                        console.log('avatar updated')
                      )
                    } else if (storage === 'cloud') {
                      const userDetails = await getUserDetails()
                      cloud.delete(`upload/files/${userDetails?.[0]?.avatarUrl?.id}`).then(() => {
                        setAvatarSrc(null)
                      })
                    } else if (setAvatar) {
                      setAvatar('')
                    }
                    setImageSrc(null)
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

export default AvatarPicker
