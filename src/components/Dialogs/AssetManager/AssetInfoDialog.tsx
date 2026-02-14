import { Dialog, DialogTitle, DialogContent, IconButton, Box, useTheme } from '@mui/material'
import { Close, ColorLens } from '@mui/icons-material'
import { Ledfx } from '../../../api/ledfx'
import SceneImage from '../../../pages/Scenes/ScenesImage'

interface AssetInfoDialogProps {
  open: boolean
  onClose: () => void
  asset: any
}

const AssetInfoDialog = ({ open, onClose, asset }: AssetInfoDialogProps) => {
  const theme = useTheme()

  const handleApplyGradient = async (gradient: string) => {
    if (gradient) {
      await Ledfx('/api/effects', 'PUT', {
        action: 'apply_global',
        gradient
      })
      onClose()
    }
  }

  if (!asset) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Asset Information
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Image Preview */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, maxHeight: '300px' }}>
            <SceneImage
              iconName={asset.url ? `image:${asset.url}` : `image:file:///${asset.path}`}
              sx={{
                height: '180px',
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`
              }}
            />
          </Box>

          {/* Basic Information and Metadata side by side */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            {/* Basic Information */}
            <Box>
              <Box
                sx={{
                  typography: 'h6',
                  mb: 1,
                  color: theme.palette.primary.main
                }}
              >
                Basic Information
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 1 }}>
                <Box sx={{ fontWeight: 'bold' }}>Path:</Box>
                <Box sx={{ fontFamily: 'monospace', fontSize: '0.9em', wordBreak: 'break-all' }}>
                  {asset.path || asset.url}
                </Box>

                <Box sx={{ fontWeight: 'bold' }}>Size:</Box>
                <Box>{((asset.size || asset.file_size) / 1024).toFixed(2)} KB</Box>

                <Box sx={{ fontWeight: 'bold' }}>Dimensions:</Box>
                <Box>
                  {asset.width} × {asset.height}px
                </Box>

                <Box sx={{ fontWeight: 'bold' }}>Format:</Box>
                <Box>{asset.format}</Box>

                <Box sx={{ fontWeight: 'bold' }}>Frames:</Box>
                <Box>
                  {asset.n_frames}
                  {asset.is_animated ? ' (Animated)' : ''}
                </Box>

                {asset.modified && (
                  <>
                    <Box sx={{ fontWeight: 'bold' }}>Modified:</Box>
                    <Box>{new Date(asset.modified).toLocaleString()}</Box>
                  </>
                )}

                {asset.cached_at && (
                  <>
                    <Box sx={{ fontWeight: 'bold' }}>Cached At:</Box>
                    <Box>{new Date(asset.cached_at).toLocaleString()}</Box>
                  </>
                )}

                {asset.last_accessed && (
                  <>
                    <Box sx={{ fontWeight: 'bold' }}>Last Accessed:</Box>
                    <Box>{new Date(asset.last_accessed).toLocaleString()}</Box>
                  </>
                )}

                {asset.access_count !== undefined && (
                  <>
                    <Box sx={{ fontWeight: 'bold' }}>Access Count:</Box>
                    <Box>{asset.access_count}</Box>
                  </>
                )}
              </Box>
            </Box>

            {/* Metadata */}
            {asset.gradients?.metadata && (
              <Box>
                <Box
                  sx={{
                    typography: 'h6',
                    mb: 1,
                    color: theme.palette.primary.main
                  }}
                >
                  Gradient Extraction Metadata
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 1 }}>
                  {Object.entries(asset.gradients.metadata).map(([key, value]: [string, any]) => (
                    <Box key={key} sx={{ display: 'contents' }}>
                      <Box sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {key.replace(/_/g, ' ')}:
                      </Box>
                      <Box sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                        {Array.isArray(value)
                          ? `[${value.join(', ')}]`
                          : typeof value === 'object'
                            ? JSON.stringify(value)
                            : String(value)}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Gradients */}
          {asset.gradients && (
            <Box>
              <Box
                sx={{
                  typography: 'h6',
                  mb: 1,
                  color: theme.palette.primary.main
                }}
              >
                Extracted Gradients
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.entries(asset.gradients).map(([key, value]: [string, any]) => {
                  if (key === 'metadata') return null
                  return (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ fontWeight: 'bold', minWidth: 100, textTransform: 'capitalize' }}>
                        {key.replace('_', ' ')}
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          height: 40,
                          borderRadius: 1,
                          background: value.gradient,
                          border: `1px solid ${theme.palette.divider}`
                        }}
                      />
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleApplyGradient(value.gradient)}
                        title="Apply to all active virtuals"
                      >
                        <ColorLens />
                      </IconButton>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default AssetInfoDialog
