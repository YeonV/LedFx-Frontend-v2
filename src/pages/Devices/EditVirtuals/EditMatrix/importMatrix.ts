import { IMCell } from './M.utils'

/**
 * Mirror of the backend's `generate_id` (ledfx/utils.py).
 *
 * A device's id is derived from its name, not chosen: every non-alphanumeric
 * run collapses to a single hyphen. Matrix Studio allows `-`, `.` and `_` in
 * its own device ids, so `wled_1` there would come back as `wled-1` here -
 * which is why creating a dummy cannot always recover an unknown device.
 */
export const generateDeviceId = (name: string) => {
  const result = name
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .toLowerCase()
    .replace(/ +/g, ' ')
    .trim()
    .replace(/ /g, '-')
  return result === '' ? 'default' : result
}

export interface UnknownDevice {
  deviceId: string
  /** Pixels needed to cover every index the layout references. */
  pixelCount: number
  /** Whether a dummy named `deviceId` would actually get that id back. */
  creatable: boolean
}

/**
 * Finds devices an imported layout references that LedFx does not have.
 *
 * Saving such a layout fails wholesale: the backend validates every segment and
 * rolls the entire set back on the first unknown device id, so the import has
 * to be resolved before it reaches the editor rather than after.
 */
export const findUnknownDevices = (
  m: IMCell[][],
  devices: Record<string, any>
): UnknownDevice[] => {
  const maxPixel = new Map<string, number>()

  for (const row of m) {
    for (const cell of row) {
      if (!cell?.deviceId) continue
      // Gaps are handled separately, at save time, by ensureGapDevice.
      if (cell.deviceId.startsWith('gap-')) continue
      if (devices[cell.deviceId]) continue
      const current = maxPixel.get(cell.deviceId) ?? -1
      maxPixel.set(cell.deviceId, Math.max(current, cell.pixel ?? 0))
    }
  }

  return Array.from(maxPixel, ([deviceId, highest]) => ({
    deviceId,
    pixelCount: highest + 1,
    creatable: generateDeviceId(deviceId) === deviceId
  })).sort((a, b) => a.deviceId.localeCompare(b.deviceId))
}
