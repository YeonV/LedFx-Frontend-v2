import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { DndContext } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'
import { MCell, clone } from './M.utils'
import useStore from '../../../../store/useStore'
import useStyles from './M.styles'
import MWrapper from './MWrapper'
import MControls from './MControls/MControls'
import Droppable from './Droppable'
import Draggable from './Draggable'
import Pixel from './Pixel'
import MContextMenu from './MContextMenu'
import AssignPixelDialog from './AssignPixelDialog'
import PixelGraph from '../../../../components/PixelGraph/PixelGraph'
import { useMatrixEditor } from './useMatrixEditor'
import { MatrixEditorContext } from './MatrixEditorContext'
import { useAssignPixelDialog } from './useAssignPixelDialog'
import { deepEqual } from '../../../../utils/helpers'
import { OpenInNew } from '@mui/icons-material'

export interface EditMatrixRef {
  saveMatrix: () => void
}

const ExternalEditorPlaceholder = () => {
  const setExternalEditorOpen = useStore((state) => state.setExternalEditorOpen)
  const externalStudioRef = useStore((state) => state.externalStudioRef)
  const setExternalStudioRef = useStore((state) => state.setExternalStudioRef)
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        textAlign: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
      }}
    >
      <OpenInNew sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Matrix is being edited in an external window.
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Please save your changes in the MatrixStudio tab to unlock this editor.
      </Typography>
      <Button
        variant="outlined"
        color="warning"
        onClick={() => {
          const matrixStudioOrigin =
            process.env.NODE_ENV === 'production'
              ? 'https://studio.ledfx.stream'
              : 'http://localhost:5173'
          const windowToClose = externalStudioRef
          setExternalStudioRef(null)
          setExternalEditorOpen(false)
          if (windowToClose && !windowToClose.closed) {
            windowToClose.postMessage({ source: 'LedFx', action: 'close' }, matrixStudioOrigin)
          }
          setExternalEditorOpen(false)
        }}
      >
        Force Close & Discard External Changes
      </Button>
    </Box>
  )
}

const EditMatrix = forwardRef<EditMatrixRef, { virtual: any }>(({ virtual }, ref) => {
  const classes = useStyles()
  const points = useStore((state) => state.points)
  const setVirtualEditorIsDirty = useStore((state) => state.setVirtualEditorIsDirty)

  const isExternalEditorOpen = useStore((state) => state.isExternalEditorOpen)

  // --- STATE MANAGEMENT ---
  const matrixEditorApi = useMatrixEditor(virtual)

  useImperativeHandle(ref, () => ({
    saveMatrix: matrixEditorApi.saveMatrix
  }))

  // Pass the required dependencies from the main hook into the dialog hook.
  const assignPixelDialogApi = useAssignPixelDialog({
    m: matrixEditorApi.m,
    setM: matrixEditorApi.setM,
    rowN: matrixEditorApi.rowN,
    colN: matrixEditorApi.colN,
    pixelGroups: matrixEditorApi.pixelGroups,
    setPixelGroups: matrixEditorApi.setPixelGroups,
    clearPixel: matrixEditorApi.clearPixel
  })

  // Local UI state for the context menu's anchor element and target cell
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [contextMenuCell, setContextMenuCell] = useState<[number, number]>([-1, -1])

  const [initialSnapshot, setInitialSnapshot] = useState<any>(null)

  // --- EVENT HANDLERS ---
  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    col: number,
    row: number
  ) => {
    e.preventDefault()
    e.stopPropagation()
    const cellData = matrixEditorApi.m[row]?.[col]

    if (cellData?.deviceId) {
      setContextMenuCell([col, row])
      setAnchorEl(e.currentTarget)
    } else if (cellData) {
      assignPixelDialogApi.openDialog([col, row], cellData)
    }
  }

  const closeMenu = () => setAnchorEl(null)

  // --- LIFECYCLE EFFECTS ---
  useEffect(() => {
    // On mount, or when the virtual ID changes, take a snapshot.
    if (matrixEditorApi.m) {
      setInitialSnapshot(JSON.parse(JSON.stringify(matrixEditorApi.m)))
    }
    // Always reset the dirty flag when a new virtual is loaded.
    setVirtualEditorIsDirty(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtual.id, setVirtualEditorIsDirty])

  useEffect(() => {
    // Whenever the matrix 'm' changes, compare it to the snapshot.
    if (initialSnapshot && matrixEditorApi.m) {
      if (!deepEqual(initialSnapshot, matrixEditorApi.m)) {
        setVirtualEditorIsDirty(true)
      } else {
        setVirtualEditorIsDirty(false)
      }
    }
  }, [matrixEditorApi.m, initialSnapshot, setVirtualEditorIsDirty])

  useEffect(() => {
    matrixEditorApi.setM(Array(matrixEditorApi.rowN).fill(Array(matrixEditorApi.colN).fill(MCell)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matrixEditorApi.rowN, matrixEditorApi.colN, matrixEditorApi.setM])

  useEffect(() => {
    if (points.length > 0) {
      const updatedM = clone(matrixEditorApi.m)
      const p = points[points.length - 1]
      if (
        !isNaN(p.x) &&
        !isNaN(p.y) &&
        p.x > 0 &&
        p.y > 0 &&
        p.x <= matrixEditorApi.colN &&
        p.y <= matrixEditorApi.rowN
      ) {
        updatedM[p.y - 1][p.x - 1] = {
          deviceId: p.device,
          pixel: p.led,
          group: `group-${p.segment + 1}`
        }
        matrixEditorApi.setM(updatedM)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, matrixEditorApi.colN, matrixEditorApi.rowN, matrixEditorApi.m, matrixEditorApi.setM])

  return (
    <>
      {isExternalEditorOpen && <ExternalEditorPlaceholder />}
      <MatrixEditorContext.Provider value={matrixEditorApi}>
        <MWrapper move={matrixEditorApi.dnd}>
          <Stack
            direction="column"
            spacing={2}
            sx={{
              height: '100%',
              overflowX: 'hidden',
              flex: '0 0 480px',
              paddingTop: '1rem',
              bgcolor: 'action.disabledBackground',
              p: 0
            }}
          >
            <MControls virtual={virtual} m={matrixEditorApi.m} setM={matrixEditorApi.setM} />
          </Stack>
          <Box sx={{ flexGrow: 1, overflow: 'hidden', height: '100%' }}>
            <TransformWrapper
              disabled={matrixEditorApi.dnd || matrixEditorApi.dndMode === 'group'}
              centerZoomedOut
              minScale={0.1}
            >
              <TransformComponent>
                <div
                  className={classes.gridCellContainer}
                  style={{
                    width: matrixEditorApi.colN * 100,
                    height: matrixEditorApi.rowN * 100
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
                    <DndContext
                      modifiers={[restrictToFirstScrollableAncestor]}
                      onDragStart={matrixEditorApi.handleDragStart}
                      onDragEnd={matrixEditorApi.handleDragEnd}
                      onDragOver={matrixEditorApi.handleDragOver}
                    >
                      {matrixEditorApi.m.map((yzrow, currentRowIndex) => (
                        <div key={`row-${currentRowIndex}`} style={{ display: 'flex' }}>
                          {yzrow.map((yzcolumn, currentColIndex) => (
                            <Droppable
                              id={`${currentColIndex}-${currentRowIndex}`}
                              key={`col-${currentColIndex}`}
                              bg={yzcolumn.deviceId !== '' ? 'transparent' : '#00000090'}
                              onContextMenu={(e) =>
                                handleContextMenu(e, currentColIndex, currentRowIndex)
                              }
                              onClick={() => {
                                if (
                                  matrixEditorApi.dndMode === 'group' &&
                                  yzcolumn.deviceId === ''
                                ) {
                                  matrixEditorApi.setSelectedGroup('')
                                }
                              }}
                            >
                              <Box sx={{ opacity: 1 }}>
                                {matrixEditorApi.dnd ? (
                                  yzcolumn.deviceId !== '' ? (
                                    <Draggable id={`${currentColIndex}-${currentRowIndex}`}>
                                      <Pixel classes={classes} yzcolumn={yzcolumn} />
                                    </Draggable>
                                  ) : null
                                ) : (
                                  <Pixel classes={classes} yzcolumn={yzcolumn} />
                                )}
                              </Box>
                            </Droppable>
                          ))}
                        </div>
                      ))}
                    </DndContext>
                  </div>
                  {virtual.id && matrixEditorApi.showPixelGraph && (
                    <PixelGraph
                      showMatrix={true}
                      virtId={virtual.id}
                      active={true}
                      dummy={false}
                      fullScreen
                      fill
                    />
                  )}
                  <MContextMenu
                    anchorEl={anchorEl}
                    closeContextMenu={closeMenu}
                    currentCell={contextMenuCell}
                    onEdit={() => {
                      const [col, row] = contextMenuCell
                      const cellData = matrixEditorApi.m[row]?.[col]
                      if (cellData) {
                        assignPixelDialogApi.openDialog(contextMenuCell, cellData)
                      }
                      closeMenu()
                    }}
                  />
                  <AssignPixelDialog dialogApi={assignPixelDialogApi} />
                </div>
              </TransformComponent>
            </TransformWrapper>
          </Box>
        </MWrapper>
      </MatrixEditorContext.Provider>
    </>
  )
})

export default EditMatrix
