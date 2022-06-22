import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useStore from '../../../../../store/useStore';
import useStyle, { CoverImage } from './SpWidgetPro.styles';

export default function SpTrack({ className }: any) {
  const classes = useStyle();
  const playerState = useStore(
    (state: any) => state.spotify.spotifyData.playerState
  );

  const title = playerState?.track_window?.current_track?.name || 'Not playing';
  const image =
    playerState?.track_window?.current_track?.album.images[0].url ||
    'https://github.com/LedFx/LedFx/raw/master/icons/discord.png';
  const artist = playerState?.track_window?.current_track?.artists || [
    { name: 'on LedFx' },
  ];
  const album = playerState?.track_window?.current_track?.album.name || '';

  return (
    <Box className={className}>
      <CoverImage className={classes.albumImg}>
        <img alt="album_image" src={image} />
      </CoverImage>
      <Box sx={{ ml: 1.5, minWidth: 0 }}>
        <Typography
          variant="body2"
          color="rgba(255,255,255,0.7)"
          fontSize={10}
          noWrap
        >
          {album}
        </Typography>
        <Typography noWrap>
          <b>{title}</b>
        </Typography>
        <Typography noWrap letterSpacing={-0.25} color="rgba(255,255,255,0.8)">
          {artist.length > 1
            ? artist.map((art: any) => art.name).join(',')
            : artist[0].name}
        </Typography>
      </Box>
    </Box>
  );
}
