import http from 'http'
import https from 'https'

export const waitForServer = (
  url: string,
  timeout: number = 30000,
  interval: number = 500
): Promise<boolean> => {
  const startTime = Date.now()

  // Use https module for https:// URLs, http for http://
  const protocol = url.startsWith('https://') ? https : http

  return new Promise((resolve) => {
    const checkServer = () => {
      const req = protocol.get(url, { rejectUnauthorized: false }, () => {
        resolve(true)
        req.destroy()
      })

      req.on('error', () => {
        if (Date.now() - startTime > timeout) {
          resolve(false)
        } else {
          setTimeout(checkServer, interval)
        }
      })

      req.setTimeout(1000, () => {
        req.destroy()
        if (Date.now() - startTime > timeout) {
          resolve(false)
        } else {
          setTimeout(checkServer, interval)
        }
      })
    }

    checkServer()
  })
}
