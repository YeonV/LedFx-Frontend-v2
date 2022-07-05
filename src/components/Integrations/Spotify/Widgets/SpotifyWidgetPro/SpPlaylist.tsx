/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridRowParams,
} from '@mui/x-data-grid';

import { Grid, IconButton } from '@material-ui/core';
import { Stack } from '@mui/material';
import { PlayCircleFilled } from '@material-ui/icons';
import useStore from '../../../../../store/useStore';
import { spotifyPlaySong } from '../../../../../utils/spotifyProxies';
import { useDataGridStyles } from './SpTriggerTable';

export default function SpPlaylist() {
  const classes = useDataGridStyles();
  const playlist = useStore((state) => state.spotify.playlist);
  const playerState = useStore(
    (state) => state.spotify.spotifyData.playerState
  );
  const spotifyPos = useStore((state) => state.spotify.spotifyPos);
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
              spotifyPlaySong(spotifyDevice, params.row.track.id);
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
  return (
    <Grid xl={7} lg={5} md={12} xs={12} item>
      <Box sx={{ height: 250 }}>
        <DataGrid
          className={classes.root}
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          headerHeight={0}
          hideFooter
          showColumnRightBorder={false}
          onRowDoubleClick={(params: any) => {
            spotifyPlaySong(spotifyDevice, params.row.track.id);
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
            params.row.track.uri ===
            playerState?.context.metadata?.current_item.uri
              ? 'currently_playing'
              : ''
          }
        />
      </Box>
    </Grid>
  );
}
