type InputType = { deviceId: string; pixel: number; group?: string }
type OutputType = [string, number, number, boolean]

export function processArray(inputArray: InputType[]): OutputType[] {
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
          outputArray.push(['gap', gapStart, i - 1, false])
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
        outputArray.push([
          deviceId,
          startPixel as number,
          endPixel as number,
          flip
        ])
        deviceId = inputArray[i].deviceId
        startPixel = inputArray[i].pixel
        endPixel = inputArray[i].pixel
        flip = false
      }
    } else {
      if (deviceId !== '') {
        outputArray.push([
          deviceId,
          startPixel as number,
          endPixel as number,
          flip
        ])
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
    outputArray.push(['gap', gapStart, inputArray.length - 1, false])
  }

  return outputArray
}

export function reverseProcessArray(
  outputArray: OutputType[],
  rows?: number
): InputType[][] {
  const inputArray: InputType[] = []
  const finalArray: InputType[][] = []
  let group: string = '0-0'

  for (let i = 0; i < outputArray.length; i += 1) {
    const [deviceId, startPixel, endPixel, flip] = outputArray[i]
    if (deviceId === 'gap' || deviceId === 'GAP') {
      for (let j = startPixel; j <= endPixel; j += 1) {
        inputArray.push({ deviceId: '', pixel: j, group: '0-0' })
      }
    } else if (flip) {
      for (let j = endPixel; j >= startPixel; j -= 1) {
        group = `${Math.floor(i / (rows || 1))}-${i % (rows || 1)}`
        inputArray.push({ deviceId, pixel: j, group })
      }
    } else {
      for (let j = startPixel; j <= endPixel; j += 1) {
        group = `${Math.floor(i / (rows || 1))}-${i % (rows || 1)}`
        inputArray.push({ deviceId, pixel: j, group })
      }
    }
  }

  if (rows) {
    for (let i = 0; i < inputArray.length; i += rows) {
      finalArray.push(inputArray.slice(i, i + rows))
    }
    return finalArray
  }
  return [inputArray]
}
