// import { useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { useTheme } from '@mui/material/styles';
import { DeleteForever } from '@material-ui/icons';
// import useStore from '../../../../../../utils/apiStore';

export default function SpotifyTriggerTable() {
  // const getSpotifyTriggers = useStore(
  //   (state) => (state as any).getSpotifyTriggers
  // );
  // const spotifytriggers = useStore((state) => (state as any).spotifytriggers);
  // // const theme = useTheme();

  // useEffect(() => {
  //   getSpotifyTriggers('spotify').then(
  //     console.log('Spotify trigger', spotifytriggers)
  //   );
  // }, []);

  // const deleteSpotifyTrigger = useStore(
  //   (state) => (state as any).deleteSpotifyTrigger
  // );

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'Song',
      headerName: 'Song',
      width: 200,
    },
    {
      field: 'Position',
      headerName: 'Position',
      width: 200,
    },
    {
      field: 'SceneTrigger',
      headerName: 'Scene Trigger',
      width: 200,
    },
  ];

  const rows = [
    {
      id: 1,
      Song: 'Losing It - FISHER',
      Position: '01:15',
      SceneTrigger: 'Red',
    },
  ];

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
      <DeleteForever
        onClick={() => {
          // deleteSpotifyTrigger('spotify', {
          // data: {
          // trigger_id: trigger.trigger_id,
          // },
          console.log('delete');
        }}
      />
    </div>
  );
}
