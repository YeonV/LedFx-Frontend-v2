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
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import useStore from '../../../../../store/useStore'
import Webcam from '../../../../../components/Webcam/Webcam'
import GroupControls from './GroupControls'
import BladeIcon from '../../../../../components/Icons/BladeIcon/BladeIcon'
import MatrixStudioButton from '../MatrixStudio'

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

    return {
      name: virtual.id,
      matrixData: m,
      deviceList: Object.entries(devices)
        .filter(
          ([id, device]) =>
            device.config.pixel_count !== undefined &&
            !id.startsWith('gap-') &&
            ['mask', 'foreground', 'background'].every((suffix) => !id.endsWith(suffix))
        )
        .map(([id, device]) => {
          const virtualId = deviceIdToVirtualIdMap.get(id)
          const order = virtualId ? virtualIdToOrderMap.get(virtualId) : undefined

          return {
            deviceId: id,
            count: device.config.pixel_count!,
            name: device.config.name || id,
            order
          }
        })
    }
  }, [virtual.id, m, devices, virtualOrder, virtuals])

  const isValidMatrixLayout = (data: any): boolean => {
    return Array.isArray(data.matrixData)
  }

  const handleJsonFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result)
          if (isValidMatrixLayout(data)) {
            setPendingMatrixLayout(data)
            showSnackbar('success', `Layout '${data.name || 'Untitled'}' is ready to import.`)
          } else {
            showSnackbar('error', 'Unrecognized matrix layout format')
          }
        } catch (_error) {
          showSnackbar('error', 'Failed to parse JSON')
        }
      }
    },
    [setPendingMatrixLayout, showSnackbar]
  )

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) handleJsonFile(file)
    if (event.target) event.target.value = ''
  }

  useEffect(() => {
    if (pendingMatrixLayout) {
      setM(pendingMatrixLayout.matrixData)
      showSnackbar('success', 'Matrix layout imported!')
      setPendingMatrixLayout(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMatrixLayout])

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
      if (data && Array.isArray(data.matrixData) && data.source === 'MatrixStudio') {
        setM(data.matrixData)
        showSnackbar('success', 'Matrix layout updated!')
        // --- When data is received, the session is over. Unlock the UI. ---
        setExternalEditorOpen(false)
      }
    }
    window.addEventListener('message', handleEditorUpdate)
    return () => window.removeEventListener('message', handleEditorUpdate)
  }, [setM, showSnackbar, setExternalEditorOpen])

  const mountTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    const uptime = Date.now() - mountTimeRef.current

    if (uptime > 3000) {
      return
    }
    if (m.length > 0 && m[0]?.length > 0) {
      const matrixIsEmpty = m?.every((row: any) => row.every((cell: any) => cell.deviceId === ''))
      if (matrixIsEmpty) {
        resetMatrix()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m])

  return (
    <Box>
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
          <DimensionSliders virtual={virtual} />
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
            <Tooltip title={showSliders ? 'Exit Resize' : 'Resize Matrix'}>
              <IconButton size="large" onClick={() => setShowSliders(!showSliders)}>
                {showSliders ? <Cancel /> : <Settings />}
              </IconButton>
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
                    process.env.NODE_ENV === 'production' // quickly reversed logic for testing
                      ? 'https://studio.ledfx.stream'
                      : 'http://localhost:5173'
                  setExternalEditorOpen(true)
                  const newWindow = window.open(url, '_blank')
                  setTimeout(() => {
                    if (newWindow) {
                      setExternalStudioRef(newWindow)
                      newWindow.postMessage({ ...studioData, source: 'LedFx' }, url)
                    } else {
                      showSnackbar(
                        'error',
                        'Failed to open MatrixStudio. Please check your popup blocker.'
                      )
                      // If it fails to open, immediately reset the flag.
                      setExternalEditorOpen(false)
                    }
                  }, 500)
                }}
              >
                <BladeIcon name="yz:logo2" />
              </IconButton>
            </Tooltip>
            <MatrixStudioButton
              defaultValue={studioData?.matrixData}
              deviceList={studioData?.deviceList}
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
              <IconButton size="large" onClick={resetMatrix}>
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
                onClick={saveMatrix}
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
