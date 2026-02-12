import { useEffect, useState } from 'react'
import {
  Box,
  IconButton,
  Stack,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert
} from '@mui/material'
import { Close, Refresh, Delete, Edit, Save, ExpandMore } from '@mui/icons-material'
import ElectronStoreInspectorFloating from './ElectronStoreInspectorFloating'
import useStyle from './ElectronStoreInspector.styles'

const ElectronStoreInspector = ({ close }: { close?: () => void }) => {
  const classes = useStyle()
  const [storeData, setStoreData] = useState<Record<string, any>>({})
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!window.api) return

    // Request store data on mount
    window.api.send('toMain', { command: 'get-electron-store' })

    // Listen for updates
    const handler = (args: any) => {
      if (!Array.isArray(args) || args.length < 1) return
      const [event, data] = args

      switch (event) {
        case 'electron-store-data':
          setStoreData(data || {})
          setError(null)
          break
        case 'electron-store-updated':
          setError(null)
          // Refetch to get latest
          window.api.send('toMain', { command: 'get-electron-store' })
          break
        case 'electron-store-cleared':
          setStoreData({})
          setError(null)
          break
        case 'electron-store-error':
          setError(data.error)
          break
      }
    }

    window.api.receive('fromMain', handler)
  }, [])

  const handleRefresh = () => {
    window.api?.send('toMain', { command: 'get-electron-store' })
  }

  const handleDelete = (key: string) => {
    if (window.confirm(`Delete key "${key}"?`)) {
      window.api?.send('toMain', { command: 'delete-electron-store-key', key })
    }
  }

  const handleEdit = (key: string, value: any) => {
    setEditingKey(key)
    setEditValue(JSON.stringify(value, null, 2))
    setError(null)
  }

  const handleSave = () => {
    if (!editingKey) return

    try {
      const parsedValue = JSON.parse(editValue)
      window.api?.send('toMain', {
        command: 'set-electron-store-key',
        key: editingKey,
        value: parsedValue
      })
      setEditingKey(null)
      setEditValue('')
    } catch {
      setError('Invalid JSON format')
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Clear ALL electron-store data? This cannot be undone!')) {
      window.api?.send('toMain', { command: 'clear-electron-store' })
    }
  }

  const renderValue = (value: any): string => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  const getValueType = (value: any): string => {
    if (Array.isArray(value)) return 'array'
    return typeof value
  }

  return (
    <Box component={ElectronStoreInspectorFloating}>
      <div className={classes.Widget}>
        <Stack
          direction="row"
          p={2}
          bgcolor="#111"
          height={50}
          alignItems="center"
          justifyContent={close ? 'space-between' : 'center'}
          display="flex"
        >
          {close && <span />}
          <Typography>Electron Store Inspector</Typography>
          {close && (
            <IconButton onClick={() => close()}>
              <Close />
            </IconButton>
          )}
        </Stack>

        <Box p={2}>
          <Stack spacing={2}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Stack direction="row" spacing={1} justifyContent="space-between">
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<Delete />}
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </Stack>

            {Object.keys(storeData).length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={4}>
                Store is empty
              </Typography>
            ) : (
              Object.entries(storeData).map(([key, value]) => (
                <Accordion key={key} sx={{ bgcolor: '#1a1a1a' }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Stack direction="row" spacing={1} alignItems="center" width="100%">
                      <Typography fontWeight="bold" flex={1}>
                        {key}
                      </Typography>
                      <Chip label={getValueType(value)} size="small" />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    {editingKey === key ? (
                      <Stack spacing={2}>
                        <TextField
                          multiline
                          fullWidth
                          rows={8}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          sx={{
                            fontFamily: 'monospace',
                            '& textarea': { fontFamily: 'monospace', fontSize: '0.85rem' }
                          }}
                        />
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Save />}
                            onClick={handleSave}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setEditingKey(null)
                              setEditValue('')
                              setError(null)
                            }}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </Stack>
                    ) : (
                      <>
                        <Box
                          component="pre"
                          sx={{
                            bgcolor: '#0a0a0a',
                            p: 2,
                            borderRadius: 1,
                            overflow: 'auto',
                            maxHeight: 300,
                            fontSize: '0.85rem',
                            margin: 0
                          }}
                        >
                          {renderValue(value)}
                        </Box>
                        <Stack direction="row" spacing={1} mt={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleEdit(key, value)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(key)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Stack>
        </Box>
      </div>
    </Box>
  )
}

export default ElectronStoreInspector
