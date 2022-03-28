import { Fab, IconButton } from '@material-ui/core';
import { QueueMusic } from '@material-ui/icons';
import ChangeSpotifyURLDialog from './ChangeSpotifyURLDialog';
import BladeIcon from '../../Icons/BladeIcon/BladeIcon';

const SpotifyWidget = ({
  spotifyEnabled,
  setSpotifyEnabled,
  spotifyExpanded,
  setSpotifyExpanded,
  spotifyURL,
  setSpotifyURL,
  setYoutubeExpanded,
  setYoutubeEnabled,
  botHeight,
}: any) => {
  return (
    <>
      <Fab
        size="small"
        color="secondary"
        onClick={() => {
          setYoutubeEnabled(false);
          setYoutubeExpanded(false);
          if (spotifyEnabled && spotifyExpanded) {
            setSpotifyExpanded(false);
          }
          setSpotifyEnabled(!spotifyEnabled);
        }}
        style={{
          position: 'fixed',
          bottom: botHeight + 65,
          right: 10,
          zIndex: 4,
        }}
      >
        <BladeIcon
          name="mdi:spotify"
          style={{
            marginLeft: '50%',
            marginTop: '50%',
            transform: 'translate(-43%, -43%)',
            display: 'flex',
          }}
        />
      </Fab>
      {spotifyEnabled && (
        <>
          <div
            style={{
              position: 'fixed',
              display: 'flex',
              bottom: spotifyExpanded ? 258 : 38,
              right: 36,
              zIndex: 2,
            }}
          >
            <ChangeSpotifyURLDialog
              spotifyURL={spotifyURL}
              setSpotifyURL={setSpotifyURL}
            />
            <IconButton onClick={() => setSpotifyExpanded(!spotifyExpanded)}>
              <QueueMusic />
            </IconButton>
          </div>
          <iframe
            title="Spotify Embed Player"
            src={`${spotifyURL
              .split('?')[0]
              .replace('.com/embed/', '.com/')
              .replace('.com/', '.com/embed/')}?theme=0`}
            width="100%"
            height={spotifyEnabled ? (spotifyExpanded ? 300 : 80) : 0}
            style={{ position: 'fixed', bottom: 0, left: 0 }}
            frameBorder="0"
            allowTransparency
            allow="encrypted-media"
          />
        </>
      )}
    </>
  );
};

export default SpotifyWidget;
