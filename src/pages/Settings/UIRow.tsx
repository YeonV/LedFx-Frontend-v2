import { FormGroup, FormControlLabel, Checkbox, Box, Tooltip } from '@mui/material'
import useStore from '../../store/useStore'

const UIRow = () => {
  const viewMode = useStore((state) => state.viewMode)
  const setViewMode = useStore((state) => state.setViewMode)
  const setFeatures = useStore((state) => state.setFeatures)
  const showFeatures = useStore((state) => state.showFeatures)
  const features = useStore((state) => state.features)

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={viewMode === 'expert'}
              onChange={(e) => setViewMode(e.target.checked ? 'expert' : 'user')}
              size="small"
            />
          }
          label="Expert Mode"
        />
        <Tooltip title="AlphaMode: Smartbar -> HackedByBlade! -> OK -> BladeAlpha">
          <FormControlLabel
            control={
              <Checkbox
                checked={features.beta}
                onChange={(e) => setFeatures('beta', e.target.checked)}
                size="small"
              />
            }
            label="Beta Mode"
          />
        </Tooltip>
        {showFeatures.alpha && (
          <FormControlLabel
            control={
              <Checkbox
                checked={features.alpha}
                onChange={(e) => setFeatures('alpha', e.target.checked)}
                size="small"
              />
            }
            label="Alpha Mode"
          />
        )}
      </FormGroup>
    </Box>
  )
}

export default UIRow
