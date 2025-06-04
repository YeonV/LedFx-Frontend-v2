import React, { useEffect, useReducer, useCallback, useId, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { Html5Qrcode, Html5QrcodeResult, Html5QrcodeScannerState } from 'html5-qrcode'
import { ScannerState, ScannerAction, initialScannerState, scannerReducer } from './QrScanner.props' // Adjust path

interface QrScannerProps {
  open: boolean
  onClose: () => void
  onScanSuccess: (_decodedText: string) => void
  onScannerError?: (_errorMessage: string) => void // Renamed from onError to avoid conflict
}

const QrScanner: React.FC<QrScannerProps> = ({ open, onClose, onScanSuccess, onScannerError }) => {
  const [state, dispatch] = useReducer(scannerReducer, initialScannerState)
  const {
    isLoadingCameras,
    isScanning,
    isStopping,
    scannerInstance,
    cameras,
    selectedCameraId,
    errorMessage,
    isMounted
  } = state

  const domElementIdSuffix = useId()
  const videoContainerId = `qr-reader-${domElementIdSuffix}`
  const videoElementRef = useRef<HTMLDivElement>(null) // Ref for the container div

  // --- Imperative Scanner Operations ---

  const stopActiveScanner = useCallback(
    async (instanceToStop: Html5Qrcode): Promise<void> => {
      if (!isMounted) {
        // Check if component is still mounted
        console.warn('stopActiveScanner: Component not mounted, aborting stop.')
        return
      }
      dispatch({ type: 'SCANNER_STOP_INITIATE' })
      try {
        if (
          instanceToStop.getState() === Html5QrcodeScannerState.SCANNING ||
          instanceToStop.getState() === Html5QrcodeScannerState.PAUSED
        ) {
          await instanceToStop.stop()
          console.log('Beastmode: Scanner instance stopped.')
        }
        await instanceToStop.clear() // Crucial for DOM cleanup
        console.log('Beastmode: Scanner instance cleared.')
        if (isMounted) dispatch({ type: 'SCANNER_STOP_SUCCESS' })
      } catch (err: any) {
        console.error('Beastmode: Error stopping/clearing scanner:', err)
        if (isMounted)
          dispatch({ type: 'SCANNER_STOP_ERROR', payload: err.message || 'Failed to stop scanner' })
      }
    },
    [isMounted]
  ) // dispatch is stable

  const startNewScanner = useCallback(
    async (cameraId: string): Promise<void> => {
      if (!isMounted || !videoElementRef.current) {
        console.warn('startNewScanner: Component not mounted or video element ref not available.')
        if (isMounted)
          dispatch({ type: 'SCANNER_START_ERROR', payload: 'Scanner element not ready.' })
        return
      }
      if (isScanning || isStopping || scannerInstance) {
        console.warn(
          'Beastmode: Attempted to start scanner when already scanning, stopping, or instance exists.'
        )
        return
      }

      dispatch({ type: 'SCANNER_START_INITIATE' })
      const newScanner = new Html5Qrcode(videoContainerId, { verbose: false })

      const successCallback = async (decodedText: string, decodedResult: Html5QrcodeResult) => {
        console.log('Beastmode: QR Scanned:', decodedText, decodedResult)
        // Important: Stop scanner before calling parent callbacks
        if (isMounted && newScanner === state.scannerInstance) {
          // Ensure it's the current instance
          await stopActiveScanner(newScanner) // state.scannerInstance could be stale here due to closure
        }
        if (isMounted) {
          // Re-check isMounted after await
          onScanSuccess(decodedText)
          onClose()
        }
      }

      const errorCallback = (error: any) => {
        const message = typeof error === 'string' ? error : error.message
        if (
          message &&
          !message.includes('NotFoundException') &&
          !message.toLowerCase().includes('qr code parse error')
        ) {
          console.warn('Beastmode: QR Scan Error (transient):', message)
          // Don't dispatch an error for every scan attempt failure
        }
      }

      try {
        await newScanner.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          successCallback,
          errorCallback
        )
        if (isMounted) dispatch({ type: 'SCANNER_START_SUCCESS', payload: newScanner })
        console.log('Beastmode: Scanner started successfully with camera:', cameraId)
      } catch (err: any) {
        console.error('Beastmode: Failed to start scanner:', err)
        if (isMounted) {
          dispatch({
            type: 'SCANNER_START_ERROR',
            payload: err.message || 'Failed to start scanner'
          })
          if (onScannerError) onScannerError(err.message || 'Failed to start scanner')
        }
      }
    },
    [
      isMounted,
      videoContainerId,
      isScanning,
      isStopping,
      scannerInstance,
      state.scannerInstance,
      stopActiveScanner,
      onScanSuccess,
      onClose,
      onScannerError
    ]
  ) // dispatch is stable

  // --- Effect for Mounting/Unmounting ---
  useEffect(() => {
    dispatch({ type: 'MOUNT' })
    return () => {
      dispatch({ type: 'UNMOUNT' })
    }
  }, []) // dispatch is stable

  // --- Effect for Open/Close Dialog and Camera Fetching ---
  useEffect(() => {
    if (!isMounted) return

    if (open) {
      dispatch({ type: 'CLEAR_ERROR' })
      dispatch({ type: 'FETCH_CAMERAS_START' })
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (isMounted) {
            // Check mount status after async operation
            if (devices && devices.length) {
              dispatch({ type: 'FETCH_CAMERAS_SUCCESS', payload: devices })
            } else {
              dispatch({ type: 'FETCH_CAMERAS_ERROR', payload: 'No cameras found.' })
              if (onScannerError) onScannerError('No cameras found.')
            }
          }
        })
        .catch((err) => {
          if (isMounted) {
            console.error('Beastmode: Error getting cameras:', err)
            const msg = `Camera access error: ${err.message || err}`
            dispatch({ type: 'FETCH_CAMERAS_ERROR', payload: msg })
            if (onScannerError) onScannerError(msg)
          }
        })
    } else {
      // Dialog is closing, stop scanner if active
      if (scannerInstance && !isStopping) {
        stopActiveScanner(scannerInstance)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isMounted, onScannerError]) // stopActiveScanner, dispatch are stable

  // --- Effect for Starting/Stopping Scanner Based on State Changes ---
  useEffect(() => {
    if (!isMounted || !open) return

    if (
      selectedCameraId &&
      !isLoadingCameras &&
      !isScanning &&
      !isStopping &&
      !scannerInstance &&
      videoElementRef.current
    ) {
      // Conditions are met to start a new scan
      console.log('Beastmode: Conditions met, attempting to start scanner.')
      startNewScanner(selectedCameraId)
    } else if ((!selectedCameraId || isStopping) && scannerInstance) {
      // Conditions met to stop (e.g. camera deselected, or explicit stop triggered)
      console.log('Beastmode: Conditions met, attempting to stop scanner.')
      stopActiveScanner(scannerInstance)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isMounted,
    open,
    selectedCameraId,
    isLoadingCameras,
    isScanning,
    isStopping,
    scannerInstance
    // startNewScanner and stopActiveScanner are stable due to useCallback
  ])

  const handleCameraChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newCameraId = event.target.value
      if (scannerInstance && !isStopping) {
        // If currently scanning, stop it first
        stopActiveScanner(scannerInstance).then(() => {
          if (isMounted) dispatch({ type: 'SELECT_CAMERA', payload: newCameraId })
        })
      } else if (isMounted) {
        dispatch({ type: 'SELECT_CAMERA', payload: newCameraId })
      }
    },
    [scannerInstance, isStopping, stopActiveScanner, isMounted]
  ) // dispatch is stable

  const handleDialogClose = useCallback(() => {
    if (isStopping) {
      console.warn('Beastmode: Attempted to close dialog while scanner is stopping. Deferring.')
      return // Optionally, disable close button or wait
    }
    onClose()
  }, [isStopping, onClose])

  // Show placeholder text if conditions are met
  const showPlaceholder =
    !isLoadingCameras && !isScanning && !errorMessage && cameras.length > 0 && open

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Scan Host QR (Beastmode)
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          disabled={isStopping}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoadingCameras && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px'
            }}
          >
            <CircularProgress /> <Typography sx={{ mt: 2 }}>Loading cameras...</Typography>
          </Box>
        )}
        {!isLoadingCameras && cameras.length > 0 && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id={`bm-camera-select-label-${domElementIdSuffix}`}>Camera</InputLabel>
            <Select
              labelId={`bm-camera-select-label-${domElementIdSuffix}`}
              id={`bm-camera-select-${domElementIdSuffix}`}
              value={selectedCameraId || ''}
              label="Camera"
              onChange={handleCameraChange}
              disabled={isScanning || isLoadingCameras || isStopping}
            >
              {cameras.map((camera: any) => (
                <MenuItem key={camera.id} value={camera.id}>
                  {camera.label || `Camera ${camera.id.substring(0, 8)}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Box
          id={videoContainerId}
          ref={videoElementRef} // Assign ref here
          sx={{
            width: '100%',
            minHeight: '250px',
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor:
              isScanning || isLoadingCameras ? 'action.disabledBackground' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {showPlaceholder &&
            !isScanning && ( // Double ensure not scanning for placeholder
              <Typography color="textSecondary">Camera ready. Point at QR code.</Typography>
            )}
        </Box>
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {!isLoadingCameras && cameras.length === 0 && !errorMessage && (
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            No cameras or permission denied.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} disabled={isStopping}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default QrScanner
