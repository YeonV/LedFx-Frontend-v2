/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { Fab, IconButton, Link } from '@material-ui/core';
import { QueueMusic } from '@material-ui/icons';
import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import ChangeSpotifyURLDialog from './ChangeSpotifyURLDialog';
import BladeIcon from '../../Icons/BladeIcon/BladeIcon';
import useStore from '../../../utils/apiStore';
import { spotifyPlay } from '../../../pages/Integrations/Spotify/proxies';

const SpotifyProWidget = ({
  spotifyEnabled,
  spotifyExpanded,
  setSpotifyExpanded,
  spotifyURL,
  setSpotifyURL,
  thePlayer,
  // setSpotifyEnabled,
  // setYoutubeExpanded,
  // setYoutubeEnabled,
  botHeight,
}: any) => {
  const { spotifyAuthToken }: any = useStore((state) => state);
  const { setSpotifyData }: any = useStore((state) => state);
  const { setSpotifyDevice }: any = useStore((state) => state);
  const { spotifyVol, setSpotifyVol }: any = useStore((state) => state);

  useEffect(() => {
    const createWebPlayer = async (token: string) => {
      // console.log(token);
      (window as any).onSpotifyWebPlaybackSDKReady = async () => {
        thePlayer.current = new (window as any).Spotify.Player({
          name: 'LedFX',
          getOAuthToken: (cb: any) => {
            cb(token);
          },
        });
        if (thePlayer.current) {
          (thePlayer.current as any).addListener(
            'initialization_error',
            ({ message }: any) => {
              console.error(message);
            }
          );
          (thePlayer.current as any).addListener(
            'authentication_error',
            ({ message }: any) => {
              console.error(message);
            }
          );
          (thePlayer.current as any).addListener(
            'account_error',
            ({ message }: any) => {
              console.error(message);
            }
          );
          (thePlayer.current as any).addListener(
            'playback_error',
            ({ message }: any) => {
              console.error(message);
            }
          );
          (thePlayer.current as any).addListener(
            'player_state_changed',
            (state: any) => {
              console.log(state);
              if (state !== null) {
                // if (state.position < 5 || state.position > 500) {
                // this.props.updatePlayerState(state);
                setSpotifyData('playerState', state);
                thePlayer.current
                  .getVolume()
                  .then((v: any) => v !== spotifyVol && setSpotifyVol(v));
                // }
              } else {
                // this.props.updatePlayerState({});
                setSpotifyData('playerState', {});
              }
            }
          );
          (thePlayer.current as any).addListener(
            'ready',
            ({ device_id }: any) => {
              setSpotifyDevice(device_id);
              spotifyPlay(device_id);
              // console.log('Ready with Device ID', device_id);
              // console.log(player);
            }
          );
          (thePlayer.current as any).addListener(
            'not_ready',
            ({ _device_id }: any) => {
              // console.log('Device ID has gone offline', device_id);
            }
          );
          // this.setState({ player });
          await (thePlayer.current as any).connect();
        }

        // console.log(res);
      };
      const script = window.document.createElement('script');
      script.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js');
      script.setAttribute('type', 'application/javascript');
      window.document.head.appendChild(script);
    };

    if (spotifyAuthToken && !thePlayer.current && !(window as any).Spotify) {
      createWebPlayer(spotifyAuthToken);
    }
    if (!spotifyAuthToken && thePlayer.current) {
      delete thePlayer.current;
    }
  }, [spotifyAuthToken]);
  return (
    <>
      <div
        style={{
          backgroundColor: '#0dbedc',
          position: 'fixed',
          bottom: botHeight + 105,
          right: 10,
          zIndex: 4,
        }}
      >
        <Fab
          size="small"
          color="inherit"
          // onClick={() => {
          //   setYoutubeEnabled(false);
          //   setYoutubeExpanded(false);
          //   if (spotifyEnabled && spotifyExpanded) {
          //     setSpotifyExpanded(false);
          //   }
          //   setSpotifyEnabled(!spotifyEnabled);
          // }}
          style={{
            position: 'fixed',
            bottom: botHeight + 115,
            right: 10,
            zIndex: 4,
            backgroundColor: '#1db954',
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
      </div>
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
          {/* <iframe
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
          /> */}
          <Link
            target="_blank"
            href="https://support.spotify.com/us/article/spotify-connect/"
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              height: spotifyEnabled ? (spotifyExpanded ? 300 : 80) : 0,
            }}
          >
            <Typography>
              Using Spotify Connect, select LedFX <InfoIcon />
            </Typography>
          </Link>
        </>
      )}
    </>
  );
};

export default SpotifyProWidget;
