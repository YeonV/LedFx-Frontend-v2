import { useEffect } from 'react'
import useStore from '../store/useStore'
import { useSubscription } from '../utils/Websocket/WebSocketProvider'

/**
 * Loads the backend Now Playing config so the per-row engine switches can
 * resolve their effective engine.
 *
 * Every write goes through useEngineRow, which updates this same config, so
 * there is nothing to push here - only reads. It matters because a section
 * reported as enabled means the core is driving those virtuals right now, and
 * this browser has to stand down whatever it would have preferred.
 */
const useNowPlayingEngine = () => {
  const getNowPlaying = useStore((state) => state.getNowPlaying)
  const currentTrack = useStore((state) => state.spotify.currentTrack)

  // Re-read on every track change as well as on mount: the artwork gradients
  // the core extracted are part of this payload, and a preview frozen at the
  // moment the widget opened would show the wrong album's colours.
  useEffect(() => {
    getNowPlaying()
  }, [getNowPlaying, currentTrack])

  // A variant switched elsewhere produces no track change, so this event is the
  // only signal for it - and it also fires when artwork lands late.
  useSubscription('now_playing_gradient_changed', () => {
    getNowPlaying()
  })
}

export default useNowPlayingEngine
