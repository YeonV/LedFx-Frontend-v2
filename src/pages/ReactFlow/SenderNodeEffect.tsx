import { Handle, Position, useEdges } from '@xyflow/react'
import { Box, IconButton, Paper } from '@mui/material'
import { PlayArrow } from '@mui/icons-material'
import EffectSchemaForm from '../../components/SchemaForm/EffectsSchemaForm/EffectSchemaForm'
import useStore from '../../store/useStore'
import { orderEffectProperties } from '../Device/Effects'
import EffectDropDown from '../../components/SchemaForm/components/DropDown/DropDown.wrapper'
import { useEffect, useRef } from 'react'
import { deepEqual } from '../../utils/helpers'

const SenderNodeEffect = ({ id, data }: { id: string; data: { onPlay: () => void } }) => {
  const edges = useEdges()
  const effects = useStore((state) => state.schemas.effects)
  const virtuals = useStore((state) => state.virtuals)
  const features = useStore((state) => state.features)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const setEffect = useStore((state) => state.setEffect)

  const outgoingEdges = edges.filter((edge) => edge.source === id)
  const connectedVirtualIds = outgoingEdges.map((edge) => edge.target)
  const primaryVirtualId = connectedVirtualIds[0]
  const targetVirtualIds = connectedVirtualIds.slice(1)

  const virtual = primaryVirtualId ? virtuals[primaryVirtualId] : null
  const copyTo = useStore((state) => state.copyTo)
  const effectRef = useRef<any>(null)

  useEffect(() => {
    if (targetVirtualIds.length > 0) {
      if (!deepEqual(effectRef.current, virtual?.effect)) {
        if (effectRef.current !== null) {
          copyTo(primaryVirtualId, targetVirtualIds).then(() => getVirtuals())
        }
        effectRef.current = virtual?.effect
      }
    }
  }, [virtual?.effect, copyTo, getVirtuals, primaryVirtualId, targetVirtualIds])

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
          {virtual && (
            <EffectDropDown
              effects={effects}
              virtual={virtual}
              features={features}
              getVirtuals={getVirtuals}
              setEffect={setEffect}
            />
          )}
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
