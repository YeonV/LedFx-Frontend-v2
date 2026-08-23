/**
 * Decoder for the binary visualisation frame (transmission_mode
 * `binary_rgba` / `binary_rgb`).
 *
 * A binary websocket frame carries no JSON envelope, so routing and geometry
 * travel in a 12-byte little-endian header written by
 * `ledfx/api/websocket.py`:
 *
 *   0 magic  1 version  2 flags (bit0 = is_device)  3 bytes-per-pixel
 *   4:8 subscription id   8:10 rows   10:12 cols
 *
 * `bytesPerPixel` is derived server-side from the payload length rather than
 * from config, so a mode switch mid-flight cannot desync the client.
 *
 * At 4 bytes per pixel the returned view aliases the received buffer with no
 * copy and no per-pixel work - it can go straight into `ImageData`. That is
 * the entire point of the mode; at 3 bytes the alpha channel has to be woven
 * in, which costs one pass.
 */

export const VIS_BINARY_MAGIC = 0x4c
export const VIS_BINARY_VERSION = 1
const HEADER_BYTES = 12

export interface VisBinaryFrame {
  subscriptionId: number
  isDevice: boolean
  rows: number
  cols: number
  rgba: Uint8ClampedArray
}

export const parseVisBinaryFrame = (buffer: ArrayBuffer): VisBinaryFrame | null => {
  if (buffer.byteLength < HEADER_BYTES) return null

  const view = new DataView(buffer)
  if (view.getUint8(0) !== VIS_BINARY_MAGIC) return null
  if (view.getUint8(1) !== VIS_BINARY_VERSION) return null

  const flags = view.getUint8(2)
  const bytesPerPixel = view.getUint8(3)
  const subscriptionId = view.getUint32(4, true)
  const rows = view.getUint16(8, true)
  const cols = view.getUint16(10, true)

  const pixelCount = rows * cols
  if (pixelCount <= 0) return null

  const available = buffer.byteLength - HEADER_BYTES
  if (available < pixelCount * bytesPerPixel) return null

  if (bytesPerPixel !== 3) return null

  const rgb = new Uint8Array(buffer, HEADER_BYTES, pixelCount * 3)
  const rgba = new Uint8ClampedArray(pixelCount * 4)
  for (let i = 0, j = 0, k = 0; i < pixelCount; i++) {
    rgba[j++] = rgb[k++]
    rgba[j++] = rgb[k++]
    rgba[j++] = rgb[k++]
    rgba[j++] = 255
  }

  return {
    subscriptionId,
    isDevice: (flags & 1) === 1,
    rows,
    cols,
    rgba
  }
}

export default parseVisBinaryFrame
