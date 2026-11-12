import { useState } from 'react'
import { Card, CardContent } from '@mui/material'
import { StoryFn, Meta } from '@storybook/react-webpack5'
import BladeSchemaForm from './SchemaForm'
import BladeEffectSchemaForm from '../EffectsSchemaForm/EffectSchemaForm'
import { orderEffectProperties } from '../fields'
import type { Schemas } from '../../../api/ledfx.types'
import fixture from '../schemas.fixture.json'
import { withStore } from './storySeed'

// Real GET /api/schemas output (a few kinds), captured from a LedFx backend.
// It is shape only: the options of instance fields come from the seeded store.
const schemas = fixture as unknown as Schemas

export default {
  title: 'UI Components/SchemaForm/Backend schemas',
  component: BladeSchemaForm,
  decorators: [
    (Story) => (
      <Card style={{ maxWidth: 800 }}>
        <CardContent>{Story()}</CardContent>
      </Card>
    )
  ]
} as Meta<typeof BladeSchemaForm>

const AUDIO = {
  0: 'PulseAudio: Built-in Audio',
  1: 'PulseAudio: RDPSource',
  3: 'PulseAudio: RDPSink.monitor',
  4: 'ALSA: default'
}
// the layer pickers list virtuals that have an `is_device`
const VIRTUALS = {
  strip: { id: 'strip', is_device: 'wled1', config: { name: 'Desk Strip' } },
  shelf: { id: 'shelf', is_device: 'wled2', config: { name: 'Shelf' } },
  tv: { id: 'tv', is_device: 'wled3', config: { name: 'TV Backlight' } }
}

const Template: StoryFn<typeof BladeSchemaForm> = (args) => {
  const [model, setModel] = useState<Record<string, any>>(args.model)
  return (
    <BladeSchemaForm
      {...args}
      model={model}
      onModelChange={(c) => setModel((m) => ({ ...m, ...c }))}
    />
  )
}

export const WledDevice = Template.bind({})
WledDevice.args = { schema: schemas.devices.wled.schema, model: {}, type: 'wled' }

export const ArtnetDevice = Template.bind({})
ArtnetDevice.args = { schema: schemas.devices.artnet.schema, model: {}, type: 'artnet' }

export const AdalightDevice = Template.bind({})
AdalightDevice.args = {
  schema: schemas.devices.adalight.schema,
  model: { com_port: 'COM4' },
  type: 'adalight'
}
AdalightDevice.decorators = [withStore({ comPorts: ['COM3', 'COM4', '/dev/ttyUSB0'] })]

export const Virtual = Template.bind({})
Virtual.args = { schema: schemas.virtuals.schema, model: {} }

export const Audio = Template.bind({})
Audio.args = { schema: schemas.audio.schema, model: { audio_device: 3 }, hideToggle: true }
Audio.decorators = [withStore({ audioDevices: AUDIO })]

export const MqttHass = Template.bind({})
MqttHass.args = {
  schema: schemas.integrations.mqtt_hass.schema,
  model: {},
  type: 'mqtt_hass'
}

export const ValidationErrors = Template.bind({})
ValidationErrors.args = {
  schema: schemas.devices.wled.schema,
  model: { name: '', ip_address: '10.0.0.300' },
  type: 'wled',
  errors: {
    name: 'Field required',
    ip_address: 'Input is not a valid IPv4 address'
  }
}

const EffectForm = ({ effect, errors }: { effect: string; errors?: Record<string, string> }) => {
  const entry = schemas.effects[effect]
  const [model, setModel] = useState<Record<string, unknown>>({})
  return (
    <BladeEffectSchemaForm
      virtId="story"
      selectedType={effect}
      descriptions="Show"
      model={model}
      errors={errors}
      schemaProperties={orderEffectProperties(
        entry.schema,
        entry.hidden_keys,
        entry.advanced_keys,
        true
      )}
      handleEffectConfig={(c: Record<string, unknown>) => setModel((m) => ({ ...m, ...c }))}
    />
  )
}

export const EnergyEffect = () => <EffectForm effect="energy" />
export const BlenderEffect = () => <EffectForm effect="blender" />
// EffectSchemaForm hides blender's layer pickers while blenderAutomagic is on (the default):
// turn it off so the story shows them and lists the seeded virtuals
BlenderEffect.decorators = [withStore({ virtuals: VIRTUALS, automagic: false })]
export const EffectValidationErrors = () => (
  <EffectForm
    effect="energy"
    errors={{
      blur: 'Input should be less than or equal to 10',
      // prettier and the quotes rule disagree on a string holding single quotes, so it has none
      mixing_mode: 'Input should be additive or overlap'
    }}
  />
)
