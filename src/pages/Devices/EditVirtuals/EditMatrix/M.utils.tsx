export type IDir =
  | 'right'
  | 'right-snake'
  | 'right-flip'
  | 'right-snake-flip'
  | 'left'
  | 'left-snake'
  | 'left-flip'
  | 'left-snake-flip'
  | 'top'
  | 'top-snake'
  | 'top-flip'
  | 'top-snake-flip'
  | 'bottom'
  | 'bottom-snake'
  | 'bottom-flip'
  | 'bottom-snake-flip'

export type IMCell = {
  deviceId: string
  pixel: number
  group?: string
}

export const MCell: IMCell = { deviceId: '', pixel: 0, group: '0-0' }

/**
 * Calculates the maximum available pixel given the input data
 */
export const getMaxRange = (
  direction: IDir,
  row: number,
  col: number,
  rowN: number,
  colN: number
) => {
  let maxRange = 0
  if (direction.includes('right')) {
    maxRange = colN * rowN - (row * colN + col)
    if (direction.includes('flip')) {
      maxRange = row * colN + colN - col
    }
  } else if (direction.includes('left')) {
    maxRange = row * colN + col + 1
    if (direction.includes('flip')) {
      maxRange = (rowN - row - 1) * colN + col + 1
    }
  } else if (direction.includes('bottom')) {
    maxRange = colN * rowN - (rowN * col + (rowN - row - 1))
    if (direction.includes('flip')) {
      maxRange = rowN * col + (rowN - row)
    }
  } else if (direction.includes('top')) {
    maxRange = rowN * col + row + 1
    if (direction.includes('flip')) {
      maxRange = colN * rowN - (rowN * col + (rowN - row - 1))
    }
  }
  return maxRange
}

/**
 * deep clone
 */
export const clone = (input: any) => JSON.parse(JSON.stringify(input))

export const getOpacity = (
  move: boolean,
  yzcolumn: IMCell,
  selectedGroup: string
) => {
  if (move && yzcolumn?.group === selectedGroup) {
    return 1
  } else if (
    (move && yzcolumn?.group !== selectedGroup) ||
    selectedGroup === ''
  ) {
    return 0.3
  } else if (yzcolumn.deviceId !== '') {
    return 1
  } else {
    return 0.3
  }
}

export const getBackgroundColor = (
  mode: 'compressed' | 'uncompressed' | undefined,
  decodedPixels: any[] | undefined,
  pixels: any[][],
  currentRowIndex: number,
  colN: number,
  currentColIndex: number
) => {
  if (mode === 'compressed' && decodedPixels) {
    return decodedPixels[currentRowIndex * colN + currentColIndex]
      ? `rgb(${Object.values(decodedPixels[currentRowIndex * colN + currentColIndex])})`
      : '#222'
  } else if (pixels && pixels[0] && pixels[0].length) {
    return `rgb(${pixels[0][currentRowIndex * colN + currentColIndex]},${pixels[1][currentRowIndex * colN + currentColIndex]},${pixels[2][currentRowIndex * colN + currentColIndex]})`
  } else {
    return '#222'
  }
}
