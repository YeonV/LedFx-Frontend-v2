/**
 * Mirror of the palette in yz-matrix-studio (`src/components/MatrixStudio/colorPallete.ts`).
 *
 * Each entry is one device's family of four shades; Matrix Studio colours a
 * cell with `family[groupIndex % 4]`, where groupIndex is the position of that
 * cell's group within the device's groups. So the family identifies the
 * device, and the shade distinguishes its groups.
 */
export const studioPalette: readonly (readonly [string, string, string, string])[] = [
  ['#393b79', '#5154a3', '#6c6ecf', '#9c9ede'],
  ['#637939', '#8ca252', '#b5cf6b', '#cddb9c'],
  ['#8c6d31', '#bd9e39', '#e7ba51', '#e7cb94'],
  ['#843c3a', '#ad494a', '#d7616b', '#e6969c'],
  ['#7b4173', '#a55194', '#ce6dbd', '#dd9ed6'],
  ['#3182bd', '#6aaed6', '#9ecae1', '#c6dbef'],
  ['#e6550e', '#fd8d3d', '#fdae6b', '#fdd0a2'],
  ['#31a354', '#74c476', '#a1d99b', '#c7e9bf'],
  ['#756bb1', '#9e9ac9', '#bcbddc', '#dadaeb'],
  ['#636363', '#969696', '#bdbdbd', '#d9d9d9']
]

const hashDeviceId = (deviceId: string) => {
  let hash = 0
  for (let i = 0; i < deviceId.length; i += 1) {
    hash = (hash * 31 + deviceId.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/**
 * Picks a palette family per device, stably.
 *
 * Left to itself Matrix Studio claims families lazily, in whatever order the
 * user happens to paint, and never reports them back - so a layout never
 * reopens with the colours it was left with. Handing the families over with
 * the device list fixes that, since the studio only auto-assigns to devices
 * that arrive without one.
 *
 * Each device hashes to a home family. The first pass hands out homes that are
 * free, so a device can only ever be displaced by another device hashing to
 * the same slot - adding or removing unrelated devices never recolours it. The
 * second pass probes the leftovers onto the nearest free family, which keeps
 * families distinct until there are more devices than the ten the studio
 * defines, after which reuse is unavoidable.
 */
export const assignStudioColors = (deviceIds: string[]) => {
  const colors = new Map<string, readonly [string, string, string, string]>()
  const taken = new Set<number>()
  const home = (deviceId: string) => hashDeviceId(deviceId) % studioPalette.length

  // Sorted so the result depends only on which devices exist, not on the
  // order they happen to arrive in.
  const sorted = [...deviceIds].sort()

  const contended: string[] = []
  for (const deviceId of sorted) {
    const slot = home(deviceId)
    if (taken.has(slot)) {
      contended.push(deviceId)
    } else {
      taken.add(slot)
      colors.set(deviceId, studioPalette[slot])
    }
  }

  for (const deviceId of contended) {
    let slot = home(deviceId)
    for (let probe = 0; probe < studioPalette.length && taken.has(slot); probe += 1) {
      slot = (slot + 1) % studioPalette.length
    }
    taken.add(slot)
    colors.set(deviceId, studioPalette[slot])
  }

  return colors
}
