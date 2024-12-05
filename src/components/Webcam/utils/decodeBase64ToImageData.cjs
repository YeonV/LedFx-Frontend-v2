function decodeBase64ToImageData(base64String) {
  const base64Data = base64String.split(',')[1]
  const imageData = atob(base64Data)
  const buffer = new Uint8Array(imageData.length)
  for (let i = 0; i < imageData.length; i++) {
    buffer[i] = imageData.charCodeAt(i)
  }
  return buffer
}

export default decodeBase64ToImageData
