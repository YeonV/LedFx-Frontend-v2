import { Stack } from '@mui/material'

const PadData = ({ label, value }: any) => (
  <Stack
    direction="column"
    sx={{
      '&>span:first-of-type': {
        color: '#999',
        mr: 2,
        textTransform: 'uppercase',
        fontSize: '0.8rem'
      }
    }}
  >
    <span>{label}</span>
    <span>{String(value)}</span>
  </Stack>
)

export default PadData
