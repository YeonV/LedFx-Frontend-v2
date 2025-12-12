import http from 'http'

export const waitForServer = (
  url: string,
  timeout: number = 30000,
  interval: number = 500
): Promise<boolean> => {
  const startTime = Date.now()

  return new Promise((resolve) => {
    const checkServer = () => {
      const req = http.get(url, () => {
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
