import { Card } from '@mui/material'
import VisualizerConfig from './VisualizerConfig'

interface VisualizerCardProps {
  selectedClients: string[]
  name: string
}

const VisualizerCard = ({ selectedClients, name }: VisualizerCardProps) => {
  return (
    <Card
      onDoubleClick={(e) => e.stopPropagation()}
      sx={{
        maxWidth: 400,
        p: 0
      }}
    >
      <VisualizerConfig selectedClients={selectedClients} single name={name} />
    </Card>
  )
}

export default VisualizerCard
