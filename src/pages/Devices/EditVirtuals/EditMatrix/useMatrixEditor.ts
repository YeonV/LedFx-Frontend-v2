import { useState, useMemo, useCallback, useEffect } from 'react'
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core'
import { produce } from 'immer'
import { MCell, IMCell } from './M.utils'
import { processArray, reverseProcessArray } from './processMatrix'
import { transpose } from '../../../../utils/helpers'
import { Ledfx } from '../../../../api/ledfx'
import type { MatrixEditorAPI } from './MatrixEditorAPI.types'
import useStore from '../../../../store/useStore'

export const useMatrixEditor = (virtual: any): MatrixEditorAPI => {
  // --- STATE MANAGEMENT ---
  const [rowN, setRowNumber] = useState<number>(virtual.config.rows || 8)
  const [colN, setColNumber] = useState<number>(
    Math.ceil(virtual.pixel_count / (virtual.config.rows || 1)) || 8
  )
  const [m, setM] = useState<IMCell[][]>(() =>
    virtual.segments.length > 0
      ? reverseProcessArray(virtual.segments, colN)
      : Array(rowN).fill(Array(colN).fill(MCell))
  )
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [move, setMove] = useState<boolean>(false)
  const [dnd, setDnd] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveringCell, setHoveringCell] = useState<[number, number]>([-1, -1])
  const [showPixelGraph, setShowPixelGraph] = useState<boolean>(false)
  const [pixelGroups, setPixelGroups] = useState<number>(0)
  const [error, setError] = useState<{ row: number; col: number }[]>([])

  const devices = useStore((state) => state.devices)

  // Zustand hooks for external actions
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getDevices = useStore((state) => state.getDevices)
  const addVirtual = useStore((state) => state.addVirtual)
  const addDevice = useStore((state) => state.addDevice)
  const setEffect = useStore((state) => state.setEffect)
  const updateVirtual = useStore((state) => state.updateVirtual)

  // --- DERIVED STATE ---
  const uniqueGroups = useMemo(() => {
    const groups = new Set<string>()
    m.flat().forEach((cell) => {
      if (cell.group && typeof cell.group === 'string' && cell.group !== '0-0') {
        groups.add(cell.group)
      }
    })
    // This is also where we can set the initial pixelGroups count
    if (pixelGroups === 0 && groups.size > 0) {
      setPixelGroups(groups.size)
    }
    return Array.from(groups)
  }, [m, pixelGroups])

  // --- ACTIONS & HANDLERS ---
  const executeGroupMove = useCallback(
    (groupId: string, rowOffset: number, colOffset: number) => {
      const groupPixels: (IMCell & { oldRow: number; oldCol: number })[] = []
      for (let i = 0; i < rowN; i++) {
        for (let j = 0; j < colN; j++) {
          if (m[i][j].group === groupId) {
            groupPixels.push({ ...m[i][j], oldRow: i, oldCol: j })
          }
        }
      }
      if (groupPixels.length === 0) return
      for (const pixel of groupPixels) {
        const targetRow = pixel.oldRow + rowOffset
        const targetCol = pixel.oldCol + colOffset
        if (targetRow < 0 || targetRow >= rowN || targetCol < 0 || targetCol >= colN) return
        const targetCell = m[targetRow][targetCol]
        if (targetCell.deviceId !== '' && targetCell.group !== groupId) return
      }
      setM(
        produce((draft) => {
          for (const pixel of groupPixels) {
            draft[pixel.oldRow][pixel.oldCol] = { deviceId: '', pixel: 0, group: '' }
          }
          for (const pixel of groupPixels) {
            const targetRow = pixel.oldRow + rowOffset
            const targetCol = pixel.oldCol + colOffset
            const { oldRow, oldCol, ...pixelData } = pixel
            draft[targetRow][targetCol] = pixelData as IMCell
          }
        })
      )
    },
    [m, rowN, colN]
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setIsDragging(true)
      if (move) {
        const [col, row] = (event.active.id as string).split('-').map(Number)
        if (!isNaN(row) && !isNaN(col)) {
          const groupId = m[row][col]?.group
          if (groupId) {
            setSelectedGroup(groupId as string)
          }
        }
      }
    },
    [move, m]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setIsDragging(false)
      const { active, over } = event
      if (!over || !over.id) return
      const [startCol, startRow] = (active.id as string).split('-').map(Number)
      const [endCol, endRow] = (over.id as string).split('-').map(Number)
      if (isNaN(startCol) || isNaN(startRow) || isNaN(endCol) || isNaN(endRow)) return
      if (move) {
        const groupId = m[startRow][startCol]?.group
        if (groupId) {
          const rowOffset = endRow - startRow
          const colOffset = endCol - startCol
          executeGroupMove(groupId as string, rowOffset, colOffset)
        }
      } else {
        setM(
          produce((draft) => {
            if (draft[endRow][endCol].deviceId === '') {
              draft[endRow][endCol] = draft[startRow][startCol]
              draft[startRow][startCol] = { deviceId: '', pixel: 0, group: '' }
            }
          })
        )
      }
    },
    [move, m, executeGroupMove]
  )

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event
    if (over) {
      const [col, row] = (over.id as string).split('-').map(Number)
      if (!isNaN(row) && !isNaN(col)) setHoveringCell([col, row])
    } else {
      setHoveringCell([-1, -1])
    }
  }, [])

  const saveMatrix = useCallback(() => {
    Ledfx(`/api/virtuals/${virtual.id}`, 'POST', {
      segments: processArray(m.flat(), virtual.id)
    }).then(() => {
      getVirtuals()
      getDevices()
    })
  }, [m, virtual.id, getVirtuals, getDevices])

  const handleSetRowNumber = useCallback(
    (n: number) => {
      addVirtual({ id: virtual.id, config: { rows: n } })
        .then(() => {
          getVirtuals()
          getDevices()
        })
        .then(() => saveMatrix())
      setRowNumber(n)
    },
    [addVirtual, getDevices, getVirtuals, saveMatrix, virtual.id]
  )

  const handleSetColNumber = useCallback(
    (n: number) => {
      saveMatrix()
      setColNumber(n)
    },
    [saveMatrix]
  )

  const transposeMatrix = useCallback(() => setM(transpose(m)), [m])
  const swapVertical = useCallback(() => setM(produce((draft) => draft.reverse())), [])
  const swapHorizontal = useCallback(
    () =>
      setM(
        produce((draft) => {
          draft.forEach((row) => row.reverse())
        })
      ),
    []
  )
  const resetMatrix = useCallback(
    () => setM(reverseProcessArray(virtual.segments, colN)),
    [virtual.segments, colN]
  )
  const clearMatrix = useCallback(() => {
    setM(Array(rowN).fill(Array(colN).fill(MCell)))
    setPixelGroups(0)
  }, [rowN, colN])

  const clearPixel = useCallback((cell: [number, number]) => {
    const [col, row] = cell
    setM(
      produce((draft) => {
        draft[row][col] = { deviceId: '', pixel: 0, group: '' }
      })
    )
  }, [])

  const clearPixelGroup = useCallback(
    (groupId: string) => {
      // Also deselect the group if it's the one being cleared
      if (selectedGroup === groupId) {
        setSelectedGroup('')
      }
      setM(
        produce((draft) => {
          for (let i = 0; i < rowN; i++) {
            for (let j = 0; j < colN; j++) {
              if (draft[i][j].group === groupId) {
                draft[i][j] = { deviceId: '', pixel: 0, group: '' }
              }
            }
          }
        })
      )
      // We can also decrement the pixelGroups counter here if we want to be precise
      setPixelGroups((pg) => pg - 1)
    },
    [rowN, colN, selectedGroup]
  ) // Dependency on rowN, colN, and selectedGroup

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

  return {
    m,
    rowN,
    colN,
    selectedGroup,
    dnd,
    move,
    isDragging,
    hoveringCell,
    uniqueGroups,
    showPixelGraph,
    pixelGroups,
    clearPixel,
    clearPixelGroup,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    setRowNumber: handleSetRowNumber,
    setColNumber: handleSetColNumber,
    setSelectedGroup,
    setDnd,
    setMove,
    setShowPixelGraph,
    transposeMatrix,
    swapVertical,
    swapHorizontal,
    resetMatrix,
    clearMatrix,
    saveMatrix,
    setM,
    setPixelGroups,
    error,
    setError
  }
}
