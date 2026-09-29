import type { Schema } from './SchemaForm/SchemaForm.props'

type Field = Record<string, any>

export type FormField = Field & { id: string; required: boolean; permitted: boolean }

/** SchemaForm order: `name` first, then required fields, then the rest; schema order within each. */
export const orderFormProperties = (schema?: Schema): FormField[] => {
  const required: string[] = schema?.required ?? []
  const rank = (id: string) => (id === 'name' ? 0 : required.includes(id) ? 1 : 2)
  return Object.entries<Field>(schema?.properties ?? {})
    .map(([id, p]) => ({
      ...p,
      id,
      required: required.includes(id),
      permitted: schema?.permitted_keys ? schema.permitted_keys.includes(id) : true
    }))
    .sort((a, b) => rank(a.id) - rank(b.id))
}

type Bucket = 'color' | 'integer' | 'number' | 'select' | 'text' | 'boolean' | 'other'

const bucketOf = (p: Field): Bucket => {
  switch (p.type) {
    case 'color':
      return 'color'
    case 'integer':
      return 'integer'
    case 'number':
      return 'number'
    case 'string':
      return p.enum?.length ? 'select' : 'text'
    case 'boolean':
      return 'boolean'
  }
  return 'other'
}

// Head groups come first in this order, each in schema order.
const HEAD: ((p: { id: string; bucket: Bucket }) => boolean)[] = [
  (p) => p.id === 'gradient',
  (p) => p.id === 'color',
  (p) => p.bucket === 'color',
  (p) => p.bucket === 'integer',
  (p) => p.bucket === 'number',
  (p) => p.bucket === 'select'
]
// The rest is grouped other -> boolean -> text, each group in REVERSE schema order: the
// order the old chained one-argument sorts produced, which users have always seen.
const TAIL: Bucket[] = ['other', 'boolean', 'text']

/** Effect form order; hidden keys dropped, advanced keys dropped unless `advanced`, `advanced` last. */
export const orderEffectProperties = (
  schema: Schema | undefined,
  hidden_keys?: string[] | null,
  advanced_keys?: string[] | null,
  advanced = false
): (Field & { id: string })[] => {
  const place = (p: { id: string; bucket: Bucket }, i: number): number[] => {
    const head = HEAD.findIndex((test) => test(p))
    return [
      p.id === 'advanced' ? 1 : 0,
      ...(head >= 0 ? [0, head, i] : [1, TAIL.indexOf(p.bucket), -i])
    ]
  }
  return Object.entries<Field>(schema?.properties ?? {})
    .filter(([id]) => !hidden_keys?.includes(id) && (advanced || !advanced_keys?.includes(id)))
    .map(([id, p], i) => ({ p: { ...p, id }, key: place({ id, bucket: bucketOf(p) }, i) }))
    .sort((a, b) => {
      for (let k = 0; k < a.key.length; k++) if (a.key[k] !== b.key[k]) return a.key[k] - b.key[k]
      return 0
    })
    .map(({ p }) => p)
}

/** The label of an audio device index in the audio_device `{index: "Host: Name"}` enum. */
export const audioDeviceName = (field: Field | undefined, index: unknown): string | undefined =>
  typeof index === 'number' ? field?.enum?.[index] : undefined
