import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  orderFormProperties,
  orderEffectProperties,
  audioDeviceName
} from '../../src/components/SchemaForm/fields.ts'

test('orderFormProperties: name, then required, then the rest in schema order', () => {
  const schema = { properties: { a: {}, b: {}, name: {}, c: {}, d: {} }, required: ['d', 'b'] }
  assert.deepEqual(
    orderFormProperties(schema).map((p) => p.id),
    ['name', 'b', 'd', 'a', 'c']
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
  // expected: what the old Effects.tsx chain produced for this schema
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
