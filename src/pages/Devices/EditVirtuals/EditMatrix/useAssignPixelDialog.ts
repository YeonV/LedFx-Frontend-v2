import { useState, useCallback, useEffect, useRef } from 'react'
import { IMCell, IDir, getMaxRange } from './M.utils'
import assignPixels from './Actions/assignPixels'
import { MatrixEditorAPI } from './MatrixEditorAPI.types'

// The hook now explicitly declares its dependencies as arguments.
// This is the "Dependency Injection" pattern.
type DialogDependencies = Pick<
  MatrixEditorAPI,
  'm' | 'setM' | 'rowN' | 'colN' | 'pixelGroups' | 'setPixelGroups' | 'clearPixel'
>

export const useAssignPixelDialog = (dependencies: DialogDependencies) => {
  const { m, setM, rowN, colN, pixelGroups, setPixelGroups, clearPixel } = dependencies

  // All state for the dialog is fully encapsulated here.
  const [isOpen, setIsOpen] = useState(false)
  const [currentCell, setCurrentCell] = useState<[number, number]>([-1, -1])
  const [currentDevice, setCurrentDevice] = useState('')
  const [isGroupMode, setIsGroupMode] = useState(false)
  const [selectedPixel, setSelectedPixel] = useState<number | number[]>(0)
  const [direction, setDirection] = useState<IDir>('right')
  const deviceRef = useRef<HTMLInputElement | null>(null)

  // --- CONTROL FUNCTIONS ---
  const openDialog = useCallback((cell: [number, number], initialData: IMCell) => {
    setCurrentCell(cell)
    setCurrentDevice(initialData.deviceId || '')
    setSelectedPixel(initialData.pixel || 0)
    setIsGroupMode(false)
    setDirection('right')
    setIsOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleClear = () => {
    clearPixel(currentCell)
    closeDialog()
  }

  // --- EVENT HANDLERS (for the form elements) ---
  const handleDirectionChange = useCallback(
    (d: IDir) => {
      setDirection(d)
      if (typeof selectedPixel !== 'number') {
        const [col, row] = currentCell
        const maxRange = getMaxRange(d, row, col, rowN, colN)
        const distance = selectedPixel[1] - selectedPixel[0]
        if (distance > maxRange) {
          setSelectedPixel([selectedPixel[0], selectedPixel[0] + maxRange])
        }
      }
    },
    [currentCell, rowN, colN, selectedPixel]
  )

  const handleSliderChange = useCallback(
    (_e: Event, newPixelRange: number | number[], activeThumb: number) => {
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
        const updatedSelectedPixel = direction.includes('top')
          ? [adjustedRightThumb, adjustedLeftThumb]
          : [adjustedLeftThumb, adjustedRightThumb]
        setSelectedPixel(updatedSelectedPixel)
      } else {
        setSelectedPixel(newPixelRange)
      }
    },
    [currentCell, direction, rowN, colN]
  )

  // --- SAVE ACTION ---
  const save = useCallback(() => {
    const newGroupId = `group-${pixelGroups}`
    assignPixels({
      m,
      rowN,
      colN,
      currentCell,
      currentDevice,
      selectedPixel,
      direction,
      setM,
      closeClear: closeDialog,
      pixelGroups,
      setPixelGroups,
      newGroupId
    })
  }, [
    m,
    rowN,
    colN,
    currentCell,
    currentDevice,
    selectedPixel,
    direction,
    setM,
    closeDialog,
    pixelGroups,
    setPixelGroups
  ])

  // Sync up isGroupMode and selectedPixel range
  useEffect(() => {
    if (isGroupMode && typeof selectedPixel === 'number') {
      setSelectedPixel([selectedPixel, selectedPixel + 1])
    } else if (!isGroupMode && typeof selectedPixel !== 'number') {
      setSelectedPixel(selectedPixel[0])
    }
  }, [isGroupMode, selectedPixel])

  // The public API of our hook, to be passed as a prop
  return {
    isOpen,
    currentCell,
    currentDevice,
    isGroupMode,
    direction,
    selectedPixel,
    deviceRef,
    openDialog,
    closeDialog,
    setCurrentDevice,
    setIsGroupMode,
    handleDirectionChange,
    handleSliderChange,
    save,
    handleClear
  }
}
