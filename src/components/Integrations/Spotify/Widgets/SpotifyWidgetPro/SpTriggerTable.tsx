/* eslint-disable no-console */
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
// import { useTheme } from '@mui/material/styles';
import { DeleteForever, PlayCircleFilled } from '@material-ui/icons';
import { useContext, useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import { Stack } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { NotStarted } from '@mui/icons-material';
import useStore from '../../../../../store/useStore';
import { spotifyPlaySong } from '../../../../../utils/spotifyProxies';
import Popover from '../../../../Popover/Popover';
import { SpotifyStateContext } from '../../SpotifyProvider';

export const useDataGridStyles = makeStyles((theme: any) => ({
  root: {
    '&.MuiDataGrid-root .MuiDataGrid-footerContainer .MuiTablePagination-root':
      {
        color: theme.palette.text.secondary,
      },
    '&.MuiDataGrid-root .MuiButtonBase-root.MuiIconButton-root': {
      color: theme.palette.text.secondary,
    },
    '&.MuiDataGrid-root .MuiDataGrid-cell': {
      borderColor: '#333',
    },
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus-within':
      {
        outline: 'none',
      },

    '& .currently_playing, .currently_playing.MuiDataGrid-row:hover, .currently_playing.MuiDataGrid-row.Mui-hovered':
      {
        backgroundColor: `${theme.palette.primary.main}20`,
        color: theme.palette.text.primary,
      },
    '& .activated, .activated.MuiDataGrid-row:hover, .activated.MuiDataGrid-row.Mui-hovered':
      {
        backgroundColor: `${theme.palette.primary.main}50`,
        color: theme.palette.text.primary,
      },
    '& .disabled.MuiDataGrid-row': {
      pointerEvents: 'none',
      color: '#666',
    },
    '& .disabled.MuiDataGrid-row .MuiIconButton-root': {
      pointerEvents: 'none',
      color: '#666',
    },
  },
}));

export default function SpotifyTriggerTable() {
  const classes = useDataGridStyles();
  const integrations = useStore((state) => state.integrations);
  const getIntegrations = useStore((state) => state.getIntegrations);
  const spotifyDevice = useStore((state) => state.spotify.spotifyDevice);
  const playerState = useContext(SpotifyStateContext);
  const spTriggersList = useStore((state) => state.spotify.spTriggersList);
  const deleteSpTrigger = useStore((state) => state.deleteSpTrigger);
  const getSpTriggers = useStore((state) => state.getSpTriggers);
  const addToSpTriggerList = useStore((state) => state.addToSpTriggerList);
  const getScenes = useStore((state) => state.getScenes);

  useEffect(() => {
    getSpTriggers('spotify');
    getScenes();
  }, []);

  const padTo2Digits = (num: any) => {
    return num.toString().padStart(2, '0');
  };

  const getTime = (milliseconds: any) => {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
      seconds
    )}`;
  };

  // Here we get the current triggers from list and set to global state
  useEffect(() => {
    const triggersNew: any = [];
    let id = 1;
    if (integrations?.spotify?.data) {
      const temp = integrations?.spotify?.data;
      Object.keys(temp).map((key) => {
        const temp1 = temp[key];
        const sceneName = temp1.name;
        const sceneId = temp1.name;
        Object.keys(temp1).map((key1) => {
          if (temp1[key1].constructor === Array) {
            triggersNew.push({
              id,
              trigger_id: `${temp1[key1][0]}-${temp1[key1][2]}`,
              songId: temp1[key1][0],
              songName: temp1[key1][1],
              position: getTime(temp1[key1][2]),
              position_ms: temp1[key1][2],
              sceneId,
              sceneName,
            });
            id += 1;
          }

          return true;
        });
        return true;
      });
      addToSpTriggerList(triggersNew, 'create');
    }
  }, [integrations]);

  const deleteTriggerHandler = (paramsTemp: any) => {
    deleteSpTrigger({
      data: {
        trigger_id: paramsTemp?.row?.trigger_id,
      },
    }).then(() => getIntegrations());
  };
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'songName',
      headerName: 'Song',
      width: 400,
    },
    {
      field: 'position',
      headerName: 'Position',
      width: 90,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'sceneId',
      headerName: 'Scene',
      width: 120,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => (
        <Stack direction="row" alignItems="center" spacing={0}>
          <Popover
            variant="text"
            color="inherit"
            icon={<DeleteForever />}
            style={{ minWidth: 40 }}
            onConfirm={() => {
              deleteTriggerHandler(params);
            }}
          />
          <IconButton
            aria-label="play"
            color="inherit"
            onClick={() => {
              spotifyPlaySong(
                spotifyDevice,
                params.row.songId,
                params.row.position_ms
              );
            }}
          >
            <PlayCircleFilled fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="playstart"
            color="inherit"
            onClick={() => {
              spotifyPlaySong(spotifyDevice, params.row.songId);
            }}
          >
            <NotStarted fontSize="inherit" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const rows = spTriggersList || [{ id: 1 }];

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
      }}
    >
      <DataGrid
        className={classes.root}
        autoHeight
        // checkboxSelection
        disableSelectionOnClick
        onRowDoubleClick={(params: any) => {
          spotifyPlaySong(spotifyDevice, params.row.songId);
        }}
        sx={{
          boxShadow: 2,
          color: '#fff',
          border: 1,
          borderColor: '#666',
        }}
        columns={columns}
        rows={rows}
        getRowClassName={(params: GridRowParams<any>) =>
          params.row.songId ===
          playerState?.context.metadata?.current_item.uri.split(':')[2]
            ? (playerState?.position ?? 0) > params.row.position_ms
              ? 'activated'
              : 'currently_playing'
            : ''
        }
      />
    </div>
  );
}
