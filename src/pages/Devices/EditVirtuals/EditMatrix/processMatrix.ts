type InputType = { deviceId: string; pixel: number; group?: string }
type OutputType = [string, number, number, boolean]

export function processArray(inputArray: InputType[], gapname = ''): OutputType[] {
  const outputArray: OutputType[] = []
  let startPixel: number | null = null
  let endPixel: number | null = null
  let deviceId: string = ''
  let flip: boolean = false
  let gapStart: number | null = null

  for (let i = 0; i < inputArray.length; i += 1) {
    if (inputArray[i].deviceId !== '') {
      if (deviceId === '') {
        if (gapStart !== null) {
          outputArray.push([`gap-${gapname}`, gapStart, i - 1, false])
          gapStart = null
        }
        deviceId = inputArray[i].deviceId
        startPixel = inputArray[i].pixel
        endPixel = inputArray[i].pixel
        flip = false
      } else if (
        inputArray[i].deviceId === deviceId &&
        Math.abs(inputArray[i].pixel - (endPixel as number)) === 1
      ) {
        endPixel = inputArray[i].pixel
        flip = inputArray[i].pixel < (endPixel as number)
      } else {
        outputArray.push([deviceId, startPixel as number, endPixel as number, flip])
        deviceId = inputArray[i].deviceId
        startPixel = inputArray[i].pixel
        endPixel = inputArray[i].pixel
        flip = false
      }
    } else {
      if (deviceId !== '') {
        outputArray.push([deviceId, startPixel as number, endPixel as number, flip])
        deviceId = ''
      }
      if (gapStart === null) {
        gapStart = i
      }
    }
  }

  if (deviceId !== '') {
    outputArray.push([deviceId, startPixel as number, endPixel as number, flip])
  }
  if (gapStart !== null) {
    outputArray.push([`gap-${gapname}`, gapStart, inputArray.length - 1, false])
  }

  for (let i = 0; i < outputArray.length; i++) {
    const item = outputArray[i]
    if (item[1] > item[2]) {
      item[3] = item[1] > item[2]
      ;[item[1], item[2]] = [item[2], item[1]]
    }
  }

  return outputArray
}

/**
 * Rebuilds a matrix from a segment list, chunked `cols` cells per row.
 *
 * Segments carry no group information, so one id is synthesised per segment as
 * a fallback. It is deliberately prefixed: the previous `row-col` form produced
 * '0-0' for the first segment, which collides with the empty-cell sentinel in
 * MCell and made that whole segment invisible to the group tools. Real group
 * ids are layered back on afterwards by `applyStoredGroups`.
 */
export function reverseProcessArray(outputArray: OutputType[], cols?: number): InputType[][] {
  const inputArray: InputType[] = []
  const finalArray: InputType[][] = []

  for (let i = 0; i < outputArray.length; i += 1) {
    const [deviceId, startPixel, endPixel, flip] = outputArray[i]
    const group = `seg-${i}`
    if (deviceId.startsWith('gap-')) {
      for (let j = startPixel; j <= endPixel; j += 1) {
        inputArray.push({ deviceId: '', pixel: j, group: '0-0' })
      }
    } else if (flip) {
      for (let j = endPixel; j >= startPixel; j -= 1) {
        inputArray.push({ deviceId, pixel: j, group })
      }
    } else {
      for (let j = startPixel; j <= endPixel; j += 1) {
        inputArray.push({ deviceId, pixel: j, group })
      }
    }
  }

  if (cols) {
    for (let i = 0; i < inputArray.length; i += cols) {
      finalArray.push(inputArray.slice(i, i + cols))
    }
    return finalArray
  }
  return [inputArray]
}
