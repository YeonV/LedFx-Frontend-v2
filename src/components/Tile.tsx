import { Button, Grid, Stack, Tooltip, Typography } from '@mui/material'
import { MouseEvent, ReactNode } from 'react'
import useStore from '../store/useStore'

interface TileProps {
  icon?: ReactNode
  text?: string
  onClick?: () => void
  onContextMenu?: (_e: MouseEvent<HTMLButtonElement>) => void
  tooltip?: ReactNode
  component?: ReactNode
  client?: boolean
  beta?: boolean
  alpha?: boolean
}

const Tile = ({
  icon,
  text,
  onClick,
  onContextMenu,
  tooltip,
  component,
  client,
  beta,
  alpha
}: TileProps) => {
  const features = useStore((state) => state.features)
  const coreParams = useStore((state) => state.coreParams)
  const isCC = coreParams && Object.keys(coreParams).length > 0

  if (beta && !features.beta) {
    return null
  }
  if (alpha && !features.alpha) {
    return null
  }

  const button = (
    <Button
      variant="outlined"
      onClick={onClick}
      onContextMenu={onContextMenu}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        gap: 1,
        width: '100%',
        height: '100%'
      }}
    >
      {icon}
      <Stack spacing={0} alignItems="center">
        {text}
        {client && !isCC && (
          <Typography
            variant="caption"
            fontSize={10}
            sx={{ border: '1px solid', width: 70, borderRadius: 3 }}
            color="textDisabled"
          >
            client
          </Typography>
        )}
        {beta && (
          <Typography
            variant="caption"
            fontSize={10}
            sx={{
              position: 'absolute',
              right: 8,
              top: 3
            }}
            color="textDisabled"
          >
            beta
          </Typography>
        )}
      </Stack>
    </Button>
  )

  return (
    <Grid
      sx={{
        width: '158px',
        height: '110px'
      }}
    >
      {component ||
        (tooltip ? (
          <Tooltip
            title={tooltip}
            placement="right"
            slotProps={{
              tooltip: { sx: { maxWidth: 'none', p: 1 } }
            }}
          >
            {button}
          </Tooltip>
        ) : (
          button
        ))}
    </Grid>
  )
}

export default Tile
