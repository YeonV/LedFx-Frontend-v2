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
}: BladeBooleanProps) => (
  <BBoolean
    index={index}
    required={required}
    style={style}
    type={type}
    onChange={() => onClick(model_id, model && !model[model_id])}
    defaultValue={(model && model[model_id]) || schema.default}
    value={model ? !!model[model_id] : false}
    title={schema.title
      .replaceAll('_', ' ')
      .replaceAll('Color', 'c')
      .replaceAll('Vertical', 'V ↕')
      .replaceAll('Horizontal', 'H ↔')}
    description={schema.description}
    hideDesc={hideDesc}
  />
)

export default BladeBoolean
