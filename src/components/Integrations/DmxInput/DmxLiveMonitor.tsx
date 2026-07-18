import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Tooltip,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { ExpandMore, Sensors } from '@mui/icons-material'
import useStore from '../../../store/useStore'

interface Props {
  integrationId: string
  open: boolean
}

const POLL_MS = 200
const CHANNELS_SHOWN = 64

export default function DmxLiveMonitor({ integrationId, open }: Props) {
  const getDmxLive = useStore((state) => state.getDmxLive)
  const liveDmxRaw = useStore((state) => state.dmxInput[integrationId]?.live_dmx)
  const liveDmx = useMemo(() => liveDmxRaw || {}, [liveDmxRaw])

  const [polling, setPolling] = useState(false)
  const [learn, setLearn] = useState(false)
  const [learned, setLearned] = useState<{ universe: string; channel: number } | null>(null)
  const baselineRef = useRef<Record<string, number[]>>({})
  const intervalRef = useRef<any>(null)
  const inFlightRef = useRef(false)

  useEffect(() => {
    if (open && polling) {
      intervalRef.current = setInterval(() => {
        if (inFlightRef.current) return
        inFlightRef.current = true
        Promise.resolve(getDmxLive(integrationId)).finally(() => {
          inFlightRef.current = false
        })
      }, POLL_MS)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [open, polling, integrationId, getDmxLive])

  // stop polling when the screen closes
  useEffect(() => {
    if (!open) {
      setPolling(false)
      setLearn(false)
    }
  }, [open])

  // learn: find the channel with the biggest jump from the captured baseline
  useEffect(() => {
    if (!learn || learned) return
    let best: { universe: string; channel: number; delta: number } | null = null
    Object.keys(liveDmx).forEach((u) => {
      const cur = liveDmx[u] || []
      const base = baselineRef.current[u] || []
      cur.forEach((val, idx) => {
        const delta = Math.abs(val - (base[idx] ?? 0))
        if (delta > 40 && (!best || delta > best.delta)) {
          best = { universe: u, channel: idx + 1, delta }
        }
      })
    })
    if (best) {
      setLearned({ universe: (best as any).universe, channel: (best as any).channel })
    }
  }, [liveDmx, learn, learned])

  const startLearn = () => {
    // snapshot current values as baseline
    const snap: Record<string, number[]> = {}
    Object.keys(liveDmx).forEach((u) => {
      snap[u] = [...(liveDmx[u] || [])]
    })
    baselineRef.current = snap
    setLearned(null)
    setLearn(true)
    setPolling(true)
  }

  const cellColor = (val: number) => {
    if (val === 0) return 'transparent'
    const a = Math.max(0.15, val / 255)
    return `rgba(33, 150, 243, ${a})`
  }

  const universes = Object.keys(liveDmx)

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Sensors fontSize="small" />
          <Typography>Live DMX monitor &amp; channel learn</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }} flexWrap="wrap">
          <Button
            variant={polling ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setPolling((p) => !p)}
          >
            {polling ? 'Stop monitor' : 'Start monitor'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={startLearn}
            disabled={!universes.length}
          >
            Learn channel
          </Button>
          {learn && !learned && (
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Press the SoundSwitch button / move the fader now…
            </Typography>
          )}
          {learned && (
            <Chip
              color="success"
              label={`Detected: universe ${learned.universe}, channel ${learned.channel}`}
              onDelete={() => {
                setLearn(false)
                setLearned(null)
              }}
            />
          )}
        </Stack>

        {!universes.length && (
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            No DMX received yet. Start the monitor and make sure SoundSwitch is sending Art-Net to
            this machine.
          </Typography>
        )}

        {universes.map((u) => {
          const vals = liveDmx[u] || []
          return (
            <Box key={u} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Universe {u}
              </Typography>
              <Paper variant="outlined" sx={{ p: 1 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(16, 1fr)',
                    gap: '2px'
                  }}
                >
                  {Array.from({
                    length: Math.min(CHANNELS_SHOWN, vals.length || CHANNELS_SHOWN)
                  }).map((_, i) => {
                    const val = vals[i] ?? 0
                    const isLearned = learned && learned.universe === u && learned.channel === i + 1
                    return (
                      <Tooltip key={i} title={`Ch ${i + 1}: ${val}`} arrow>
                        <Box
                          sx={{
                            height: 26,
                            borderRadius: '3px',
                            border: isLearned
                              ? '2px solid #66bb6a'
                              : '1px solid rgba(255,255,255,0.12)',
                            background: cellColor(val),
                            fontSize: 9,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: val > 140 ? '#fff' : 'inherit'
                          }}
                        >
                          {val > 0 ? val : i + 1}
                        </Box>
                      </Tooltip>
                    )
                  })}
                </Box>
              </Paper>
            </Box>
          )
        })}
      </AccordionDetails>
    </Accordion>
  )
}
