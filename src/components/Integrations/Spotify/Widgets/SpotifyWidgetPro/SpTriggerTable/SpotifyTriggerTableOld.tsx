// import { useEffect } from 'react';
// import withStyles from '@material-ui/core/styles/withStyles';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
} from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
// import useStore from '../../../../../utils/apiStore';

export default function SpotifyTriggerTableOld() {
  // const getSpotifyTriggers = useStore(
  //   (state) => (state as any).getSpotifyTriggers
  // );
  // const spotifytriggers = useStore((state) => (state as any).spotifytriggers);
  // const reportWebVitals = (onPerfEntry: any) => {
  //   useEffect(() => {
  //     getSpotifyTriggers('spotify').then(
  //       console.log('Spotify trigger', spotifytriggers)
  //     );
  //   }, []);

  return (
    <div>
      <List>
        <ListItem>
          <Grid container>
            <Grid item xs={3}>
              <ListItemText primary="Song" secondary="Song and Artist" />
            </Grid>
            <Grid item xs={3}>
              <ListItemText
                primary="Time"
                secondary="Song time the scene will be triggered"
              />
            </Grid>
            <Grid item xs={3}>
              <ListItemText primary="Scene" secondary="Scene to Activate" />
            </Grid>
            <ListItem>
              <Grid container>
                <Grid item xs={3}>
                  <ListItemText primary="Losing It - FISHER" />
                </Grid>
                <Grid item xs={3}>
                  <ListItemText primary="01:15" />
                </Grid>
                <Grid item xs={3}>
                  <ListItemText primary="Red" />
                </Grid>
                <Grid item xs={1}>
                  <ListItemIcon>
                    <DeleteForever
                      color="error"
                      onClick={() => {
                        // deleteSpotifyTrigger('spotify', {
                        //   data: {
                        //     trigger_id: trigger.trigger_id,
                        //   },
                        // });
                        console.error('Trigger deleted');
                        // spotifytriggers.setState({
                        //   triggers: spotifytriggers.filter(
                        //     (x) => x.trigger_id !== trigger.trigger_id
                        //   ),
                        // });
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </ListItemIcon>
                </Grid>
              </Grid>
            </ListItem>
          </Grid>
        </ListItem>
        <Divider />
      </List>
    </div>
  );
}
