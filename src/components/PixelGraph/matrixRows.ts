import type { Device, Virtual } from '../../api/ledfx.types'

export const getMatrixRows = (virtual: Virtual | undefined, devices: Record<string, Device>) => {
  const deviceId = typeof virtual?.is_device === 'string' ? virtual.is_device : undefined
  const deviceRows = deviceId
    ? (devices[deviceId]?.config as (Device['config'] & { rows?: number }) | undefined)?.rows
    : undefined

  return deviceRows || virtual?.config?.rows || 1
}

export const getMatrixFrameShape = (
  pixelCount: number,
  sourceShape: [number, number],
  matrixRows: number,
  showMatrix: boolean
): [number, number] => {
  if (!showMatrix) return [1, pixelCount]

  const rows = sourceShape[0] > 1 ? sourceShape[0] : matrixRows
  return [rows, Math.ceil(pixelCount / rows)]
}
