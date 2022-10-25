/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridRowParams,
} from '@mui/x-data-grid';

import { Grid, IconButton , Stack } from '@mui/material';
import { PlayCircleFilled } from '@mui/icons-material';
import useStore from '../../../../../store/useStore';
import { spotifyPlaySong } from '../../../../../utils/spotifyProxies';
import { useDataGridStyles } from './SpTriggerTable';
import { SpotifyStateContext } from '../../SpotifyProvider';

// function isScrolledIntoView(el: any) {
//   const rect = el.getBoundingClientRect();
//   const elemTop = rect.top;
//   const elemBottom = rect.bottom;

//   // Only completely visible elements return true:
//   const isVisible = elemTop >= 0 && elemBottom <= rect.innerHeight;
//   // Partially visible elements return true:
//   // isVisible = elemTop < window.innerHeight && elemBottom >= 0;
//   return isVisible;
// }

export default function SpPlaylist() {
  const classes = useDataGridStyles();
  const playlist = useStore((state) => state.spotify.playlist);
  const playerState = React.useContext(SpotifyStateContext);
  const playlistUri = playerState?.context?.metadata?.uri;
  const spotifyDevice = useStore((state) => state.spotify.spotifyDevice);
  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: ' ',
      width: 50,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Stack direction="row" alignItems="center" spacing={0}>
          <IconButton
            aria-label="playstart"
            color="inherit"
            onClick={() => {
              spotifyPlaySong(
                spotifyDevice,
                params.row.track.id,
                undefined,
                playlistUri
              );
            }}
          >
            <PlayCircleFilled fontSize="inherit" />
          </IconButton>
        </Stack>
      ),
    },
    {
      field: 'songName',
      headerName: 'Song name',
      width: 500,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) =>
        `${params?.row?.track?.artists?.[0]?.name || ''} - ${
          params?.row?.track?.name || ''
        }`,
    },
  ];
  const rows = playlist.map((item: any, index: number) => ({
    ...item,
    id: index,
  })) || [{ id: 1 }];

  React.useEffect(() => {
    const playing = document.querySelector(
      '.MuiDataGrid-root.playlist .MuiDataGrid-row.currently_playing'
    );
    if (playing) {
      playing.scrollIntoView();
    }
  }, [playerState?.track_window?.current_track?.name]);
  // console.log(playerState?.context.metadata?.current_item, rows.map((r: any)=>r.track))
  return (
    <Grid xl={7} lg={5} md={12} xs={12} item>
      <Box sx={{ height: 250 }}>
        <DataGrid
          className={`${classes.root} playlist`}
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          headerHeight={0}
          hideFooter
          disableVirtualization
          showColumnRightBorder={false}
          onRowDoubleClick={(params: any) => {
            spotifyPlaySong(
              spotifyDevice,
              params.row.track.id,
              undefined,
              playlistUri
            );
          }}
          sx={{
            boxShadow: 2,
            color: '#fff',
            border: 1,
            borderColor: '#666',
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: 0,
            },
          }}
          pageSize={rows.length}
          rowsPerPageOptions={[rows.length]}
          getRowClassName={(params: GridRowParams<any>) =>
            (params.row.track.name ===
            playerState?.context.metadata?.current_item.name) && (
              params.row.track.artists?.[0].uri ===
              playerState?.context.metadata?.current_item.artists?.[0].uri
            )
              ? 'currently_playing'
              : ''
          }
        />
      </Box>
    </Grid>
  );
}
