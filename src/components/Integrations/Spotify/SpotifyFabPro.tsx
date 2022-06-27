/* eslint-disable array-callback-return */
/* eslint-disable no-console */
import { Fab } from '@material-ui/core';
import { useEffect, useState, useRef } from 'react';
import BladeIcon from '../../Icons/BladeIcon/BladeIcon';
import useStore from '../../../store/useStore';
import { spotifyPlay } from '../../../utils/spotifyProxies';
import SpotifyWidgetPro from './Widgets/SpotifyWidgetPro/SpWidgetPro';
import { log } from '../../../utils/helpers';

const SpotifyFabPro = ({ botHeight }: any) => {
  const scenes = useStore((state) => state.scenes);
  const spTriggersList = useStore((state) => state.spotify.spTriggersList);
  const spotifyAuthToken = useStore((state) => state.spotify.spotifyAuthToken);
  const spotifyData: any = useStore((state) => state.spotify.spotifyData);
  const setSpotifyData = useStore((state) => state.setSpData);
  const setSpotifyDevice = useStore((state) => state.setSpDevice);
  const spotifyVol = useStore((state) => state.spotify.spotifyVol);
  const setSpotifyVol = useStore((state) => state.setSpVol);
  const setSpotifyPos = useStore((state) => state.setSpPos);
  const activateScene = useStore((state) => state.activateScene);
  const activateSceneIn = useStore((state) => state.activateSceneIn);
  const spActTriggers = useStore((state) => state.spotify.spActTriggers);
  const setSpActTriggers = useStore((state) => state.setSpActTriggers);
  const spNetworkTime = useStore((state) => state.spotify.spNetworkTime);

  const [floatingWidget, setFloatingWidget] = useState(false);

  const player = useStore((state) => state.spotify.player);
  const setPlayer = useStore((state) => state.setPlayer);

  const position = spotifyData?.playerState?.position || 0;
  const paused = spotifyData?.playerState?.paused || false;
  const posi = useRef(position || 0);

  let activeFilters = spTriggersList.filter(
    (l: any) =>
      l.songId ===
      spotifyData?.playerState?.context?.metadata?.current_item?.uri.split(
        ':'
      )[2]
  );

  useEffect(() => {
    setSpActTriggers(
      spTriggersList.filter(
        (l: any) =>
          l.songId ===
          spotifyData?.playerState?.context?.metadata?.current_item?.uri.split(
            ':'
          )[2]
      )
    );
  }, [
    spotifyData?.playerState?.context?.metadata?.current_item?.uri.split(
      ':'
    )[2],
  ]);

  useEffect(() => {
    setSpotifyPos(position);
    posi.current = position;
  }, [position]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        !paused &&
        !!spotifyData?.playerState?.context?.metadata?.current_item?.uri.split(
          ':'
        )[2]
      ) {
        activeFilters.map((t: any) => {
          if (posi.current + spNetworkTime >= t.position_ms) {
            const scene = Object.keys(scenes).find(
              (s: any) => scenes[s].name === t.sceneId
            );
            if (scene) {
              player.getCurrentState().then((state: any) => {
                if (!state) {
                  console.error(
                    'User is not playing music through the Web Playback SDK'
                  );
                  return;
                }
                console.log(
                  'Currently Playing',
                  state.position,
                  t.position_ms,
                  state.duration,
                  state.position - t.position_ms
                );
                if (t.position_ms - state.position > 0) {
                  activateSceneIn(
                    scene,
                    (t.position_ms - state.position) / 1000
                  );
                } else {
                  activateScene(scene);
                }

                activeFilters = activeFilters.filter((f: any) => f.id !== t.id);
                if (
                  JSON.stringify(activeFilters) !==
                  JSON.stringify(spActTriggers)
                ) {
                  setSpActTriggers(activeFilters);
                }
              });
            }
          }
        });

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
        const new_player = new (window as any).Spotify.Player({
          name: 'LedFX',
          getOAuthToken: (cb: any) => {
            cb(token);
          },
        });
        setPlayer(new_player);
        if (new_player) {
          new_player.addListener('initialization_error', ({ message }: any) => {
            console.error(message);
          });
          new_player.addListener('authentication_error', ({ message }: any) => {
            console.error(message);
          });
          new_player.addListener('account_error', ({ message }: any) => {
            console.error(message);
          });
          new_player.addListener('playback_error', ({ message }: any) => {
            console.error(message);
          });
          new_player.addListener('player_state_changed', (state: any) => {
            // console.log('YZ', state);
            if (state !== null) {
              setSpotifyData('playerState', state);
              new_player
                .getVolume()
                .then((v: any) => v !== spotifyVol && setSpotifyVol(v));
            } else {
              setSpotifyData('playerState', {});
            }
          });
          new_player.addListener('ready', ({ device_id }: any) => {
            setSpotifyDevice(device_id);
            spotifyPlay(device_id);
            log('successSpotify connected');
          });
          new_player.addListener('not_ready', ({ _device_id }: any) => {
            log('errorSpotify disconnected');
            // console.log('Device ID has gone offline', device_id);
          });
          await new_player.connect();
        }
      };
      const script = window.document.createElement('script');
      script.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js');
      script.setAttribute('type', 'application/javascript');
      window.document.head.appendChild(script);
    };

    if (spotifyAuthToken && !player && !(window as any).Spotify) {
      createWebPlayer(spotifyAuthToken);
    }
    if (!spotifyAuthToken && player) {
      setPlayer(undefined);
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
