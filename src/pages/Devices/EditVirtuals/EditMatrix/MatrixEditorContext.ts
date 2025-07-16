import { createContext, useContext } from 'react'
import { MatrixEditorAPI } from './MatrixEditorAPI.types'

// Create a context with a null default value
export const MatrixEditorContext = createContext<MatrixEditorAPI | null>(null)

// Create a custom hook for consuming the context.
// This is a best practice. It provides a clean API and a helpful error message.
export const useMatrixEditorContext = () => {
  const context = useContext(MatrixEditorContext)
  if (!context) {
    throw new Error('useMatrixEditorContext must be used within a MatrixEditorProvider')
  }
  return context
}
