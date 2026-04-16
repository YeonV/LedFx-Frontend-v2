import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Divider,
  Tooltip
} from '@mui/material'
import {
  Close,
  Add,
  Delete,
  Edit,
  Search,
  CheckCircle,
  RadioButtonUnchecked,
  Save,
  Cancel
} from '@mui/icons-material'
import { Switch, FormControlLabel } from '@mui/material'
import useStore from '../../store/useStore'

interface FormState {
  id: string
  server_url: string
  client_name: string
}

const emptyForm = (): FormState => ({ id: '', server_url: 'ws://', client_name: 'LedFx' })

const SendspinDialog = () => {
  const open = useStore((state) => state.dialogs.sendspinManager?.open || false)
  const setDialogOpenSendspinManager = useStore((state) => state.setDialogOpenSendspinManager)
  const servers = useStore((state) => state.sendspinServers)
  const discovered = useStore((state) => state.sendspinDiscovered)
  const discovering = useStore((state) => state.sendspinDiscovering)
  const available = useStore((state) => state.sendspinAvailable)
  const getSendspinServers = useStore((state) => state.getSendspinServers)
  const addSendspinServer = useStore((state) => state.addSendspinServer)
  const updateSendspinServer = useStore((state) => state.updateSendspinServer)
  const deleteSendspinServer = useStore((state) => state.deleteSendspinServer)
  const renameSendspinServer = useStore((state) => state.renameSendspinServer)
  const discoverSendspinServers = useStore((state) => state.discoverSendspinServers)
  const clearSendspinDiscovered = useStore((state) => state.clearSendspinDiscovered)
  const config = useStore((state) => state.config)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const getSystemConfig = useStore((state) => state.getSystemConfig)

  const [form, setForm] = useState<FormState>(emptyForm())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')

  const handleOpen = () => {
    getSendspinServers()
  }

  const handleClose = () => {
    setDialogOpenSendspinManager(false)
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm())
    setFormError('')
    clearSendspinDiscovered()
  }

  const startAdd = () => {
    setEditingId(null)
    setForm(emptyForm())
    setFormError('')
    setShowForm(true)
  }

  const startEdit = (id: string) => {
    const s = servers[id]
    setEditingId(id)
    setForm({ id, server_url: s.server_url, client_name: s.client_name })
    setFormError('')
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm())
    setFormError('')
  }

  const validateForm = () => {
    if (!form.id.trim()) return 'Server ID is required'
    if (!/^[a-z0-9-_]+$/i.test(form.id.trim()))
      return 'ID must be a URL-safe slug (letters, numbers, hyphens, underscores)'
    if (!form.server_url.trim()) return 'Server URL is required'
    if (!/^wss?:\/\/.+/.test(form.server_url.trim())) return 'URL must start with ws:// or wss://'
    if (!editingId && servers[form.id.trim()]) return `Server "${form.id.trim()}" already exists`
    // Renaming: new ID must not already exist (unless it's the same id)
    if (editingId && form.id.trim() !== editingId && servers[form.id.trim()])
      return `Server "${form.id.trim()}" already exists`
    return ''
  }

  const handleSave = async () => {
    const err = validateForm()
    if (err) {
      setFormError(err)
      return
    }
    setFormError('')

    let ok: boolean
    if (editingId) {
      const newId = form.id.trim()
      const isRename = newId !== editingId
      if (isRename) {
        ok = await renameSendspinServer(editingId, newId, {
          server_url: form.server_url.trim(),
          client_name: form.client_name.trim() || 'LedFx'
        })
      } else {
        ok = await updateSendspinServer(editingId, {
          server_url: form.server_url.trim(),
          client_name: form.client_name.trim() || 'LedFx'
        })
      }
    } else {
      ok = await addSendspinServer({
        id: form.id.trim(),
        server_url: form.server_url.trim(),
        client_name: form.client_name.trim() || 'LedFx'
      })
    }
    if (ok) {
      cancelForm()
      getSendspinServers()
    }
  }

  const handleDelete = async (id: string) => {
    await deleteSendspinServer(id)
    getSendspinServers()
  }

  const handleAddDiscovered = async (s: { name: string; server_url: string }) => {
    const suggestedId = s.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setEditingId(null)
    setForm({ id: suggestedId, server_url: s.server_url, client_name: 'LedFx' })
    setFormError('')
    setShowForm(true)
  }

  const serverEntries = Object.entries(servers)

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionProps={{ onEntered: handleOpen }}
    >
      <DialogTitle>
        Sendspin Servers
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {!available && (
          <Box sx={{ mb: 2 }}>
            <Chip
              color="warning"
              label="Sendspin unavailable — requires Python 3.12+ and aiosendspin package"
            />
          </Box>
        )}

        {/* Configured servers table */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Configured Servers
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={!!config.sendspin_always_on}
                  onChange={() => {
                    setSystemConfig({ sendspin_always_on: !config.sendspin_always_on }).then(() => getSystemConfig())
                  }}
                  disabled={!available}
                />
              }
              label="Always On"
              sx={{ mr: 1 }}
            />
            <Button
              size="small"
              variant="outlined"
              startIcon={discovering ? <CircularProgress size={14} /> : <Search />}
              disabled={discovering || !available}
              onClick={() => discoverSendspinServers(3.0)}
            >
              {discovering ? 'Discovering…' : 'Auto-Discover'}
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<Add />}
              disabled={!available || showForm}
              onClick={startAdd}
            >
              Add Server
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Server URL</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serverEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                    No servers configured
                  </TableCell>
                </TableRow>
              ) : (
                serverEntries.map(([id, s]) => (
                  <TableRow key={id} hover>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontFamily="monospace"
                        sx={{ wordBreak: 'break-all' }}
                      >
                        {s.server_url}
                      </Typography>
                    </TableCell>
                    <TableCell>{s.client_name}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => startEdit(id)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add / Edit form */}
        {showForm && (
          <Box component={Paper} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              {editingId ? `Edit "${editingId}"` : 'Add Server'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <TextField
                label="ID"
                size="small"
                value={form.id}
                onChange={(e) => {
                  const sanitized = e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-_]/g, '')
                  setForm((f) => ({ ...f, id: sanitized }))
                }}
                placeholder="living-room"
                sx={{ flex: '1 1 140px' }}
              />
              <TextField
                label="Server URL"
                size="small"
                value={form.server_url}
                onChange={(e) => setForm((f) => ({ ...f, server_url: e.target.value }))}
                placeholder="ws://192.168.1.12:8927/sendspin"
                sx={{ flex: '3 1 280px' }}
              />
              <TextField
                label="Client Name"
                size="small"
                value={form.client_name}
                onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                placeholder="LedFx"
                sx={{ flex: '1 1 120px' }}
              />
            </Box>
            {formError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {formError}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5, justifyContent: 'flex-end' }}>
              <Button size="small" startIcon={<Cancel />} onClick={cancelForm}>
                Cancel
              </Button>
              <Button size="small" variant="contained" startIcon={<Save />} onClick={handleSave}>
                {editingId ? 'Update' : 'Add'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Discovery results */}
        {(discovered.length > 0 || discovering) && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Discovered on Network
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>Host</TableCell>
                    <TableCell align="center">Configured</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {discovered.map((d) => (
                    <TableRow key={d.server_url} hover>
                      <TableCell>{d.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {d.server_url}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {d.host}:{d.port}
                      </TableCell>
                      <TableCell align="center">
                        {d.already_configured ? (
                          <CheckCircle fontSize="small" color="success" />
                        ) : (
                          <RadioButtonUnchecked fontSize="small" color="disabled" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={d.already_configured || showForm}
                          onClick={() => handleAddDiscovered(d)}
                        >
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SendspinDialog
