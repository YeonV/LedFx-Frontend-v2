import { useEffect } from 'react'
import { DataGrid, GridColDef, GridEventListener, GridRenderCellParams } from '@mui/x-data-grid'
import { useMediaQuery, useTheme } from '@mui/material'
import useStore from '../../store/useStore'
import SceneImage from './ScenesImage'
import ExpanderCard from './ExpanderCard'

export default function ScenesMostUsed({ scenes, activateScene, title, db }: any) {
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
    await activateScene(Object.keys(scenes).find((s: any) => scenes[s].name === params.row?.name))
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
      width: xsmallScreen ? 60 : 100,
      renderCell: (params: GridRenderCellParams) => (
        <SceneImage iconName={params.value || 'Wallpaper'} list />
      )
    },
    {
      field: 'name',
      headerName: 'Name',
      width: xsmallScreen ? window.innerWidth - 150 : db ? 136 : 250
    },
    {
      field: 'used',
      headerName: 'Used',
      type: 'number',
      width: 70
    }
  ]

  return (
    <ExpanderCard title={title} cardKey="scenesMostUsed">
      <DataGrid
        onRowClick={handleEvent}
        rowHeight={50}
        columns={db ? columns.filter((c) => c.field !== 'used') : columns}
        hideFooter
        // headerHeight={1}
        pageSizeOptions={[5]}
        disableColumnSorting
        disableColumnMenu
        disableColumnFilter
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
        sx={[
          {
            '& .MuiDataGrid-row--borderBottom': {
              background: theme.palette.background.paper + ' !important'
            },

            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important'
            },

            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer'
            }
          },
          db
            ? {
                borderColor: 'transparent'
              }
            : {
                borderColor: theme.palette.divider
              }
        ]}
      />
    </ExpanderCard>
  )
}
