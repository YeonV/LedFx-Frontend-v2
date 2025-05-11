import { clone } from '../M.utils'
import { IMoveGroup } from './interfaces'

const moveSelectedGroupUp = ({ m, rowN, colN, selectedGroup, setError, setM }: IMoveGroup) => {
  const updatedM = clone(m)
  const conflictingCells = []

  for (let i = 0; i < rowN; i++) {
    for (let j = 0; j < colN; j += 1) {
      if (m[i][j].group === selectedGroup) {
        const targetRow = i - 1 // Calculate target row above
        if (targetRow >= 0) {
          // Check if within matrix bounds
          if (updatedM[targetRow][j].deviceId !== '') {
            // Conflict detected, add cell to conflictingCells
            conflictingCells.push({ row: targetRow, col: j })
          } else {
            updatedM[targetRow][j] = m[i][j]
            updatedM[i][j] = { deviceId: '', pixel: 0, group: '' }
          }
        }
      }
    }
  }

  if (conflictingCells.length > 0) {
    setError(conflictingCells) // Set error with conflicting cells
  } else {
    setM(updatedM) // Update matrix if no conflicts
  }
}

export default moveSelectedGroupUp
