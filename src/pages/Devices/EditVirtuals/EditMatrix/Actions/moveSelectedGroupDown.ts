import { clone } from '../M.utils'
import { IMoveGroup } from './interfaces'

const moveSelectedGroupDown = ({ m, rowN, colN, selectedGroup, setError, setM }: IMoveGroup) => {
  const updatedM = clone(m)
  const conflictingCells = [] // Array to store conflicting cells

  for (let i = rowN - 1; i >= 0; i--) {
    for (let j = 0; j < colN; j += 1) {
      if (m[i][j].group === selectedGroup) {
        const targetRow = i + 1
        if (targetRow < rowN) {
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

export default moveSelectedGroupDown
