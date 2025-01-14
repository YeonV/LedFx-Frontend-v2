import { useEffect, useState } from 'react'
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

export default function ScenesRecent({ scenes, activateScene, title }: any) {
  const theme = useTheme()
  const recentScenes = useStore((state) => state.recentScenes)
  const [theScenes, setTheScenes] = useState({})
  const xsmallScreen = useMediaQuery('(max-width: 475px)')

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'scene_image',
      headerName: 'Image',
      width: xsmallScreen ? 100 : 150,
      renderCell: (params: GridRenderCellParams) => (
        <SceneImage iconName={params.value || 'Wallpaper'} list />
      )
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 220
    },
    {
      field: 'used',
      type: 'number',
      headerName: 'Order',
      width: 70
    }
  ]

  const sceneBlenderFilter = (sc: string) =>
    scenes[sc] && !scenes[sc].scene_tags?.split(',')?.includes('blender')

  const handleEvent: GridEventListener<'rowClick'> = (params) =>
    activateScene(
      Object.keys(scenes).find((s: any) => scenes[s].name === params.row?.name)
    )

  useEffect(() => {
    const current = {} as any
    recentScenes.filter(sceneBlenderFilter).map((key: string, i: number) => {
      current[key] = { ...scenes[key], used: i + 1 }
      return setTheScenes(current)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes, recentScenes])

  return (
    <Card sx={{ width: '100%', maxWidth: 'unset' }}>
      <Box sx={{ height: 293, width: '100%', maxWidth: '470px', m: '0 auto' }}>
        <Typography
          color="GrayText"
          variant="h6"
          sx={{
            pl: 1,
            pt: 0.5,
            pb: 0.5,
            border: '1px solid',
            borderColor: theme.palette.divider,
            borderBottom: 0
          }}
        >
          {title}
        </Typography>
        <DataGrid
          disableColumnSorting={xsmallScreen}
          disableColumnMenu={xsmallScreen}
          onRowClick={handleEvent}
          rowHeight={50}
          columns={columns}
          hideFooter
          // headerHeight={1}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          rows={Object.values(theScenes).map((v: any, i: number) => ({
            id: i + 1,
            ...v
          }))}
          initialState={{
            // pagination: {
            //   pageSize: 100,
            // },
            sorting: {
              sortModel: [{ field: 'used', sort: 'asc' }]
            },
            columns: {
              columnVisibilityModel: {
                id: false,
                scene_tags: false
              }
            }
          }}
          sx={{
            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important'
            }
          }}
        />
      </Box>
    </Card>
  )
}
