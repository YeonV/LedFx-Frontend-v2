import { createContext, useEffect, useMemo, useState } from 'react';

import { SpotifyState } from '../../../store/ui/SpotifyState';
import useStore from '../../../store/useStore';
import { spotifyPlay } from '../../../utils/spotifyProxies';
import { log } from '../../../utils/helpers';

export interface ControlSpotify {
  togglePlay: () => void;
  stop: () => void;
  // eslint-disable-next-line no-unused-vars
  setPos: (pos: number) => void;
  next: () => void;
  prev: () => void;
  // eslint-disable-next-line no-unused-vars
  setVol: (vol: number) => void;
}

export const SpotifyStateContext = createContext<SpotifyState | undefined>(
  undefined
);

export const SpotifyVolumeContext = createContext<number>(1);

export const ControlSpotifyContext = createContext<ControlSpotify>({
  togglePlay: () => undefined,
  stop: () => undefined,
  setPos: () => undefined,
  next: () => undefined,
  prev: () => undefined,
  setVol: () => undefined,
});

interface ISpotifyProviderProps {
  children: JSX.Element[] | JSX.Element;
}

const SpotifyProvider = ({ children }: ISpotifyProviderProps) => {
  const [spotifyState, setSpotifyState] = useState<SpotifyState | undefined>(
    undefined
  );
  const [volume, setVolume] = useState<number>(1);
  const setSpotifyDevice = useStore((state) => state.setSpDevice);
  const setPlayer = useStore((state) => state.setPlayer);
  const player = useStore((state) => state.spotify.player);
  const spotifyAuthToken = useStore((state) => state.spotify.spotifyAuthToken);

  const controlSp: ControlSpotify = useMemo(
    () => ({
      togglePlay: () => {
        if (spotifyState)
          setSpotifyState({ ...spotifyState, paused: !spotifyState.paused });
        player?.togglePlay();
      },
      stop: () => player?.stop(),
      setPos: (pos) => player?.seek(pos),
      next: () => player?.nextTrack(),
      prev: () => {
        player?.previousTrack();
      },
      setVol: (vol) => {
        setVolume(vol);
        player.setVolume(vol);
      },
    }),
    [player, spotifyState]
  );

  useEffect(() => {
    if (!player) {
      setSpotifyState(undefined);
      return () => '' as any;
    }

    const update = setInterval(() => {
      player.getCurrentState().then((state: any) => {
        setSpotifyState(state);
      });
      player.getVolume().then((v: number) => setVolume(v));
    }, 1000);

    return () => clearInterval(update);
  }, [player]);

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
            console.log('YZ', state);
            if (state !== null) {
              setSpotifyState(state);
              new_player
                .getVolume()
                .then((v: number) => setSpotifyState({ ...state, volume: v }));
            } else {
              setSpotifyState(undefined);
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
    <SpotifyVolumeContext.Provider value={volume}>
      <SpotifyStateContext.Provider value={spotifyState}>
        <ControlSpotifyContext.Provider value={controlSp}>
          {children}
        </ControlSpotifyContext.Provider>
      </SpotifyStateContext.Provider>
    </SpotifyVolumeContext.Provider>
  );
};

export default SpotifyProvider;
