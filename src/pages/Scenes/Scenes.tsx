import { useEffect } from 'react'

import {
  Card,
  CardActionArea,
  CardActions,
  Typography,
  Chip,
  useTheme,
  Alert,
  Collapse,
  useMediaQuery,
  Grid2,
  Box,
  Stack
} from '@mui/material'
import useStore from '../../store/useStore'
import NoYet from '../../components/NoYet'
// import ScenesTable from './ScenesTable';
import ScenesRecent from './ScenesRecent'
import ScenesMostUsed from './ScenesMostUsed'
import ScenesPlaylist from './ScenesPlaylist'
import ScenesMenu from './ScenesMenu'
import useStyles from './Scenes.styles'
import SceneImage from './ScenesImage'
import { ISceneOrder } from '../../store/api/storeScenes'

const Scenes = () => {
  const classes = useStyles()
  const theme = useTheme()

  const getScenes = useStore((state) => state.getScenes)
  const scenes = useStore((state) => state.scenes)
  const sceneOrder = useStore((state) => state.sceneOrder)
  const setSceneOrder = useStore((state) => state.setSceneOrder)
  const features = useStore((state) => state.features)
  const activateScene = useStore((state) => state.activateScene)
  const infoAlerts = useStore((state) => state.uiPersist.infoAlerts)
  const setInfoAlerts = useStore((state) => state.setInfoAlerts)
  const sceneActiveTags = useStore((state) => state.ui.sceneActiveTags)
  const xsmallScreen = useMediaQuery('(max-width: 475px)')
  const mediumScreen = useMediaQuery('(max-width: 870px)')
  const largeScreen = useMediaQuery('(min-width: 1480px)')

  const toggletSceneActiveTag = useStore(
    (state) => state.ui.toggletSceneActiveTag
  )
  const captivateScene = useStore((state) => state.captivateScene)

  const handleActivateScene = (e: string) => {
    activateScene(e)
    if (scenes[e]?.scene_puturl && scenes[e]?.scene_payload)
      captivateScene(scenes[e]?.scene_puturl, scenes[e]?.scene_payload)
  }

  useEffect(() => {
    getScenes()
  }, [getScenes])

  useEffect(() => {
    // initial scene order if not set
    const sc = JSON.parse(JSON.stringify(sceneOrder)) as ISceneOrder[]
    Object.keys(scenes).map((s, i) => {
      if (!sc.some((o) => o.sceneId === s)) {
        return sc.push({ sceneId: s, order: i })
      }
      return null
    })
    setSceneOrder(sc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes])

  const sceneFilter = (sc: string) =>
    scenes[sc].scene_tags
      ?.split(',')
      .some((sce: string) => sceneActiveTags.includes(sce))

  const sceneBlenderFilter = (sc: string) =>
    scenes[sc] && !scenes[sc].scene_tags?.split(',')?.includes('blender')
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Collapse in={infoAlerts.scenes}>
          <Alert
            sx={{ mb: 2 }}
            severity="info"
            onClose={() => {
              setInfoAlerts('scenes', false)
            }}
          >
            Head over to Devices-Page and adjust all effects for all devices.
            <br />
            You can then save everything as a scene by using the{' '}
            <strong>+</strong> button
          </Alert>
        </Collapse>

        <Stack
          direction={mediumScreen || largeScreen ? 'column' : 'row'}
          // justifyContent={'center'}
          alignItems={mediumScreen || largeScreen ? 'center' : 'flex-start'}
        >
          {scenes && Object.keys(scenes).length && features.scenetables && (
            <Stack
              direction={largeScreen ? 'row' : 'column'}
              spacing={2}
              p={!xsmallScreen && !mediumScreen && !largeScreen ? 2 : 0}
            >
              <Box
                maxWidth={mediumScreen ? '100%' : 450}
                paddingBottom={0}
                // paddingLeft={1}
                // paddingRight={1}
              >
                <ScenesRecent
                  scenes={scenes}
                  activateScene={handleActivateScene}
                  title="Recent Scenes"
                />
              </Box>
              <Box
                maxWidth={mediumScreen ? '100%' : 450}
                paddingBottom={0}
                // paddingLeft={1}
                // paddingRight={1}
              >
                <ScenesMostUsed
                  scenes={scenes}
                  activateScene={handleActivateScene}
                  title="Most Used Scenes"
                />
              </Box>
              <Box
                maxWidth={mediumScreen ? '100%' : 450}
                paddingBottom={0}
                // paddingLeft={1}
                // paddingRight={1}
              >
                <ScenesPlaylist
                  scenes={scenes}
                  activateScene={handleActivateScene}
                  title="Playlist"
                />
              </Box>
            </Stack>
          )}
          <Box justifyContent={'center'} textAlign={'center'} mt={2}>
            {scenes && Object.keys(scenes).length && features.scenechips ? (
              <div>
                {Object.keys(scenes)
                  .flatMap((s) =>
                    !!scenes[s].scene_tags && scenes[s].scene_tags !== ''
                      ? scenes[s].scene_tags.split(',')
                      : null
                  )
                  .filter((n: string) => !!n && n.trim())
                  .filter((v, i, a) => a.indexOf(v) === i && v)
                  .map((t: string) => {
                    return (
                      <Chip
                        variant={
                          sceneActiveTags.includes(t) ? 'filled' : 'outlined'
                        }
                        sx={{
                          ml: 1,
                          mt: 1,
                          mr: 1,
                          cursor: sceneActiveTags.includes(t)
                            ? 'zoom-out'
                            : 'zoom-in'
                        }}
                        key={t}
                        label={t}
                        onClick={() => toggletSceneActiveTag(t)}
                      />
                    )
                  })}
              </div>
            ) : null}
            <Grid2
              container
              spacing={[0, 0, 2, 2, 2]}
              justifyContent={'center'}
              m={['0 auto', '0 auto', '0.5rem', '0.5rem', '0.5rem']}
              sx={{ maxWidth: '100%' }}
            >
              {scenes && Object.keys(scenes).length ? (
                (sceneActiveTags.length
                  ? Object.keys(scenes).filter(sceneFilter)
                  : Object.keys(scenes)
                )
                  .filter(sceneBlenderFilter)
                  .map((s, i) => {
                    return (
                      <Grid2
                        key={i}
                        mt={['0.5rem', '0.5rem', 0, 0, 0]}
                        p="8px !important"
                        order={
                          sceneOrder.find((o) => o.sceneId === s)?.order || 0
                        }
                      >
                        <Card
                          className={classes.root}
                          sx={{
                            border: '1px solid',
                            borderColor: theme.palette.divider
                          }}
                        >
                          <CardActionArea
                            style={{
                              background: theme.palette.background.default
                            }}
                            onClick={() => handleActivateScene(s)}
                          >
                            <SceneImage
                              iconName={scenes[s].scene_image || 'Wallpaper'}
                            />
                            <div
                              style={{ position: 'absolute', top: 0, right: 0 }}
                            >
                              {scenes[s].scene_tags?.split(',').map(
                                (t: string) =>
                                  t.length > 0 &&
                                  features.scenechips && (
                                    <Chip
                                      variant="filled"
                                      label={t}
                                      key={t}
                                      sx={{
                                        cursor: 'pointer',
                                        backgroundColor:
                                          theme.palette.background.paper,
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
                          >
                            <Typography
                              className={classes.sceneTitle}
                              variant="h5"
                              component="h2"
                            >
                              {scenes[s].name || s}
                            </Typography>
                            {!(
                              window.localStorage.getItem('guestmode') ===
                              'activated'
                            ) && <ScenesMenu sceneId={s} />}
                          </CardActions>
                        </Card>
                      </Grid2>
                    )
                  })
              ) : (
                <NoYet type="Scene" />
              )}
            </Grid2>
          </Box>
        </Stack>
      </div>
    </>
  )
}

export default Scenes
