import { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { VolumeDown, VolumeMute, VolumeUp } from '@material-ui/icons';
import useStore from '../../../../../store/useStore';
import { VolSliderStyles } from './SpWidgetPro.styles';

export default function SpVolume() {
  const thePlayer = useStore((state: any) => state.spotify.thePlayer);
  const spotifyVol = useStore((state: any) => state.spotify.spotifyVol);
  const setSpotifyVol = useStore((state: any) => state.spotify.setSpotifyVol);
  const [volu, setVolu] = useState(spotifyVol || 0);
  const setVol = (vol: number) =>
    thePlayer.current
      .setVolume(vol)
      .then(() =>
        thePlayer.current.getVolume().then((v: any) => setSpotifyVol(v))
      );

  useEffect(() => {
    setVolu(spotifyVol);
  }, [spotifyVol]);

  return (
    <Stack
      spacing={2}
      direction="row"
      sx={{ width: '80%' }}
      alignItems="center"
    >
      <IconButton
        aria-label="next song"
        sx={{ marginLeft: '0 !important' }}
        onClick={() => setVol(spotifyVol === 0 ? 1 : 0)}
      >
        {spotifyVol === 0 ? (
          <VolumeMute htmlColor="rgba(255,255,255,0.4)" />
        ) : spotifyVol < 0.5 ? (
          <VolumeDown htmlColor="rgba(255,255,255,0.4)" />
        ) : (
          <VolumeUp htmlColor="rgba(255,255,255,0.4)" />
        )}
      </IconButton>
      <Slider
        aria-label="Volume"
        min={0}
        max={100}
        value={volu * 100}
        onChange={(_, v) => setVolu((v as number) / 100)}
        onChangeCommitted={(e, v: any) => setVol(v / 100)}
        sx={{ ...VolSliderStyles, '&&&': { marginLeft: 0, marginRight: 3 } }}
      />
    </Stack>
  );
}
