import { useEffect } from 'react'
import useStore from '../store/useStore'
import { Ledfx } from '../api/ledfx'
import { useSubscription } from '../utils/Websocket/WebSocketProvider'

const NOW_PLAYING_ASSET_PREFIX = 'now_playing/'

interface SongPayload {
  title?: string
  artist?: string
  album?: string
  thumbnail?: string | null
  position?: number | null
  duration?: number | null
  playing?: boolean | null
  timestamp?: number | null
}

const buildSongProtocolUrl = ({
  title,
  artist,
  thumbnail,
  position,
  duration,
  playing,
  timestamp
}: SongPayload): string => {
  const songTitle = `${artist} - ${title}`

  // now_playing/ paths are already assets-relative and live in a subdirectory:
  // stripping them to a basename would point at a file that does not exist.
  const thumbnailFilename = thumbnail
    ? thumbnail.startsWith(NOW_PLAYING_ASSET_PREFIX)
      ? thumbnail
      : thumbnail.split(/[/\\]/).pop()
    : ''

  let protocolUrl = `ledfx://song/ledfxcc/${encodeURIComponent(songTitle)}`
  if (thumbnailFilename) {
    protocolUrl += `/${thumbnailFilename}`
  }

  const params = new URLSearchParams()
  if (position !== null && position !== undefined) params.append('position', String(position))
  if (duration !== null && duration !== undefined) params.append('duration', String(duration))
  if (playing !== null && playing !== undefined) params.append('playing', String(playing))
  if (timestamp !== null && timestamp !== undefined) params.append('timestamp', String(timestamp))

  if (params.toString()) {
    protocolUrl += `?${params.toString()}`
  }

  return protocolUrl
}

const useAppSubscriptions = () => {
  const showSnackbar = useStore((state) => state.ui.showSnackbar)
  const setProtoCall = useStore((state) => state.setProtoCall)
  const getAudioDevices = useStore((state) => state.getAudioDevices)

  useSubscription('audio_device_list_changed', () => {
    getAudioDevices() // Refresh audio devices list and active device index
  })
  useSubscription('show_message', (e: any) => {
    showSnackbar(e.type, e.message)
  })
  useSubscription('scene_activated', (e: any) => {
    showSnackbar('info', 'Scene activated: ' + e.scene_id)
  })
  useSubscription('song_detected', (e: any) => {
    setProtoCall(buildSongProtocolUrl(e))
  })

  // song_detected is fire-and-forget: a browser that connects mid-track hears
  // nothing until the next one. Replay it once through the same handler.
  useEffect(() => {
    let cancelled = false
    const catchUp = async () => {
      const resp = await Ledfx('/api/now-playing', 'GET', undefined, false)
      const metadata = resp?.metadata
      if (cancelled || !metadata?.title) return

      const cacheKey: string | undefined = resp?.artwork?.cache_key
      const thumbnail = cacheKey
        ? `${NOW_PLAYING_ASSET_PREFIX}${cacheKey.replace(/\\/g, '/').split('/').pop()}`
        : null

      setProtoCall(
        buildSongProtocolUrl({
          title: metadata.title,
          artist: metadata.artist ?? '',
          album: metadata.album ?? '',
          thumbnail,
          position: metadata.position,
          duration: metadata.duration,
          playing: metadata.playing,
          timestamp: metadata.position !== null ? metadata.updated_at : null
        })
      )
    }
    catchUp()
    return () => {
      cancelled = true
    }
  }, [setProtoCall])
}

export default useAppSubscriptions
