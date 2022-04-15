import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useStyle from './SpWidgetPro.styles';
import useStore from '../../../../../utils/apiStore';
import SpControlsWrapper from './SpControls/SpControls.wrapper';
import SpTrackWrapper from './SpTrack/SpTrack.wrapper';
import SpVolume from './SpVolume/SpVolume';
import SpSceneTrigger from './SpSceneTrigger/SpSceneTrigger';
import SpLayoutButtons from './SpLayoutButtons';
import SpFloating from './SpFloating';

const SpotifyWidgetPro = ({ drag }: any) => {
  const classes = useStyle();
  const swSize = useStore((state) => (state as any).swSize);

  return (
    <Box component={drag ? SpFloating : undefined}>
      <div className={classes.Widget}>
        <Box className={`${classes.spWrapper} ${drag ? swSize : ''}`}>
          <SpTrackWrapper
            className={`${classes.spTrack} ${drag ? swSize : ''}`}
          />
          <SpControlsWrapper className={`${drag ? swSize : ''}`} />
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
