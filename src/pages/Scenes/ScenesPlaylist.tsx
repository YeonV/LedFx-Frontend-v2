import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Button,
  Card,
  CardMedia,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { PlayArrow, PlaylistRemove, Stop } from '@mui/icons-material';

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
    width: 220,
    renderCell: (params: GridRenderCellParams<string>) => (
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'scene_id',
    headerName: 'Scene ID',
    width: 100,
    renderCell: (params: GridRenderCellParams<string>) => {
      const removeScene2PL = useStore((state) => state.removeScene2PL);
      return (
        <Button
          onClick={() => removeScene2PL(params.id as number)}
          size="small"
          variant="text"
        >
          <PlaylistRemove />
        </Button>
      );
    },
  },
];

export default function ScenesPlaylist({ scenes, title, activateScene }: any) {
  const theme = useTheme();
  const [theScenes, setTheScenes] = useState([]);
  const scenePL = useStore((state) => state.scenePL);
  const scenePLplay = useStore((state) => state.scenePLplay);
  const toggleScenePLplay = useStore((state) => state.toggleScenePLplay);
  const scenePLactiveIndex = useStore((state) => state.scenePLactiveIndex);
  const scenePLinterval = useStore((state) => state.scenePLinterval);
  const setScenePLinterval = useStore((state) => state.setScenePLinterval);
  const setScenePLactiveIndex = useStore(
    (state) => state.setScenePLactiveIndex
  );

  useEffect(() => {
    const current = scenePL.map((key: string, id: number) => ({
      id,
      ...scenes[key],
      scene_id: key,
    }));
    return setTheScenes(current);
  }, [scenes, scenePL]);

  let timer = null as any;
  useEffect(() => {
    if (scenePLplay && timer === null) {
      timer = setTimeout(() => {
        if (scenePL[scenePLactiveIndex + 1])
          activateScene(scenePL[scenePLactiveIndex + 1]);
        setScenePLactiveIndex(scenePLactiveIndex + 1);
      }, scenePLinterval * 1000);
    } else if (timer) {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [scenePLplay, scenePLactiveIndex]);

  useEffect(() => {
    if (scenePLplay && timer && scenePLactiveIndex >= theScenes.length) {
      toggleScenePLplay();
      setScenePLactiveIndex(-1);
    }
  }, [scenePLplay, scenePLactiveIndex]);

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
              value={scenePLinterval}
              onChange={(e: any) => setScenePLinterval(e.target.value)}
            />
            <Button
              sx={{ mr: 1 }}
              onClick={() => {
                if (scenePLplay) {
                  setScenePLactiveIndex(-1);
                }
                toggleScenePLplay();
              }}
            >
              {scenePLplay ? <Stop /> : <PlayArrow />}
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
          getRowClassName={(params) =>
            `row${params.row.id === scenePLactiveIndex ? '--active' : ''}`
          }
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
            '&.MuiDataGrid-root .row--active': {
              background: `${theme.palette.primary.main}30`,
            },
          }}
        />
      </Box>
    </Card>
  );
}
