import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fieldErrors, clearFieldErrors } from '../../src/api/fieldErrors.ts'

const body = (errors: unknown) => ({
  status: 'failed',
  payload: { type: 'error', reason: 'x invalid value(s)' },
  errors
})

test('maps each error to its top-level field', () => {
  const resp = body([
    {
      type: 'less_than_equal',
      loc: ['brightness'],
      msg: 'Input should be less than or equal to 1',
      input: 7
    },
    { type: 'missing', loc: ['name'], msg: 'Field required', input: {} }
  ])
  assert.deepEqual(fieldErrors(resp), {
    brightness: 'Input should be less than or equal to 1',
    name: 'Field required'
  })
})

test('skips a leading config segment and keeps nested locs on their top-level field', () => {
  assert.deepEqual(fieldErrors(body([{ loc: ['config', 'brightness'], msg: 'too big' }])), {
    brightness: 'too big'
  })
  assert.deepEqual(fieldErrors(body([{ loc: ['segments', 0, 1], msg: 'bad segment' }])), {
    segments: 'bad segment'
  })
})

test('joins several messages for one field', () => {
  const resp = body([
    { loc: ['ip_address'], msg: 'first' },
    { loc: ['ip_address'], msg: 'second' }
  ])
  assert.deepEqual(fieldErrors(resp), { ip_address: 'first; second' })
})

test('ignores errors without a field, and non-validation responses', () => {
  assert.deepEqual(fieldErrors(body([{ loc: [], msg: 'whole body' }, { msg: 'no loc' }])), {})
  assert.deepEqual(fieldErrors({ status: 'success' }), {})
  assert.deepEqual(fieldErrors(undefined), {})
  assert.deepEqual(fieldErrors(true), {})
})

test('clearFieldErrors drops only the changed fields', () => {
  assert.deepEqual(clearFieldErrors({ a: 'x', b: 'y' }, { a: 1 }), { b: 'y' })
})

test('malformed entries are skipped without throwing', () => {
  const resp = body([null, { loc: null, msg: 'x' }, { loc: 'name', msg: 'y' }])
  assert.deepEqual(fieldErrors(resp), {})
})
