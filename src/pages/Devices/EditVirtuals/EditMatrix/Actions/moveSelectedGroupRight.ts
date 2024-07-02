import { clone } from '../M.utils'
import { IMoveGroupHorizontal } from './interfaces'

const moveSelectedGroupRight = ({
  m,
  rowN,
  colN,
  selectedGroup,
  setM
}: IMoveGroupHorizontal) => {
  const updatedM = clone(m)
  for (let i = 0; i < rowN; i++) {
    for (let j = colN - 1; j >= 0; j--) {
      if (m[i][j].group === selectedGroup) {
        const targetCol = j + 1
        if (targetCol < colN && m[i][colN - 1].deviceId === '') {
          updatedM[i][targetCol] = m[i][j]
          updatedM[i][j] = { deviceId: '', pixel: 0, group: '' }
        }
      }
    }
  }
  setM(updatedM)
}

export default moveSelectedGroupRight
