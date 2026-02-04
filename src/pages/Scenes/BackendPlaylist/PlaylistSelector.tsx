import {
  Box,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Typography,
  Tooltip
} from '@mui/material'
import { Edit, Delete, Add } from '@mui/icons-material'
import SceneImage from '../ScenesImage'
import { PlaylistSelectorProps } from './types'

export default function PlaylistSelector({
  currentPlaylist,
  playlists,
  onPlaylistChange,
  onEdit,
  onDelete,
  onCreate,
  canEdit
}: PlaylistSelectorProps) {
  return (
    <Box sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 200, flex: 1, minHeight: 56 }}>
          <Select
            disableUnderline
            value={currentPlaylist || ''}
            onChange={(e) => onPlaylistChange(e.target.value)}
            sx={{ height: 56 }}
          >
            {Object.entries(playlists).map(([id, playlist]: [string, any]) => (
              <MenuItem key={id} value={id}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SceneImage
                    iconName={playlist.image || 'QueueMusic'}
                    list
                    sx={{ height: 56, width: 50 }}
                  />
                  <Typography>{playlist?.name}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {currentPlaylist && (
          <Tooltip title="Edit Playlist">
            <span>
              <IconButton disabled={!canEdit} onClick={onEdit}>
                <Edit />
              </IconButton>
            </span>
          </Tooltip>
        )}

        {currentPlaylist && (
          <Tooltip title="Delete Playlist">
            <IconButton onClick={onDelete} color="error">
              <Delete />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Create New Playlist">
          <IconButton onClick={onCreate} color="primary">
            <Add />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  )
}
