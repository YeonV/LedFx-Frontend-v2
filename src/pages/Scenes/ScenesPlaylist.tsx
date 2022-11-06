import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Card, CardMedia, TextField, Typography } from '@mui/material';
import { Pause, PlayArrow, PlaylistRemove } from '@mui/icons-material';
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
  { field: 'id', headerName: 'ID', width: 0 },
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
    width: 200,
  },
  {
    field: 'scene_id',
    headerName: 'Scene ID',
    width: 120,
    renderCell: (params: GridRenderCellParams<string>) => {
      const removeScene2PL = useStore((state) => state.removeScene2PL);
      return (
        <Button
          onClick={() => removeScene2PL(params.id as number)}
          size="small"
        >
          <PlaylistRemove />
        </Button>
      );
    },
  },
];

export default function ScenesPlaylist({ scenes, title }: any) {
  const [theScenes, setTheScenes] = useState([]);
  const scenePL = useStore((state) => state.scenePL);
  const scenePLplay = useStore((state) => state.scenePLplay);
  const toggleScenePLplay = useStore((state) => state.toggleScenePLplay);

  useEffect(() => {
    const current = scenePL.map((key: string, id: number) => ({
      id,
      ...scenes[key],
      scene_id: key,
    }));
    return setTheScenes(current);
  }, [scenes, scenePL]);

  console.log(theScenes);

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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {title}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            sec
            <TextField
              variant="standard"
              sx={{
                width: 70,
                border: '1px solid #666',
                marginRight: 1,
                marginLeft: 1,
                borderRadius: 1,
                '& input': {
                  textAlign: 'right',
                  padding: '5px 0 2px',
                },
                '& .MuiInput-underline:before': {
                  display: 'none',
                },
                '& .MuiInput-underline:after': {
                  display: 'none',
                },
              }}
              type="number"
              // value={spNetworkTime}
              // onChange={(e: any) => setSpNetworkTime(e.target.value)}
            />
            <Button sx={{ mr: 1 }} onClick={() => toggleScenePLplay()}>
              {scenePLplay ? <Pause /> : <PlayArrow />}
            </Button>
          </div>
        </Typography>

        <DataGrid
          rowHeight={50}
          columns={columns}
          hideFooter
          headerHeight={1}
          // pageSize={5}
          disableSelectionOnClick
          rows={(
            (theScenes && theScenes.length > 0 && Object.values(theScenes)) ||
            []
          ).map((v: any, i: number) => ({
            id: i + 1,
            ...v,
          }))}
          initialState={{
            pagination: {
              pageSize: 100,
            },
            sorting: {
              sortModel: [{ field: 'id', sort: 'asc' }],
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
