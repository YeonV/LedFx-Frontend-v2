import { createContext, useContext } from 'react'
import { useAssignPixelDialog } from './useAssignPixelDialog'

// Infer the type of the return value from the hook itself
type AssignPixelDialogAPI = ReturnType<typeof useAssignPixelDialog>

export const AssignPixelDialogContext = createContext<AssignPixelDialogAPI | null>(null)

export const useAssignPixelDialogContext = () => {
  const context = useContext(AssignPixelDialogContext)
  if (!context) {
    throw new Error('useAssignPixelDialogContext must be used within an AssignPixelDialogProvider')
  }
  return context
}
