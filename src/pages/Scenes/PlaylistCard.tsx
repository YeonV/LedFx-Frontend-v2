import { Card, CardActionArea, CardActions, Typography, useTheme, Grid } from '@mui/material'
import SceneImage from './ScenesImage'
import { PlaylistConfig } from '../../api/ledfx.types'
import PlaylistCardMenu from './PlaylistCardMenu'

interface PlaylistCardProps {
  playlistId: string
  playlist: PlaylistConfig
  order: number

  handleStartPlaylist: (id: string) => void

  handleEditPlaylist: (id: string) => void
  isActive?: boolean
  classes: any
}

const PlaylistCard = ({
  playlistId,
  playlist,
  order,
  handleStartPlaylist,
  handleEditPlaylist,
  isActive = false,
  classes
}: PlaylistCardProps) => {
  const theme = useTheme()

  return (
    <Grid
      key={playlistId}
      mt={['0.5rem', '0.5rem', 0, 0, 0]}
      p="8px !important"
      order={order}
    >
      <Card
        className={classes.root}
        sx={{
          border: '1px solid',
          borderColor: isActive ? theme.palette.primary.main : theme.palette.divider,
          position: 'relative'
        }}
      >
        <CardActionArea
          style={{
            background: theme.palette.background.default
          }}
          onClick={() => handleStartPlaylist(playlistId)}
        >
          <SceneImage iconName={playlist?.image || 'QueueMusic'} />

          {/* Active/Playing indicator */}
          {/* {isActive && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <PlaylistPlay
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 24,
                  animation: isPlaying ? 'pulse 2s infinite' : 'none'
                }}
              />
            </div>
          )} */}

          {/* Tags */}
          {/* <div style={{ position: 'absolute', top: 0, right: 0 }}>
            {playlist.tags?.map(
              (tag: string) =>
                tag.length > 0 && (
                  <Chip
                    variant="filled"
                    label={tag}
                    key={tag}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: theme.palette.background.paper,
                      border: '1px solid',
                      borderColor: theme.palette.text.disabled,
                      m: 0.5
                    }}
                  />
                )
            )}
          </div> */}

          {/* Playlist info chips */}
          {/* <div style={{ position: 'absolute', bottom: 48, left: 8 }}>
            <Stack direction="row" spacing={0.5}>
              <Chip
                size="small"
                label={`${playlist.items?.length || 0} scenes`}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  border: '1px solid',
                  borderColor: theme.palette.text.disabled
                }}
              />
              <Chip
                size="small"
                icon={playlist.mode === 'shuffle' ? <QueueMusic /> : undefined}
                label={playlist.mode || 'sequence'}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  border: '1px solid',
                  borderColor: theme.palette.text.disabled
                }}
              />
            </Stack>
          </div> */}
        </CardActionArea>

        <CardActions
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography className={classes.sceneTitle} variant="h5" component="h2">
            {playlist?.name || playlistId}
          </Typography>
          {!(window.localStorage.getItem('guestmode') === 'activated') && (
            <PlaylistCardMenu
              playlistId={playlistId}
              editPlaylist={() => {
                console.log('Editing playlist:', playlistId)
                handleEditPlaylist(playlistId)
              }}
            />
          )}
        </CardActions>
      </Card>

      {/* Add CSS animation for pulse effect */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Grid>
  )
}

export default PlaylistCard
