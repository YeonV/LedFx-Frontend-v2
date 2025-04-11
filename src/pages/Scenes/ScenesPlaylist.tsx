import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import {
  Button,
  Card,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  PlayArrow,
  PlaylistRemove,
  Repeat,
  RepeatOn,
  Stop,
  Timer,
  TimerOff,
  SkipNext,
  SkipPrevious
} from '@mui/icons-material'
import useStore from '../../store/useStore'
import ScenesPlaylistMenu from './ScenesPlaylistMenu'
import SceneImage from './ScenesImage'
import ExpanderCard from './ExpanderCard'

export default function ScenesPlaylist({
  scenes,
  title,
  activateScene,
  db
}: any) {
  const theme = useTheme()
  const workerRef = useRef<Worker | null>(null)
  const [theScenes, setTheScenes] = useState([])
  const scenePL = useStore((state) => state.scenePL)
  const scenePLintervals = useStore((state) => state.scenePLintervals)
  const setScenePLintervals = useStore((state) => state.setScenePLintervals)
  const sceneUseIntervals = useStore((state) => state.sceneUseIntervals)
  const toggleSceneUseIntervals = useStore(
    (state) => state.toggleSceneUseIntervals
  )
  const scenePLplay = useStore((state) => state.scenePLplay)
  const toggleScenePLplay = useStore((state) => state.toggleScenePLplay)
  const scenePLrepeat = useStore((state) => state.scenePLrepeat)
  const toggleScenePLrepeat = useStore((state) => state.toggleScenePLrepeat)
  const scenePLactiveIndex = useStore((state) => state.scenePLactiveIndex)
  const scenePLinterval = useStore((state) => state.scenePLinterval)
  const setScenePLinterval = useStore((state) => state.setScenePLinterval)
  const setScenePLactiveIndex = useStore((state) => state.setScenePLactiveIndex)
  const xsmallScreen = useMediaQuery('(max-width: 475px)')

  useEffect(() => {
    const current = scenePL.map((key: string, id: number) => ({
      id,
      ...scenes[key],
      scene_id: key
    }))
    return setTheScenes(current)
  }, [scenes, scenePL])

  useEffect(() => {
    if (workerRef.current === null) {
      workerRef.current = new Worker(
        new URL('../../workers/timerWorker.ts', import.meta.url)
      )
      workerRef.current.onmessage = (e) => {
        if (e.data.action === 'sceneChanged') {
          setScenePLactiveIndex(e.data.nextIndex)
        }
      }
    }

    if (scenePLplay) {
      workerRef.current.postMessage({
        action: 'start',
        interval:
          (sceneUseIntervals
            ? scenePLinterval
            : scenePLintervals[scenePLactiveIndex] || 2) * 1000,
        scenePL,
        scenePLactiveIndex,
        scenePLrepeat,
        url: window.localStorage.getItem('ledfx-host')
      })
    } else {
      workerRef.current.postMessage({ action: 'stop' })
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [
    scenePLplay,
    scenePLactiveIndex,
    scenePLintervals,
    scenePLinterval,
    scenePLrepeat,
    setScenePLactiveIndex,
    sceneUseIntervals,
    scenePL
  ])

  const handleNext = () => {
    const nextIndex = (scenePLactiveIndex + 1) % scenePL.length
    setScenePLactiveIndex(nextIndex)
    activateScene(scenePL[nextIndex])
  }

  const handlePrev = () => {
    const prevIndex = (scenePLactiveIndex - 1 + scenePL.length) % scenePL.length
    setScenePLactiveIndex(prevIndex)
    activateScene(scenePL[prevIndex])
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 0 },
    {
      field: 'scene_image',
      headerName: 'Image',
      width: xsmallScreen ? 70 : db ? 100 : 100,
      renderCell: (params: GridRenderCellParams) => (
        <SceneImage iconName={params.value || 'Wallpaper'} list />
      )
    },
    {
      field: 'name',
      headerName: 'Name',
      width: xsmallScreen ? 160 : db ? 136 : 200,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            cursor: 'pointer'
          }}
          onClick={() => {
            activateScene(params.row.scene_id)
            setScenePLactiveIndex(params.row.id)
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'interval',
      headerName: 'Wait',
      width: 70,
      renderCell: (params: GridRenderCellParams) => (
        <TextField
          variant="standard"
          disabled={sceneUseIntervals}
          sx={{
            display: 'flex',
            width: 70,
            height: '100%',
            '& input': {
              textAlign: 'right',
              padding: '5px 15px 2px'
            },
            '& .MuiInput-underline:before': {
              display: 'none'
            },
            '& .MuiInput-underline:after': {
              display: 'none'
            },
            '& .MuiInput-root': {
              height: '100%'
            }
          }}
          type="number"
          value={sceneUseIntervals ? 2 : scenePLintervals[params.id as number]}
          onChange={(e: any) => {
            const newIntervals = [...scenePLintervals]
            newIntervals[params.id as number] = e.target.value
            setScenePLintervals(newIntervals)
          }}
        />
      )
    },
    {
      field: 'scene_id',
      headerName: 'Remove',
      width: 80,
      renderCell: (params: GridRenderCellParams) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const removeScene2PL = useStore((state) => state.removeScene2PL)
        return (
          <Button
            onClick={() => removeScene2PL(params.id as number)}
            size="small"
            variant="text"
          >
            <PlaylistRemove />
          </Button>
        )
      }
    }
  ]

  return (
    <ExpanderCard title={title} cardKey="scenesPlaylist">
      <Card
        sx={[
          db
            ? {
                background: 'transparent'
              }
            : {
                background: ''
              },
          db
            ? {
                borderColor: 'transparent'
              }
            : {
                borderColor: ''
              }
        ]}
      >
        <Box
          sx={[
            {
              width: '100%',
              maxWidth: '470px',
              m: '0 auto'
            },
            db
              ? {
                  height: 301
                }
              : {
                  height: 293
                }
          ]}
        >
          <Typography
            color="GrayText"
            variant="h6"
            sx={[
              {
                // pl: 1,
                pt: 0.5,

                pb: 0.5,
                border: '1px solid',
                borderBottom: 0,
                display: 'flex',
                alignItems: 'center'
              },
              db
                ? {
                    borderColor: 'transparent'
                  }
                : {
                    borderColor: theme.palette.divider
                  },
              xsmallScreen
                ? {
                    justifyContent: 'flex-start'
                  }
                : {
                    justifyContent: 'space-between'
                  }
            ]}
          >
            <Stack flex={1} direction={'row'} justifyContent={'space-between'}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: db ? theme.palette.text.primary : ''
                }}
              >
                <IconButton onClick={handlePrev}>
                  <SkipPrevious />
                </IconButton>
                <IconButton
                  onClick={() => {
                    if (scenePLplay) {
                      setScenePLactiveIndex(-1)
                    } else {
                      activateScene(scenePL[0])
                      setScenePLactiveIndex(0)
                    }
                    toggleScenePLplay()
                  }}
                >
                  {scenePLplay ? <Stop /> : <PlayArrow />}
                </IconButton>
                <IconButton onClick={handleNext}>
                  <SkipNext />
                </IconButton>
                <IconButton
                  onClick={() => {
                    toggleScenePLrepeat()
                  }}
                >
                  {scenePLrepeat ? <RepeatOn /> : <Repeat />}
                </IconButton>
                <IconButton
                  sx={{ mr: 1 }}
                  onClick={() => {
                    toggleSceneUseIntervals()
                  }}
                >
                  {sceneUseIntervals ? <Timer /> : <TimerOff />}
                </IconButton>
                {db || xsmallScreen ? '' : 'sec'}
                <TextField
                  variant="standard"
                  disabled={!sceneUseIntervals}
                  sx={{
                    width: 60,
                    // border: '1px solid',
                    // borderColor: theme.palette.divider,
                    marginRight: 1,
                    marginLeft: 1,
                    // borderRadius: 1,
                    '& input': {
                      textAlign: 'right',
                      padding: '5px 0 2px'
                    },
                    '& .MuiInput-underline:before': {
                      display: 'none'
                    },
                    '& .MuiInput-underline:after': {
                      display: 'none'
                    }
                  }}
                  type="number"
                  value={scenePLinterval}
                  onChange={(e: any) => setScenePLinterval(e.target.value)}
                />
              </div>
              {!(window.localStorage.getItem('guestmode') === 'activated') && (
                <ScenesPlaylistMenu />
              )}
            </Stack>
          </Typography>

          <DataGrid
            onRowDoubleClick={(params) => {
              activateScene(params.row.scene_id)
              setScenePLactiveIndex(params.row.id)
            }}
            rowHeight={50}
            columns={columns}
            hideFooter
            disableColumnSorting
            disableColumnMenu
            disableColumnFilter
            // headerHeight={1}
            // pageSize={5}
            disableRowSelectionOnClick
            rows={(
              (theScenes && theScenes.length > 0 && Object.values(theScenes)) ||
              []
            ).map((v: any, i: number) => ({
              id: i + 1,
              ...v
            }))}
            getRowClassName={(params) =>
              `row${params.row.id === scenePLactiveIndex ? '--active' : ''}`
            }
            pageSizeOptions={[100]}
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'asc' }]
              },
              columns: {
                columnVisibilityModel: {
                  id: false,
                  scene_tags: false
                }
              }
            }}
            sx={(theme) => ({
              '& .MuiDataGrid-row--borderBottom': {
                background: theme.palette.background.paper + ' !important'
              },

              '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                outline: 'none !important'
              },

              '&.MuiDataGrid-root .row--active': {
                background: `${theme.palette.primary.main}30`
              },

              '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle': {
                textOverflow: 'clip'
              }
            })}
          />
        </Box>
      </Card>
    </ExpanderCard>
  )
}
