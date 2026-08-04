import { useEffect, useState } from 'react'
import { Box, ListSubheader, MenuItem, Select, Slider, Stack } from '@mui/material'
import useStore from '../../../../../store/useStore'
import BladeFrame from '../../../../SchemaForm/components/BladeFrame'
import type { EngineSection } from '../../../../../store/ui/storeSongDectector'

const BACKEND_SECTION: Record<EngineSection, 'gradient' | 'track_text' | 'album_art'> = {
  gradient: 'gradient',
  text: 'track_text',
  image: 'album_art'
}

const FALLBACK_VARIANTS = ['led_safe', 'led_punchy', 'led_max']

const CoreSectionConfig = ({ section }: { section: EngineSection }) => {
  const backendSection = BACKEND_SECTION[section]
  const config = useStore((state) => state.nowPlayingState?.config)
  const gradients = useStore((state) => state.nowPlayingState?.artwork?.gradients)
  const updateNowPlayingConfig = useStore((state) => state.updateNowPlayingConfig)

  const getLedFxPresets = useStore((state) => state.getLedFxPresets)
  const userPresetsAll = useStore((state) => state.config?.user_presets)
  const userTexterPresets = ((userPresetsAll as any)?.texter2d ?? {}) as Record<
    string,
    { name?: string }
  >
  const [ledfxTexterPresets, setLedfxTexterPresets] = useState<Record<string, { name?: string }>>(
    {}
  )

  useEffect(() => {
    if (section !== 'text') return
    getLedFxPresets().then((all: any) => {
      setLedfxTexterPresets(all?.texter2d ?? {})
    })
  }, [section, getLedFxPresets])

  const current = (config?.[backendSection] ?? {}) as {
    variant?: string
    duration?: number
    preset?: string
  }

  const write = (patch: Record<string, any>) =>
    updateNowPlayingConfig({ [backendSection]: { ...current, ...patch } } as any)

  const variants = gradients ? Object.keys(gradients) : FALLBACK_VARIANTS
  const activeVariant = variants.includes(current.variant ?? '')
    ? (current.variant as string)
    : variants[0]
  const variantGradient = gradients?.[activeVariant]?.gradient

  // Local while dragging; write on release, or every pixel becomes a PUT.
  const [duration, setDuration] = useState(current.duration ?? 0)
  useEffect(() => {
    setDuration(current.duration ?? 0)
  }, [current.duration])

  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      {section === 'gradient' && (
        <>
          <BladeFrame title="Gradient Variant">
            <Select
              fullWidth
              size="small"
              variant="standard"
              disableUnderline
              value={activeVariant}
              onChange={(e) => write({ variant: e.target.value })}
            >
              {variants.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </BladeFrame>

          {/* What the core actually extracted for this variant - a single bar
              rather than the browser engine's pick-one-of-six grid, because
              here there is nothing to choose: the core applies this one. */}
          {variantGradient && (
            <Box
              sx={{
                height: 40,
                // Match BladeFrame so the preview sits in the same rhythm as
                // the framed controls around it.
                borderRadius: '10px',
                border: '1px solid',
                borderColor: 'divider',
                margin: '0.5rem 0',
                background: variantGradient
              }}
              title={activeVariant}
            />
          )}
        </>
      )}

      {section === 'text' && (
        <BladeFrame title="Texter2d Preset">
          <Select
            fullWidth
            displayEmpty
            size="small"
            variant="standard"
            disableUnderline
            value={current.preset ?? ''}
            onChange={(e) => write({ preset: e.target.value })}
          >
            <MenuItem value="">
              <em>Default</em>
            </MenuItem>

            {Object.keys(ledfxTexterPresets).length > 0 && (
              <ListSubheader>LedFx Presets</ListSubheader>
            )}
            {Object.entries(ledfxTexterPresets).map(([id, p]) => (
              <MenuItem key={`ledfx_${id}`} value={id}>
                {p?.name ?? id}
              </MenuItem>
            ))}

            {Object.keys(userTexterPresets).length > 0 && <ListSubheader>My Presets</ListSubheader>}
            {Object.entries(userTexterPresets).map(([id, p]) => (
              <MenuItem key={`user_${id}`} value={id}>
                {p?.name ?? id}
              </MenuItem>
            ))}
          </Select>
        </BladeFrame>
      )}

      {(section === 'text' || section === 'image') && (
        <BladeFrame title={`Duration: ${duration}s`}>
          <Slider
            min={0}
            max={60}
            step={1}
            value={duration}
            onChange={(_e, v) => typeof v === 'number' && setDuration(v)}
            onChangeCommitted={(_e, v) => typeof v === 'number' && write({ duration: v })}
            valueLabelDisplay="auto"
          />
        </BladeFrame>
      )}
    </Stack>
  )
}

export default CoreSectionConfig
