import { Menu, MenuItem } from '@mui/material'
import { useMatrixEditorContext } from './MatrixEditorContext'

// The props interface now includes the onEdit callback
interface MContextMenuProps {
  anchorEl: HTMLElement | null
  closeContextMenu: () => void
  currentCell: [number, number]
  onEdit: () => void // <-- ADDED THIS LINE
}

const MContextMenu = ({ anchorEl, closeContextMenu, currentCell, onEdit }: MContextMenuProps) => {
  const { m, setDnd, setDndMode, clearPixel, clearPixelGroup, setSelectedGroup } =
    useMatrixEditorContext()

  const contextMenuOpen = Boolean(anchorEl)
  // Ensure we don't crash if the cell is out of bounds
  const [col, row] = currentCell
  const cellData = m[row]?.[col]

  // All event handlers now just call functions from the context or props
  const handleMovePixel = () => {
    if (cellData?.group) {
      setSelectedGroup(cellData.group as string)
      setDnd(true)
    }
    closeContextMenu()
  }

  const handleMoveGroup = () => {
    if (cellData?.group) {
      setSelectedGroup(cellData.group as string)
      setDndMode('group')
    }
    closeContextMenu()
  }

  const handleClearPixel = () => {
    clearPixel(currentCell)
    closeContextMenu()
  }

  const handleClearGroup = () => {
    if (cellData?.group) {
      clearPixelGroup(cellData.group as string)
    }
    closeContextMenu()
  }

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
    >
      {/* onEdit is passed directly from the parent */}
      <MenuItem onClick={onEdit}>Edit</MenuItem>
      <MenuItem onClick={handleMovePixel}>Move Pixel in DND</MenuItem>
      <MenuItem onClick={handleMoveGroup}>Move Group</MenuItem>
      <MenuItem onClick={handleClearPixel}>Clear Pixel</MenuItem>
      <MenuItem onClick={handleClearGroup}>Clear Group</MenuItem>
    </Menu>
  )
}

export default MContextMenu
