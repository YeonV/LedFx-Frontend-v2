import { LyricLine } from 'lrclib-api'

const CACHE_KEY = 'ledfx_lyrics_cache'
const MAX_CACHE_SIZE = 50

interface CachedEntry {
  artist: string
  title: string
  synced: LyricLine[] | null
  plain: string | null
  timestamp: number
}

export const getLyricsCache = (): CachedEntry[] => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    return cached ? JSON.parse(cached) : []
  } catch (e) {
    console.error('Failed to load lyrics cache:', e)
    return []
  }
}

export const saveLyricsToCache = (
  artist: string,
  title: string,
  synced: LyricLine[] | null,
  plain: string | null
) => {
  try {
    const cache = getLyricsCache()
    // Remove existing entry for the same song if it exists
    const filteredCache = cache.filter(
      (entry) =>
        entry.artist.toLowerCase() !== artist.toLowerCase() ||
        entry.title.toLowerCase() !== title.toLowerCase()
    )

    const newEntry: CachedEntry = {
      artist,
      title,
      synced,
      plain,
      timestamp: Date.now()
    }

    const updatedCache = [newEntry, ...filteredCache].slice(0, MAX_CACHE_SIZE)
    localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache))
  } catch (e) {
    console.error('Failed to save to lyrics cache:', e)
  }
}

export const findLyricsInCache = (artist: string, title: string) => {
  const cache = getLyricsCache()
  return cache.find(
    (entry) =>
      entry.artist.toLowerCase() === artist.toLowerCase() &&
      entry.title.toLowerCase() === title.toLowerCase()
  )
}

export const clearLyricsCache = () => {
  localStorage.removeItem(CACHE_KEY)
}
