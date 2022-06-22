/* eslint-disable no-console */
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { useTheme } from '@mui/material/styles';
import { DeleteForever } from '@material-ui/icons';
import { useEffect } from 'react';
import useStore from '../../../../../store/useStore';

export default function SpotifyTriggerTable() {
  const integrations = useStore((state) => state.integrations);
  const spTriggersList = useStore((state) => state.spotify.spTriggersList);
  const deleteSpTrigger = useStore((state) => state.deleteSpTrigger);
  const getSpTriggers = useStore((state) => state.getSpTriggers);
  const addToSpTriggerList = useStore((state) => state.addToSpTriggerList);

  useEffect(() => {
    getSpTriggers('spotify');
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
      triggersNew.length = 0;
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

  // const getSpTriggers = useStore(
  //   (state) => (state as any).getSpTriggers
  // );
  // const spotifytriggers = useStore((state) => (state as any).spotifytriggers);
  // // const theme = useTheme();

  // useEffect(() => {
  //   getSpTriggers('spotify').then(
  //     console.log('Spotify trigger', spotifytriggers)
  //   );
  // }, []);

  // const deleteSpTrigger = useStore(
  //   (state) => (state as any).deleteSpTrigger
  // );

  const deleteTriggerHandler = (paramsTemp: any) => {
    deleteSpTrigger({
      data: {
        trigger_id: paramsTemp?.row?.trigger_id,
      },
    });
    // setTimeout(() => {
    //   getIntegrations();
    // }, 500);
    console.log('delete', paramsTemp?.row?.trigger_id);
  };
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'songName',
      headerName: 'Song',
      width: 300,
    },
    {
      field: 'position',
      headerName: 'Position',
      width: 300,
    },

    {
      field: 'sceneId',
      headerName: 'Scene Trigger',
      width: 300,
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 300,
      renderCell: (params: any) => (
        <DeleteForever
          color="error"
          onClick={(e) => {
            e.preventDefault();
            deleteTriggerHandler(params);
          }}
          style={{ cursor: 'pointer' }}
        />
      ),
    },
  ];

  const rows = spTriggersList || [{ id: 1 }];

  return (
    <div
      style={{
        display: 'flex',
        height: 400,
        width: '100%',
      }}
    >
      <DataGrid
        style={{
          color: '#fff',
        }}
        columns={columns}
        rows={rows}
      />
    </div>
  );
}
