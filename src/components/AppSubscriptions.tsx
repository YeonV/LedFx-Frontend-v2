import useStore from '../store/useStore'
import { useSubscription } from '../utils/Websocket/WebSocketProvider'

const AppSubscriptions = () => {
  const showSnackbar = useStore((state) => state.ui.showSnackbar)
  const setProtoCall = useStore((state) => state.setProtoCall)

  useSubscription('show_message', (e: any) => {
    showSnackbar(e.type, e.message)
  })
  useSubscription('scene_activated', (e: any) => {
    showSnackbar('info', 'Scene activated: ' + e.scene_id)
  })
  useSubscription('song_detected', (e: any) => {
    // Handle WebSocket song_detected event by converting to protocol format
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { title, artist, album, thumbnail, position, duration, playing, timestamp } = e

    // Format as protocol URL to reuse existing handler logic
    const songTitle = `${artist} - ${title}`
    const thumbnailFilename = thumbnail ? thumbnail.split(/[/\\]/).pop() : ''

    // Build protocol URL with query params
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

    // Trigger existing protocol handler
    setProtoCall(protocolUrl)
  })
  return null
}

export default AppSubscriptions
