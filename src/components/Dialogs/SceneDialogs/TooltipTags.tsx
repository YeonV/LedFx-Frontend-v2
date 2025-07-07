import { InfoRounded } from '@mui/icons-material'
import { Tooltip, Typography } from '@mui/material'

const TooltipTags = () => (
  <Tooltip
    sx={{ cursor: 'help' }}
    placement="bottom-end"
    title={
      <div>
        <Typography color="HighlightText" variant="subtitle1">
          can be used to categorize your scenes
        </Typography>
        <Typography color="textSecondary" variant="subtitle1">
          <em>please press ENTER after each tag</em>
        </Typography>
        <Typography color="textSecondary" variant="subtitle1">
          <em>eg. HipHop, Smooth</em>
        </Typography>
      </div>
    }
  >
    <InfoRounded />
  </Tooltip>
)

export default TooltipTags
