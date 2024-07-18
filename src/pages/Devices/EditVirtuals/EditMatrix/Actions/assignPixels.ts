import { transpose } from '../../../../../utils/helpers'
import { clone, IMCell } from '../M.utils'

const assignPixels = ({
  m,
  rowN,
  colN,
  currentCell,
  currentDevice,
  selectedPixel,
  direction,
  setM,
  closeClear,
  pixelGroups,
  setPixelGroups
}: {
  m: IMCell[][]
  rowN: number
  colN: number
  currentCell: number[]
  currentDevice: string
  selectedPixel: number | number[]
  direction: string
  setM: any
  closeClear: any
  pixelGroups: number
  setPixelGroups: any
}) => {
  let updatedM: IMCell[][] = clone(m)
  const [col, row] = currentCell
  if (typeof selectedPixel === 'number') {
    updatedM[row][col] = {
      deviceId: currentDevice,
      pixel: selectedPixel,
      group: `${row}-${col}`
    }
  } else {
    for (
      let index = 0;
      index <= Math.abs(selectedPixel[1] - selectedPixel[0]);
      index += 1
    ) {
      const newM = {
        deviceId: currentDevice,
        pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index,
        group: `${row}-${col}`
      }
      if (direction.includes('diagonal-top-right')) {
        for (let index = 0; index <= Math.abs(selectedPixel[1] - selectedPixel[0]) && row - index >= 0 && col + index < colN; index++) {
          const newM = {
            deviceId: currentDevice,
            pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index,
            group: `${row}-${col}`
          }
          updatedM[row - index][col + index] = newM;
        }
      }
      
      else if (direction.includes('diagonal-bottom-right')) {
        for (let index = 0; index <= Math.abs(selectedPixel[1] - selectedPixel[0]) && row + index < rowN && col + index < colN; index++) {
          const newM = {
            deviceId: currentDevice,
            pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index,
            group: `${row}-${col}`
          }
          updatedM[row + index][col + index] = newM;
        }
      }
      
      else if (direction.includes('diagonal-bottom-left')) {
        for (let index = 0; index <= Math.abs(selectedPixel[1] - selectedPixel[0]) && row + index < rowN && col - index >= 0; index++) {
          const newM = {
            deviceId: currentDevice,
            pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index,
            group: `${row}-${col}`
          }
          updatedM[row + index][col - index] = newM;
        }
      }
      
      else if (direction.includes('diagonal-top-left')) {
        for (let index = 0; index <= Math.abs(selectedPixel[1] - selectedPixel[0]) && row - index >= 0 && col - index >= 0; index++) {
          const newM = {
            deviceId: currentDevice,
            pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index,
            group: `${row}-${col}`
          }
          updatedM[row - index][col - index] = newM;
        }
      }
      
      else if (direction.includes('right')) {
        if (direction.includes('flip')) {
          updatedM[row - Math.floor((index + col) / colN)][
            (index + col) % colN
          ] = newM
        } else {
          updatedM[row + Math.floor((index + col) / colN)][
            (index + col) % colN
          ] = newM
        }
      } else if (direction.includes('bottom')) {
        if (direction.includes('flip')) {
          updatedM[(index + row) % rowN][
            col - Math.floor((index + row) / rowN)
          ] = newM
        } else {
          updatedM[(index + row) % rowN][
            col + Math.floor((index + row) / rowN)
          ] = newM
        }
      } else if (direction.includes('left')) {
        if (direction.includes('flip')) {
          updatedM[row + Math.abs(Math.floor((col - index) / colN))][
            (colN + ((col - index) % colN)) % colN
          ] = newM
        } else {
          updatedM[row - Math.abs(Math.floor((col - index) / colN))][
            (colN + ((col - index) % colN)) % colN
          ] = newM
        }
      } else if (direction.includes('top')) {
        if (direction.includes('flip')) {
          updatedM[(rowN + ((row - index) % rowN)) % rowN][
            col + Math.abs(Math.floor((row - index) / rowN))
          ] = newM
        } else {
          updatedM[(rowN + ((row - index) % rowN)) % rowN][
            col - Math.abs(Math.floor((row - index) / rowN))
          ] = newM
        }
      }
    }
  }
  if (direction.includes('right-snake')) {
    if (direction.includes('flip')) {
      for (let i = row; i >= 0; i -= 1) {
        const currentRow = [...updatedM[i]]
        if ((i + row) % 2 === 1) updatedM[i] = currentRow.reverse()
      }
    } else {
      for (let i = row; i < rowN; i += 1) {
        const currentRow = [...updatedM[i]]
        if ((i + row) % 2 === 1) updatedM[i] = currentRow.reverse()
      }
    }
  }
  if (direction.includes('bottom-snake')) {
    if (direction.includes('flip')) {
      const mat = clone(updatedM)
      const temp = transpose(mat)
      for (let i = col; i >= 0; i -= 1) {
        const currentCol = [...temp[i]]
        if ((i + col) % 2 === 1) temp[i] = currentCol.reverse()
      }
      updatedM = transpose(temp)
    } else {
      const mat = clone(updatedM)
      const temp = transpose(mat)
      for (let i = col; i < colN; i += 1) {
        const currentCol = [...temp[i]]
        if ((i + col) % 2 === 1) temp[i] = currentCol.reverse()
      }
      updatedM = transpose(temp)
    }
  }
  if (direction.includes('left-snake')) {
    if (direction.includes('flip')) {
      for (let i = row; i < rowN; i += 1) {
        const currentRow = [...updatedM[i]]
        if ((i + row) % 2 === 1) updatedM[i] = currentRow.reverse()
      }
    } else {
      for (let i = row; i >= 0; i -= 1) {
        const currentRow = [...updatedM[i]]
        if ((i + row) % 2 === 1) updatedM[i] = currentRow.reverse()
      }
    }
  }
  if (direction.includes('top-snake')) {
    if (direction.includes('flip')) {
      const mat = clone(updatedM)
      const temp = transpose(mat)
      for (let i = col; i < colN; i += 1) {
        const currentCol = [...temp[i]]
        if ((i + col) % 2 === 1) temp[i] = currentCol.reverse()
      }
      updatedM = transpose(temp)
    } else {
      const mat = clone(updatedM)
      const temp = transpose(mat)
      for (let i = col; i >= 0; i -= 1) {
        const currentCol = [...temp[i]]
        if ((i + col) % 2 === 1) temp[i] = currentCol.reverse()
      }
      updatedM = transpose(temp)
    }
  }
  setPixelGroups(pixelGroups + 1)
  setM(updatedM)
  closeClear()
}

export default assignPixels
