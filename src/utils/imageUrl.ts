/**
 * Generates a URL for accessing images and thumbnails from the LedFx API
 * @param path - The image path (may include prefixes like 'file:///')
 * @param thumbnail - Whether to use the thumbnail endpoint (default: false)
 * @returns The complete URL for accessing the image
 */
export const getImageUrl = (path: string, thumbnail: boolean = false): string => {
  const baseURL = window.localStorage.getItem('ledfx-host') || window.location.origin
  // Only strip file:/// for user assets, keep builtin:// and http(s):// as-is
  const cleanPath = path.startsWith('file:///') ? path.replace('file:///', '') : path
  const endpoint = thumbnail ? 'thumbnail' : 'download'
  return `${baseURL}/api/assets/${endpoint}?path=${encodeURIComponent(cleanPath)}`
}
