function hexColor(encodedString: string, mode?: string) {
  if (mode === 'uncompressed' || !encodedString) {
    return []
  }
  const decodedString = atob(encodedString)
  const charCodes = Array.from(decodedString).map((char) => char.charCodeAt(0))
  const colors = Array.from({ length: charCodes.length / 3 }, (_, i) => {
    const r = charCodes[i * 3]
    const g = charCodes[i * 3 + 1]
    const b = charCodes[i * 3 + 2]
    return { r, g, b }
  })
  return colors
}

export default hexColor
