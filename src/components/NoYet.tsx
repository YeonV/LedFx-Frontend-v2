import { Card, CardHeader } from '@mui/material'
import { Info } from '@mui/icons-material'

import type { JSX } from 'react'

interface NoYetProps {
  type?: string
}

const NoYet: React.FC<NoYetProps> = ({ type = 'Thing' }: NoYetProps): JSX.Element => (
  <Card>
    <CardHeader
      avatar={<Info />}
      title={`No ${type}s yet`}
      subheader={`You can add your first ${type} using the plus button`}
    />
  </Card>
)

export default NoYet
