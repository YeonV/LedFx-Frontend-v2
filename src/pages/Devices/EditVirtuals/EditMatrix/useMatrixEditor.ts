/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo, useCallback, useEffect } from 'react'
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core'
import { produce } from 'immer'
import { MCell, IMCell, extractGroups, applyStoredGroups } from './M.utils'
import { processArray, reverseProcessArray } from './processMatrix'
import { transpose } from '../../../../utils/helpers'
import { Ledfx } from '../../../../api/ledfx'
import type { MatrixEditorAPI } from './MatrixEditorAPI.types'
import useStore from '../../../../store/useStore'

export const useMatrixEditor = (virtual: any): MatrixEditorAPI => {
  // Dummy device that backs every empty cell in the saved segment list.
  const gapDeviceId = `gap-${virtual.id}`

  // Group ids the backend cannot store, kept per virtual in the persisted store.
  const storedGroups = useStore((state) => state.matrixGroups[virtual.id])
  const setMatrixGroups = useStore((state) => state.setMatrixGroups)

  // --- STATE MANAGEMENT ---
  const [rowN, setRowNumber] = useState<number>(virtual.config.rows || 8)
  const [colN, setColNumber] = useState<number>(
    Math.ceil(virtual.pixel_count / (virtual.config.rows || 1)) || 8
  )

  // Rebuild from segments, then layer the real groups back over the ids
  // reverseProcessArray had to invent.
  const loadMatrix = useCallback(
    (segments: any[], cols: number) =>
      applyStoredGroups(reverseProcessArray(segments, cols), storedGroups),
    [storedGroups]
  )

  const [m, setM] = useState<IMCell[][]>(() =>
    virtual.segments.length > 0
      ? loadMatrix(virtual.segments, colN)
      : Array(rowN).fill(Array(colN).fill(MCell))
  )
  // Baseline for the dirty check: the matrix as it was last written to the
  // backend. Every producer of `m` builds new arrays, so holding the saved
  // reference is a valid snapshot and deepEqual short-circuits on identity.
  const [savedSnapshot, setSavedSnapshot] = useState<IMCell[][]>(m)
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [dndMode, setDndMode] = useState<'pixel' | 'group'>('pixel')
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
    return Array.from(groups)
  }, [m])

  // Seed the new-group counter past every `group-N` already on the grid, so a
  // fresh placement cannot land on an id that is in use. The count alone was
  // not enough: a grid holding group-0 and group-2, or ids minted by Matrix
  // Studio, would still hand out a colliding number.
  useEffect(() => {
    if (pixelGroups !== 0 || uniqueGroups.length === 0) return
    setPixelGroups(
      uniqueGroups.reduce((next, group) => {
        const match = /^group-(\d+)$/.exec(group)
        return match ? Math.max(next, Number(match[1]) + 1) : next
      }, uniqueGroups.length)
    )
  }, [uniqueGroups, pixelGroups])

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
      if (dndMode === 'group') {
        const [col, row] = (event.active.id as string).split('-').map(Number)
        if (!isNaN(row) && !isNaN(col)) {
          const groupId = m[row][col]?.group
          if (groupId) {
            setSelectedGroup(groupId as string)
          }
        }
      }
    },
    [dndMode, m]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setIsDragging(false)
      const { active, over } = event
      if (!over || !over.id) return
      const [startCol, startRow] = (active.id as string).split('-').map(Number)
      const [endCol, endRow] = (over.id as string).split('-').map(Number)
      if (isNaN(startCol) || isNaN(startRow) || isNaN(endCol) || isNaN(endRow)) return
      if (dndMode === 'group') {
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
    [dndMode, m, executeGroupMove]
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

  const createGapDevice = useCallback(
    () =>
      addDevice({
        type: 'dummy',
        config: {
          center_offset: 0,
          icon_name: 'mdi:eye-off',
          name: gapDeviceId,
          pixel_count: 4096,
          refresh_rate: 64
        }
      }),
    [addDevice, gapDeviceId]
  )

  // processArray emits a `gap-<virtualId>` segment for every run of empty
  // cells, but the dummy device backing them is only created for virtuals that
  // start out with no segments at all. Any other virtual saved with a hole in
  // it gets the whole POST rejected with "Invalid device id" and rolled back,
  // so the layout silently refuses to persist. Re-check against a freshly
  // fetched device list before creating one: add_new_device derives the id
  // straight from the name without de-duplicating.
  const ensureGapDevice = useCallback(
    (segments: ReturnType<typeof processArray>) => {
      const gapExists = () =>
        Object.values(useStore.getState().devices).some((d: any) => d.id === gapDeviceId)

      if (!segments.some(([deviceId]) => deviceId === gapDeviceId)) return Promise.resolve()
      if (gapExists()) return Promise.resolve()

      return getDevices()
        .then(() => (gapExists() ? null : createGapDevice()))
        .then(() => getDevices())
    },
    [gapDeviceId, getDevices, createGapDevice]
  )

  // `rows` and `segments` describe the same grid and must always be written
  // together from the same matrix: on load the column count is derived as
  // pixel_count / rows, so a mismatched pair re-chunks the flat pixel list at
  // the wrong width and the matrix comes back scrambled.
  const saveMatrix = useCallback(() => {
    const saved = m
    const rows = saved.length
    const segments = processArray(saved.flat(), virtual.id)

    return ensureGapDevice(segments)
      .then(() =>
        addVirtual({
          id: virtual.id,
          config: { ...virtual.config, rows }
        })
      )
      .then(() => Ledfx(`/api/virtuals/${virtual.id}`, 'POST', { segments }))
      .then((res: any) => {
        // Only re-base the dirty check when the backend actually accepted the
        // segments. It rolls back to the previous ones on a validation failure,
        // and the matrix on screen is then genuinely still unsaved.
        if (res?.status === 'success') {
          setSavedSnapshot(saved)
          // Groups have no home in the segment list, so they are persisted
          // alongside it. Only on success, so they stay in step with what the
          // backend actually holds.
          setMatrixGroups(virtual.id, extractGroups(saved))
        }
        getVirtuals()
        getDevices()
      })
  }, [m, virtual, ensureGapDevice, addVirtual, getVirtuals, getDevices, setMatrixGroups])

  // Dimension changes are local state only. Persisting them is the job of the
  // slider's onChangeCommitted, so dragging doesn't fire a save (and a rows
  // write built from the pre-resize matrix) for every intermediate value.
  const handleSetRowNumber = useCallback((n: number) => setRowNumber(n), [])

  const handleSetColNumber = useCallback((n: number) => setColNumber(n), [])

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
    () => setM(loadMatrix(virtual.segments, colN)),
    [virtual.segments, colN, loadMatrix]
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
      if (!Object.values(devices).some((d) => d.id === gapDeviceId)) {
        createGapDevice().then(() => {
          Ledfx(`/api/virtuals/${virtual.id}`, 'POST', {
            segments: [[gapDeviceId, 0, virtual.config.rows * virtual.config.rows - 1, false]]
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
      setM(loadMatrix(virtual.segments, colN))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // EditMatrix is not remounted when the edited virtual changes, so a new
  // virtual needs a fresh baseline or its matrix reads as unsaved.
  useEffect(() => {
    setSavedSnapshot(m)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtual.id])

  return {
    m,
    savedSnapshot,
    rowN,
    colN,
    selectedGroup,
    dnd,
    isDragging,
    hoveringCell,
    uniqueGroups,
    showPixelGraph,
    pixelGroups,
    error,
    dndMode,
    setDndMode,
    clearPixel,
    clearPixelGroup,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    setRowNumber: handleSetRowNumber,
    setColNumber: handleSetColNumber,
    setSelectedGroup,
    setDnd,
    setShowPixelGraph,
    transposeMatrix,
    swapVertical,
    swapHorizontal,
    resetMatrix,
    clearMatrix,
    saveMatrix,
    setM,
    setPixelGroups,
    setError
  }
}
