/* eslint-disable no-console */
import { Fab } from '@material-ui/core';
import { useEffect, useState, useRef } from 'react';
import BladeIcon from '../../Icons/BladeIcon/BladeIcon';
import useStore from '../../../utils/apiStore';
import { spotifyPlay } from '../../../utils/spotifyProxies';
import SpotifyWidgetPro from './Widgets/SpotifyWidgetPro/SpWidgetPro';

const SpotifyFabPro = ({ botHeight }: any) => {
  const { spotifyAuthToken }: any = useStore((state: any) => state);
  const { spotifyData }: any = useStore((state: any) => state);
  const { setSpotifyData }: any = useStore((state: any) => state);
  const { setSpotifyDevice }: any = useStore((state: any) => state);
  const { spotifyVol, setSpotifyVol }: any = useStore((state: any) => state);
  const thePlayer = useStore((state) => (state as any).thePlayer);
  const [floatingWidget, setFloatingWidget] = useState(false);
  const setSpotifyPos = useStore((state) => (state as any).setSpotifyPos);

  const position = spotifyData?.playerState?.position || 0;
  const paused = spotifyData?.playerState?.paused || false;
  const posi = useRef(position || 0);

  useEffect(() => {
    setSpotifyPos(position);
    posi.current = position;
  }, [position]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (posi.current && !paused) {
        posi.current += 1000;
        setSpotifyPos(posi.current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [position, paused]);

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
              // console.log(state);
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
          await (thePlayer.current as any).connect();
        }
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
        className="spotifyFab"
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
          onClick={() => setFloatingWidget(!floatingWidget)}
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
      {floatingWidget && <SpotifyWidgetPro drag />}
    </>
  );
};

export default SpotifyFabPro;
