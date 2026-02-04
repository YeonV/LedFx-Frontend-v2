import { Card, CardActionArea, CardActions, Typography, Chip, useTheme, Grid } from '@mui/material'
import ScenesMenu from './ScenesMenu'
import SceneImage from './ScenesImage'
import { StoredSceneConfig } from '../../api/ledfx.types'
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon'
import { Stack } from '@mui/system'

const SceneCard = ({
  sceneId,
  scene,
  order,
  handleActivateScene,
  features,
  classes,
  flow
}: {
  sceneId: string
  scene: StoredSceneConfig
  order: number
  handleActivateScene: (_id: string) => void
  features: any
  classes: any
  flow?: boolean
}) => {
  const theme = useTheme()

  return (
    <Grid key={sceneId} mt={['0.5rem', '0.5rem', 0, 0, 0]} p="8px !important" order={order}>
      <Card
        className={classes.root}
        sx={{
          border: '1px solid',
          borderColor: scene.active ? theme.palette.primary.main : theme.palette.divider
        }}
      >
        <CardActionArea
          style={{
            background: theme.palette.background.default
          }}
          onClick={() => handleActivateScene(sceneId)}
        >
          <SceneImage iconName={scene.scene_image || 'Wallpaper'} />
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            {scene.scene_tags?.split(',').map(
              (t: string) =>
                t.length > 0 &&
                features.scenechips && (
                  <Chip
                    variant="filled"
                    label={t}
                    key={t}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: theme.palette.background.paper,
                      border: '1px solid',
                      borderColor: theme.palette.text.disabled
                    }}
                  />
                )
            )}
          </div>
        </CardActionArea>
        <CardActions
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
          className="step-scenes-five"
        >
          <Stack direction="row" spacing={1}>
            {flow && <BladeIcon name={'Wallpaper'} />}
            <Typography className={classes.sceneTitle} variant="h5" component="h2">
              {scene.name || sceneId}
            </Typography>
          </Stack>
          {!(window.localStorage.getItem('guestmode') === 'activated') && (
            <ScenesMenu sceneId={sceneId} flow />
          )}
        </CardActions>
      </Card>
    </Grid>
  )
}

export default SceneCard
