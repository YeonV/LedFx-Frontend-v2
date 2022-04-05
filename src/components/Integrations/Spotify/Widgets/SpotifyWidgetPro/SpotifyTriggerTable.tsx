// import Box from '@mui/material';
import useStore from '../../../../../utils/apiStore';

export default function SpotifyTriggerTable() {
  const spotifytriggers = useStore((state) => (state as any).spotify);
  return (
    console.log('load spotify triggers', spotifytriggers),
    (
      <div>
        <div>test123</div>
      </div>
    )
  );
}
