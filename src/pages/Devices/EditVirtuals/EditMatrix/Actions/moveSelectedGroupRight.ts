// src/pages/Devices/EditVirtuals/EditMatrix/Actions/moveSelectedGroupRight.ts
import { clone } from '../M.utils'
import { IMoveGroupHorizontal } from './interfaces'

const moveSelectedGroupRight = ({ m, colN, selectedGroup, setM }: IMoveGroupHorizontal) => {
  const groupPixels = []
  // First, identify all pixels in the group and check for out-of-bounds moves
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (m[i][j].group === selectedGroup) {
        if (j + 1 >= colN) {
          // Part of the group is at the right edge, cannot move right.
          console.log('Move aborted: group is at the right edge.')
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
  // For horizontal moves, we don't need a separate conflict check since we can rely
  // on the same logic. However, we'll keep the structure for consistency.
  // Note: For horizontal moves, you don't have setError, so we'll just log.
  for (const pixel of groupPixels) {
    const targetRow = pixel.oldRow
    const targetCol = pixel.oldCol + 1
    const targetCell = m[targetRow][targetCol]

    // Check if the target cell is occupied by a DIFFERENT group
    if (targetCell.deviceId !== '' && targetCell.group !== selectedGroup) {
      console.log('Move aborted: collision detected with an external pixel.')
      return // Abort the entire move
    }
  }

  // --- PHASE 2: EXECUTE (CLEAR AND PAINT) ---
  const updatedM = clone(m)

  // Step A: Clear the group's original positions
  for (const pixel of groupPixels) {
    updatedM[pixel.oldRow][pixel.oldCol] = { deviceId: '', pixel: 0, group: '' }
  }

  // Step B: Paint the group in its new positions
  for (const pixel of groupPixels) {
    const targetRow = pixel.oldRow
    const targetCol = pixel.oldCol + 1
    updatedM[targetRow][targetCol] = {
      deviceId: pixel.deviceId,
      pixel: pixel.pixel,
      group: pixel.group
    }
  }

  setM(updatedM) // Atomically update the state with the final result
}

export default moveSelectedGroupRight
