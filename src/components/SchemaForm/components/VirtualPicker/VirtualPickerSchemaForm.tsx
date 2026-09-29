import VirtualPicker from './VirtualPicker'

const VirtualPickerSchemaForm = ({
  title,
  id,
  model,
  hide,
  handleEffectConfig,
  defaultValue
}: {
  title: string
  id: string
  model: Record<string, unknown>
  hide?: boolean
  defaultValue?: string
  handleEffectConfig?: (_config: Record<string, unknown>) => void
}) => {
  if (hide) return null

  return (
    <VirtualPicker
      title={title}
      value={model[id] as string}
      defaultValue={defaultValue}
      onChange={(value: string) => {
        if (handleEffectConfig) {
          handleEffectConfig({ [id]: value })
        }
      }}
    />
  )
}

export default VirtualPickerSchemaForm
