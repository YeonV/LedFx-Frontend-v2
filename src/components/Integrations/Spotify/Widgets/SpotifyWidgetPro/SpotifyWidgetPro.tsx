import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useStyle from '../Spotify.styles';
import SpotifyControls from './SpotifyControls';
import SpotifyTrackInfo from './SpotifyTrackInfo';
import SpotifyVolume from './SpotifyVolume';
import SpotifySceneTrigger from './SpotifySceneTrigger';

export default function SpotifyWidgetLarge({ thePlayer }: any) {
  const classes = useStyle();
  return (
    <Box sx={{}}>
      <div className={classes.Widget}>
        <Box className={classes.spotifyWrapper}>
          <SpotifyTrackInfo />
          <SpotifyControls thePlayer={thePlayer} />
          <Stack className={classes.spotifyDesktopVolStyles}>
            <SpotifySceneTrigger />
            <SpotifyVolume thePlayer={thePlayer} />
          </Stack>
        </Box>
      </div>
    </Box>
  );
}
