import { Handle, Position, useEdges } from '@xyflow/react'
import { Box, IconButton, Paper, Collapse, Typography } from '@mui/material'
import { PlayArrow, HdrAuto, ArrowDropDown } from '@mui/icons-material'
import EffectSchemaForm from '../../components/SchemaForm/EffectsSchemaForm/EffectSchemaForm'
import useStore from '../../store/useStore'
import { orderEffectProperties } from '../Device/Effects'
import EffectDropDown from '../../components/SchemaForm/components/DropDown/DropDown.wrapper'
import { useEffect, useRef } from 'react'
import { deepEqual } from '../../utils/helpers'

const SenderNodeEffect = ({ id, data }: { id: string; data: { name: string, isSyncing: boolean, isCollapsed: boolean, onNodeDataChange: (id: string, data: any) => void } }) => {
  const { name, isSyncing, isCollapsed, onNodeDataChange } = data;
  const edges = useEdges()
  const effects = useStore((state) => state.schemas.effects)
  const virtuals = useStore((state) => state.virtuals)
  const features = useStore((state) => state.features)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const setEffect = useStore((state) => state.setEffect)
  const copyTo = useStore((state) => state.copyTo)
  const effectRef = useRef<any>(null)

  const outgoingEdges = edges.filter((edge) => edge.source === id)
  const connectedVirtualIds = outgoingEdges.map((edge) => edge.target)
  const primaryVirtualId = connectedVirtualIds[0]
  const targetVirtualIds = connectedVirtualIds.slice(1)

  const virtual = primaryVirtualId ? virtuals[primaryVirtualId] : null

  const handleManualCopy = () => {
    if (primaryVirtualId && targetVirtualIds.length > 0) {
      copyTo(primaryVirtualId, targetVirtualIds).then(() => getVirtuals())
    }
  }

  useEffect(() => {
    if (isSyncing && targetVirtualIds.length > 0) {
      if (!deepEqual(effectRef.current, virtual?.effect)) {
        if (effectRef.current !== null) {
          copyTo(primaryVirtualId, targetVirtualIds).then(() => getVirtuals())
        }
        effectRef.current = virtual?.effect
      }
    }
  }, [virtual?.effect, copyTo, getVirtuals, primaryVirtualId, targetVirtualIds, isSyncing])

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
      <IconButton
        sx={{ position: 'absolute', top: 5, right: 45 }}
        onClick={() => onNodeDataChange(id, { isSyncing: !isSyncing })}
        color={isSyncing ? 'primary' : 'inherit'}
      >
        <HdrAuto />
      </IconButton>
      <IconButton
        sx={{ position: 'absolute', top: 5, right: 15 }}
        onClick={handleManualCopy}
        disabled={isSyncing}
      >
        <PlayArrow />
      </IconButton>
      <Paper sx={{ width: '480px' }}>
        <Box sx={{ p: 1, bgcolor: '#090909', mb: virtual ? 2 : 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <IconButton
            size="small"
            onClick={() => onNodeDataChange(id, { isCollapsed: !isCollapsed })}
            sx={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}
          >
            <ArrowDropDown />
          </IconButton>
          <strong>{name}</strong>
        </Box>
        {virtual ? (
          <>
            <EffectDropDown
              effects={effects}
              virtual={virtual}
              features={features}
              getVirtuals={getVirtuals}
              setEffect={setEffect}
            />
            <Collapse in={!isCollapsed}>
              <EffectSchemaForm
                virtId={virtual.id}
                schemaProperties={orderedProperties}
                model={virtual.effect.config as Record<string, unknown>}
                selectedType={effectType}
              />
            </Collapse>
          </>
        ) : (
          <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            Connect to enable
          </Typography>
        )}
      </Paper>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default SenderNodeEffect
