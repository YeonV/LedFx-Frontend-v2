import { CssBaseline, GlobalStyles, useTheme } from '@mui/material'

const AppStyles = () => {
  const theme = useTheme()

  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            colorScheme: theme.palette.mode
          }
        }}
      />
    </>
  )
}

export default AppStyles
