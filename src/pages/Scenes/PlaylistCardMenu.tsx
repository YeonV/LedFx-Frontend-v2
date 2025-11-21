import { useState, MouseEvent } from 'react'
import { Menu, MenuItem, ListItemIcon, Button } from '@mui/material'
import { Edit, MoreVert } from '@mui/icons-material'
import Popover from '../../components/Popover/Popover'
import useStore from '../../store/useStore'

const PlaylistCardMenu = ({
  playlistId,
  editPlaylist
}: {
  playlistId: string

  editPlaylist: (id: string) => void
}) => {
  const deletePlaylist = useStore((state) => state.deletePlaylist)
  const getPlaylists = useStore((state) => state.getPlaylists)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDeleteScene = (e: any) => {
    deletePlaylist(e).then(() => {
      getPlaylists()
    })
  }

  return (
    <>
      <Button variant="text" onClick={handleClick} sx={{ minWidth: '32px' }}>
        <MoreVert />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            editPlaylist(playlistId)
            handleClose()
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
        </MenuItem>
        <Popover
          type="menuItem"
          onConfirm={() => {
            handleDeleteScene(playlistId)
            handleClose()
          }}
          variant="outlined"
          color="inherit"
          style={{ marginLeft: '0.5rem' }}
        />
      </Menu>
    </>
  )
}

export default PlaylistCardMenu
