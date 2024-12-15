import { useState, MouseEvent } from 'react'
import { Menu, MenuItem, ListItemIcon, Button } from '@mui/material'
import {
  PlaylistAdd,
  Edit,
  MoreVert,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material'
import Popover from '../../components/Popover/Popover'
import useStore from '../../store/useStore'

const ScenesMenu = ({ sceneId }: { sceneId: string }) => {
  const deleteScene = useStore((state) => state.deleteScene)
  const getScenes = useStore((state) => state.getScenes)
  const scenes = useStore((state) => state.scenes)
  const sceneOrder = useStore((state) => state.sceneOrder)
  const addScene2PL = useStore((state) => state.addScene2PL)
  const setSceneOrderUp = useStore((state) => state.setSceneOrderUp)
  const setSceneOrderDown = useStore((state) => state.setSceneOrderDown)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const order = sceneOrder.find((s) => s.sceneId === sceneId)?.order || -1

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const setDialogOpenAddScene = useStore((state) => state.setDialogOpenAddScene)

  const handleDeleteScene = (e: any) => {
    deleteScene(e).then(() => {
      getScenes()
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
            setDialogOpenAddScene(false, true, sceneId, scenes[sceneId])
            handleClose()
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          onClick={() => {
            addScene2PL(sceneId)
            handleClose()
          }}
        >
          <ListItemIcon>
            <PlaylistAdd />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          disabled={order < 1}
          onClick={() => {
            setSceneOrderUp(sceneId)
            handleClose()
          }}
        >
          <ListItemIcon>
            <ChevronLeft />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          disabled={order >= sceneOrder.length - 1}
          onClick={() => {
            setSceneOrderDown(sceneId)
            handleClose()
          }}
        >
          <ListItemIcon>
            <ChevronRight />
          </ListItemIcon>
        </MenuItem>
        <Popover
          type="menuItem"
          onConfirm={() => {
            handleDeleteScene(sceneId)
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

export default ScenesMenu
