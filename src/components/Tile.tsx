import { Button, Grid, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'
import useStore from '../store/useStore'

interface TileProps {
  icon?: ReactNode
  text?: string
  onClick?: () => void
  component?: ReactNode
  client?: boolean
  beta?: boolean
}

const Tile = ({ icon, text, onClick, component, client, beta }: TileProps) => {
  const features = useStore((state) => state.features)
  const coreParams = useStore((state) => state.coreParams)
  const isCC = coreParams && Object.keys(coreParams).length > 0

  if (beta && !features.beta) {
    return null
  }

  return (
    <Grid
      sx={{
        width: '169px',
        height: '110px'
      }}
    >
      {component || (
        <Button
          variant="outlined"
          onClick={onClick}
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
      )}
    </Grid>
  )
}

export default Tile
