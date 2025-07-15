// src/pages/Devices/EditVirtuals/EditMatrix/Actions/moveSelectedGroupDown.ts
import { clone } from '../M.utils'
import { IMoveGroup } from './interfaces'

const moveSelectedGroupDown = ({ m, rowN, selectedGroup, setError, setM }: IMoveGroup) => {
  const groupPixels = []
  // First, identify all pixels in the group and check for out-of-bounds moves
  for (let i = 0; i < rowN; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (m[i][j].group === selectedGroup) {
        if (i + 1 >= rowN) {
          // Part of the group is at the bottom edge, cannot move down.
          console.log('Move aborted: group is at the bottom edge.')
          return
        }
        groupPixels.push({ ...m[i][j], oldRow: i, oldCol: j })
      }
    }
  }

  if (groupPixels.length === 0) {
    return // No pixels in the selected group
  }

  // --- PHASE 1: PRE-FLIGHT CHECK ---
  const conflictingCells = []
  for (const pixel of groupPixels) {
    const targetRow = pixel.oldRow + 1
    const targetCol = pixel.oldCol
    const targetCell = m[targetRow][targetCol]

    // Check if the target cell is occupied by a DIFFERENT group
    if (targetCell.deviceId !== '' && targetCell.group !== selectedGroup) {
      conflictingCells.push({ row: targetRow, col: targetCol })
    }
  }

  if (conflictingCells.length > 0) {
    setError(conflictingCells) // Set error with external conflicting cells
    console.log('Move aborted: collision detected with an external pixel.')
    return
  }

  // --- PHASE 2: EXECUTE (CLEAR AND PAINT) ---
  setError([]) // Clear any previous errors
  const updatedM = clone(m)

  // Step A: Clear the group's original positions
  for (const pixel of groupPixels) {
    updatedM[pixel.oldRow][pixel.oldCol] = { deviceId: '', pixel: 0, group: '' }
  }

  // Step B: Paint the group in its new positions
  for (const pixel of groupPixels) {
    const targetRow = pixel.oldRow + 1
    const targetCol = pixel.oldCol
    updatedM[targetRow][targetCol] = {
      deviceId: pixel.deviceId,
      pixel: pixel.pixel,
      group: pixel.group
    }
  }

  setM(updatedM) // Atomically update the state with the final result
}

export default moveSelectedGroupDown
