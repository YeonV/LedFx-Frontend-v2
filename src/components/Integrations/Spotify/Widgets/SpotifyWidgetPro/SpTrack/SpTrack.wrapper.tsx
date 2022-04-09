import useStore from '../../../../../../utils/apiStore';
import SpTrack from './SpTrack';

export default function SpTrackWrapper({ className }: any) {
  const spotifyData = useStore(
    (state) => (state as any).spotifyData.playerState
  );
  const title = spotifyData?.track_window?.current_track?.name || 'Not playing';
  const image =
    spotifyData?.track_window?.current_track?.album.images[0].url ||
    'https://github.com/LedFx/LedFx/raw/master/icons/discord.png';
  const artist = spotifyData?.track_window?.current_track?.artists || [
    { name: 'on LedFx' },
  ];
  const album = spotifyData?.track_window?.current_track?.album.name || '';

  return (
    <SpTrack
      title={title}
      image={image}
      artist={
        artist?.length > 1
          ? artist.map((art: any) => art.name).join(',')
          : artist?.[0].name || 'Nothing Playing'
      }
      album={album}
      className={className}
    />
  );
}
