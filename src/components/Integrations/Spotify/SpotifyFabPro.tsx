/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
import { Fab } from '@material-ui/core';
import { useEffect, useState, useRef, createContext, useMemo } from 'react';
import BladeIcon from '../../Icons/BladeIcon/BladeIcon';
import useStore from '../../../store/useStore';
import { spotifyPlay } from '../../../utils/spotifyProxies';
import SpotifyWidgetPro from './Widgets/SpotifyWidgetPro/SpWidgetPro';
import { log } from '../../../utils/helpers';
import { SpotifyState } from '../../../store/ui/SpotifyState';

const SpotifyFabPro = ({ botHeight }: any) => {
  const scenes = useStore((state) => state.scenes);
  const spTriggersList = useStore((state) => state.spotify.spTriggersList);
  const spotifyAuthToken = useStore((state) => state.spotify.spotifyAuthToken);
  const spotifyData: any = useStore((state) => state.spotify.spotifyData);
  const activateScene = useStore((state) => state.activateScene);
  const activateSceneIn = useStore((state) => state.activateSceneIn);
  const spActTriggers = useStore((state) => state.spotify.spActTriggers);
  const setSpActTriggers = useStore((state) => state.setSpActTriggers);
  const spNetworkTime = useStore((state) => state.spotify.spNetworkTime);

  const player = useStore((state) => state.spotify.player);
  const setPlayer = useStore((state) => state.setPlayer);

  // const controlSp: ControlSpotify = useMemo(
  //   () => ({
  //     togglePlay: () => player?.togglePlay(),
  //     stop: () => player?.stop(),
  //     setVol: (pos) => player?.seek(pos),
  //   }),
  //   [player]
  // );

  // const spotifyState = useStore((state) => state.spotify.spotifyState);
  const [floatingWidget, setFloatingWidget] = useState(false);

  const activeFilters = spTriggersList.filter(
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

  // useEffect(() => {
  //   const update = setInterval(() => {
  //     player.getCurrentState().then((state: any) => {
  //       setSpotifyState(state);
  //     });
  //   }, 1000);
  //   return () => clearInterval(update);
  // });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (
  //       !paused &&
  //       !!spotifyData?.playerState?.context?.metadata?.current_item?.uri.split(
  //         ':'
  //       )[2]
  //     ) {
  //       activeFilters.map((t: any) => {
  //         if (posi.current + spNetworkTime >= t.position_ms) {
  //           const scene = Object.keys(scenes).find(
  //             (s: any) => scenes[s].name === t.sceneId
  //           );
  //           if (scene) {
  //             player.getCurrentState().then((state: any) => {
  //               if (!state) {
  //                 console.error(
  //                   'User is not playing music through the Web Playback SDK'
  //                 );
  //                 return;
  //               }
  //               console.log(
  //                 'Currently Playing',
  //                 state.position,
  //                 t.position_ms,
  //                 // state.duration,
  //                 state.position - t.position_ms
  //               );
  //               if (t.position_ms - state.position > 0) {
  //                 // console.log('Activate in');

  //                 activateSceneIn(
  //                   scene,
  //                   (t.position_ms - state.position) / 1000
  //                 );
  //               } else {
  //                 // console.log('Activate now');

  //                 activateScene(scene);
  //               }

  //               activeFilters = activeFilters.filter((f: any) => f.id !== t.id);
  //               if (
  //                 JSON.stringify(activeFilters) !==
  //                 JSON.stringify(spActTriggers)
  //               ) {
  //                 setSpActTriggers(activeFilters);
  //               }
  //             });
  //           }
  //         }
  //       });

  //       posi.current += 1000;
  //       setSpotifyPos(posi.current);
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [position, paused]);

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
