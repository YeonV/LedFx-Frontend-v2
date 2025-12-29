import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

// Chrome Cast SDK types
declare global {
  interface Window {
    chrome?: {
      cast?: {
        ApiConfig: any
        SessionRequest: any
        requestSession: (
          onSuccess: (session: any) => void,
          onError: (error: any) => void
        ) => void
        isAvailable: boolean
        media?: {
          DEFAULT_MEDIA_RECEIVER_APP_ID: string
        }
      }
    }
    __onGCastApiAvailable?: (isAvailable: boolean) => void
  }
}

interface CastContextType {
  isAvailable: boolean
  isConnecting: boolean
  isConnected: boolean
  deviceName: string | null
  error: string | null
  startCasting: (canvas: HTMLCanvasElement) => void
  stopCasting: () => void
}

const CastContext = createContext<CastContextType | null>(null)

// Load Google Cast SDK
const loadCastSdk = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.chrome?.cast?.isAvailable) {
      resolve(true)
      return
    }

    // Set up callback for when Cast API becomes available
    window.__onGCastApiAvailable = (isAvailable: boolean) => {
      resolve(isAvailable)
    }

    // Check if SDK script is already loaded
    if (document.querySelector('script[src*="cast_sender"]')) {
      // Script already loading, wait for callback
      return
    }

    // Load the Cast SDK
    const script = document.createElement('script')
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
    script.async = true
    script.onerror = () => resolve(false)
    document.head.appendChild(script)

    // Timeout fallback
    setTimeout(() => {
      if (!window.chrome?.cast?.isAvailable) {
        resolve(false)
      }
    }, 5000)
  })
}

export const CastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [deviceName, setDeviceName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sessionRef = useRef<any>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Initialize Cast SDK
  useEffect(() => {
    loadCastSdk().then((available) => {
      setIsAvailable(available)
      if (available) {
        console.log('Cast SDK loaded successfully')
      }
    })
  }, [])

  // Start casting the canvas
  const startCasting = useCallback(async (canvas: HTMLCanvasElement) => {
    setError(null)
    setIsConnecting(true)
    canvasRef.current = canvas

    try {
      // For MVP, we'll use the Presentation API which is more widely supported
      // and allows casting just a specific element/stream

      // Capture the canvas as a MediaStream
      const stream = canvas.captureStream(60) // 60 FPS
      streamRef.current = stream

      // Try using the Presentation API first (Chrome's built-in cast)
      if ('PresentationRequest' in window) {
        const presentationRequest = new (window as any).PresentationRequest([
          // Cast to any available display
          'cast:CC1AD845' // Default Media Receiver ID
        ])

        try {
          const connection = await presentationRequest.start()
          sessionRef.current = connection
          setIsConnected(true)
          setDeviceName(connection.id || 'Chromecast')

          // Send canvas data via the connection
          // Note: For full canvas streaming, we'd need a custom receiver app
          // For MVP, we'll open a fullscreen view that the user can cast

          connection.onclose = () => {
            setIsConnected(false)
            setDeviceName(null)
            sessionRef.current = null
          }
        } catch (presentationError) {
          // Presentation API failed, try alternative approach
          throw presentationError
        }
      } else {
        // Fallback: Open canvas in new window for tab casting
        throw new Error('Presentation API not available')
      }
    } catch (err) {
      console.log('Presentation API failed, trying popup approach:', err)

      // Alternative: Open a popup window with just the canvas that user can cast
      try {
        // Create a data URL from the canvas for initial display
        const popup = window.open('', 'LedFx Visualiser Cast', 'width=1920,height=1080')

        if (popup) {
          // Set up the popup with a canvas that mirrors the main one
          popup.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>LedFx Visualiser - Cast This Window</title>
                <style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body {
                    background: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    overflow: hidden;
                  }
                  canvas {
                    width: 100vw;
                    height: 100vh;
                    object-fit: contain;
                  }
                  .cast-hint {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-family: system-ui, sans-serif;
                    z-index: 1000;
                    opacity: 1;
                    transition: opacity 3s ease-out;
                  }
                  .cast-hint.hidden { opacity: 0; pointer-events: none; }
                </style>
              </head>
              <body>
                <div class="cast-hint" id="hint">
                  Right-click → Cast... to send to Chromecast
                </div>
                <canvas id="castCanvas"></canvas>
                <script>
                  // Hide hint after 5 seconds
                  setTimeout(() => {
                    document.getElementById('hint').classList.add('hidden');
                  }, 5000);
                </script>
              </body>
            </html>
          `)

          const castCanvas = popup.document.getElementById('castCanvas') as HTMLCanvasElement
          if (castCanvas) {
            // Match the source canvas size
            castCanvas.width = canvas.width
            castCanvas.height = canvas.height

            const ctx = castCanvas.getContext('2d')

            // Set up animation loop to copy frames from source canvas
            const copyFrame = () => {
              if (popup.closed) {
                setIsConnected(false)
                setDeviceName(null)
                return
              }

              if (ctx && canvas) {
                ctx.drawImage(canvas, 0, 0)
              }

              requestAnimationFrame(copyFrame)
            }

            copyFrame()

            setIsConnected(true)
            setDeviceName('Cast Window')

            // Track window close
            const checkClosed = setInterval(() => {
              if (popup.closed) {
                clearInterval(checkClosed)
                setIsConnected(false)
                setDeviceName(null)
                sessionRef.current = null
              }
            }, 1000)

            sessionRef.current = { popup, checkInterval: checkClosed }
          }
        }
      } catch (popupError) {
        setError('Unable to open cast window. Please allow popups.')
        console.error('Cast popup failed:', popupError)
      }
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // Stop casting
  const stopCasting = useCallback(() => {
    if (sessionRef.current) {
      if (sessionRef.current.popup) {
        sessionRef.current.popup.close()
        clearInterval(sessionRef.current.checkInterval)
      } else if (sessionRef.current.terminate) {
        sessionRef.current.terminate()
      }
      sessionRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    setIsConnected(false)
    setDeviceName(null)
    setError(null)
  }, [])

  return (
    <CastContext.Provider
      value={{
        isAvailable: true, // Popup fallback always available
        isConnecting,
        isConnected,
        deviceName,
        error,
        startCasting,
        stopCasting
      }}
    >
      {children}
    </CastContext.Provider>
  )
}

export const useCast = (): CastContextType => {
  const context = useContext(CastContext)
  if (!context) {
    throw new Error('useCast must be used within a CastProvider')
  }
  return context
}

export default CastProvider
