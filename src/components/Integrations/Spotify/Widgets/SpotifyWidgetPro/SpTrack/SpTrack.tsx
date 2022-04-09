import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useStyle, { CoverImage } from '../SpWidgetPro.styles';

const SpTrack = ({ className, title, image, artist, album }: any) => {
  const classes = useStyle();
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
          {artist}
        </Typography>
      </Box>
    </Box>
  );
};

export default SpTrack;
