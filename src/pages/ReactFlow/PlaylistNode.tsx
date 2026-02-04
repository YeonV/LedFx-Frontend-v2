import useStore from '../../store/useStore'
import PlaylistCard from '../Scenes/PlaylistCard'

const PlaylistNode = ({ id }: { id: string }) => {
  const playlists = useStore((state) => state.playlists)
  const playlist = id.startsWith('pl-') ? playlists[id.replace('pl-', '')] : playlists[id]
  const startPlaylist = useStore((state) => state.startPlaylist)
  const stopPlaylist = useStore((state) => state.stopPlaylist)
  const getPlaylistState = useStore((state) => state.getPlaylistState)
  const setCurrentPlaylist = useStore((state) => state.setCurrentPlaylist)

  const handleStartPlaylist = async (playlistId: string) => {
    await stopPlaylist()
    await startPlaylist(playlistId)
    setCurrentPlaylist(playlistId)
    getPlaylistState()
  }

  return (
    <div style={{ width: 250 }}>
      <PlaylistCard
        flow
        classes={{}}
        order={0}
        playlist={playlist}
        playlistId={id}
        handleStartPlaylist={handleStartPlaylist}
        handleEditPlaylist={() => {
          console.log('Edit playlist')
        }}
      />
    </div>
  )
}

export default PlaylistNode
