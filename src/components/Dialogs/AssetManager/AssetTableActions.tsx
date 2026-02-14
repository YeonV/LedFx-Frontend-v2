import { Box, IconButton } from '@mui/material'
import { ColorLens, Refresh } from '@mui/icons-material'
import Popover from '../../Popover/Popover'
import AssetInfoButton from './AssetInfoButton'

interface AssetTableActionsProps {
  asset: any
  type: 'user' | 'cache'
  onApplyGradient: (asset: any, event: React.MouseEvent) => void
  onDelete?: (path: string) => void
  onRefresh?: (url: string) => void
  onClear?: (url: string) => void
  filename?: string
}

const AssetTableActions = ({
  asset,
  type,
  onApplyGradient,
  onDelete,
  onRefresh,
  onClear,
  filename
}: AssetTableActionsProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <AssetInfoButton asset={asset} />
      <IconButton
        size="small"
        color="primary"
        onClick={(e) => onApplyGradient(asset, e)}
        disabled={!asset.gradients?.led_safe?.gradient}
        title="Apply gradient to all active virtuals"
      >
        <ColorLens />
      </IconButton>

      {type === 'user' && onDelete && (
        <Popover
          type="iconbutton"
          variant="text"
          color="inherit"
          onConfirm={() => onDelete(asset.path)}
          text={`Delete ${filename}?`}
        />
      )}

      {type === 'cache' && (
        <>
          {onRefresh && (
            <Popover
              type="iconbutton"
              variant="text"
              color="inherit"
              onConfirm={() => onRefresh(asset.url)}
              text="Refresh cache for this image?"
              icon={<Refresh />}
            />
          )}
          {onClear && (
            <Popover
              type="iconbutton"
              variant="text"
              color="inherit"
              onConfirm={() => onClear(asset.url)}
              text="Clear cache for this image?"
            />
          )}
        </>
      )}
    </Box>
  )
}

export default AssetTableActions
