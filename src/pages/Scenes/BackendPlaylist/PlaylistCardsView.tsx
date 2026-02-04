import { Box, Card, Grid, Typography, useTheme } from '@mui/material'
import { AddCircleOutline } from '@mui/icons-material'
import PlaylistCard from '../PlaylistCard'
import useStyles from '../Scenes.styles'

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

  return (
    <Box sx={{ mt: 4, textAlign: 'center', width: '100%' }}>
      <Grid container justifyContent="start" spacing={1}>
        {Object.values(playlists).map((playlist: any) => (
          <PlaylistCard
            key={playlist.id}
            playlistId={playlist.id}
            playlist={playlist}
            order={0}
            handleStartPlaylist={onStartPlaylist}
            handleEditPlaylist={onEditPlaylist}
            isActive={currentPlaylist === playlist.id}
            classes={classes}
          />
        ))}
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
