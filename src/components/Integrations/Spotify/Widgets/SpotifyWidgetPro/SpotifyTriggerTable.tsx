// import Box from '@mui/material';
import { useEffect } from 'react';
import useStore from '../../../../../utils/apiStore';

export default function SpotifyTriggerTable() {
  const getSpotifyTriggers = useStore(
    (state) => (state as any).getSpotifyTriggers
  );
  const spotifytriggers = useStore((state) => (state as any).spotifytriggers);

  useEffect(() => {
    getSpotifyTriggers('spotify');

    console.log('load spotify triggers', spotifytriggers);
  }, []);

  return (
    <div>
      <div>test123</div>
    </div>
  );
}
