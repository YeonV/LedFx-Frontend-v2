/* eslint-disable no-console */
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// GridRowParams
// import { useTheme } from '@mui/material/styles';
import { DeleteForever } from '@material-ui/icons';
import { useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import { Stack, Switch } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

import { Edit } from '@mui/icons-material';
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
  const QLCTriggersList = useStore((state) => state.qlc.qlcTriggersList);
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
        const sceneName = temp1[1].scene_name;
        const sceneId = temp1[1].scene_name;
        console.log('test', sceneId);
        if (temp1.constructor === Array) {
          triggersNew.push({
            id,
            trigger: `scene_activated: ${sceneName}`,
            qlc_string:
              'ID: 34, Type: Button, Name: Medium colour cycle (138 bpm)',
            eventId: temp1[1],
            sceneId,
            sceneName,
            eventName: temp1[1].scene_name,
            qlc_id: temp1[3],
            qlc_widgetType: temp1[3],
            qlc_name: temp1[3],
            qlc_value: 255,
          });
          id += 1;
        }
        return triggersNew;
      });
      console.log('QLC triggersNew', triggersNew);
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
      field: 'trigger',
      headerName: 'Trigger Event Type & Name (If This)',
      width: 350,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'qlc_string',
      headerName: 'QLC+ Widget (Do This)',
      width: 500,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'qlc_value',
      headerName: 'QLC+ Value',
      width: 150,
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
          <Switch
            checked={params.row.activated}
            color="primary"
            aria-label="Enable/Disable Trigger"
            onChange={() => {
              console.log(console.log('Enable/Disable trigger coming soon...'));
            }}
          />
          <IconButton
            aria-label="Edit"
            color="inherit"
            onClick={() => console.log('coming soon...')}
          >
            <Edit fontSize="inherit" />
          </IconButton>
          <Popover
            variant="text"
            color="inherit"
            icon={<DeleteForever />}
            style={{ minWidth: 40 }}
            onConfirm={() => {
              deleteTriggerHandler(params);
            }}
          />
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
