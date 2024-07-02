import { Menu, MenuItem } from '@mui/material'

const MContextMenu = ({
  anchorEl,
  closeContextMenu,
  setOpen,
  setSelectedGroup,
  setMove,
  currentCell,
  m,
  setDnd
}: {
  anchorEl: any
  closeContextMenu: any
  setOpen: any
  setSelectedGroup: any
  setMove: any
  currentCell: [number, number]
  m: any
  setDnd: any
}) => {
  const contextMenuOpen = Boolean(anchorEl)
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={contextMenuOpen}
      onClose={closeContextMenu}
      onContextMenu={(e) => {
        e.preventDefault()
        closeContextMenu()
      }}
      MenuListProps={{
        'aria-labelledby': 'basic-button'
      }}
    >
      <MenuItem
        onClick={() => {
          setOpen(true)
        }}
      >
        Edit
      </MenuItem>
      <MenuItem
        onClick={() => {
          setSelectedGroup(m[currentCell[1]][currentCell[0]].group || '0-0')
          setDnd(true)
          closeContextMenu()
        }}
      >
        Move Pixel in DND
      </MenuItem>
      <MenuItem
        onClick={() => {
          setSelectedGroup(m[currentCell[1]][currentCell[0]].group || '0-0')
          setMove(true)
          closeContextMenu()
        }}
      >
        Move Group
      </MenuItem>
      <MenuItem onClick={closeContextMenu}>Clear</MenuItem>
    </Menu>
  )
}

export default MContextMenu
