export function getBaseUrl(urlStr: string) {
  try {
    const url = new URL(urlStr) // Parse the URL string

    // Construct the base: protocol + '//' + hostname
    let baseUrl = `${url.protocol}//${url.hostname}`

    // Add port only if it exists and is not the default for the protocol
    // Default ports: 80 for http, 443 for https
    if (
      url.port &&
      !(
        (url.protocol === 'http:' && url.port === '80') ||
        (url.protocol === 'https:' && url.port === '443')
      )
    ) {
      baseUrl += `:${url.port}`
    }
    return baseUrl
  } catch (error) {
    console.error('Invalid URL provided:', urlStr, error)
    // Fallback or error handling:
    // You could try to return a best-effort extraction or null/undefined
    // For a simple fallback, if it looks like it has a protocol:
    const match = urlStr.match(/^([a-zA-Z]+:\/\/[^/]+)/)
    if (match && match[1]) {
      return match[1].replace(/\/+$/, '') // Remove trailing slashes
    }
    return null // Or throw error, or return original string
  }
}
