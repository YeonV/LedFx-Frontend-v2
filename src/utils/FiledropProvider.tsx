// src/FiledropProvider.tsx

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import { useCallback, useState } from 'react'
import isElectron from 'is-electron'
import useStore from '../store/useStore'

const FiledropProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState('LedFx JSON detected')
  const [newData, setNewData] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageName, setImageName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const showSnackbar = useStore((state) => state.ui.showSnackbar)
  const open = useStore((state) => state.dialogs.filedrop.open)
  const virtualOrder = useStore((state) => state.virtualOrder)
  const setVirtualOrder = useStore((state) => state.setVirtualOrder)
  const setDialogOpenFileDrop = useStore((state) => state.setDialogOpenFileDrop)
  const setScenePL = useStore((state) => state.setScenePL)
  const setScenePLintervals = useStore((state) => state.setScenePLintervals)
  const importSystemConfig = useStore((state) => state.importSystemConfig)
  const setPendingMatrixLayout = useStore((state) => state.ui.setPendingMatrixLayout)
  const uploadAsset = useStore((state) => state.uploadAsset)
  const getAssets = useStore((state) => state.getAssets)

  const isValidFullConfig = useCallback((data: any) => {
    const requiredConfigKeys = [
      'dev_mode',
      'user_colors',
      'user_presets',
      'host',
      'global_transitions',
      'configuration_version',
      'wled_preferences',
      'user_gradients',
      'visualisation_maxlen',
      'devices',
      'virtuals',
      'visualisation_fps',
      'global_brightness',
      'transmission_mode',
      'create_segments',
      'ui_brightness_boost',
      'melbank_collection',
      'port',
      'melbanks',
      'port_s',
      'integrations',
      'scenes',
      'scan_on_startup',
      'audio',
      'flush_on_deactivate'
    ]
    const missingKeys = requiredConfigKeys.filter((key) => !(key in data))
    if (missingKeys.length > 0) {
      console.log('Missing keys:', missingKeys)
      return false
    }
    return true
  }, [])
  const isValidMatrixLayout = (data: any): boolean => {
    return Array.isArray(data.matrixData)
  }

  const handleJsonFile = useCallback(
    async (e: any) => {
      const fileReader = new FileReader()
      const file = e.target.files?.[0]
      if (!file) return

      fileReader.readAsText(file, 'UTF-8')
      fileReader.onload = (ev: any) => {
        try {
          const data = JSON.parse(ev.target.result)
          if (!data) {
            showSnackbar('error', 'Invalid file')
            return
          }
          if (isValidMatrixLayout(data)) {
            setTitle('New Matrix Layout detected')
            setNewData({ type: 'matrixLayout', data })
            setDialogOpenFileDrop(true)
          } else if (data.virtualOrder) {
            const newOrder = data.virtualOrder
            const oldVirtIds = virtualOrder.map((o: any) => o.virtId)
            const newVirtIds = newOrder.map((o: any) => o.virtId)
            if (
              newOrder.length === virtualOrder.length &&
              oldVirtIds.sort().join(',') === newVirtIds.sort().join(',')
            ) {
              setTitle('New Device Order detected')
              setNewData({ type: 'virtualOrder', data: newOrder })
              setDialogOpenFileDrop(true)
            } else {
              showSnackbar('warning', 'Order file does not match')
            }
          } else if (data.scenePL || data.scenePLintervals) {
            setTitle('New Scene Playlist detected')
            setNewData({ type: 'scenePlaylist', data })
            setDialogOpenFileDrop(true)
          } else if (isValidFullConfig(data)) {
            setTitle('Full Configuration detected')
            setNewData({ type: 'fullConfig', data })
            setDialogOpenFileDrop(true)
          } else {
            showSnackbar('error', 'Unrecognized JSON file format')
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          showSnackbar('error', 'Failed to parse JSON')
        }
      }
    },
    [isValidFullConfig, setDialogOpenFileDrop, showSnackbar, virtualOrder]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      
      // Capture files reference immediately (React synthetic event pooling)
      const files = e.dataTransfer.files
      // Force synchronous access to ensure files are populated for cross-browser drag
      const fileCount = files.length
      
      setTimeout(() => {
        const file = fileCount > 0 ? files[0] : null
        
        if (file && file.type === 'application/json') {
          handleJsonFile({ target: { files: [file] } })
        } else if (file && file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (ev) => {
            setImagePreview(ev.target?.result as string)
            setImageFile(file)
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
            setImageName(nameWithoutExt)
            setTitle('Image Asset detected')
            setNewData({ type: 'image', file })
            setDialogOpenFileDrop(true)
          }
          reader.readAsDataURL(file)
        }
      }, 0)
    },
    [handleJsonFile, setDialogOpenFileDrop]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  const handleClose = () => {
    setDialogOpenFileDrop(false)
    setImagePreview(null)
    setImageFile(null)
    setImageName('')
  }

  const handleSave = () => {
    showSnackbar('info', 'Importing...')
    if (newData) {
      switch (newData.type) {
        case 'image':
          if (imageFile) {
            // Get original file extension
            const extension = imageFile.name.match(/\.[^/.]+$/)?.[0] || ''
            // Ensure filename has extension
            const filenameWithExt = imageName.endsWith(extension)
              ? imageName
              : imageName + extension

            uploadAsset(imageFile, filenameWithExt).then(() => {
              getAssets()
              showSnackbar('success', 'Image uploaded successfully')
            })
          }
          break
        case 'matrixLayout':
          setPendingMatrixLayout(newData.data)
          showSnackbar('success', 'Matrix layout imported successfully')
          break
        case 'virtualOrder':
          setVirtualOrder(newData.data)
          showSnackbar('success', 'Order updated')
          break
        case 'scenePlaylist':
          if (newData.data.scenePL) setScenePL(newData.data.scenePL)
          if (newData.data.scenePLintervals) setScenePLintervals(newData.data.scenePLintervals)
          showSnackbar('success', 'Scene Playlist updated')
          break
        case 'fullConfig':
          importSystemConfig(JSON.stringify(newData.data)).then(() => {
            showSnackbar('success', 'Configuration imported')
            setTimeout(() => {
              window.location.reload()
            }, 200)
          })
          break
        default:
          showSnackbar('error', 'Unknown data type')
      }
    }
    setDialogOpenFileDrop(false)
    setImagePreview(null)
    setImageFile(null)
    setImageName('')
  }

  return (
    <Box
      sx={{ display: 'flex' }}
      style={{ paddingTop: isElectron() ? '30px' : 0 }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {children}
      <Dialog open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {imagePreview ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
              <Box
                component="img"
                src={imagePreview}
                alt="Preview"
                sx={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
              />
              <Box>
                <strong>Type:</strong> {imageFile?.type}
              </Box>
              <Box>
                <strong>Size:</strong> {((imageFile?.size || 0) / 1024).toFixed(2)} KB
              </Box>
              <TextField
                fullWidth
                label="Asset Name"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
              />
            </Box>
          ) : (
            'Would you like to import it and overwrite current data?'
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleSave}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FiledropProvider
