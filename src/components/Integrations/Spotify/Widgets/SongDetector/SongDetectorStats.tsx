import { Card, CardContent, Stack, Typography, Chip, IconButton } from '@mui/material'
import { PlayArrow, Stop } from '@mui/icons-material'
import useStore from '../../../../../store/useStore'

const SongDetectorStats = () => {
  const sceneTriggerActive = useStore((state) => state.sceneTriggerActive)
  const gradientAutoApply = useStore((state) => state.gradientAutoApply)
  const textAutoApply = useStore((state) => state.textAutoApply)
  const imageAutoApply = useStore((state) => state.imageAutoApply)
  const setSceneTriggerActive = useStore((state) => state.setSceneTriggerActive)
  const setGradientAutoApply = useStore((state) => state.setGradientAutoApply)
  const setTextAutoApply = useStore((state) => state.setTextAutoApply)
  const setImageAutoApply = useStore((state) => state.setImageAutoApply)

  // Dedicated state for Auto-Text Visualisers (from store)
  const isActiveVisualisers = useStore((state) => state.isActiveVisualisers)
  const setIsActiveVisualisers = useStore((state) => state.setIsActiveVisualisers)
  const toggleAutoApplyVisualisers = () => setIsActiveVisualisers(!isActiveVisualisers)

  const stats = [
    {
      label: 'Scene Triggers',
      active: sceneTriggerActive,
      toggle: () => setSceneTriggerActive(!sceneTriggerActive)
    },
    {
      label: 'Auto-Gradients',
      active: gradientAutoApply,
      toggle: () => setGradientAutoApply(!gradientAutoApply)
    },
    { label: 'Auto-Text', active: textAutoApply, toggle: () => setTextAutoApply(!textAutoApply) },
    {
      label: 'Auto-Text Visualisers',
      active: isActiveVisualisers,
      toggle: toggleAutoApplyVisualisers
    },
    {
      label: 'Auto-Image',
      active: imageAutoApply,
      toggle: () => setImageAutoApply(!imageAutoApply)
    }
  ]

  return (
    <Card sx={{ width: '100%', height: '152px', display: 'flex', alignItems: 'center' }}>
      <CardContent sx={{ py: 0, px: 2, width: '100%', '&:last-child': { pb: 0 } }}>
        <Stack direction="column" spacing={0.5} sx={{ height: '100%', justifyContent: 'center' }}>
          {stats.map((stat) => (
            <Stack
              key={stat.label}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {stat.label}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  label={stat.active ? 'Active' : 'Inactive'}
                  size="small"
                  color={stat.active ? 'success' : 'default'}
                  sx={{ height: 18, fontSize: '0.65rem', minWidth: 60 }}
                />
                <IconButton
                  size="small"
                  onClick={stat.toggle}
                  sx={{
                    width: 20,
                    height: 20,
                    p: 0
                  }}
                >
                  {stat.active ? (
                    <Stop color="inherit" sx={{ fontSize: 16 }} />
                  ) : (
                    <PlayArrow color="success" sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default SongDetectorStats
