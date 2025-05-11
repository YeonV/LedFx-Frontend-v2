import { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridEventListener, GridRenderCellParams } from '@mui/x-data-grid'
import { useMediaQuery, useTheme } from '@mui/material'
import useStore from '../../store/useStore'
import SceneImage from './ScenesImage'
import ExpanderCard from './ExpanderCard'

export default function ScenesRecent({ scenes, activateScene, title }: any) {
  const recentScenes = useStore((state) => state.recentScenes)
  const theme = useTheme()
  const [theScenes, setTheScenes] = useState({})
  const xsmallScreen = useMediaQuery('(max-width: 475px)')

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 0 },
    {
      field: 'scene_image',
      headerName: 'Image',
      width: xsmallScreen ? 60 : 100,
      flex: 0,
      renderCell: (params: GridRenderCellParams) => (
        <SceneImage iconName={params.value || 'Wallpaper'} list />
      )
    },
    {
      field: 'name',
      headerName: 'Name',
      width: xsmallScreen && window ? window.innerWidth - 150 : 250
      // flex: 1
    },
    {
      field: 'used',
      type: 'number',
      headerName: 'Order',
      width: 70,
      flex: 0
    }
  ]

  const sceneBlenderFilter = (sc: string) =>
    scenes[sc] && !scenes[sc].scene_tags?.split(',')?.includes('blender')

  const handleEvent: GridEventListener<'rowClick'> = (params) =>
    activateScene(Object.keys(scenes).find((s: any) => scenes[s].name === params.row?.name))

  useEffect(() => {
    const current = {} as any
    recentScenes.filter(sceneBlenderFilter).map((key: string, i: number) => {
      current[key] = { ...scenes[key], used: i + 1 }
      return setTheScenes(current)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes, recentScenes])

  return (
    <ExpanderCard title={title} cardKey="scenesRecent">
      <DataGrid
        disableColumnSorting
        disableColumnMenu
        disableColumnFilter
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
          '& .MuiDataGrid-row--borderBottom': {
            background: theme.palette.background.paper + ' !important'
          },
          width: '100%',
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important'
          }
        }}
      />
    </ExpanderCard>
  )
}
