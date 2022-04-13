import useStore from '../../../../../../utils/apiStore';
import SpControls from './SpControls';

export default function SpControlsWrapper({ className }: any) {
  const spotifyData = useStore(
    (state) => (state as any).spotifyData.playerState
  );
  const duration = spotifyData?.duration || 0;
  const paused = spotifyData?.paused || false;
  const repeat_mode = spotifyData?.repeat_mode || 0;
  const shuffle = spotifyData?.shuffle || false;
  const hijack = spotifyData?.track_window?.current_track?.album.name || '';

  const spotifyDevice = useStore((state) => (state as any).spotifyDevice);
  const spotifyVol = useStore((state) => (state as any).spotifyVol);
  const setSpotifyVol = useStore((state) => (state as any).setSpotifyVol);
  const spotifyPos = useStore((state) => (state as any).spotifyPos);
  const setSpotifyPos = useStore((state) => (state as any).setSpotifyPos);
  const thePlayer = useStore((state) => (state as any).thePlayer);

  const setVol = (vol: number) =>
    thePlayer.current
      .setVolume(vol)
      .then(() =>
        thePlayer.current.getVolume().then((v: any) => setSpotifyVol(v))
      );
  return (
    <SpControls
      duration={duration}
      paused={paused}
      repeat_mode={repeat_mode}
      shuffle={shuffle}
      hijack={hijack}
      spotifyDevice={spotifyDevice}
      spotifyVol={spotifyVol}
      spotifyPos={spotifyPos}
      setSpotifyPos={setSpotifyPos}
      thePlayer={thePlayer}
      setVol={setVol}
      className={className}
    />
  );
}
