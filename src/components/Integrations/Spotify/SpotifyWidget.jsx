import useStore from '../../../utils/apiStore';
import { Fab, IconButton } from '@material-ui/core';
import { QueueMusic } from '@material-ui/icons';
import ChangeSpotifyURLDialog from './ChangeSpotifyURLDialog';
import BladeIcon from '../../Icons/BladeIcon';

const SpotifyWidget = ({
  spotifyEnabled,
  setSpotifyEnabled,
  spotifyExpanded,
  setSpotifyExpanded
}) => {

  const spotifyURL = useStore((state) => state.spotifyEmbedUrl);
  const setSpotifyURL = useStore((state) => state.setSpotifyEmbedUrl);

  return (
    <>         
      <Fab size="small" color="secondary" onClick={() => setSpotifyEnabled(!spotifyEnabled)} style={{ position: 'fixed', bottom: spotifyEnabled ? spotifyExpanded ? 363 : 143: 65, right: 10, zIndex: 2 }} >
        <BladeIcon name="mdi:spotify" />
      </Fab>        
      {spotifyEnabled && <>
      <div style={{ position: 'fixed', display: 'flex', bottom: spotifyExpanded ? 258 : 38, right: 36, zIndex: 2 }}>
        <ChangeSpotifyURLDialog spotifyURL={spotifyURL} setSpotifyURL={setSpotifyURL} />
        <IconButton onClick={() => setSpotifyExpanded(!spotifyExpanded)} >
          <QueueMusic />
        </IconButton>
      </div>
      <iframe src={`${spotifyURL.split('?')[0].replace('.com/embed/', '.com/').replace('.com/', '.com/embed/')}?theme=0`} width="100%" height={spotifyEnabled ? spotifyExpanded ? 300 : 80 : 0} style={{ position: 'fixed', bottom: 0, left: 0 }} frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      </>}
    </>
  )
}

export default SpotifyWidget
