import { useMemo, useCallback } from 'react'
import { Box, Card, Grid, Typography, useTheme } from '@mui/material'
import { AddCircleOutline } from '@mui/icons-material'
import PlaylistCard from '../PlaylistCard'
import useStyles from '../Scenes.styles'
import SortableCardGrid from '../../../components/DnD/SortableCardGrid'
import useStore from '../../../store/useStore'
import { IPlaylistOrder } from '../../../store/api/storePlaylist'

interface PlaylistCardsViewProps {
  playlists: any
  currentPlaylist: string | null
  onStartPlaylist: (playlistId: string) => void
  onEditPlaylist: (playlistId: string) => void
  onCreatePlaylist: () => void
}

export default function PlaylistCardsView({
  playlists,
  currentPlaylist,
  onStartPlaylist,
  onEditPlaylist,
  onCreatePlaylist
}: PlaylistCardsViewProps) {
  const theme = useTheme()
  const classes = useStyles()
  const playlistOrder = useStore((state) => state.playlistOrder)
  const setPlaylistOrder = useStore((state) => state.setPlaylistOrder)

  const sortedPlaylistIds = useMemo(() => {
    const ids = Object.values(playlists).map((p: any) => p.id as string)
    return ids.sort((a, b) => {
      const orderA = playlistOrder.find((o) => o.playlistId === a)?.order ?? 999
      const orderB = playlistOrder.find((o) => o.playlistId === b)?.order ?? 999
      return orderA - orderB
    })
  }, [playlists, playlistOrder])

  const handlePlaylistReorder = useCallback(
    (newIds: string[]) => {
      const newOrder: IPlaylistOrder[] = newIds.map((id, index) => ({
        playlistId: id,
        order: index
      }))
      setPlaylistOrder(newOrder)
    },
    [setPlaylistOrder]
  )

  return (
    <Box sx={{ mt: 4, textAlign: 'center', width: '100%' }}>
      <Grid container justifyContent="start" spacing={1}>
        <SortableCardGrid items={sortedPlaylistIds} onReorder={handlePlaylistReorder}>
          {(id, dragHandleProps) => (
            <PlaylistCard
              key={id}
              playlistId={id}
              playlist={playlists[id]}
              order={0}
              handleStartPlaylist={onStartPlaylist}
              handleEditPlaylist={onEditPlaylist}
              isActive={currentPlaylist === id}
              classes={classes}
              dragHandleProps={dragHandleProps}
            />
          )}
        </SortableCardGrid>
        <Grid key={'add-playlist'} mt={['0.5rem', '0.5rem', 0, 0, 0]} p="8px !important" order={99}>
          <Card
            className={classes.root}
            sx={{
              border: '1px solid',
              borderColor: theme.palette.divider,
              bgcolor: 'transparent',
              position: 'relative',
              cursor: 'pointer',
              '&:hover': { bgcolor: theme.palette.background.paper }
            }}
            onClick={onCreatePlaylist}
          >
            <Box
              sx={{
                height: 140,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: theme.palette.background.default
              }}
            >
              <AddCircleOutline color="disabled" sx={{ fontSize: 64, opacity: 0.5 }} />
            </Box>
            <Box
              sx={{
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                bgcolor: '#282829',
                p: 1
              }}
            >
              <Typography variant="h5">Add Playlist</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
