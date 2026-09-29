import type { FieldSchema, ObjectSchema } from '../../api/ledfx.types'

export type WidgetKind =
  | 'boolean'
  | 'slider'
  | 'integerSlider'
  | 'select'
  | 'text'
  | 'color'
  | 'gradient'
  | 'multiselect'
  | 'autocomplete'
  | 'virtual'
  | 'audioDevice'
  | 'hidden'
  | 'unsupported'

export interface Widget {
  kind: WidgetKind
  nullable: boolean
  /** The field with `anyOf [T, null]` folded into T. */
  field: FieldSchema
}

export type EnumOption = { value: string | number | boolean | null; label: string }

/** The null option of a nullable field: "System default" for the audio device, else "None". */
export const nullOption = (field?: FieldSchema): EnumOption => ({
  value: null,
  label: field?.['x-ledfx-enum-source'] === 'audio_devices' ? 'System default' : 'None'
})

/**
 * The choices of an enum field: pydantic's `enum`, or a single `const`. A `nullable` field (see
 * unwrapNullable) gets a trailing null option. Undefined when the field is not an enum.
 */
export const enumOptions = (field?: FieldSchema, nullable = false): EnumOption[] | undefined => {
  const values = Array.isArray(field?.enum)
    ? field.enum
    : field && 'const' in field
      ? [field.const]
      : undefined
  const options = values?.map((v): EnumOption => ({ value: v, label: String(v) }))
  if (!options) return undefined
  return nullable ? [...options, nullOption(field)] : options
}

/** The slider marks of an integer field: its `enum` (hand-built `int`), else its `examples`. */
export const sliderMarks = (field: FieldSchema): EnumOption['value'][] | undefined =>
  enumOptions(field)?.map((o) => o.value) ??
  (field.type === 'integer' && Array.isArray(field.examples) ? field.examples : undefined)

/** A select's stand-in for the `null` option: MUI Select can't hold `null` as a value. */
export const NULL_OPTION = '__null__'

/**
 * The Select value of an enum field: the model value, else the default, else the first option.
 * `null` counts as a value (shown as NULL_OPTION) only when the options include null.
 */
export const toSelectValue = (
  options: EnumOption[] | undefined,
  current: unknown,
  def: unknown
) => {
  const hasNull = !!options?.some((o) => o.value === null)
  const picked = [current, def, options?.[0]?.value].find(
    (v) => v !== undefined && (v !== null || hasNull)
  )
  return picked === null ? NULL_OPTION : picked
}

/** The model value of a Select choice: NULL_OPTION is `null`. */
export const fromSelectValue = (v: unknown) => (v === NULL_OPTION ? null : v)

/**
 * Fold a nullable field into T: `anyOf: [T, {type: 'null'}]`. T's keys (type, enum) join the
 * wrapper's (title, default, the x-ledfx-* keys), which win.
 */
export const unwrapNullable = (raw: FieldSchema): { field: FieldSchema; nullable: boolean } => {
  const { anyOf, ...wrapper } = raw
  const branches = anyOf?.filter((b) => b.type !== 'null') ?? []
  if (!anyOf || anyOf.length !== 2 || branches.length !== 1) return { field: raw, nullable: false }
  return { field: { ...branches[0], ...wrapper }, nullable: true }
}

// The widget of each `x-ledfx-enum-source` marker: the schema holds the shape, the store the choices.
const SOURCE_WIDGETS: Record<string, WidgetKind> = {
  audio_devices: 'audioDevice',
  virtuals: 'virtual',
  scenes: 'select',
  playlists: 'select',
  devices: 'select',
  com_ports: 'select'
}

/** The marker of a field, or of its array items. */
export const sourceOf = (field: FieldSchema): string | undefined =>
  field['x-ledfx-enum-source'] ?? field.items?.['x-ledfx-enum-source']

const warned = new Set<string>()
const sourceKind = (field: FieldSchema): WidgetKind | undefined => {
  const source = sourceOf(field)
  if (!source) return undefined
  const kind = SOURCE_WIDGETS[source]
  if (!kind) {
    if (!warned.has(source)) {
      warned.add(source)
      console.warn(`unknown x-ledfx-enum-source "${source}": using the base type's widget`)
    }
    return undefined
  }
  return field.type === 'array' ? 'multiselect' : kind
}

// A UI choice, not data: the form of mqtt_hass sets name and description itself.
const override = (id: string, formType?: string): WidgetKind | undefined =>
  formType === 'mqtt_hass' && (id === 'name' || id === 'description') ? 'hidden' : undefined

// `backend`: a form built from /api/schemas. The 2020-12 rules (format color/gradient, a
// non-string enum as a select) apply only there; hand-built forms (VisualizerConfig, the
// visualiser's own) render as the old SchemaForm drew them: a `string` with a format as text,
// and an `integer` or `number` enum as a slider.
const kindOf = (field: FieldSchema, backend: boolean): WidgetKind => {
  // the frontend's own hand-built types (VisualizerConfig, stories)
  switch (field.type) {
    case 'multiselect':
    case 'autocomplete':
    case 'virtual':
      return field.type
    case 'color':
      return field.isGradient || field.gradient ? 'gradient' : 'color'
    case 'int':
      return 'integerSlider'
  }
  const sourced = sourceKind(field)
  if (sourced) return sourced
  if (backend && field.format === 'gradient') return 'gradient'
  if (backend && field.format === 'color') return 'color'
  if (enumOptions(field) && (backend || field.type === 'string')) return 'select'
  switch (field.type) {
    case 'boolean':
      return 'boolean'
    case 'number':
      return 'slider'
    case 'integer':
      return 'integerSlider'
    case 'string':
      return 'text'
  }
  return 'unsupported'
}

/**
 * The widget of a field. `formType` is the device, integration or effect type of the form.
 * `backend` says the schema came from /api/schemas (it carries `$schema`); it defaults to
 * "has a formType", so audio and virtuals forms, which have none, must pass it explicitly.
 */
export const widgetFor = (
  raw: FieldSchema,
  id: string,
  formType?: string,
  backend: boolean = formType !== undefined
): Widget => {
  const { field, nullable } = unwrapNullable(raw)
  return {
    kind: override(id, formType) ?? kindOf(field, backend),
    nullable,
    field
  }
}

export type FormField = FieldSchema & { id: string; required: boolean; permitted: boolean }

/** SchemaForm order: `name` first, then required fields, then the rest; schema order within each. */
export const orderFormProperties = (schema?: ObjectSchema): FormField[] => {
  const required = schema?.required ?? []
  const rank = (id: string) => (id === 'name' ? 0 : required.includes(id) ? 1 : 2)
  return Object.entries(schema?.properties ?? {})
    .map(([id, p]) => ({
      ...p,
      id,
      required: required.includes(id),
      permitted: schema?.permitted_keys ? schema.permitted_keys.includes(id) : true
    }))
    .sort((a, b) => rank(a.id) - rank(b.id))
}

type Bucket = 'color' | 'integer' | 'number' | 'select' | 'text' | 'boolean' | 'other'
const BUCKETS: Partial<Record<WidgetKind, Bucket>> = {
  color: 'color',
  gradient: 'color',
  integerSlider: 'integer',
  slider: 'number',
  select: 'select',
  text: 'text',
  boolean: 'boolean'
}

// Effect forms are backend forms; the per-type overrides stay out of the ordering.
const bucketOf = (p: FieldSchema, id: string): Bucket => {
  const field = unwrapNullable(p).field
  const kind = override(id) ?? kindOf(field, true)
  // a live choice list (a virtual's id, a COM port) must not move its field
  const source = sourceOf(field)
  if (source && SOURCE_WIDGETS[source] && kind !== 'multiselect') return 'text'
  return BUCKETS[kind] ?? 'other'
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
  schema: ObjectSchema | undefined,
  hidden_keys?: string[] | null,
  advanced_keys?: string[] | null,
  advanced = false
): (FieldSchema & { id: string })[] => {
  const place = (p: { id: string; bucket: Bucket }, i: number): number[] => {
    const head = HEAD.findIndex((test) => test(p))
    return [
      p.id === 'advanced' ? 1 : 0,
      ...(head >= 0 ? [0, head, i] : [1, TAIL.indexOf(p.bucket), -i])
    ]
  }
  return Object.entries(schema?.properties ?? {})
    .filter(([id]) => !hidden_keys?.includes(id) && (advanced || !advanced_keys?.includes(id)))
    .map(([id, p], i) => ({ p: { ...p, id }, key: place({ id, bucket: bucketOf(p, id) }, i) }))
    .sort((a, b) => {
      for (let k = 0; k < a.key.length; k++) if (a.key[k] !== b.key[k]) return a.key[k] - b.key[k]
      return 0
    })
    .map(({ p }) => p)
}

/** The label of an audio device index in the audio_device `{index: "Host: Name"}` enum. */
export const audioDeviceName = (
  field: FieldSchema | undefined,
  index: unknown
): string | undefined => (typeof index === 'number' ? field?.enum?.[index] : undefined)
