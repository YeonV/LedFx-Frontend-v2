import { useEffect } from 'react'
import { Chip, Alert, Collapse, useMediaQuery, Grid, Box, Stack } from '@mui/material'
import useStore from '../../store/useStore'
import NoYet from '../../components/NoYet'
// import ScenesTable from './ScenesTable';
import ScenesRecent from './ScenesRecent'
import ScenesMostUsed from './ScenesMostUsed'
import ScenesPlaylist from './ScenesPlaylist'
import useStyles from './Scenes.styles'
import { ISceneOrder } from '../../store/api/storeScenes'
import SceneCard from './SceneCard'
import BackendPlaylist from './BackendPlaylist/BackendPlaylist'

const Scenes = () => {
  const classes = useStyles()

  const getScenes = useStore((state) => state.getScenes)
  const scenes = useStore((state) => state.scenes)
  const sceneOrder = useStore((state) => state.sceneOrder)
  const setSceneOrder = useStore((state) => state.setSceneOrder)
  const features = useStore((state) => state.features)
  const activateScene = useStore((state) => state.activateScene)
  const infoAlerts = useStore((state) => state.uiPersist.infoAlerts)
  const setInfoAlerts = useStore((state) => state.setInfoAlerts)
  const sceneActiveTags = useStore((state) => state.ui.sceneActiveTags)
  // const xsmallScreen = useMediaQuery('(max-width: 475px)')
  const mediumScreen = useMediaQuery('(max-width: 870px)')
  // const largeScreen = useMediaQuery('(min-width: 1480px)')

  const toggletSceneActiveTag = useStore((state) => state.ui.toggletSceneActiveTag)
  const captivateScene = useStore((state) => state.captivateScene)

  const handleActivateScene = async (e: string) => {
    await activateScene(e)
    setTimeout(async () => {
      await getScenes()
    }, 400)
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
    scenes[sc].scene_tags?.split(',').some((sce: string) => sceneActiveTags.includes(sce))

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
            You can then save everything as a scene by using the <strong>+</strong> button
          </Alert>
        </Collapse>

        <Stack
          direction={'row'}
          // justifyContent={'center'}
          alignItems={'flex-start'}
        >
          {scenes && Object.keys(scenes).length && (
            <Stack direction={'column'} spacing={2} p={2} className="step-scenes-four">
              {features.sceneRecent && (
                <Box maxWidth={mediumScreen ? '100%' : 450} paddingBottom={0}>
                  <ScenesRecent
                    scenes={scenes}
                    activateScene={handleActivateScene}
                    title="Recent Scenes"
                  />
                </Box>
              )}
              {features.sceneMostUsed && (
                <Box maxWidth={mediumScreen ? '100%' : 450} paddingBottom={0}>
                  <ScenesMostUsed
                    scenes={scenes}
                    activateScene={handleActivateScene}
                    title="Most Used Scenes"
                  />
                </Box>
              )}
              {features.scenePlaylist && (
                <Box maxWidth={mediumScreen ? '100%' : 450} paddingBottom={0}>
                  <ScenesPlaylist
                    scenes={scenes}
                    activateScene={handleActivateScene}
                    title="Playlist"
                  />
                </Box>
              )}
              {features.scenePlaylistBackend && (
                <Box maxWidth={mediumScreen ? '100%' : 450} paddingBottom={0}>
                  <BackendPlaylist maxWidth={mediumScreen ? '100%' : 450} />
                </Box>
              )}
            </Stack>
          )}
          <Box justifyContent={'center'} textAlign={'center'}>
            {scenes && Object.keys(scenes).length && features.scenechips ? (
              <div className="step-scenes-three">
                {Object.keys(scenes)
                  .flatMap((s) =>
                    !!scenes[s].scene_tags && scenes[s].scene_tags !== ''
                      ? scenes[s].scene_tags.split(',')
                      : []
                  )
                  .filter((n) => !!n && n.trim())
                  .filter((v, i, a) => a.indexOf(v) === i && v)
                  .map((t) => {
                    return (
                      <Chip
                        variant={sceneActiveTags.includes(t) ? 'filled' : 'outlined'}
                        sx={{
                          ml: 1,
                          mt: 1,
                          mr: 1,
                          cursor: sceneActiveTags.includes(t) ? 'zoom-out' : 'zoom-in'
                        }}
                        key={t}
                        label={t}
                        onClick={() => toggletSceneActiveTag(t)}
                      />
                    )
                  })}
              </div>
            ) : null}
            <Grid
              container
              spacing={[0, 0, 2, 2, 2]}
              justifyContent={'center'}
              m={['0 auto', '0 auto', '0.5rem', '0.5rem', '0.5rem']}
              className="step-scenes-one"
              sx={{
                maxWidth: '100%',
                overflowY: features.sceneScroll ? 'auto' : 'unset',
                maxHeight: features.sceneScroll ? 'calc(100vh - 185px)' : 'auto'
              }}
            >
              {scenes && Object.keys(scenes).length ? (
                (sceneActiveTags.length
                  ? Object.keys(scenes).filter(sceneFilter)
                  : Object.keys(scenes)
                )
                  .filter(sceneBlenderFilter)
                  .map((s, i) => {
                    return (
                      <SceneCard
                        key={i}
                        sceneId={s}
                        scene={scenes[s]}
                        order={sceneOrder.find((o) => o.sceneId === s)?.order || 0}
                        handleActivateScene={handleActivateScene}
                        features={features}
                        classes={classes}
                      />
                    )
                  })
              ) : (
                <NoYet type="Scene" />
              )}
            </Grid>
          </Box>
        </Stack>
      </div>
    </>
  )
}

export default Scenes
