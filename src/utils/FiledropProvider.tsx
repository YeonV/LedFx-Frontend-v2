// src/FiledropProvider.tsx

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useCallback, useState } from 'react'
import isElectron from 'is-electron'
import useStore from '../store/useStore'

const FiledropProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState('LedFx JSON detected')
  const [newData, setNewData] = useState<any>(null)
  const showSnackbar = useStore((state) => state.ui.showSnackbar)
  const open = useStore((state) => state.dialogs.filedrop.open)
  const virtualOrder = useStore((state) => state.virtualOrder)
  const setVirtualOrder = useStore((state) => state.setVirtualOrder)
  const setDialogOpenFileDrop = useStore((state) => state.setDialogOpenFileDrop)
  const setScenePL = useStore((state) => state.setScenePL)
  const setScenePLintervals = useStore((state) => state.setScenePLintervals)
  const importSystemConfig = useStore((state) => state.importSystemConfig)
  const setPendingMatrixLayout = useStore((state) => state.ui.setPendingMatrixLayout)

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
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
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
      const file = e.dataTransfer.files[0]
      if (file && file.type === 'application/json') {
        console.log('file', file)
        handleJsonFile({ target: { files: [file] } })
      }
    },
    [handleJsonFile]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  const handleClose = () => {
    setDialogOpenFileDrop(false)
  }

  const handleSave = () => {
    showSnackbar('info', 'Importing...')
    if (newData) {
      switch (newData.type) {
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
        <DialogContent>Would you like to import it and overwrite current data?</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleSave}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FiledropProvider
