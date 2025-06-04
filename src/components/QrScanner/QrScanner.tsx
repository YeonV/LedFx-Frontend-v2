import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  IconButton
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { Scanner } from '@yudiel/react-qr-scanner'
import type { IDetectedBarcode } from '@yudiel/react-qr-scanner'

interface QrScannerDialogProps {
  open: boolean
  onClose: () => void
  onScanSuccess: (_decodedText: string) => void
  onScanErrorProp?: (_errorMessage: string) => void
}

const QrScanner: React.FC<QrScannerDialogProps> = ({
  open,
  onClose,
  onScanSuccess,
  onScanErrorProp
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDecode = (detectedCodes: IDetectedBarcode[]) => {
    console.log('QR Code Decoded by library:', detectedCodes)
    if (detectedCodes.length > 0 && detectedCodes[0].rawValue) {
      onScanSuccess(detectedCodes[0].rawValue)
      onClose()
    }
  }

  const handleError = (error: unknown) => {
    console.error('QR Scanner Library Error:', error)
    const message = typeof error === 'string' ? error : (error as any).message
    setErrorMessage(`Scan Error: ${message}. Try again or check camera permissions.`)
    if (onScanErrorProp) {
      onScanErrorProp(message)
    }
  }

  React.useEffect(() => {
    if (open) {
      setErrorMessage(null)
    }
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Scan Host QR Code
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: 0,
          '& .MuiDialogContent-root': {
            p: 0
          } /* Attempt to remove padding if library adds too much space */
        }}
      >
        {/*
          The library will render its own video feed and UI.
          We wrap it in a Box for potential sizing or styling.
        */}
        <Box
          sx={{
            width: '100%',
            minHeight: '300px',
            position: 'relative',
            overflow: 'hidden' /* Ensure video fits */
          }}
        >
          {open && (
            <Scanner
              onScan={handleDecode}
              onError={handleError}
              scanDelay={500}
              styles={{
                container: { width: '100%', height: '100%', paddingTop: '0' },
                video: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }
              }}
              components={{
                onOff: false,
                torch: true,
                zoom: true,
                finder: true
              }}
            />
          )}
        </Box>

        {errorMessage && (
          <Box sx={{ p: 2 }}>
            {' '}
            {/* Add padding back for the alert */}
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default QrScanner
