/* eslint-disable no-console */
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// GridRowParams
// import { useTheme } from '@mui/material/styles';
import { DeleteForever, PlayCircleFilled } from '@material-ui/icons';
import { useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import { Stack } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import useStore from '../../../store/useStore';
// import { spotifyPlaySong } from '../../../utils/spotifyProxies';
import Popover from '../../Popover/Popover';

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

export default function QLCTriggerTable() {
  const classes = useDataGridStyles();
  const integrations = useStore((state) => state.integrations);
  const getIntegrations = useStore((state) => state.getIntegrations);
  const QLCTriggersList = useStore((state) => state.qlc.QLCTriggersList);
  const deleteSpTrigger = useStore((state) => state.deleteSpTrigger);
  const addToQLCTriggerList = useStore((state) => state.addToQLCTriggerList);

  // Here we get the current triggers from list and set to global state

  useEffect(() => {
    const triggersNew: any = [];
    let id = 1;
    if (integrations?.qlc?.data) {
      const temp = integrations?.qlc?.data;
      Object.keys(temp).map((key) => {
        const temp1 = temp[key];
        const sceneName = temp1.name;
        const sceneId = temp1.name;
        Object.keys(temp1).map((key1) => {
          if (temp1[key1].constructor === Array) {
            triggersNew.push({
              id,
              trigger_id: `${temp1[key1][0]}-${temp1[key1][2]}`,
              eventType: temp1[key1][0],
              songName: temp1[key1][1],
              // position: getTime(temp1[key1][2]),
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
      console.log('triggersNew', triggersNew);
      addToQLCTriggerList(triggersNew, 'create');
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
      field: 'eventType',
      headerName: 'Event Type',
      width: 100,
    },
    {
      field: 'trigger',
      headerName: 'Event Trigger (If This)',
      width: 300,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'payload',
      headerName: 'Payload (Do This)',
      width: 300,
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
            onClick={() => console.log('coming soon...')}
          >
            <PlayCircleFilled fontSize="inherit" />
          </IconButton>
          {/* TO DO!
           If trigger=true enabled then tick button 
           else disabled=false = X button */}
          <IconButton
            aria-label="playstart"
            color="inherit"
            onClick={() => console.log('coming soon... Enable trigger')}
          >
            <CheckCircleIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="playstart"
            color="inherit"
            onClick={() => console.log('coming soon... Disable trigger')}
          >
            <CancelIcon fontSize="inherit" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const rows = QLCTriggersList || [{ id: 1 }];

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
        sx={{
          boxShadow: 2,
          color: '#fff',
          border: 1,
          borderColor: '#666',
        }}
        columns={columns}
        rows={rows}
      />
    </div>
  );
}
