import { Card, CircularProgress } from '@mui/material'
import VisualizerConfig from './VisualizerConfig'
import { ClientType } from '../../store/ui/storeClientIdentity'
import useStore from '../../store/useStore'

interface VisualizerCardProps {
  selectedClients: string[]
  name: string
  type: ClientType
}

const VisualizerCard = ({ selectedClients, name, type }: VisualizerCardProps) => {
  const visualizerInitialized = useStore((state) => state.ui.visualizerInitialized)

  if (!visualizerInitialized) {
    return <CircularProgress />
  }
  return (
    <Card
      elevation={0}
      onDoubleClick={(e) => e.stopPropagation()}
      sx={{
        maxWidth: 400,
        p: 0
      }}
    >
      <VisualizerConfig selectedClients={selectedClients} single name={name} type={type} />
    </Card>
  )
}

export default VisualizerCard
