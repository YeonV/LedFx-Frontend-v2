import { BladeBooleanProps } from './BladeBoolean.props'
import BBoolean from './BBolean'

/**
 * ## Boolean for SchemaForm
 * ### render as `switch`,`checkbox` or `button`
 */
const BladeBoolean = ({
  onClick,
  index,
  required,
  style,
  type = 'switch',
  schema,
  model,
  hideDesc = false,
  model_id
}: BladeBooleanProps) => {
  const checked = !!(model?.[model_id] ?? schema.default)
  return (
    <BBoolean
      index={index}
      required={required}
      style={style}
      type={type}
      onChange={() => onClick(model_id, !checked)}
      defaultValue={checked}
      value={checked}
      title={schema.title
        .replaceAll('_', ' ')
        .replaceAll('Color', 'c')
        .replaceAll('Vertical', 'V ↕')
        .replaceAll('Horizontal', 'H ↔')}
      description={schema.description}
      hideDesc={hideDesc}
    />
  )
}

export default BladeBoolean
