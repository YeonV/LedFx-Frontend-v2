import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  widgetFor,
  unwrapNullable,
  orderFormProperties,
  orderEffectProperties,
  audioDeviceName,
  sliderMarks,
  enumOptions,
  nullOption,
  NULL_OPTION,
  toSelectValue,
  fromSelectValue
} from '../../src/components/SchemaForm/fields.ts'

const schemas = JSON.parse(
  readFileSync(
    new URL('../../src/components/SchemaForm/schemas.fixture.json', import.meta.url),
    'utf8'
  )
)
const prop = (entry: any, id: string) => entry.schema.properties[id]

test('unwrapNullable folds anyOf [T, null] and keeps the wrapper keys', () => {
  const { field, nullable } = unwrapNullable(prop(schemas.effects.energy, 'advanced'))
  assert.equal(nullable, true)
  assert.equal(field.type, 'boolean')
  assert.equal(field.title, 'Advanced')
  assert.equal(field.anyOf, undefined)
  assert.equal(unwrapNullable({ type: 'number' }).nullable, false)
})

test("unwrapNullable folds anyOf [T-with-enum, null], keeping T's enum and the wrapper keys", () => {
  const { field, nullable } = unwrapNullable(prop(schemas.audio, 'audio_device'))
  assert.equal(nullable, true)
  assert.equal(field.type, 'integer')
  assert.equal(field.enum, undefined)
  assert.equal(field.title, 'Audio Device')
  assert.equal(field.default, null)
  assert.equal(field['x-ledfx-enum-source'], 'audio_devices')
  // the old `type: [T, null]` form has no producer any more
  assert.equal(unwrapNullable({ type: ['integer', 'null'], enum: [1] }).nullable, false)
})

test('enumOptions reads enum, a single const, and nothing else', () => {
  assert.deepEqual(enumOptions(prop(schemas.effects.energy, 'mixing_mode')), [
    { value: 'additive', label: 'additive' },
    { value: 'overlap', label: 'overlap' }
  ])
  assert.deepEqual(enumOptions({ type: 'integer', enum: [5, 6] }), [
    { value: 5, label: '5' },
    { value: 6, label: '6' }
  ])
  // a one-value Literal (com_port with one serial port)
  assert.deepEqual(enumOptions({ type: 'string', const: '/dev/ttyUSB0' }), [
    { value: '/dev/ttyUSB0', label: '/dev/ttyUSB0' }
  ])
  assert.equal(enumOptions({ type: 'number' }), undefined)
  assert.equal(enumOptions({ oneOf: [{ const: 1, title: 'x' }] }), undefined)
  assert.equal(enumOptions(undefined), undefined)
})

test('enumOptions adds the null option for a nullable field, labelled by source', () => {
  const dev = { type: 'integer', enum: [1, 3, 4], 'x-ledfx-enum-source': 'audio_devices' }
  assert.deepEqual(enumOptions(dev, true)?.at(-1), { value: null, label: 'System default' })
  assert.deepEqual(
    enumOptions(dev)?.map((o) => o.value),
    [1, 3, 4]
  )
  assert.deepEqual(enumOptions({ type: 'string', enum: ['a'] }, true)?.at(-1), {
    value: null,
    label: 'None'
  })
  // not an enum: nothing to add to
  assert.equal(enumOptions({ type: 'string' }, true), undefined)
})

test('nullOption is there with zero audio devices, where the field has no enum', () => {
  const raw = {
    anyOf: [{ type: 'integer' }, { type: 'null' }],
    default: null,
    'x-ledfx-enum-source': 'audio_devices'
  }
  const w = widgetFor(raw, 'audio_device', undefined, true)
  assert.equal(w.kind, 'audioDevice')
  assert.equal(w.nullable, true)
  assert.equal(enumOptions(w.field), undefined)
  assert.deepEqual(nullOption(w.field), { value: null, label: 'System default' })
  assert.deepEqual(nullOption({ type: 'string' }), { value: null, label: 'None' })
})

test('widgetFor picks the widget for each 2020-12 field form', () => {
  const cases: [any, string, string | undefined, string][] = [
    [prop(schemas.devices.wled, 'refresh_rate'), 'refresh_rate', 'wled', 'integerSlider'],
    [prop(schemas.devices.wled, 'ip_address'), 'ip_address', 'wled', 'text'],
    [prop(schemas.devices.wled, 'sync_mode'), 'sync_mode', 'wled', 'select'],
    [prop(schemas.devices.rpi_ws281x, 'gpio_pin'), 'gpio_pin', 'rpi_ws281x', 'select'],
    [prop(schemas.devices.artnet, 'even_packet_size'), 'even_packet_size', 'artnet', 'boolean'],
    [prop(schemas.effects.energy, 'background_color'), 'background_color', 'energy', 'color'],
    [prop(schemas.effects.gradient, 'gradient'), 'gradient', 'gradient', 'gradient'],
    [prop(schemas.effects.energy, 'mixing_mode'), 'mixing_mode', 'energy', 'select'],
    [prop(schemas.effects.energy, 'blur'), 'blur', 'energy', 'slider'],
    [prop(schemas.effects.energy, 'advanced'), 'advanced', 'energy', 'boolean'],
    [prop(schemas.virtuals, 'transition_mode'), 'transition_mode', undefined, 'select'],
    [prop(schemas.audio, 'delay_ms'), 'delay_ms', undefined, 'integerSlider'],
    [prop(schemas.audio, 'audio_device'), 'audio_device', undefined, 'audioDevice'],
    [prop(schemas.effects.blender, 'mask'), 'mask', 'blender', 'virtual'],
    [prop(schemas.effects.blender, 'mask'), 'mask', undefined, 'virtual'],
    [prop(schemas.effects.blender, 'foreground'), 'foreground', 'blender', 'virtual'],
    [prop(schemas.devices.adalight, 'com_port'), 'com_port', 'adalight', 'select'],
    [prop(schemas.effects.radial, 'source_virtual'), 'source_virtual', 'radial', 'virtual'],
    [prop(schemas.integrations.mqtt_hass, 'name'), 'name', 'mqtt_hass', 'hidden'],
    [{ type: 'object' }, 'x', undefined, 'unsupported'],
    [{ $ref: '#/$defs/AudioConfig' }, 'x', undefined, 'unsupported']
  ]
  for (const [field, id, formType, kind] of cases)
    assert.equal(widgetFor(field, id, formType).kind, kind, `${formType}.${id}`)
  assert.equal(widgetFor(prop(schemas.effects.energy, 'advanced'), 'advanced').nullable, true)
})

test('widgetFor keeps the hand-built types', () => {
  const cases: [any, string][] = [
    [{ type: 'int', enum: [10, 20] }, 'integerSlider'],
    [{ type: 'color' }, 'color'],
    [{ type: 'color', isGradient: true }, 'gradient'],
    [{ type: 'color', gradient: true }, 'gradient'],
    [{ type: 'multiselect', enum: ['a'] }, 'multiselect'],
    [{ type: 'autocomplete', enum: ['a'] }, 'autocomplete'],
    [{ type: 'virtual' }, 'virtual'],
    [{ type: 'string', enum: ['a', 'b'] }, 'select'],
    [{ type: 'integer' }, 'integerSlider']
  ]
  for (const [field, kind] of cases) assert.equal(widgetFor(field, 'x').kind, kind, field.type)
})

test('hand-built fields render as they always did; the 2020-12 rules are for backend forms', () => {
  // VisualizerConfig and the visualiser's own forms pass no form type; the old SchemaForm drew a
  // string with format color as a text field, and an integer or number enum as a slider
  const handBuilt: [any, string][] = [
    [{ type: 'string', format: 'color' }, 'text'],
    [{ type: 'string', format: 'color', isGradient: true }, 'text'],
    [{ type: 'string', format: 'gradient' }, 'text'],
    [{ type: 'integer', enum: [1, 2, 3] }, 'integerSlider'],
    [{ type: 'number', enum: [0.5, 1] }, 'slider']
  ]
  for (const [field, kind] of handBuilt)
    assert.equal(widgetFor(field, 'x').kind, kind, JSON.stringify(field))
  assert.equal(widgetFor({ type: 'string', format: 'color' }, 'x', 'energy').kind, 'color')
  assert.equal(widgetFor({ type: 'integer', enum: [1, 2, 3] }, 'x', 'rpi_ws281x').kind, 'select')
})

test('a backend form without a form type (audio, virtuals) gets the backend widgets', () => {
  const color = { type: 'string', format: 'color' }
  const gradient = { type: 'string', format: 'gradient' }
  const intEnum = { type: 'integer', enum: [1, 2], default: 1 }
  assert.equal(widgetFor(color, 'x', undefined, true).kind, 'color')
  assert.equal(widgetFor(gradient, 'x', undefined, true).kind, 'gradient')
  assert.equal(widgetFor(intEnum, 'x', undefined, true).kind, 'select')
  // the default stays "hand-built" without a form type
  assert.equal(widgetFor(color, 'x').kind, 'text')
  assert.equal(widgetFor(intEnum, 'x').kind, 'integerSlider')
  // an explicit false overrides a form type
  assert.equal(widgetFor(color, 'x', 'energy', false).kind, 'text')
})

test('every field of every fixture form has a widget', () => {
  const forms: [string, any][] = [
    ['audio', schemas.audio],
    ['virtuals', schemas.virtuals],
    ...Object.entries<any>(schemas.devices).map(([t, e]): [string, any] => [t, e]),
    ...Object.entries<any>(schemas.integrations).map(([t, e]): [string, any] => [t, e]),
    ...Object.entries<any>(schemas.effects).map(([t, e]): [string, any] => [t, e])
  ]
  for (const [type, entry] of forms)
    for (const [id, field] of Object.entries<any>(entry.schema.properties))
      assert.notEqual(widgetFor(field, id, type).kind, 'unsupported', `${type}.${id}`)
})

test('orderFormProperties: name, then required, then the rest in schema order', () => {
  const schema = { properties: { a: {}, b: {}, name: {}, c: {}, d: {} }, required: ['d', 'b'] }
  assert.deepEqual(
    orderFormProperties(schema).map((p) => p.id),
    ['name', 'b', 'd', 'a', 'c']
  )
  const wled = schemas.devices.wled.schema
  const ids = orderFormProperties(wled).map((p) => p.id)
  assert.deepEqual(ids.slice(0, 2), ['name', 'ip_address'])
  assert.deepEqual(
    ids.slice(2),
    Object.keys(wled.properties).filter((id) => id !== 'name' && id !== 'ip_address')
  )
})

test('orderFormProperties flags required and permitted fields', () => {
  const [name, other] = orderFormProperties({
    properties: { other: {}, name: {} },
    required: ['name'],
    permitted_keys: ['other']
  })
  assert.deepEqual([name.id, name.required, name.permitted], ['name', true, false])
  assert.deepEqual([other.id, other.required, other.permitted], ['other', false, true])
  assert.equal(orderFormProperties({ properties: { x: {} } })[0].required, false)
  assert.deepEqual(orderFormProperties(undefined), [])
})

test('orderEffectProperties keeps the order of the old chained sorts', () => {
  // expected lists: what the old Effects.tsx chain produced for these schemas
  const legacy = {
    properties: {
      flip: { type: 'boolean' },
      brightness: { type: 'number' },
      background_color: { type: 'color' },
      text: { type: 'string' },
      diag: { type: 'boolean' },
      advanced: { type: 'boolean' },
      count: { type: 'integer' },
      blur: { type: 'number' },
      mirror: { type: 'boolean' },
      label: { type: 'string' },
      color_lows: { type: 'color' },
      mode: { type: 'string', enum: ['a', 'b'] },
      bg_color: { type: 'color' },
      color: { type: 'color' },
      gradient: { type: 'color', gradient: true }
    }
  }
  assert.deepEqual(
    orderEffectProperties(legacy, [], [], true).map((p) => p.id),
    [
      'gradient',
      'color',
      'background_color',
      'color_lows',
      'bg_color',
      'count',
      'brightness',
      'blur',
      'mode',
      'mirror',
      'diag',
      'flip',
      'label',
      'text',
      'advanced'
    ]
  )
  const order = (id: string, advanced = true) => {
    const e = schemas.effects[id]
    return orderEffectProperties(e.schema, e.hidden_keys, e.advanced_keys, advanced).map(
      (p) => p.id
    )
  }
  assert.deepEqual(order('energy'), [
    'background_color',
    'color_lows',
    'color_mids',
    'color_high',
    'brightness',
    'background_brightness',
    'blur',
    'sensitivity',
    'mixing_mode',
    'color_cycler',
    'mirror',
    'diag',
    'flip',
    'advanced'
  ])
  assert.deepEqual(order('gradient'), [
    'gradient',
    'background_color',
    'blur',
    'brightness',
    'background_brightness',
    'modulation_speed',
    'gradient_roll',
    'speed',
    'modulation_effect',
    'modulate',
    'diag',
    'mirror',
    'flip',
    'advanced'
  ])
  assert.deepEqual(order('blender'), [
    'brightness',
    'mask_cutoff',
    'mask_stretch',
    'background_stretch',
    'foreground_stretch',
    'invert_mask',
    'diag',
    'mirror',
    'flip',
    'background',
    'foreground',
    'mask',
    'advanced'
  ])
})

test('a marked field orders like a plain string, an unknown marker like its base type', () => {
  const radial = schemas.effects.radial
  const plain = structuredClone(radial.schema)
  plain.properties.source_virtual = { type: 'string', title: 'Source Virtual' }
  const ids = (schema: any) =>
    orderEffectProperties(schema, radial.hidden_keys, radial.advanced_keys, true).map((p) => p.id)
  assert.equal(radial.schema.properties.source_virtual.enum, undefined)
  assert.deepEqual(ids(radial.schema), ids(plain))
  // an unknown marker is not a live list: an integer stays in the integer bucket
  const s: any = { properties: { a: { type: 'string' }, n: { type: 'integer' } } }
  const before = orderEffectProperties(s, [], [], true).map((p) => p.id)
  s.properties.n['x-ledfx-enum-source'] = 'other'
  assert.deepEqual(
    orderEffectProperties(s, [], [], true).map((p) => p.id),
    before
  )
})

test('orderEffectProperties drops hidden keys, and advanced keys unless advanced', () => {
  const schema = {
    properties: { a: { type: 'number' }, b: { type: 'number' }, c: { type: 'number' } }
  }
  assert.deepEqual(
    orderEffectProperties(schema, ['a'], ['b'], false).map((p) => p.id),
    ['c']
  )
  assert.deepEqual(
    orderEffectProperties(schema, ['a'], ['b'], true).map((p) => p.id),
    ['b', 'c']
  )
  assert.deepEqual(orderEffectProperties(undefined), [])
})

test('audioDeviceName finds device index 0', () => {
  const field = { type: 'string', enum: { 0: 'MME: Mic', 1: 'MME: Line' } }
  assert.equal(audioDeviceName(field, 0), 'MME: Mic')
  assert.equal(audioDeviceName(field, 1), 'MME: Line')
  assert.equal(audioDeviceName(field, undefined), undefined)
})

test('a select maps a null option to NULL_OPTION and back', () => {
  const withNull = enumOptions({ enum: [1] }, true)
  const noNull = enumOptions({ enum: [1, 2] })
  // a null value selects the null option; choosing it sends null
  assert.equal(toSelectValue(withNull, null, 1), NULL_OPTION)
  assert.equal(fromSelectValue(NULL_OPTION), null)
  assert.equal(fromSelectValue(1), 1)
  // `default: null` is a default, not "no default"
  assert.equal(toSelectValue(withNull, undefined, null), NULL_OPTION)
  assert.equal(toSelectValue(withNull, 1, null), 1)
  // index 0 / falsy values are values
  assert.equal(toSelectValue(enumOptions({ enum: [0, 1] }), 0, 1), 0)
  // without a null option, null falls through to the default, then the first option
  assert.equal(toSelectValue(noNull, null, 2), 2)
  assert.equal(toSelectValue(noNull, null, null), 1)
  assert.equal(toSelectValue(noNull, undefined, undefined), 1)
})

test('widgetFor kinds over the fixture: sourced fields', () => {
  const kind = (e: any, id: string, t?: string) => widgetFor(prop(e, id), id, t, true).kind
  assert.equal(kind(schemas.audio, 'audio_device'), 'audioDevice')
  assert.equal(kind(schemas.effects.energy, 'mixing_mode', 'energy'), 'select')
  assert.equal(kind(schemas.effects.radial, 'source_virtual', 'radial'), 'virtual')
  assert.equal(kind(schemas.effects.energy, 'advanced', 'energy'), 'boolean')
})

test('the marker picks the widget', () => {
  const marked = (source: string, extra: any = {}) => ({
    type: 'string',
    'x-ledfx-enum-source': source,
    ...extra
  })
  const kind = (f: any, id = 'x', t?: string) => widgetFor(f, id, t, true).kind
  assert.equal(kind(marked('audio_devices', { type: 'integer' })), 'audioDevice')
  assert.equal(kind(marked('virtuals')), 'virtual')
  for (const s of ['scenes', 'playlists', 'devices', 'com_ports'])
    assert.equal(kind(marked(s)), 'select', s)
  // an array whose items are marked is a multi-select
  assert.equal(kind({ type: 'array', items: marked('virtuals') }, 'virtual_ids'), 'multiselect')
  // a nullable marked field: the wrapper's marker counts
  assert.equal(
    kind({ anyOf: [{ type: 'string' }, { type: 'null' }], 'x-ledfx-enum-source': 'scenes' }),
    'select'
  )
  // no id or form type involved any more
  assert.equal(kind(marked('virtuals'), 'audio_device'), 'virtual')
  assert.equal(kind({ type: 'string' }, 'audio_device'), 'text')
  assert.equal(kind({ type: 'string' }, 'mask', 'blender'), 'text')
  // mqtt_hass hiding is a UI choice, not data
  assert.equal(kind({ type: 'string' }, 'name', 'mqtt_hass'), 'hidden')
})

test('an unknown marker falls back to the base type and warns once', () => {
  const warn = console.warn
  const calls: unknown[][] = []
  console.warn = (...a) => void calls.push(a)
  try {
    const f = { type: 'integer', 'x-ledfx-enum-source': 'nope' }
    assert.equal(widgetFor(f, 'x', 'e', true).kind, 'integerSlider')
    assert.equal(widgetFor(f, 'y', 'e', true).kind, 'integerSlider')
    assert.equal(widgetFor({ type: 'string', 'x-ledfx-enum-source': 'nope' }, 'z').kind, 'text')
    assert.equal(calls.length, 1)
    assert.match(String(calls[0][0]), /nope/)
  } finally {
    console.warn = warn
  }
})

test('an integer with examples is a slider with marks at the examples', () => {
  const rate = prop(schemas.devices.wled, 'refresh_rate')
  assert.equal(rate.enum, undefined)
  assert.equal(rate['x-ledfx-enum-source'], undefined)
  const w = widgetFor(rate, 'refresh_rate', 'wled')
  assert.equal(w.kind, 'integerSlider')
  assert.deepEqual(sliderMarks(w.field), rate.examples)
  // an enum still gives the marks (hand-built `int`), a plain integer has none
  assert.deepEqual(sliderMarks({ type: 'int', enum: [10, 20] }), [10, 20])
  assert.equal(sliderMarks({ type: 'integer' }), undefined)
  // examples on a number don't make marks
  assert.equal(sliderMarks({ type: 'number', examples: [1, 2] }), undefined)
})
