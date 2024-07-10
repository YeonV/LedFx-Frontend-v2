export function transpose(
  inputX: number,
  inputY: number,
  inputWidth: number,
  inputHeight: number,
  outputWidth: number,
  outputHeight: number
): { x: number; y: number } {
  const outputX = Math.floor((inputX / inputWidth) * outputWidth)
  const outputY = Math.floor((inputY / inputHeight) * outputHeight)

  return { x: outputX, y: outputY }
}
