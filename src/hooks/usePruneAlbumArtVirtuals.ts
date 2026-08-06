import { useEffect } from 'react'
import useStore from '../store/useStore'

/**
 * Drops single-row virtuals from the album-art selections.
 *
 * The selectors only offer matrix virtuals - an imagespin on one row is
 * meaningless - but the stored selections predate that rule, so an old config
 * can hold a strip the dropdown will never list again. It shows up as a target
 * that is active, cannot be re-added once removed, and does nothing useful.
 *
 * Deliberately not a store migration: `rows` lives on the core, and migrations
 * run against the persisted blob before any host has been contacted, so the
 * data this needs does not exist yet at that point.
 */
const usePruneAlbumArtVirtuals = () => {
  const virtuals = useStore((state) => state.virtuals)
  const imageVirtuals = useStore((state) => state.imageVirtuals)
  const setImageVirtuals = useStore((state) => state.setImageVirtuals)
  const spotifyImageVirtuals = useStore((state) => state.spotify.spotifyAlbumArtImageVirtuals)
  const setSpotifyImageVirtuals = useStore((state) => state.setSpotifyAlbumArtImageVirtuals)

  useEffect(() => {
    // Nothing fetched yet: every id would look unknown, and pruning on that
    // basis would wipe a perfectly good config on a slow connection.
    if (Object.keys(virtuals).length === 0) return

    // Only drop what can be positively proven to be single-row. An id missing
    // from this core's virtuals is left alone - the user may be pointed at a
    // different host and expect the selection back when they switch again.
    const isSingleRow = (id: string) => !!virtuals[id] && (virtuals[id]?.config?.rows || 1) <= 1

    const prune = (ids: string[], set: (next: string[]) => void) => {
      const kept = ids.filter((id) => !isSingleRow(id))
      // Only write on an actual change, or this effect re-triggers itself.
      if (kept.length !== ids.length) set(kept)
    }

    prune(imageVirtuals, setImageVirtuals)
    prune(spotifyImageVirtuals, setSpotifyImageVirtuals)
  }, [virtuals, imageVirtuals, spotifyImageVirtuals, setImageVirtuals, setSpotifyImageVirtuals])
}

export default usePruneAlbumArtVirtuals
