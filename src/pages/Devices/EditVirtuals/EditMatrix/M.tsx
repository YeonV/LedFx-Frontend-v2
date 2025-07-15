import { useEffect, useRef, useState, FC } from 'react'
import { Box, Stack, useTheme } from '@mui/material'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'
import { MCell, clone, getMaxRange } from './M.utils'
import type { IMCell, IDir } from './M.utils'
import useStore from '../../../../store/useStore'
import useStyles from './M.styles'
import MWrapper from './MWrapper'
import MControls from './MControls/MControls'
import Droppable from './Droppable'
import Draggable from './Draggable'
import Pixel from './Pixel'
// import hexColor from './Actions/hexColor'
import MContextMenu from './MContextMenu'
import AssignPixelDialog from './AssignPixelDialog'
import { Ledfx } from '../../../../api/ledfx'
import PixelGraph from '../../../../components/PixelGraph/PixelGraph'
import { reverseProcessArray } from './processMatrix'

const EditMatrix: FC<{ virtual: any }> = ({ virtual }) => {
  const classes = useStyles()
  const theme = useTheme()
  const deviceRef = useRef<HTMLInputElement | null>(null)

  const devices = useStore((state) => state.devices)
  // const mode = useStore((state) => state.config).transmission_mode
  const addDevice = useStore((state) => state.addDevice)
  const getDevices = useStore((state) => state.getDevices)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const updateVirtual = useStore((state) => state.updateVirtual)
  const setEffect = useStore((state) => state.setEffect)
  const points = useStore((state) => state.points)

  const [error, setError] = useState<{ row: number; col: number }[]>([])
  const [currentDevice, setCurrentDevice] = useState<string>('')
  const [rowN, setRowNumber] = useState<number>(virtual.config.rows || 8)
  const [colN, setColNumber] = useState<number>(
    Math.ceil(virtual.pixel_count / (virtual.config.rows || 1)) || 8
  )
  const [currentCell, setCurrentCell] = useState<[number, number]>([-1, -1])
  const [open, setOpen] = useState<boolean>(false)
  const [group, setGroup] = useState<boolean>(false)
  const [selectedPixel, setSelectedPixel] = useState<number | number[]>(0)
  const [direction, setDirection] = useState<IDir>('right')
  const [m, setM] = useState<IMCell[][]>(Array(rowN).fill(Array(colN).fill(MCell)))
  const [pixelGroups, setPixelGroups] = useState<number>(0)
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  // const [pixels, setPixels] = useState<any>([])
  const [move, setMove] = useState<boolean>(false)
  const [dnd, setDnd] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveringCell, setHoveringCell] = useState<[number, number]>([-1, -1])
  const [showPixelGraph, setShowPixelGraph] = useState<boolean>(false)

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    currentColIndex: number,
    currentRowIndex: number,
    yzcolumn: IMCell
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentCell([currentColIndex, currentRowIndex])
    setCurrentDevice(yzcolumn.deviceId !== '' ? yzcolumn.deviceId : '')
    setSelectedPixel(yzcolumn.pixel || 0)
    if (currentRowIndex > -1 && currentColIndex > -1) {
      if (m[currentRowIndex][currentColIndex]?.deviceId !== '') {
        setAnchorEl(e.currentTarget)
      } else {
        setOpen(true)
      }
    }
  }

  const closeClear = () => {
    setOpen(false)
    setCurrentDevice('')
    setSelectedPixel(0)
    setGroup(false)
  }

  const handleDirectionChange = (d: IDir) => {
    setDirection(d)
    if (typeof selectedPixel !== 'number') {
      const [col, row] = currentCell
      const maxRange = getMaxRange(direction, row, col, rowN, colN)
      const distance = selectedPixel[1] - selectedPixel[0]
      if (distance > maxRange) {
        setSelectedPixel([selectedPixel[0], selectedPixel[0] + maxRange])
      }
    }
  }

  const handleSliderChange = (
    e: Event,
    newPixelRange: number | [number, number],
    activeThumb: number
  ) => {
    if (typeof newPixelRange !== 'number') {
      const [col, row] = currentCell
      const maxRange = getMaxRange(direction, row, col, rowN, colN)
      const distance = Math.abs(newPixelRange[1] - newPixelRange[0])
      let adjustedLeftThumb = newPixelRange[0]
      let adjustedRightThumb = newPixelRange[1]
      if (distance > maxRange) {
        if (activeThumb === 0) {
          adjustedRightThumb = adjustedLeftThumb + maxRange
        } else {
          adjustedLeftThumb = adjustedRightThumb - maxRange
        }
      }
      const updatedSelectedPixel =
        direction === 'top'
          ? [adjustedRightThumb, adjustedLeftThumb]
          : [adjustedLeftThumb, adjustedRightThumb]
      setSelectedPixel(updatedSelectedPixel)
    } else {
      setSelectedPixel(newPixelRange)
    }
  }

  const clearPixel = () => {
    const updatedM = clone(m)
    const [col, row] = currentCell
    updatedM[row][col] = { deviceId: '', pixel: 0, group: 0 }
    setM(updatedM)
    closeClear()
  }

  const clearPixelGroup = (group: string | number) => {
    const updatedM = clone(m)
    m.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.group === group) {
          updatedM[rowIndex][colIndex] = { deviceId: '', pixel: 0, group: 0 }
        }
      })
    })
    setM(updatedM)
  }

  const executeGroupMove = (groupId: string, rowOffset: number, colOffset: number) => {
    // This function was already correct. Its inputs were just wrong.
    // Now that the inputs will be correct, it will work perfectly.
    const groupPixels = []
    for (let i = 0; i < rowN; i++) {
      for (let j = 0; j < colN; j++) {
        if (m[i][j].group === groupId) {
          groupPixels.push({ ...m[i][j], oldRow: i, oldCol: j })
        }
      }
    }
    if (groupPixels.length === 0) return

    // Phase 1: Pre-flight check
    for (const pixel of groupPixels) {
      const targetRow = pixel.oldRow + rowOffset
      const targetCol = pixel.oldCol + colOffset
      if (targetRow < 0 || targetRow >= rowN || targetCol < 0 || targetCol >= colN) {
        console.error('Move aborted: group would go out of bounds.')
        return
      }
      const targetCell = m[targetRow][targetCol]
      if (targetCell.deviceId !== '' && targetCell.group !== groupId) {
        console.error('Move aborted: collision with external pixel(s).')
        return
      }
    }

    // Phase 2: Execute Move
    const updatedM = clone(m)
    for (const pixel of groupPixels) {
      updatedM[pixel.oldRow][pixel.oldCol] = { deviceId: '', pixel: 0, group: '' }
    }
    for (const pixel of groupPixels) {
      const targetRow = pixel.oldRow + rowOffset
      const targetCol = pixel.oldCol + colOffset
      const { ...pixelData } = pixel
      updatedM[targetRow][targetCol] = pixelData as IMCell
    }
    setM(updatedM)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setIsDragging(false) // Do this once at the top

    if (!over || !over.id) {
      return
    }

    // --- UNIFIED PARSING ---
    // Since ALL IDs are now "col-row", this is the single source of truth for parsing.
    const [startCol, startRow] = (active.id as string).split('-').map(Number)
    const [endCol, endRow] = (over.id as string).split('-').map(Number)

    // Check for invalid parsing
    if (isNaN(startCol) || isNaN(startRow) || isNaN(endCol) || isNaN(endRow)) {
      console.error('DND parsing failed', { active, over })
      return
    }

    // --- UNIFIED LOGIC ---
    if (move) {
      const groupId = m[startRow][startCol]?.group
      if (groupId) {
        const rowOffset = endRow - startRow
        const colOffset = endCol - startCol
        executeGroupMove(groupId as string, rowOffset, colOffset)
      }
    } else {
      const updatedM = clone(m)
      if (updatedM[endRow][endCol].deviceId === '') {
        updatedM[endRow][endCol] = updatedM[startRow][startCol]
        updatedM[startRow][startCol] = { deviceId: '', pixel: 0, group: 0 }
        setM(updatedM)
      }
    }
  }

  // And the matching onDragStart
  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true)
    if (move) {
      const [col, row] = (event.active.id as string).split('-').map(Number)
      const groupId = m[row][col]?.group
      if (groupId) {
        setSelectedGroup(groupId)
      }
    }
  }

  /**
   * Set the selected pixel when the group changes
   */
  useEffect(() => {
    if (group) {
      if (typeof selectedPixel === 'number') {
        setSelectedPixel([selectedPixel, selectedPixel + 1])
      }
    } else if (typeof selectedPixel !== 'number') {
      setSelectedPixel(selectedPixel[0])
    }
  }, [group, selectedPixel])

  /**
   * Set the matrix when the row or column numbers change
   */
  useEffect(() => {
    setM(Array(rowN).fill(Array(colN).fill(MCell)))
  }, [rowN, colN])

  /**
   * Add a dummy device to the virtual if there are no devices
   */
  useEffect(() => {
    if (virtual.segments.length === 0) {
      if (!Object.values(devices).some((d) => d.id === `gap-${virtual.id}`)) {
        // add new device
        addDevice({
          type: 'dummy',
          config: {
            center_offset: 0,
            icon_name: 'mdi:eye-off',
            name: `gap-${virtual.id}`,
            pixel_count: 4096,
            refresh_rate: 64
          }
        }).then(() => {
          Ledfx(`/api/virtuals/${virtual.id}`, 'POST', {
            segments: [
              [`gap-${virtual.id}`, 0, virtual.config.rows * virtual.config.rows - 1, false]
            ]
          }).then(() => {
            getDevices()
            getVirtuals().then(() => {
              setEffect(virtual.id, 'equalizer2d', { bands: virtual.config.rows }, true).then(
                () => {
                  updateVirtual(virtual.id, true)
                }
              )
            })
          })
        })
      }
    } else {
      setM(reverseProcessArray(virtual.segments, colN))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Update the row and column numbers when the virtual changes
   */
  // useEffect(() => {
  //   setRowNumber(virtual.config.rows || 8)
  //   setColNumber(Math.ceil(virtual.pixel_count / (virtual.config.rows || 1)) || 8)
  // }, [virtual])

  /**
   * Update the matrix when a new point is added from the video mapper
   */
  useEffect(() => {
    if (points.length > 0) {
      const updatedM = clone(m)
      const p = points[points.length - 1]
      if (!isNaN(p.x) && !isNaN(p.y) && p.x > 0 && p.y > 0 && p.x <= colN && p.y <= rowN) {
        updatedM[p.y - 1][p.x - 1] = {
          deviceId: p.device,
          pixel: p.led,
          group: p.segment + 1
        }
        setM(updatedM)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points])

  return (
    <MWrapper move={dnd}>
      <Stack
        direction="column"
        spacing={2}
        bgcolor={theme.palette.action.disabledBackground}
        sx={{
          overflowY: 'scroll',
          height: '100%',
          overflowX: 'hidden',
          minWidth: 440,
          paddingTop: '1rem'
        }}
      >
        <MControls
          dnd={dnd}
          setDnd={setDnd}
          rowN={rowN}
          colN={colN}
          setRowNumber={setRowNumber}
          setColNumber={setColNumber}
          virtual={virtual}
          m={m}
          setM={setM}
          move={move}
          setMove={setMove}
          selectedGroup={selectedGroup}
          setError={setError}
          setShowPixelGraph={setShowPixelGraph}
          showPixelGraph={showPixelGraph}
          pixelGroups={pixelGroups}
          setPixelGroups={setPixelGroups}
          setSelectedGroup={setSelectedGroup}
        />
      </Stack>
      <Box sx={{ flexGrow: 1, overflow: 'hidden', height: '100%' }}>
        <TransformWrapper
          disabled={dnd}
          centerZoomedOut
          minScale={0.1}
          initialScale={
            colN * 100 < window.innerWidth || rowN * 100 < window.innerHeight * 0.8 ? 1 : 0.1
          }
        >
          <TransformComponent>
            <div
              className={classes.gridCellContainer}
              style={{
                width: colN * 100,
                height: rowN * 100
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
                <DndContext
                  modifiers={[restrictToFirstScrollableAncestor]}
                  onDragStart={handleDragStart}
                  onDragEnd={(e) => handleDragEnd(e)}
                  onDragOver={(e) =>
                    setHoveringCell((e.over?.id as any)?.split('-').map(Number) || [-1, -1])
                  }
                >
                  {m.map((yzrow, currentRowIndex) => (
                    <div key={`row-${currentRowIndex}`} style={{ display: 'flex' }}>
                      {yzrow.map((yzcolumn: IMCell, currentColIndex: number) => {
                        // const bg = getBackgroundColor(
                        //   mode,
                        //   decodedPixels,
                        //   pixels,
                        //   currentRowIndex,
                        //   colN,
                        //   currentColIndex
                        // )
                        // const op = getOpacity(move, yzcolumn, selectedGroup)
                        return (
                          <Droppable
                            cell={
                              hoveringCell[0] > -1 && hoveringCell[1] > -1
                                ? m[hoveringCell[1]][hoveringCell[0]]
                                : undefined
                            }
                            id={`${currentColIndex}-${currentRowIndex}`}
                            key={`col-${currentColIndex}`}
                            bg={
                              m[currentRowIndex][currentColIndex].deviceId !== ''
                                ? 'transparent'
                                : 'black'
                            }
                            opacity={0.8}
                            onContextMenu={(e) =>
                              handleContextMenu(e, currentColIndex, currentRowIndex, yzcolumn)
                            }
                            onClick={() => {
                              console.log(`Clicked cell: ${currentColIndex}-${currentRowIndex}`)
                              if (move && m[currentRowIndex][currentColIndex].deviceId === '') {
                                setSelectedGroup('')
                              }
                            }}
                          >
                            <Box
                              key={`col-${currentColIndex}`}
                              onContextMenu={(e) =>
                                handleContextMenu(e, currentColIndex, currentRowIndex, yzcolumn)
                              }
                              sx={{
                                // backgroundColor: bg,
                                opacity: 1
                              }}
                            >
                              {dnd ? (
                                m[currentRowIndex][currentColIndex].deviceId !== '' ? (
                                  <Draggable m={m} id={`${currentColIndex}-${currentRowIndex}`}>
                                    <Pixel
                                      m={m}
                                      currentColIndex={currentColIndex}
                                      classes={classes}
                                      currentRowIndex={currentRowIndex}
                                      move={move}
                                      // decodedPixels={decodedPixels}
                                      // colN={colN}
                                      // pixels={pixels}
                                      yzcolumn={yzcolumn}
                                      selectedGroup={selectedGroup}
                                      error={error}
                                      setCurrentCell={setCurrentCell}
                                      setCurrentDevice={setCurrentDevice}
                                      setSelectedPixel={setSelectedPixel}
                                      openContextMenu={(
                                        e: React.MouseEvent<HTMLDivElement, MouseEvent>
                                      ) => setAnchorEl(e.currentTarget)}
                                      isDragging={isDragging}
                                    />
                                  </Draggable>
                                ) : null
                              ) : (
                                <Pixel
                                  m={m}
                                  currentColIndex={currentColIndex}
                                  classes={classes}
                                  currentRowIndex={currentRowIndex}
                                  move={move}
                                  // decodedPixels={decodedPixels}
                                  // colN={colN}
                                  // pixels={pixels}
                                  yzcolumn={yzcolumn}
                                  selectedGroup={selectedGroup}
                                  error={error}
                                  setCurrentCell={setCurrentCell}
                                  setCurrentDevice={setCurrentDevice}
                                  setSelectedPixel={setSelectedPixel}
                                  openContextMenu={(
                                    e: React.MouseEvent<HTMLDivElement, MouseEvent>
                                  ) => setAnchorEl(e.currentTarget)}
                                  isDragging={isDragging}
                                />
                              )}
                            </Box>
                          </Droppable>
                        )
                      })}
                    </div>
                  ))}
                </DndContext>
              </div>

              {virtual.id && showPixelGraph && (
                <div
                  style={{
                    position: 'absolute',
                    top: -2,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0
                  }}
                >
                  <PixelGraph
                    showMatrix={true}
                    virtId={virtual.id}
                    active={true}
                    dummy={false}
                    fullScreen
                    fill
                  />
                </div>
              )}
              <MContextMenu
                setDnd={setDnd}
                setSelectedGroup={setSelectedGroup}
                anchorEl={anchorEl}
                closeContextMenu={() => setAnchorEl(null)}
                currentCell={currentCell}
                m={m}
                setOpen={setOpen}
                setMove={setMove}
                clearPixel={clearPixel}
                clearPixelGroup={clearPixelGroup}
                pixelGroups={pixelGroups}
                setPixelGroups={setPixelGroups}
              />
              <AssignPixelDialog
                open={open}
                closeClear={closeClear}
                currentCell={currentCell}
                m={m}
                setCurrentDevice={setCurrentDevice}
                deviceRef={deviceRef}
                group={group}
                setGroup={setGroup}
                direction={direction}
                handleDirectionChange={handleDirectionChange}
                selectedPixel={selectedPixel}
                handleSliderChange={handleSliderChange}
                clearPixel={clearPixel}
                setM={setM}
                currentDevice={currentDevice}
                pixelGroups={pixelGroups}
                setPixelGroups={setPixelGroups}
                rowN={rowN}
                colN={colN}
              />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </Box>
    </MWrapper>
  )
}

export default EditMatrix
