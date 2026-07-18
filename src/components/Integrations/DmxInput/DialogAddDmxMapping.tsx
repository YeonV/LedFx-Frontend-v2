import React, { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  IconButton,
  Slider
} from '@mui/material'
import { Add, Edit } from '@mui/icons-material'
import useStore from '../../../store/useStore'
import type { DmxMapping } from '../../../store/ui/storeDmxInput'

interface Props {
  integrationId: string
  editMapping?: DmxMapping
  editIndex?: number
}

type TargetKind = 'venue' | 'virtual'

const defaultMapping = (): DmxMapping => ({
  name: '',
  type: 'trigger',
  universe: 0,
  channels: [1],
  on_threshold: 128,
  off_threshold: 96,
  active: true
})

export default function DialogAddDmxMapping({ integrationId, editMapping, editIndex }: Props) {
  const isEdit = editMapping !== undefined && editIndex !== undefined
  const dmxData = useStore((state) => state.dmxInput[integrationId])
  const saveDmxMapping = useStore((state) => state.saveDmxMapping)
  const getDmxInput = useStore((state) => state.getDmxInput)

  const venues = useMemo(() => dmxData?.venues || {}, [dmxData])
  const virtuals = useMemo(() => dmxData?.virtuals || {}, [dmxData])

  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<DmxMapping['type']>('trigger')
  const [universe, setUniverse] = useState(0)
  const [active, setActive] = useState(true)
  const [onThreshold, setOnThreshold] = useState(128)
  const [offThreshold, setOffThreshold] = useState(96)

  // channels
  const [triggerCh, setTriggerCh] = useState(1)
  const [rCh, setRCh] = useState(1)
  const [gCh, setGCh] = useState(2)
  const [bCh, setBCh] = useState(3)
  const [dimmerCh, setDimmerCh] = useState(1)
  const [fxRCh, setFxRCh] = useState(2)
  const [fxGCh, setFxGCh] = useState(3)
  const [fxBCh, setFxBCh] = useState(4)
  // Fixture wash only: 0 = every strobe pulse renders (default, today's
  // exact behaviour), 100 = pulses fire with real-fixture-like randomness.
  // Stored/sent to the backend inverted, as strobe_probability = 1 - x/100.
  const [strobeRandomness, setStrobeRandomness] = useState(0)

  // Per-type last-entered field values, so switching a mapping's type in
  // this dialog (or across dialog sessions, once saved) re-populates each
  // type's previous fields instead of resetting to schema defaults.
  const [typeFieldCache, setTypeFieldCache] = useState<Record<string, Record<string, unknown>>>({})

  // target
  const [venueId, setVenueId] = useState('')
  const [padIndex, setPadIndex] = useState(0)
  const [virtualId, setVirtualId] = useState('')
  const [targetKind, setTargetKind] = useState<TargetKind>('venue')

  const resetFromMapping = (m: DmxMapping) => {
    setName(m.name || '')
    setType(m.type)
    setUniverse(m.universe ?? 0)
    setActive(m.active ?? true)
    setOnThreshold(m.on_threshold ?? 128)
    setOffThreshold(m.off_threshold ?? 96)
    const ch: any = m.channels
    if (m.type === 'trigger') {
      setTriggerCh(Array.isArray(ch) ? (ch[0] ?? 1) : 1)
    } else if (m.type === 'color') {
      setRCh(Array.isArray(ch) ? (ch[0] ?? 1) : 1)
      setGCh(Array.isArray(ch) ? (ch[1] ?? 2) : 2)
      setBCh(Array.isArray(ch) ? (ch[2] ?? 3) : 3)
    } else if (m.type === 'fixture') {
      const d = !Array.isArray(ch) ? ch : {}
      setDimmerCh(d.dimmer ?? (Array.isArray(ch) ? ch[0] : 1) ?? 1)
      setFxRCh(d.r ?? (Array.isArray(ch) ? ch[1] : 2) ?? 2)
      setFxGCh(d.g ?? (Array.isArray(ch) ? ch[2] : 3) ?? 3)
      setFxBCh(d.b ?? (Array.isArray(ch) ? ch[3] : 4) ?? 4)
      const sp = m.strobe_probability ?? 1
      setStrobeRandomness(Math.round((1 - sp) * 100))
    }
    if (m.virtual_id) {
      setTargetKind('virtual')
      setVirtualId(m.virtual_id)
    } else if (m.venue_id) {
      setTargetKind('venue')
      setVenueId(m.venue_id)
      setPadIndex(m.pad_index ?? 0)
    }
    setTypeFieldCache(m._type_field_cache || {})
  }

  // Snapshot of the fields currently entered for a given mapping type, used
  // both to persist the per-type cache and to restore it on type switch.
  const captureCurrentTypeFields = (t: DmxMapping['type']): Record<string, unknown> => {
    if (t === 'trigger') {
      return {
        channels: [triggerCh],
        on_threshold: onThreshold,
        off_threshold: offThreshold,
        venue_id: venueId,
        pad_index: padIndex
      }
    }
    if (t === 'color') {
      return {
        channels: [rCh, gCh, bCh],
        target_kind: targetKind,
        venue_id: venueId,
        virtual_id: virtualId
      }
    }
    return {
      channels: { dimmer: dimmerCh, r: fxRCh, g: fxGCh, b: fxBCh },
      virtual_id: virtualId,
      strobe_probability: 1 - strobeRandomness / 100
    }
  }

  const applyCachedTypeFields = (t: DmxMapping['type'], cached?: Record<string, unknown>) => {
    if (!cached) return
    const ch: any = cached.channels
    if (t === 'trigger') {
      setTriggerCh(Array.isArray(ch) ? (ch[0] ?? 1) : 1)
      setOnThreshold((cached.on_threshold as number) ?? 128)
      setOffThreshold((cached.off_threshold as number) ?? 96)
      if (cached.venue_id) setVenueId(cached.venue_id as string)
      if (cached.pad_index !== undefined) setPadIndex(cached.pad_index as number)
    } else if (t === 'color') {
      setRCh(Array.isArray(ch) ? (ch[0] ?? 1) : 1)
      setGCh(Array.isArray(ch) ? (ch[1] ?? 2) : 2)
      setBCh(Array.isArray(ch) ? (ch[2] ?? 3) : 3)
      if (cached.target_kind) setTargetKind(cached.target_kind as TargetKind)
      if (cached.venue_id) setVenueId(cached.venue_id as string)
      if (cached.virtual_id) setVirtualId(cached.virtual_id as string)
    } else {
      const d = !Array.isArray(ch) ? (ch as Record<string, number>) : {}
      setDimmerCh(d.dimmer ?? 1)
      setFxRCh(d.r ?? 2)
      setFxGCh(d.g ?? 3)
      setFxBCh(d.b ?? 4)
      if (cached.virtual_id) setVirtualId(cached.virtual_id as string)
      const sp = (cached.strobe_probability as number) ?? 1
      setStrobeRandomness(Math.round((1 - sp) * 100))
    }
  }

  const handleTypeChange = (newType: DmxMapping['type']) => {
    const nextCache = { ...typeFieldCache, [type]: captureCurrentTypeFields(type) }
    setTypeFieldCache(nextCache)
    applyCachedTypeFields(newType, nextCache[newType])
    setType(newType)
  }

  const handleOpen = () => {
    if (isEdit && editMapping) {
      resetFromMapping(editMapping)
    } else {
      const d = defaultMapping()
      resetFromMapping(d)
      setVenueId(Object.keys(venues)[0] || '')
      setVirtualId('')
    }
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  // keep venue default sensible when venues load
  useEffect(() => {
    if (open && !isEdit && !venueId && Object.keys(venues).length) {
      setVenueId(Object.keys(venues)[0])
    }
  }, [open, isEdit, venueId, venues])

  // default a virtual target so fixture / color-virtual mappings are never empty
  useEffect(() => {
    if (!open || isEdit) return
    const needsVirtual = type === 'fixture' || (type === 'color' && targetKind === 'virtual')
    if (needsVirtual && !virtualId && Object.keys(virtuals).length) {
      setVirtualId(Object.keys(virtuals)[0])
    }
  }, [open, isEdit, type, targetKind, virtualId, virtuals])

  const targetValid = (() => {
    if (type === 'trigger') return !!venueId
    if (type === 'color') return targetKind === 'virtual' ? !!virtualId : !!venueId
    return !!virtualId
  })()

  const buildMapping = (): DmxMapping => {
    const m: DmxMapping = {
      name: name || undefined,
      type,
      universe: Number(universe),
      channels: [1],
      active
    }
    if (type === 'trigger') {
      m.channels = [Number(triggerCh)]
      m.on_threshold = Number(onThreshold)
      m.off_threshold = Number(offThreshold)
      m.venue_id = venueId
      m.pad_index = Number(padIndex)
    } else if (type === 'color') {
      m.channels = [Number(rCh), Number(gCh), Number(bCh)]
      if (targetKind === 'virtual') {
        m.virtual_id = virtualId
      } else {
        m.venue_id = venueId
      }
    } else if (type === 'fixture') {
      m.channels = {
        dimmer: Number(dimmerCh),
        r: Number(fxRCh),
        g: Number(fxGCh),
        b: Number(fxBCh)
      }
      m.virtual_id = virtualId
      m.strobe_probability = Number((1 - strobeRandomness / 100).toFixed(2))
    }
    m._type_field_cache = { ...typeFieldCache, [type]: captureCurrentTypeFields(type) }
    return m
  }

  const handleSave = async () => {
    const mapping = buildMapping()
    await saveDmxMapping(integrationId, mapping, isEdit ? editIndex : undefined)
    await getDmxInput(integrationId)
    setOpen(false)
  }

  const venuePads = venueId && venues[venueId] ? venues[venueId]?.color_pads?.pads || [] : []

  const channelField = (lbl: string, val: number, setter: (n: number) => void) => (
    <TextField
      label={lbl}
      type="number"
      size="small"
      value={val}
      onChange={(e) => setter(Number(e.target.value))}
      inputProps={{ min: 1, max: 512 }}
      sx={{ width: 110 }}
    />
  )

  return (
    <>
      {isEdit ? (
        <IconButton aria-label="Edit" color="inherit" onClick={handleOpen}>
          <Edit fontSize="inherit" />
        </IconButton>
      ) : (
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpen}>
          Add Mapping
        </Button>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? 'Edit DMX Mapping' : 'Add DMX Mapping'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Type"
                size="small"
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as DmxMapping['type'])}
                sx={{ width: 160 }}
              >
                <MenuItem value="trigger">Trigger (button)</MenuItem>
                <MenuItem value="color">Color (live RGB)</MenuItem>
                <MenuItem value="fixture">Fixture (wash)</MenuItem>
              </TextField>
              <TextField
                label="Universe"
                type="number"
                size="small"
                value={universe}
                onChange={(e) => setUniverse(Number(e.target.value))}
                inputProps={{ min: 0, max: 32767 }}
                sx={{ width: 120 }}
              />
              <FormControlLabel
                control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)} />}
                label="Active"
              />
            </Stack>

            {/* Channels */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Channels
              </Typography>
              {type === 'trigger' && (
                <Stack direction="row" spacing={2}>
                  {channelField('Button ch', triggerCh, setTriggerCh)}
                </Stack>
              )}
              {type === 'color' && (
                <Stack direction="row" spacing={2}>
                  {channelField('Red ch', rCh, setRCh)}
                  {channelField('Green ch', gCh, setGCh)}
                  {channelField('Blue ch', bCh, setBCh)}
                </Stack>
              )}
              {type === 'fixture' && (
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  {channelField('Dimmer ch', dimmerCh, setDimmerCh)}
                  {channelField('Red ch', fxRCh, setFxRCh)}
                  {channelField('Green ch', fxGCh, setFxGCh)}
                  {channelField('Blue ch', fxBCh, setFxBCh)}
                </Stack>
              )}
            </Box>

            {/* Strobe randomness (fixture wash only): real fixtures each run
                their own oscillator so multiple fixtures visibly drift out
                of sync -- LedFx mirrors the dimmer frame-perfectly by
                default, which can look artificially "locked" next to real
                fixtures. Raising this makes each detected strobe pulse have
                a chance to be suppressed instead of always firing. */}
            {type === 'fixture' && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Strobe randomness: {strobeRandomness}%
                </Typography>
                <Slider
                  aria-label="Strobe randomness"
                  value={strobeRandomness}
                  onChange={(_e, v) => setStrobeRandomness(v as number)}
                  step={5}
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0% (off)' },
                    { value: 100, label: '100%' }
                  ]}
                  valueLabelDisplay="auto"
                  sx={{ maxWidth: 360 }}
                />
              </Box>
            )}

            {/* Thresholds (trigger button press only; fixture wash has no gate) */}
            {type === 'trigger' && (
              <Stack direction="row" spacing={2}>
                <TextField
                  label="On threshold"
                  type="number"
                  size="small"
                  value={onThreshold}
                  onChange={(e) => setOnThreshold(Number(e.target.value))}
                  inputProps={{ min: 0, max: 255 }}
                  sx={{ width: 140 }}
                />
                <TextField
                  label="Off threshold"
                  type="number"
                  size="small"
                  value={offThreshold}
                  onChange={(e) => setOffThreshold(Number(e.target.value))}
                  inputProps={{ min: 0, max: 255 }}
                  sx={{ width: 140 }}
                />
              </Stack>
            )}

            {/* Target */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Target
              </Typography>
              {type === 'color' && (
                <TextField
                  select
                  label="Target type"
                  size="small"
                  value={targetKind}
                  onChange={(e) => setTargetKind(e.target.value as TargetKind)}
                  sx={{ width: 160, mb: 2 }}
                >
                  <MenuItem value="venue">Venue</MenuItem>
                  <MenuItem value="virtual">Virtual</MenuItem>
                </TextField>
              )}

              {(type === 'trigger' || (type === 'color' && targetKind === 'venue')) && (
                <Stack direction="row" spacing={2}>
                  <TextField
                    select
                    label="Venue"
                    size="small"
                    value={venueId}
                    onChange={(e) => {
                      setVenueId(e.target.value)
                      setPadIndex(0)
                    }}
                    sx={{ minWidth: 180 }}
                  >
                    {Object.keys(venues).map((vid) => (
                      <MenuItem key={vid} value={vid}>
                        {venues[vid]?.name || vid}
                      </MenuItem>
                    ))}
                  </TextField>
                  {type === 'trigger' && (
                    <TextField
                      select
                      label="Pad"
                      size="small"
                      value={padIndex}
                      onChange={(e) => setPadIndex(Number(e.target.value))}
                      sx={{ minWidth: 160 }}
                    >
                      {venuePads.map((pad: any, i: number) => (
                        <MenuItem key={i} value={i}>
                          <Box
                            component="span"
                            sx={{
                              display: 'inline-block',
                              width: 16,
                              height: 16,
                              borderRadius: '3px',
                              mr: 1,
                              verticalAlign: 'middle',
                              background: pad.gradient || pad.color || '#000'
                            }}
                          />
                          Pad {i + 1}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Stack>
              )}

              {(type === 'fixture' || (type === 'color' && targetKind === 'virtual')) && (
                <TextField
                  select
                  label="Virtual"
                  size="small"
                  value={virtualId}
                  onChange={(e) => setVirtualId(e.target.value)}
                  sx={{ minWidth: 240 }}
                >
                  {Object.keys(virtuals).map((vid) => (
                    <MenuItem key={vid} value={vid}>
                      {virtuals[vid]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={!targetValid}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
