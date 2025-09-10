import { Handle, Position } from '@xyflow/react'
import { Box, IconButton, Paper } from '@mui/material'
import { PlayArrow } from '@mui/icons-material'
import EffectSchemaForm from '../../components/SchemaForm/EffectsSchemaForm/EffectSchemaForm'
import useStore from '../../store/useStore'
import { orderEffectProperties } from '../Device/Effects'

const SenderNodeEffect = ({ data }: { data: { onPlay: () => void } }) => {
  const effects = useStore((state) => state.schemas.effects)
  const virtuals = useStore((state) => state.virtuals)
  // pick first virtual of the record virtuals. its an object not an array
  const virtual = virtuals
    ? virtuals[
        Object.keys(virtuals).find((k) => virtuals[k].id === 'logo-ii-top') ||
          Object.keys(virtuals)[0]
      ]
    : null
  console.log(virtual)
  const effectType = virtual && virtual.effect.type
  const orderedProperties =
    effects &&
    effectType &&
    orderEffectProperties(
      effects[effectType].schema,
      effects[effectType].hidden_keys,
      effects[effectType].advanced_keys
    )

  return (
    <div
      style={{
        position: 'relative',
        minWidth: 120,
        minHeight: 60
      }}
    >
      <IconButton sx={{ position: 'absolute', top: 5, right: 15 }} onClick={data.onPlay}>
        <PlayArrow />
      </IconButton>
      {!virtual && <div style={{ color: 'red' }}>No virtuals found</div>}
      {!effectType && <div style={{ color: 'orange' }}>No effect type</div>}
      {!virtual?.effect?.config && <div style={{ color: 'orange' }}>No effect config</div>}
      {virtual?.effect?.config && (
        <Paper sx={{ width: '480px' }}>
          <Box sx={{ p: 1, bgcolor: '#090909', mb: 2 }} textAlign="center">
            <strong>Effect Sender</strong>
          </Box>
          <EffectSchemaForm
            virtId={virtual ? virtual.id : ''}
            schemaProperties={orderedProperties}
            model={virtual.effect.config as Record<string, unknown>}
            selectedType={effectType}
          />
        </Paper>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default SenderNodeEffect
