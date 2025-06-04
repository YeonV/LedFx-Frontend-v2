import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode' // The base qrcode library

interface QrCodeWithLogoProps {
  data: string // Data to encode in QR code
  logoSrc?: string // URL or path to the logo image
  logoSizeRatio?: number // Ratio of QR code size (e.g., 0.25 for 1/4th)
  qrCodeOptions?: QRCode.QRCodeToDataURLOptions // Options for qrcode library
  imageSettings?: any // Specific settings for QR image (fill, bg)
  width?: number // Desired width of the final QR code image
  height?: number // Desired height of the final QR code image
  alt?: string // Alt text for the image
  className?: string // Optional CSS class for the container/image
  style?: React.CSSProperties // Optional inline styles
  onQrReady?: (_dataUrl: string) => void // Callback when QR is ready
}

const QrCodeWithLogo: React.FC<QrCodeWithLogoProps> = ({
  data,
  logoSrc,
  logoSizeRatio = 0.25, // Default to 1/4th of QR code size
  qrCodeOptions = {
    errorCorrectionLevel: 'H', // High error correction for logo
    margin: 2, // Corresponds to 'border' in python qrcode
    scale: 8, // Corresponds to 'box_size' in python qrcode (lower for smaller canvas, then scale up)
    type: 'image/png'
    // width: 256, // Will be determined by scale or overridden by props.width/height
  },
  imageSettings = {
    // These are qrcode library's way to set colors
    fgColor: '#000000', // fill_color
    bgColor: '#FFFFFF' // back_color
  },
  width,
  height,
  alt = 'QR Code',
  className,
  style,
  onQrReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrDataURL, setQrDataURL] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setError(null)

    const generateQrCode = async () => {
      if (!data) {
        setQrDataURL(null) // Clear if no data
        return
      }

      try {
        // 1. Generate QR code as a data URL (without logo first)
        // We need to use toDataURL to get pixel data or draw to an offscreen canvas
        const tempCanvas = document.createElement('canvas')
        await QRCode.toCanvas(tempCanvas, data, {
          ...qrCodeOptions,
          color: {
            dark: imageSettings.fgColor || '#000000FF', // QR code color
            light: imageSettings.bgColor || '#FFFFFFFF' // Background color
          }
        })

        const finalCanvas = canvasRef.current
        if (!finalCanvas || !isMounted) return

        const ctx = finalCanvas.getContext('2d')
        if (!ctx) {
          if (isMounted) setError('Could not get canvas context.')
          return
        }

        // Determine final canvas size
        const finalWidth = width || tempCanvas.width
        const finalHeight = height || tempCanvas.height
        finalCanvas.width = finalWidth
        finalCanvas.height = finalHeight

        // Fill background of final canvas (important if QR background is transparent or different)
        ctx.fillStyle = imageSettings.bgColor || '#FFFFFF'
        ctx.fillRect(0, 0, finalWidth, finalHeight)

        // Draw the QR code (from tempCanvas) onto the final canvas, scaling if necessary
        ctx.drawImage(
          tempCanvas,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height,
          0,
          0,
          finalWidth,
          finalHeight
        )

        // 2. Load and draw the logo if provided
        if (logoSrc) {
          const logoImage = new Image()
          logoImage.crossOrigin = 'Anonymous' // Handle CORS if logo is from another domain
          logoImage.onload = () => {
            if (!isMounted) return

            // Calculate logo size and position
            const qrActualSize = Math.min(finalWidth, finalHeight) // Base size on the smaller dimension
            const calculatedLogoWidth = qrActualSize * logoSizeRatio
            const calculatedLogoHeight = (logoImage.height / logoImage.width) * calculatedLogoWidth // Maintain aspect ratio

            const logoX = (finalWidth - calculatedLogoWidth) / 2
            const logoY = (finalHeight - calculatedLogoHeight) / 2

            // Optional: Draw a small white border/background behind the logo
            // to improve scannability if the logo has dark parts overlapping QR dark parts.
            // This helps with the error correction.
            const padding = Math.max(2, calculatedLogoWidth * 0.05) // Small padding around logo
            ctx.fillStyle = imageSettings.bgColor || '#FFFFFF' // Match QR background
            ctx.fillRect(
              logoX - padding,
              logoY - padding,
              calculatedLogoWidth + padding * 2,
              calculatedLogoHeight + padding * 2
            )

            ctx.drawImage(logoImage, logoX, logoY, calculatedLogoWidth, calculatedLogoHeight)

            // Get data URL from the final canvas
            const finalDataUrl = finalCanvas.toDataURL(qrCodeOptions.type || 'image/png')
            if (isMounted) {
              setQrDataURL(finalDataUrl)
              if (onQrReady) onQrReady(finalDataUrl)
            }
          }
          logoImage.onerror = () => {
            if (isMounted) {
              console.error('Failed to load logo image.')
              setError('Failed to load logo image.')
              // Proceed to set QR without logo
              const qrWithoutLogoUrl = finalCanvas.toDataURL(qrCodeOptions.type || 'image/png')
              setQrDataURL(qrWithoutLogoUrl)
              if (onQrReady) onQrReady(qrWithoutLogoUrl)
            }
          }
          logoImage.src = logoSrc
        } else {
          // No logo, just use the QR code drawn on the canvas
          const finalDataUrl = finalCanvas.toDataURL(qrCodeOptions.type || 'image/png')
          if (isMounted) {
            setQrDataURL(finalDataUrl)
            if (onQrReady) onQrReady(finalDataUrl)
          }
        }
      } catch (err) {
        console.error('QR code generation failed:', err)
        if (isMounted) setError((err as Error).message || 'Failed to generate QR code.')
      }
    }

    generateQrCode()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    logoSrc,
    logoSizeRatio,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(qrCodeOptions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(imageSettings),
    width,
    height
  ]) // Re-run if these change
  // Using JSON.stringify for objects in dependency array is a common way to detect deep changes.

  if (error) {
    return (
      <div style={{ color: 'red', ...style }} className={className}>
        Error: {error}
      </div>
    )
  }

  // Render an invisible canvas for drawing, and an img tag to display the result
  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {qrDataURL ? (
        <img
          src={qrDataURL}
          alt={alt}
          className={className}
          style={{ width: width || 'auto', height: height || 'auto', ...style }}
        />
      ) : (
        // Optional: Show a placeholder or loader while generating
        <div
          style={{
            width: width || 200,
            height: height || 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed grey',
            ...style
          }}
          className={className}
        >
          {data ? 'Generating QR...' : 'No data provided'}
        </div>
      )}
    </>
  )
}

export default QrCodeWithLogo
