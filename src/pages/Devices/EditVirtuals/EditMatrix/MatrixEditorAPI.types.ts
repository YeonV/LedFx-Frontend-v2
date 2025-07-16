/* eslint-disable no-unused-vars */
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { IMCell } from './M.utils'

// This is the updated, complete version of our API type
export interface MatrixEditorAPI {
  // State for the View Components
  m: IMCell[][]
  rowN: number
  colN: number
  selectedGroup: string
  dnd: boolean
  dndMode: 'pixel' | 'group'
  isDragging: boolean
  hoveringCell: [number, number]
  uniqueGroups: string[] // This is derived state, calculated inside the hook
  showPixelGraph: boolean
  pixelGroups: number

  // Actions for Event Handlers
  handleDragStart: (event: DragStartEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
  handleDragOver: (event: DragOverEvent) => void

  // State Setters for the Control Components
  setRowNumber: (n: number) => void
  setColNumber: (n: number) => void
  setSelectedGroup: (group: string) => void
  setDnd: (dnd: boolean) => void
  setDndMode: (mode: 'pixel' | 'group') => void
  setShowPixelGraph: (show: boolean) => void

  // Matrix Manipulation Actions
  transposeMatrix: () => void
  swapVertical: () => void
  swapHorizontal: () => void
  resetMatrix: () => void
  clearMatrix: () => void
  saveMatrix: () => void

  // We also need to expose these for the dialogs
  setM: (m: IMCell[][]) => void
  setPixelGroups: (n: number) => void

  clearPixel: (cell: [number, number]) => void
  clearPixelGroup: (groupId: string) => void

  // Expose the error state and setter for the UI
  error: { row: number; col: number }[]
  setError: (error: { row: number; col: number }[]) => void
}
