// src/MActionBar.tsx

import {
  Settings,
  Loop,
  PlayArrow,
  Save,
  Stop,
  Delete,
  Cancel,
  EmergencyRecording,
  Gamepad
  // FileDownload,
  // FileUpload
} from '@mui/icons-material'
import { Box, Collapse, Divider, IconButton, Stack, Tooltip } from '@mui/material'
import { useMatrixEditorContext } from '../MatrixEditorContext'
import DimensionSliders from './DimensionSliders'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import useStore from '../../../../../store/useStore'
import Webcam from '../../../../../components/Webcam/Webcam'
import GroupControls from './GroupControls'
import BladeIcon from '../../../../../components/Icons/BladeIcon/BladeIcon'
import MatrixStudioButton from '../MatrixStudio'
import { assignStudioColors } from '../studioPalette'
import { findUnknownDevices, type UnknownDevice } from '../importMatrix'
import ImportDevicesDialog from '../ImportDevicesDialog'

const MActionBar = ({
  virtual,
  camMapper,
  setCamMapper,
  m,
  setM
}: {
  virtual: any
  camMapper: boolean
  setCamMapper: any
  m: any
  setM: any
}) => {
  const {
    showPixelGraph,
    setShowPixelGraph,
    resetMatrix,
    clearMatrix,
    saveMatrix,
    rowN,
    colN,
    uniqueGroups
  } = useMatrixEditorContext()

  const [showSliders, setShowSliders] = useState(false)
  const [showGroupMove, setShowGroupMove] = useState(false)

  const features = useStore((state) => state.features)
  const getDevices = useStore((state) => state.getDevices)
  const addDevice = useStore((state) => state.addDevice)
  const devices = useStore((state) => state.devices)
  const virtuals = useStore((state) => state.virtuals)
  const virtualOrder = useStore((state) => state.virtualOrder)

  const pendingMatrixLayout = useStore((state) => state.ui.pendingMatrixLayout)
  const setPendingMatrixLayout = useStore((state) => state.ui.setPendingMatrixLayout)
  const showSnackbar = useStore((state) => state.ui.showSnackbar)
  const virtualEditorIsDirty = useStore((state) => state.virtualEditorIsDirty)
  const setExternalEditorOpen = useStore((state) => state.setExternalEditorOpen)

  const setExternalStudioRef = useStore((state) => state.setExternalStudioRef)

  const studioData = useMemo(() => {
    const deviceIdToVirtualIdMap = new Map<string, string>()
    Object.values(virtuals).forEach((v: any) => {
      if (v.is_device) {
        deviceIdToVirtualIdMap.set(v.is_device, v.id)
      }
    })

    const virtualIdToOrderMap = new Map<string, number>()
    virtualOrder.forEach((vo: any) => {
      virtualIdToOrderMap.set(vo.virtId, vo.order)
    })

    const eligible = Object.entries(devices).filter(
      ([id, device]) =>
        device.config.pixel_count !== undefined &&
        !id.startsWith('gap-') &&
        ['mask', 'foreground', 'background'].every((suffix) => !id.endsWith(suffix))
    )

    // Hand the studio a fixed palette family per device. It only auto-assigns
    // to devices that arrive without one, so this is what makes a layout reopen
    // in the colours it was left with.
    const studioColors = assignStudioColors(eligible.map(([id]) => id))

    return {
      name: virtual.id,
      matrixData: m,
      deviceList: eligible.map(([id, device]) => {
        const virtualId = deviceIdToVirtualIdMap.get(id)
        const order = virtualId ? virtualIdToOrderMap.get(virtualId) : undefined

        return {
          deviceId: id,
          count: device.config.pixel_count!,
          name: device.config.name || id,
          order,
          colors: studioColors.get(id)
        }
      })
    }
  }, [virtual.id, m, devices, virtualOrder, virtuals])

  // const isValidMatrixLayout = (data: any): boolean => {
  //   return Array.isArray(data.matrixData)
  // }

  // const handleJsonFile = useCallback(
  //   (file: File) => {
  //     const reader = new FileReader()
  //     reader.readAsText(file, 'UTF-8')
  //     reader.onload = (event: any) => {
  //       try {
  //         const data = JSON.parse(event.target.result)
  //         if (isValidMatrixLayout(data)) {
  //           setPendingMatrixLayout(data)
  //           showSnackbar('success', `Layout '${data.name || 'Untitled'}' is ready to import.`)
  //         } else {
  //           showSnackbar('error', 'Unrecognized matrix layout format')
  //         }
  //       } catch (_error) {
  //         showSnackbar('error', 'Failed to parse JSON')
  //       }
  //     }
  //   },
  //   [setPendingMatrixLayout, showSnackbar]
  // )

  // const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) handleJsonFile(file)
  //   if (event.target) event.target.value = ''
  // }

  // A layout held back because it references devices LedFx does not have.
  const [pendingImport, setPendingImport] = useState<{
    matrixData: any
    unknown: UnknownDevice[]
  } | null>(null)
  const [creatingDevices, setCreatingDevices] = useState(false)

  /**
   * Single gate for every way a layout enters the editor - internal studio,
   * external studio and dropped JSON file. An unknown device id makes the
   * backend reject the entire segment list on save, so it is caught here rather
   * than surfacing later as a save that silently reverts.
   */
  const applyImportedMatrix = useCallback(
    (matrixData: any) => {
      if (!Array.isArray(matrixData)) return
      const unknown = findUnknownDevices(matrixData, devices)
      if (unknown.length === 0) {
        setM(matrixData)
        showSnackbar('success', 'Matrix layout imported!')
        return
      }
      setPendingImport({ matrixData, unknown })
    },
    [devices, setM, showSnackbar]
  )

  const confirmImportWithDummies = useCallback(async () => {
    if (!pendingImport) return
    setCreatingDevices(true)
    try {
      for (const device of pendingImport.unknown) {
        // Sequential: each POST rewrites the device config file, so parallel
        // creates can drop one another's entry.
        await addDevice({
          type: 'dummy',
          config: {
            center_offset: 0,
            icon_name: 'mdi:help-circle-outline',
            name: device.deviceId,
            pixel_count: device.pixelCount,
            refresh_rate: 64
          }
        })
      }
      await getDevices()

      // Ledfx() swallows request failures into a snackbar, so confirm against a
      // fresh device list rather than assuming every create landed. Importing a
      // layout that still cannot be saved would put back exactly the silent
      // revert this dialog exists to prevent.
      const stillMissing = findUnknownDevices(pendingImport.matrixData, useStore.getState().devices)
      if (stillMissing.length > 0) {
        showSnackbar(
          'error',
          `Could not create ${stillMissing.map((d) => d.deviceId).join(', ')} - layout not imported`
        )
        setPendingImport({ ...pendingImport, unknown: stillMissing })
        return
      }

      setM(pendingImport.matrixData)
      showSnackbar(
        'success',
        `Created ${pendingImport.unknown.length} dummy device${pendingImport.unknown.length === 1 ? '' : 's'} and imported the layout`
      )
      setPendingImport(null)
    } finally {
      setCreatingDevices(false)
    }
  }, [pendingImport, addDevice, getDevices, setM, showSnackbar])

  useEffect(() => {
    if (pendingMatrixLayout) {
      applyImportedMatrix(pendingMatrixLayout.matrixData)
      setPendingMatrixLayout(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMatrixLayout])

  // A studio window that has been opened but not yet handed its layout. Held in
  // a ref so the message listener below can reach the latest payload without
  // resubscribing every time the matrix changes.
  const pendingStudioTransfer = useRef<{
    window: Window
    url: string
    payload: typeof studioData
  } | null>(null)

  const sendStudioPayload = useCallback(() => {
    const pending = pendingStudioTransfer.current
    if (!pending || pending.window.closed) return
    // Exactly once: the studio reloads its state from every payload it gets, so
    // a late duplicate would discard whatever the user had already drawn.
    pendingStudioTransfer.current = null
    pending.window.postMessage({ ...pending.payload, source: 'LedFx' }, pending.url)
  }, [])

  useEffect(() => {
    const handleEditorUpdate = (event: MessageEvent) => {
      const matrixStudioOrigin =
        process.env.NODE_ENV === 'production'
          ? 'https://studio.ledfx.stream'
          : 'http://localhost:5173'
      if (
        !(
          event.origin === matrixStudioOrigin ||
          event.origin === window.location.origin ||
          event.origin === 'https://yeonv.github.io' ||
          event.origin === 'https://studio.ledfx.stream'
        )
      ) {
        console.warn(
          `Received message from unknown origin: ${event.origin}. Expected: ${matrixStudioOrigin}`
        )
        return
      }
      // console.log('Received message from MatrixStudio:', event.data)

      const data = event.data
      // The studio signals when its own listener is live; hand the layout over
      // then rather than hoping it booted inside the fallback timeout.
      if (data?.source === 'MatrixStudio' && data.action === 'ready') {
        sendStudioPayload()
        return
      }
      if (data && Array.isArray(data.matrixData) && data.source === 'MatrixStudio') {
        setExternalStudioRef(null)
        applyImportedMatrix(data.matrixData)
        // --- When data is received, the session is over. Unlock the UI. ---
        setExternalEditorOpen(false)
      }
    }
    window.addEventListener('message', handleEditorUpdate)
    return () => window.removeEventListener('message', handleEditorUpdate)
  }, [
    applyImportedMatrix,
    showSnackbar,
    setExternalEditorOpen,
    setExternalStudioRef,
    sendStudioPayload
  ])

  return (
    <Box>
      <ImportDevicesDialog
        unknown={pendingImport?.unknown ?? null}
        busy={creatingDevices}
        onCreate={confirmImportWithDummies}
        onCancel={() => {
          setPendingImport(null)
          showSnackbar('info', 'Import discarded - the matrix is unchanged')
        }}
      />
      <Collapse in={camMapper}>
        {camMapper && (
          <Box
            sx={{
              pt: 2,
              pl: 2,
              borderTop: 1,
              borderColor: 'divider',
              backgroundColor: 'background.paper'
            }}
          >
            <Webcam rowN={rowN} colN={colN} />
          </Box>
        )}
      </Collapse>
      <Collapse in={showGroupMove}>
        <Box
          sx={{
            p: 1,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        >
          <GroupControls />
        </Box>
      </Collapse>
      <Collapse in={showSliders}>
        <Box
          sx={{
            pt: 2,
            pl: 2,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        >
          <DimensionSliders />
        </Box>
      </Collapse>
      <Box
        sx={{
          p: 0.5,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={0.5}>
            <Tooltip
              title={
                showSliders
                  ? 'Exit Resize'
                  : virtualEditorIsDirty
                    ? 'Cannot Resize with Unsaved Changes'
                    : 'Resize Matrix'
              }
            >
              <div>
                <IconButton
                  size="large"
                  onClick={() => setShowSliders(!showSliders)}
                  disabled={virtualEditorIsDirty}
                >
                  {showSliders ? <Cancel /> : <Settings />}
                </IconButton>
              </div>
            </Tooltip>

            {features.matrix_cam && (
              <>
                <Tooltip title={camMapper ? 'Exit CameraMapper' : 'Map Pixels via Camera'}>
                  <IconButton
                    className="step-2d-virtual-cam-toggle"
                    size="large"
                    onClick={() => {
                      getDevices()
                      setCamMapper(!camMapper)
                    }}
                  >
                    {camMapper ? <Cancel /> : <EmergencyRecording />}
                  </IconButton>
                </Tooltip>
              </>
            )}
            {uniqueGroups.length > 0 && (
              <>
                <Tooltip title={showGroupMove ? 'Exit Group Movement' : 'Move Groups via Buttons'}>
                  <IconButton size="large" onClick={() => setShowGroupMove(!showGroupMove)}>
                    {showGroupMove ? <Cancel /> : <Gamepad />}
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Divider orientation="vertical" flexItem />
            {/* <Tooltip title="Export to YZ Matrix Editor">
              <IconButton
                size="large"
                onClick={() => {
                  const dataStr = JSON.stringify(studioData, null, 2)
                  const blob = new Blob([dataStr], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${virtual.id}.json`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
              >
                <FileDownload />
              </IconButton>
            </Tooltip>

            <Tooltip title="Import from YZ Matrix Editor">
              <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                sx={{ minWidth: '40px', p: '8px', border: 0 }}
                onClick={(e) => e.stopPropagation()}
                onContextMenu={(e) => e.preventDefault()}
              >
                <FileUpload />
                <input type="file" onChange={handleFileSelected} hidden accept=".json" />
              </Button>
            </Tooltip> */}
            <Tooltip title="Edit in MatrixStudio (external)">
              <IconButton
                size="large"
                onClick={() => {
                  const url =
                    process.env.NODE_ENV === 'production'
                      ? 'https://studio.ledfx.stream'
                      : 'http://localhost:5173'
                  setExternalEditorOpen(true)
                  const newWindow = window.open(url, '_blank')
                  if (!newWindow) {
                    showSnackbar(
                      'error',
                      'Failed to open MatrixStudio. Please check your popup blocker.'
                    )
                    setExternalEditorOpen(false)
                    return
                  }
                  setExternalStudioRef(newWindow)
                  pendingStudioTransfer.current = { window: newWindow, url, payload: studioData }
                  // The studio normally asks for the layout as soon as it is
                  // listening. This only covers builds that predate that signal.
                  setTimeout(sendStudioPayload, 500)
                }}
              >
                <BladeIcon name="yz:logo2" />
              </IconButton>
            </Tooltip>
            <MatrixStudioButton
              defaultValue={studioData?.matrixData}
              deviceList={studioData?.deviceList}
              handleSave={(data) => applyImportedMatrix(data)}
            />
            <Divider orientation="vertical" flexItem />
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <Tooltip title={showPixelGraph ? 'Hide Live Preview' : 'Show Live Preview'}>
              <IconButton size="large" onClick={() => setShowPixelGraph(!showPixelGraph)}>
                {showPixelGraph ? <Stop /> : <PlayArrow />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset to last saved state">
              <IconButton size="large" onClick={resetMatrix} disabled={!virtualEditorIsDirty}>
                <Loop />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Matrix">
              <IconButton size="large" onClick={clearMatrix}>
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save Changes">
              <IconButton
                color={virtualEditorIsDirty ? 'error' : 'inherit'}
                size="large"
                onClick={() => saveMatrix()}
              >
                <Save />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default MActionBar
