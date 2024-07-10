import useStore from '../../store/useStore'
import { transpose } from './matrixUtils'

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const wled = async (body) => {
  const wledIp = useStore.getState().videoMapper.wledIp
  try {
    const response = await fetch(`http://${wledIp}/json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const json = await response.json()
    return json
  } catch (error) {
    console.error(error)
  }
}
export const wledGet = async (path = 'state') => {
  const wledIp =  useStore.getState().videoMapper.wledIp
  if (!wledIp || wledIp === '') {
    return
  }
  try {
    const response = await fetch(`http://${wledIp}/json/${path}`)
    const json = await response.json()
    return json || response
  } catch (error) {
    console.error(error)
  }
}

export const getLedCount = async (wledIp) => {
  try {
    const response = await fetch(`http://${wledIp}/json/info`)
    const info = await response.json()
    return info.leds.count
  } catch (error) {
    console.error(error)
  }

}

export const oneLed = async (led) => {
  const state = await wledGet('state')
  const segments = state.seg
  let totalLedCount = 0

  // First, turn all LEDs off
  for (const segment of segments) {
    const allLedsOff = {
      seg: {
        id: segment.id,
        i: [0, segment.len, '000000']
      }
    }
    await wled(allLedsOff)
  }

  // Then, turn on the specified LED
  for (const segment of segments) {
    totalLedCount += segment.len
    if (totalLedCount >= led) {
      const ledInSegment = led - (totalLedCount - segment.len)
      const singleLedOn = {
        seg: {
          id: segment.id,
          i: [ledInSegment, ledInSegment + 1, 'FFFFFF']
        }
      }
      await wled(singleLedOn)
      break
    }
  }
}


export function decodeBase64ToImageData(base64String) {
  const base64Data = base64String.split(',')[1]
  const imageData = atob(base64Data)
  const buffer = new Uint8Array(imageData.length)
  for (let i = 0; i < imageData.length; i++) {
    buffer[i] = imageData.charCodeAt(i)
  }
  return buffer
}

export async function createImageFromData(imageData) {
  const blob = new Blob([imageData], { type: 'image/webp' })
  const url = URL.createObjectURL(blob)
  const img = new Image()
  img.src = url
  await new Promise((resolve) => {
    img.onload = resolve
  })
  return img
}

export function calculateImageDifference(img1, img2, threshold = 128, ignoreTop = 0, ignoreLeft = 0, ignoreBottom = 0, ignoreRight = 0) {
  // console.log("BROOOOO", img1.width, img1.height, ignoreTop, ignoreLeft, ignoreBottom, ignoreRight)
  const width = img1.width - ignoreLeft - ignoreRight
  const height = img1.height - ignoreTop - ignoreBottom
  const canvas = document.createElement('canvas', {willReadFrequently: true})
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', {willReadFrequently: true})
  // context.drawImage(img1, 0, 0, width, height)
  context.drawImage(img1, ignoreLeft, ignoreTop, width, height, 0, 0, width, height)
  const imageData1 = context.getImageData(0, 0, width, height).data
  context.clearRect(0, 0, width, height)
  // context.drawImage(img2, 0, 0, width, height)
  context.drawImage(img2, ignoreLeft, ignoreTop, width, height, 0, 0, width, height)
  const imageData2 = context.getImageData(0, 0, width, height).data
  const diffData = new Uint8ClampedArray(width * height * 4)

  let whitePixels = []
  
  for (let i = 0; i < width * height * 4; i += 4) {
    const diffRed = Math.abs(imageData1[i] - imageData2[i])
    const diffGreen = Math.abs(imageData1[i + 1] - imageData2[i + 1])
    const diffBlue = Math.abs(imageData1[i + 2] - imageData2[i + 2])
    const diffAlpha = 255
    const avgDiff = (diffRed + diffGreen + diffBlue) / 3 // Combine differences (simple average) Ignore the alpha channel
    const outputValue = avgDiff > threshold ? 255 : 0
    diffData[i] = outputValue
    diffData[i + 1] = outputValue
    diffData[i + 2] = outputValue
    diffData[i + 3] = diffAlpha // Keep alpha channel intact

    if (outputValue === 255) {
      const x = (i / 4) % width
      const y = Math.floor((i / 4) / width)
      whitePixels.push({ x, y })
    }
  }

  const whitePixelsCount = whitePixels.length
  const whitePixelsCenter = whitePixels.reduce((acc, { x, y }) => ({ x: acc.x + x, y: acc.y + y }), { x: 0, y: 0 })
  whitePixelsCenter.x /= whitePixelsCount
  whitePixelsCenter.y /= whitePixelsCount

  context.putImageData(new ImageData(diffData, width, height), 0, 0)

  // Draw a small red circle at the center of the white area
  context.beginPath()
  context.arc(whitePixelsCenter.x, whitePixelsCenter.y, 5, 0, 2 * Math.PI, false)
  context.fillStyle = 'red'
  context.fill()

  return { diffImage: canvas.toDataURL('image/webp'), whitePixelsCenter }
}

export async function processImages(img1b64, img2b64, threshold = 128, ignoreTop = 0, ignoreLeft = 0, ignoreBottom = 0, ignoreRight = 0, pointsRef) {
  try {
    const imageData1 = decodeBase64ToImageData(img1b64)
    const image1 = await createImageFromData(imageData1)
    const imageData2 = decodeBase64ToImageData(img2b64)
    const image2 = await createImageFromData(imageData2)
    const diffData = calculateImageDifference(image1, image2, threshold, ignoreTop, ignoreLeft, ignoreBottom, ignoreRight)
    const diffImageBase64 = diffData.diffImage
    // console.log("BROOOOO", diffData.whitePixelsCenter)
    if (pointsRef) pointsRef.current = diffData.whitePixelsCenter
    const diffImageElement = document.getElementById('diffImage')
    diffImageElement.src = diffImageBase64
  } catch (error) {
    console.error('Error processing images:', error)
  }
}

export const iterativeOnOnlyOne = async (waitingTime, pointsRef, inputWidth = 400, inputHeight = 300, outputWidth = 50, outputHeight = 50, addPoint, device) => {
  const state = await wledGet()    
  const segments = state.seg
  let totalPreviousLength = 0;  // Initialize total length of previous segments
  for (const segment of segments) {
    for (let i = 0; i < segment.len + 1; i++) {
      const singleLedOn = {
        seg: {
          id: segment.id,
          i:
            i === 0
              ? [i, i + 1, 'FFFFFF', i + 1, segment.len, '000000']
              : [
                  0,
                  i,
                  '000000',
                  i,
                  i + 1,
                  'FFFFFF',
                  i + 1,
                  segment.len,
                  '000000'
                ]
        }
      }
      await wled(singleLedOn)      
      const transposed = transpose(pointsRef?.current?.x, pointsRef?.current?.y, inputWidth, inputHeight, outputWidth, outputHeight)
      if (!isNaN(transposed.x) && !isNaN(transposed.y)) {
        // console.log("transposed", {...transposed, segment: segment.id, led: i, device})
        addPoint({...transposed, segment: segment.id, led: totalPreviousLength + i, device})  // Add totalPreviousLength to i
        await wait(waitingTime)
      }
    }
    totalPreviousLength += segment.len;  // Update total length of previous segments
  }
}


export const iterativeOn = async (waitingTime) => {
  const state = await wledGet()    
  const segments = state.seg
  for (const segment of segments) {
    for (let i = 0; i < segment.len; i++) {
      const singleLedOn = {
        seg: {
          id: segment.id,
          i: [i, i + 1, 'FFFFFF', i + 1, segment.len, '000000']
        }
      }
      await wled(singleLedOn)
      await wait(waitingTime)
    }
  }
}
