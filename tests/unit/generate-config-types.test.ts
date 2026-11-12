import { test } from 'node:test'
import assert from 'node:assert/strict'
import { generate, pascal, untitle } from '../../scripts/generate-config-types.mjs'

const plugin = (properties: object, extra: object = {}) => ({
  schema: { type: 'object', properties, ...extra }
})
const schemas = {
  core: {
    schema: {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      title: 'CoreConfig',
      properties: { audio: { $ref: '#/$defs/AudioConfig' } },
      $defs: {
        AudioConfig: {
          type: 'object',
          title: 'AudioConfig',
          properties: { delay_ms: { type: 'integer', title: 'Delay Ms' } }
        }
      }
    }
  },
  devices: {
    rpi_ws281x: plugin({ name: { type: 'string', title: 'Name' } }, { required: ['name'] })
  },
  integrations: { mqtt_hass: plugin({ name: { type: 'string', title: 'Name' } }) },
  effects: {
    energy: plugin({
      blur: { type: 'number', title: 'Blur' },
      advanced: { anyOf: [{ type: 'boolean' }, { type: 'null' }], title: 'Advanced' }
    }),
    digitalrain2d: plugin({ blur: { type: 'number', title: 'Blur' } })
  }
}

test('pascal matches the names ledfx.types.ts always used', () => {
  assert.equal(pascal('rpi_ws281x'), 'RpiWs281x')
  assert.equal(pascal('digitalrain2d'), 'Digitalrain2d')
  assert.equal(pascal('multiBar'), 'Multibar')
  assert.equal(pascal('mqtt_hass'), 'MqttHass')
})

test('untitle drops property titles but keeps $defs titles', () => {
  const out = untitle(schemas.core.schema)
  assert.equal(out.$schema, undefined)
  assert.equal(out.$defs.AudioConfig.title, 'AudioConfig')
  assert.equal(out.$defs.AudioConfig.properties.delay_ms.title, undefined)
})

test('generate emits one interface per plugin plus the type maps', async () => {
  const ts = await generate(schemas)
  for (const name of [
    'export interface CoreConfig',
    'export interface AudioConfig',
    'export interface RpiWs281xDeviceConfig',
    'export interface MqttHassIntegrationConfig',
    'export interface Digitalrain2dEffectConfig',
    'export interface EnergyEffectConfig',
    'export type EffectType = "digitalrain2d" | "energy"',
    'export interface EffectConfigByType',
    'export type EffectSpecificConfig = EffectConfigByType[EffectType]',
    'export interface EffectConfig {',
    'export interface DeviceConfig {'
  ])
    assert.ok(ts.includes(name), name)
  assert.match(ts, /advanced\?: boolean \| null;/)
  assert.doesNotMatch(ts, /export type (Name|Blur|Advanced)\b/)
  assert.doesNotMatch(ts, /\d[A-Z]\w*(Device|Effect|Integration)Config\b/)
})

test('an enum field becomes a literal union', async () => {
  const ts = await generate({
    ...schemas,
    effects: { rain: plugin({ mode: { enum: ['Blob', 'Laser'], type: 'string' } }) }
  })
  assert.match(ts, /mode\?: "Blob" \| "Laser";/)
})
