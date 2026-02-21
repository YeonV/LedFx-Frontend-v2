import { Stack } from '@mui/material'
import { ReactNode } from 'react'

interface CardStackProps {
  children: ReactNode
}

const CardStack = ({ children }: CardStackProps) => (
  <Stack
    direction="column"
    spacing={2}
    sx={{
      backgroundColor: (theme) => theme.palette.background.paper,
      pt: 2,
      pr: 1,
      pb: 1,
      pl: 1,
      borderRadius: 1
    }}
  >
    {children}
  </Stack>
)

export default CardStack
