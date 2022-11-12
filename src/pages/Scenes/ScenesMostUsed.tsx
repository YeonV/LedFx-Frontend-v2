import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { Card, CardMedia, Typography } from '@mui/material';
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon';
import useStore from '../../store/useStore';

const sceneImage = (iconName: string) =>
  iconName && iconName.startsWith('image:') ? (
    <CardMedia
      image={iconName.split('image:')[1]}
      title="Contemplative Reptile"
      sx={{ width: '100%', height: '100%' }}
    />
  ) : (
    <BladeIcon scene name={iconName} />
  );

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'scene_image',
    headerName: 'Image',
    width: 150,
    renderCell: (params: GridRenderCellParams<string>) =>
      sceneImage(params.value || 'Wallpaper'),
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 220,
  },
  {
    field: 'used',
    headerName: 'Used',
    type: 'number',
    width: 20,
  },
];

export default function ScenesMostUsed({ scenes, activateScene, title }: any) {
  const count = useStore((state) => state.count);
  const [mostUsedScenes, setMostUsedScenes] = useState({});
  const handleEvent: GridEventListener<'rowClick'> = (params) =>
    activateScene(
      Object.keys(scenes).find((s: any) => scenes[s].name === params.row?.name)
    );

  useEffect(() => {
    const current = {} as any;
    Object.keys(count).map((key: string) => {
      current[key] = { ...scenes[key], used: count[key] };
      return setMostUsedScenes(current);
    });
  }, [scenes, count]);

  return (
    <Card>
      <Box sx={{ height: 293, width: '100%', maxWidth: '470px', m: '0 auto' }}>
        <Typography
          color="GrayText"
          variant="h6"
          sx={{
            pl: 1,
            pt: 0.5,
            pb: 0.5,
            border: '1px solid #666',
            borderBottom: 0,
          }}
        >
          {title}
        </Typography>
        <DataGrid
          onRowClick={handleEvent}
          rowHeight={50}
          columns={columns}
          hideFooter
          headerHeight={1}
          pageSize={5}
          disableSelectionOnClick
          rows={Object.values(mostUsedScenes).map((v: any, i: number) => ({
            id: i + 1,
            ...v,
          }))}
          initialState={{
            pagination: {
              pageSize: 100,
            },
            sorting: {
              sortModel: [{ field: 'used', sort: 'desc' }],
            },
            columns: {
              columnVisibilityModel: {
                id: false,
                scene_tags: false,
              },
            },
          }}
          sx={{
            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
          }}
        />
      </Box>
    </Card>
  );
}
