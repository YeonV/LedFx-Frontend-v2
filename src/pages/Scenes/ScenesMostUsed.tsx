import { useEffect } from 'react'
import Box from '@mui/material/Box'
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRenderCellParams
} from '@mui/x-data-grid'
import { Card, Typography, useMediaQuery, useTheme } from '@mui/material'
import useStore from '../../store/useStore'
import SceneImage from './ScenesImage'

export default function ScenesMostUsed({
  scenes,
  activateScene,
  title,
  db
}: any) {
  const theme = useTheme()
  const count = useStore((state) => state.count)
  // const [mostUsedScenes, setMostUsedScenes] = useState({});
  const mostUsedScenes = useStore((state) => state.mostUsedScenes)
  const setMostUsedScenes = useStore((state) => state.setMostUsedScenes)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const xsmallScreen = useMediaQuery('(max-width: 475px)')

  const sceneBlenderFilter = (sc: string) =>
    scenes[sc] && !scenes[sc].scene_tags?.split(',')?.includes('blender')

  const handleEvent: GridEventListener<'rowClick'> = async (params) => {
    await activateScene(
      Object.keys(scenes).find((s: any) => scenes[s].name === params.row?.name)
    )
    getVirtuals()
  }
  useEffect(() => {
    Object.keys(count).map((key: string) => setMostUsedScenes(key, count[key]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes, count])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'scene_image',
      headerName: 'Image',
      width: xsmallScreen || db ? 100 : 150,
      renderCell: (params: GridRenderCellParams) => (
        <SceneImage iconName={params.value || 'Wallpaper'} list />
      )
    },
    {
      field: 'name',
      headerName: 'Name',
      width: db ? 136 : 220
    },
    {
      field: 'used',
      headerName: 'Used',
      type: 'number',
      width: 70
    }
  ]

  return (
    <Card
      sx={{
        background: db ? 'transparent' : '',
        borderColor: db ? 'transparent' : '',
        maxWidth: xsmallScreen ? '100%' : 'unset'
      }}
    >
      <Box
        sx={{
          height: db ? 301 : 293,
          width: '100%',
          maxWidth: xsmallScreen ? 'unset' : '470px',
          m: '0 auto'
        }}
      >
        {!db && (
          <Typography
            color="GrayText"
            variant="h6"
            sx={{
              pl: 1,
              pt: 0.5,
              pb: 0.5,
              border: '1px solid',
              borderColor: db ? 'transparent' : theme.palette.divider,
              borderBottom: 0
            }}
          >
            {title}
          </Typography>
        )}
        <DataGrid
          onRowClick={handleEvent}
          rowHeight={50}
          columns={db ? columns.filter((c) => c.field !== 'used') : columns}
          hideFooter
          // headerHeight={1}
          pageSizeOptions={[5]}
          disableColumnSorting={xsmallScreen}
          disableColumnMenu={xsmallScreen}
          disableRowSelectionOnClick
          rows={Object.values(mostUsedScenes)
            .filter((scene: any) => sceneBlenderFilter(scene.name))
            .map((v: any, i: number) => ({
              id: i + 1,
              ...v
            }))}
          initialState={{
            // pagination: {
            //   pageSize: 100,
            // },
            sorting: {
              sortModel: [{ field: 'used', sort: 'desc' }]
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
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer'
            }
          }}
        />
      </Box>
    </Card>
  )
}
