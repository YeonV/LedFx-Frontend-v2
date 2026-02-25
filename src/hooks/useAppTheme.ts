import { useMemo } from 'react'
import { createTheme } from '@mui/material'
import { ledfxThemes, ledfxTheme, common } from '../themes/AppThemes'

export default function useAppTheme(changeTheme: any) {
  return useMemo(
    () =>
      createTheme({
        ...ledfxThemes[window.localStorage.getItem('ledfx-theme') ?? ledfxTheme],
        ...common,
        palette: {
          ...ledfxThemes[window.localStorage.getItem('ledfx-theme') ?? ledfxTheme]?.palette
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [changeTheme]
  )
}
