import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import {
  Button,
  Card,
  IconButton,
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
  TimerOff
} from '@mui/icons-material'
import useStore from '../../store/useStore'
import ScenesPlaylistMenu from './ScenesPlaylistMenu'
import SceneImage from './ScenesImage'

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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 0 },
    {
      field: 'scene_image',
      headerName: 'Image',
      width: xsmallScreen ? 70 : db ? 100 : 150,
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
            height: '100%'
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'interval',
      headerName: 'Wait',
      width: db ? 70 : 0,
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
    <Card
      sx={{
        background: db ? 'transparent' : '',
        borderColor: db ? 'transparent' : ''
      }}
    >
      <Box
        sx={{
          height: db ? 301 : 293,
          width: '100%',
          maxWidth: '470px',
          m: '0 auto'
        }}
      >
        <Typography
          color="GrayText"
          variant="h6"
          sx={{
            pl: 1,
            pt: 0.5,
            pb: 0.5,
            border: '1px solid',
            borderColor: db ? 'transparent' : theme.palette.divider,
            borderBottom: 0,
            display: 'flex',
            justifyContent: xsmallScreen ? 'flex-start' : 'space-between',
            alignItems: 'center'
          }}
        >
          {title}
          {!(window.localStorage.getItem('guestmode') === 'activated') && (
            <ScenesPlaylistMenu />
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: db ? theme.palette.text.primary : ''
            }}
          >
            {db ? (
              <IconButton
                sx={{ mr: 1 }}
                onClick={() => {
                  toggleScenePLrepeat()
                }}
              >
                {scenePLrepeat ? <RepeatOn /> : <Repeat />}
              </IconButton>
            ) : (
              <Button
                sx={{ mr: 1 }}
                onClick={() => {
                  toggleScenePLrepeat()
                }}
              >
                {scenePLrepeat ? <RepeatOn /> : <Repeat />}
              </Button>
            )}
            {db ? (
              <IconButton
                sx={{ mr: 1 }}
                onClick={() => {
                  toggleSceneUseIntervals()
                }}
              >
                {sceneUseIntervals ? <Timer /> : <TimerOff />}
              </IconButton>
            ) : (
              <Button
                sx={{ mr: 1 }}
                onClick={() => {
                  toggleSceneUseIntervals()
                }}
              >
                {sceneUseIntervals ? <Timer /> : <TimerOff />}
              </Button>
            )}
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
            {db ? (
              <IconButton
                sx={{ mr: 1 }}
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
            ) : (
              <Button
                // sx={{ mr: 1 }}
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
              </Button>
            )}
          </div>
        </Typography>

        <DataGrid
          rowHeight={50}
          columns={columns}
          hideFooter
          disableColumnSorting={xsmallScreen}
          disableColumnMenu={xsmallScreen}
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
          sx={{
            borderColor: db ? 'transparent' : theme.palette.divider,
            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important'
            },
            '&.MuiDataGrid-root .row--active': {
              background: `${theme.palette.primary.main}30`
            },
            '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle': {
              textOverflow: 'clip'
            }
          }}
        />
      </Box>
    </Card>
  )
}
