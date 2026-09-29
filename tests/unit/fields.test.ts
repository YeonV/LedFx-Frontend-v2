import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  widgetFor,
  unwrapNullable,
  orderFormProperties,
  orderEffectProperties,
  groupAudioDevices,
  audioDeviceName,
  instanceOptions,
  sliderMarks,
  sourcedOptions,
  unlistedLabel,
  enumOptions,
  nullOption,
  NULL_OPTION,
  toSelectValue,
  fromSelectValue
} from '../../src/components/SchemaForm/fields.ts'
import { loadSource } from '../../src/components/SchemaForm/loadSource.ts'

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
  // sourced options replace the schema's own and get the null option too
  assert.deepEqual(enumOptions({ type: 'string' }, true, [{ value: 'a', label: 'A' }]), [
    { value: 'a', label: 'A' },
    { value: null, label: 'None' }
  ])
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

test('widgetFor reports the standard readOnly, and not the old x-ledfx-readonly', () => {
  assert.equal(widgetFor({ type: 'string', readOnly: true }, 'x').readonly, true)
  assert.equal(widgetFor({ type: 'string' }, 'x').readonly, false)
  assert.equal(widgetFor({ type: 'string', 'x-ledfx-readonly': true }, 'x').readonly, false)
  // through a nullable wrapper
  assert.equal(
    widgetFor({ anyOf: [{ type: 'string' }, { type: 'null' }], readOnly: true }, 'x').readonly,
    true
  )
})

test('a backend form: readOnly fields are disabled, the others editable', () => {
  // the audio schema has no permitted_keys: everything is permitted, readOnly decides
  const editable = (schema: any) =>
    Object.fromEntries(
      orderFormProperties(schema).map((f) => [
        f.id,
        f.permitted && !widgetFor(f, f.id, undefined, true).readonly
      ])
    )
  const audio = editable(schemas.audio.schema)
  for (const id of ['sample_rate', 'mic_rate', 'fft_size', 'audio_device_name'])
    assert.equal(audio[id], false, id)
  for (const id of ['audio_device', 'delay_ms', 'min_volume']) assert.equal(audio[id], true, id)
  const core = editable(schemas.core.schema)
  assert.equal(core.instance_id, false)
  assert.equal(core.debug_asyncio, false)
  assert.equal(core.host, true)
})

test("an effect's permitted_keys still decide, and readOnly adds to them", () => {
  const schema = {
    properties: {
      a: { type: 'string' },
      b: { type: 'string' },
      c: { type: 'string', readOnly: true }
    },
    permitted_keys: ['a', 'c']
  }
  const f = Object.fromEntries(
    orderFormProperties(schema).map((p) => [p.id, [p.permitted, widgetFor(p, p.id).readonly]])
  )
  assert.deepEqual(f, { a: [true, false], b: [false, false], c: [true, true] })
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

test('no "(unavailable)" before the source has loaded', () => {
  const scene = { type: 'string', 'x-ledfx-enum-source': 'scenes' }
  const audio = { 'x-ledfx-enum-source': 'audio_devices' }
  // not loaded: the stored id shows plain, a bare index isn't offered at all
  assert.deepEqual(sourcedOptions(scene, [], 'gone', false, false), [
    { value: 'gone', label: 'gone' }
  ])
  assert.deepEqual(sourcedOptions(audio, [], 2, false, false), [])
  // loaded: the suffix
  assert.deepEqual(sourcedOptions(scene, [], 'gone', false, true), [
    { value: 'gone', label: 'gone (unavailable)' }
  ])
  assert.deepEqual(sourcedOptions(audio, [], 2, false, true), [
    { value: 2, label: '2 (unavailable)' }
  ])
})

test('sourcedOptions keeps an unknown stored value, and adds None to optional scenes', () => {
  const opts = [{ value: 's1', label: 'Chill' }]
  const scene = { type: 'string', default: '', 'x-ledfx-enum-source': 'scenes' }
  assert.deepEqual(sourcedOptions(scene, opts, 's1'), [
    { value: '', label: 'None' },
    { value: 's1', label: 'Chill' }
  ])
  assert.deepEqual(sourcedOptions(scene, opts, 'gone')?.at(-1), {
    value: 'gone',
    label: 'gone (unavailable)'
  })
  // index 0 is a value; null and '' are not stored values
  assert.deepEqual(sourcedOptions({ 'x-ledfx-enum-source': 'audio_devices' }, [], 0), [
    { value: 0, label: '0 (unavailable)' }
  ])
  assert.deepEqual(sourcedOptions({ 'x-ledfx-enum-source': 'audio_devices' }, [], null), [])
  // required, or a default that isn't "": no None option; not sourced: nothing
  assert.equal(sourcedOptions(scene, opts, 's1', true)?.length, 1)
  assert.equal(sourcedOptions({ ...scene, default: undefined }, opts, 's1')?.length, 1)
  assert.equal(sourcedOptions(scene, undefined, 's1'), undefined)
  // the unavailable entry belongs to the one call: another field's options are untouched
  assert.equal(sourcedOptions(scene, opts, 's1')?.length, 2)
})

test("the schema's default is a none value: blank, never unavailable", () => {
  const radial = schemas.effects.radial.schema.properties.source_virtual
  assert.equal(radial.default, 'unknown')
  const opts = [{ value: 'v1', label: 'Strip' }]
  assert.deepEqual(sourcedOptions(radial, opts, 'unknown')?.at(-1), { value: 'unknown', label: '' })
  assert.deepEqual(sourcedOptions(radial, opts, 'unknown', false, false)?.at(-1), {
    value: 'unknown',
    label: ''
  })
  // any other stored id the store doesn't know is still unavailable
  assert.deepEqual(sourcedOptions(radial, opts, 'gone')?.at(-1), {
    value: 'gone',
    label: 'gone (unavailable)'
  })
})

test('unlistedLabel: default blank, a filtered-out instance by name, else unavailable or raw', () => {
  // radial's default 'unknown' is "none", loaded or not
  assert.equal(unlistedLabel('unknown', undefined, 'unknown', true), '')
  assert.equal(unlistedLabel('unknown', undefined, 'unknown', false), '')
  // an existing virtual the picker hides (automagic's smoke-mask) shows its name
  assert.equal(unlistedLabel('smoke-mask', 'Smoke mask', 'unknown', true), 'Smoke mask')
  assert.equal(unlistedLabel('smoke-mask', 'Smoke mask', 'unknown', false), 'Smoke mask')
  // missing: unavailable once loaded, the raw id before
  assert.equal(unlistedLabel('gone', undefined, 'unknown', true), 'gone (unavailable)')
  assert.equal(unlistedLabel('gone', undefined, 'unknown', false), 'gone')
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

const NAMES = {
  1: 'PulseAudio: Default Source',
  3: 'PulseAudio: RDPSink.monitor',
  4: 'PulseAudio: RDPSource'
}

const opts = (m: Record<string, string>) =>
  Object.entries(m).map(([k, label]) => ({ value: Number(k), label }))

test('groupAudioDevices groups the device options by host, index 0 included', () => {
  assert.deepEqual(groupAudioDevices(opts(NAMES)), [
    {
      host: 'PulseAudio',
      devices: [
        { index: 1, name: 'Default Source' },
        { index: 3, name: 'RDPSink.monitor' },
        { index: 4, name: 'RDPSource' }
      ]
    }
  ])
  // a colon inside the device name stays in the name
  assert.deepEqual(groupAudioDevices(opts({ 0: 'WASAPI: Mic (USB: 2)', 2: 'MME: Line' })), [
    { host: 'WASAPI', devices: [{ index: 0, name: 'Mic (USB: 2)' }] },
    { host: 'MME', devices: [{ index: 2, name: 'Line' }] }
  ])
  assert.deepEqual(groupAudioDevices([]), [])
  assert.deepEqual(groupAudioDevices(undefined), [])
})

test('audioDeviceName looks the name up by index, including index 0', () => {
  const names = { 0: 'A: zero', 1: 'A: one' }
  assert.equal(audioDeviceName(names, 0), 'A: zero')
  // an unplugged device (not in the map) has no name, so nothing is keyed by it
  assert.equal(audioDeviceName(names, 7), undefined)
  assert.equal(audioDeviceName(names, null), undefined)
  assert.equal(audioDeviceName(names, undefined), undefined)
  assert.equal(audioDeviceName(undefined, 0), undefined)
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

const STATE = {
  audio_devices: { 3: 'PulseAudio: B', 0: 'ALSA: Zero', 12: 'ALSA: Twelve' },
  virtuals: { v1: { id: 'v1', config: { name: 'Strip' } }, v2: { id: 'v2', config: {} } },
  scenes: { s1: { name: 'Chill' } },
  playlists: { p1: { id: 'p1', name: 'Party' } },
  devices: { d1: { id: 'd1', config: { name: 'WLED' } } },
  com_ports: ['/dev/ttyUSB0', 'COM3']
}

test('instanceOptions builds the options of each source from the store', () => {
  // audio devices: sorted by index, numeric values, index 0 kept
  assert.deepEqual(instanceOptions('audio_devices', STATE), [
    { value: 0, label: 'ALSA: Zero' },
    { value: 3, label: 'PulseAudio: B' },
    { value: 12, label: 'ALSA: Twelve' }
  ])
  // virtuals: id -> name, the id when there is no name
  assert.deepEqual(instanceOptions('virtuals', STATE), [
    { value: 'v1', label: 'Strip' },
    { value: 'v2', label: 'v2' }
  ])
  assert.deepEqual(instanceOptions('com_ports', STATE), [
    { value: '/dev/ttyUSB0', label: '/dev/ttyUSB0' },
    { value: 'COM3', label: 'COM3' }
  ])
  assert.deepEqual(instanceOptions('scenes', STATE), [{ value: 's1', label: 'Chill' }])
  assert.deepEqual(instanceOptions('playlists', STATE), [{ value: 'p1', label: 'Party' }])
  assert.deepEqual(instanceOptions('devices', STATE), [{ value: 'd1', label: 'WLED' }])
})

test('instanceOptions: empty sources are empty, unknown sources are undefined', () => {
  for (const s of ['audio_devices', 'virtuals', 'com_ports', 'scenes', 'playlists', 'devices']) {
    assert.deepEqual(instanceOptions(s, {}), [], s)
    assert.deepEqual(instanceOptions(s, { [s]: s === 'com_ports' ? [] : {} }), [], s)
  }
  assert.equal(instanceOptions('nope', STATE), undefined)
  assert.equal(instanceOptions(undefined, STATE), undefined)
})

const deepFreeze = <T>(o: T): T => {
  if (o && typeof o === 'object') {
    Object.freeze(o)
    for (const v of Object.values(o)) deepFreeze(v)
  }
  return o
}

test('nothing in the widget path writes into the schemas', () => {
  // a frozen fixture throws (strict mode, ESM) on any write
  const frozen = deepFreeze(structuredClone(schemas))
  const forms: [any, string | undefined][] = [
    [frozen.audio, undefined],
    [frozen.virtuals, undefined],
    ...Object.entries<any>(frozen.devices).map(([t, e]): [any, string] => [e, t]),
    ...Object.entries<any>(frozen.integrations).map(([t, e]): [any, string] => [e, t]),
    ...Object.entries<any>(frozen.effects).map(([t, e]): [any, string] => [e, t]),
    [frozen.core, undefined]
  ]
  for (const [entry, type] of forms) {
    orderFormProperties(entry.schema)
    orderEffectProperties(entry.schema, entry.hidden_keys, entry.advanced_keys, true)
    for (const [id, field] of Object.entries<any>(entry.schema.properties)) {
      const w = widgetFor(field, id, type, true)
      enumOptions(w.field, w.nullable, instanceOptions(w.field['x-ledfx-enum-source'], STATE))
      sliderMarks(w.field)
    }
  }
  groupAudioDevices(instanceOptions('audio_devices', STATE))
})

test('loadSource calls the getter once and marks the source loaded, however it ends', async () => {
  const marked: string[] = []
  const mark = (s: string) => void marked.push(s)
  let calls = 0
  // success, a 404 (the getter resolves to nothing), and a throw (it rejects)
  const ok = async () => void calls++
  const notFound = async () => void calls++ || undefined
  const boom = async () => {
    calls++
    throw new Error('network')
  }
  await loadSource('a', { a: ok }, mark)
  await loadSource('b', { b: notFound }, mark)
  await loadSource('c', { c: boom }, mark)
  assert.equal(calls, 3)
  assert.deepEqual(marked, ['a', 'b', 'c'])
  // a synchronous throw counts too
  await loadSource(
    'd',
    {
      d: () => {
        throw new Error('x')
      }
    },
    mark
  )
  assert.equal(marked.at(-1), 'd')
})

test('loadSource ignores an unknown source', async () => {
  const marked: string[] = []
  await loadSource('nope', { a: async () => {} }, (s) => void marked.push(s))
  await loadSource('a', {}, (s) => void marked.push(s))
  assert.deepEqual(marked, [])
})

test('loadSource shares one request per source while it is pending, then fetches again', async () => {
  let calls = 0
  let release = () => {}
  const load = () => {
    calls++
    return new Promise<void>((r) => (release = r))
  }
  const marked: string[] = []
  const mark = (s: string) => void marked.push(s)
  const first = loadSource('x', { x: load }, mark)
  const second = loadSource('x', { x: load }, mark)
  assert.equal(calls, 1)
  assert.equal(first, second)
  release()
  await first
  assert.deepEqual(marked, ['x'])
  const third = loadSource('x', { x: load }, mark)
  assert.equal(calls, 2)
  release()
  await third
})
