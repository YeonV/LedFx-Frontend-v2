// // QrScannerState.ts (can be in the same file or separate)

// // import { Html5Qrcode, CameraDevice } from 'html5-qrcode'

// export interface ScannerState {
//   isLoadingCameras: boolean
//   isScanning: boolean
//   isStopping: boolean // Flag to prevent actions during stop
//   scannerInstance: Html5Qrcode | null
//   cameras: CameraDevice[]
//   selectedCameraId: string | undefined
//   errorMessage: string | null
//   isMounted: boolean // To help with async operations in useEffect cleanup
// }

// export type ScannerAction =
//   | { type: 'MOUNT' }
//   | { type: 'UNMOUNT' }
//   | { type: 'FETCH_CAMERAS_START' }
//   | { type: 'FETCH_CAMERAS_SUCCESS'; payload: CameraDevice[] }
//   | { type: 'FETCH_CAMERAS_ERROR'; payload: string }
//   | { type: 'SELECT_CAMERA'; payload: string }
//   | { type: 'SCANNER_START_INITIATE' } // About to call .start()
//   | { type: 'SCANNER_START_SUCCESS'; payload: Html5Qrcode }
//   | { type: 'SCANNER_START_ERROR'; payload: string }
//   | { type: 'SCANNER_STOP_INITIATE' } // About to call .stop()
//   | { type: 'SCANNER_STOP_SUCCESS' }
//   | { type: 'SCANNER_STOP_ERROR'; payload: string }
//   | { type: 'CLEAR_ERROR' }
//   | { type: 'SET_ERROR'; payload: string }

// export const initialScannerState: ScannerState = {
//   isLoadingCameras: false,
//   isScanning: false,
//   isStopping: false,
//   scannerInstance: null,
//   cameras: [],
//   selectedCameraId: undefined,
//   errorMessage: null,
//   isMounted: false
// }

// export function scannerReducer(state: ScannerState, action: ScannerAction): ScannerState {
//   switch (action.type) {
//     case 'MOUNT':
//       return { ...state, isMounted: true }
//     case 'UNMOUNT':
//       return { ...state, isMounted: false } // Further cleanup might be needed based on this
//     case 'FETCH_CAMERAS_START':
//       return { ...state, isLoadingCameras: true, errorMessage: null }
//     case 'FETCH_CAMERAS_SUCCESS': {
//       const cameras = action.payload
//       let selectedCameraId = state.selectedCameraId
//       if (
//         cameras.length > 0 &&
//         (!selectedCameraId || !cameras.some((c) => c.id === selectedCameraId))
//       ) {
//         const rearCamera = cameras.find((d) => d.label.toLowerCase().includes('back'))
//         selectedCameraId = rearCamera ? rearCamera.id : cameras[0].id
//       }
//       return { ...state, isLoadingCameras: false, cameras, selectedCameraId }
//     }
//     case 'FETCH_CAMERAS_ERROR':
//       return { ...state, isLoadingCameras: false, errorMessage: action.payload }
//     case 'SELECT_CAMERA':
//       return { ...state, selectedCameraId: action.payload, errorMessage: null } // Clear error on new camera
//     case 'SCANNER_START_INITIATE':
//       return { ...state, isScanning: true, errorMessage: null } // Optimistically set isScanning
//     case 'SCANNER_START_SUCCESS':
//       return { ...state, scannerInstance: action.payload, isScanning: true, isStopping: false }
//     case 'SCANNER_START_ERROR':
//       return { ...state, isScanning: false, errorMessage: action.payload, scannerInstance: null }
//     case 'SCANNER_STOP_INITIATE':
//       return { ...state, isStopping: true }
//     case 'SCANNER_STOP_SUCCESS':
//       // scannerInstance is nulled by the effect calling stop
//       return { ...state, isScanning: false, isStopping: false, scannerInstance: null }
//     case 'SCANNER_STOP_ERROR':
//       // Even if stop fails, we assume it's no longer usable.
//       return {
//         ...state,
//         isScanning: false,
//         isStopping: false,
//         errorMessage: action.payload,
//         scannerInstance: null
//       }
//     case 'CLEAR_ERROR':
//       return { ...state, errorMessage: null }
//     case 'SET_ERROR':
//       return { ...state, errorMessage: action.payload }
//     default:
//       return state
//   }
// }
