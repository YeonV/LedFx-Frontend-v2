import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useStyle from './SpWidgetPro.styles';
import SpControls from './SpControls';
import SpTrack from './SpTrack';
import SpVolume from './SpVolume';
import SpSceneTrigger from './SpSceneTrigger';
import useStore from '../../../../../utils/apiStore';
import SpLayoutButtons from './SpLayoutButtons';
import SpFloating from './SpFloating';

const SpotifyWidgetPro = ({ drag }: any) => {
  const classes = useStyle();
  const swSize = useStore((state) => (state as any).swSize);

  return (
    <Box component={drag ? SpFloating : undefined}>
      <div className={classes.Widget}>
        <Box className={`${classes.spWrapper} ${drag ? swSize : ''}`}>
          <SpTrack className={`${classes.spTrack} ${drag ? swSize : ''}`} />
          <SpControls className={`${drag ? swSize : ''}`} />
          <Stack className={`${classes.spDeskVol} ${drag ? swSize : ''}`}>
            <Stack direction="row">
              {drag && <SpLayoutButtons />}
              <SpSceneTrigger />
            </Stack>
            <SpVolume />
          </Stack>
        </Box>
      </div>
    </Box>
  );
};

export default SpotifyWidgetPro;
