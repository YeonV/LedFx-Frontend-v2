// Generates src/api/ledfx.config.types.ts from `ledfx --dump-schemas FILE`.
// usage: yarn generate:types [schemas.json] [out.ts]
import { compile } from 'json-schema-to-typescript'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const pascal = (id) =>
  id
    .split('_')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join('')

// Drop property titles so json-schema-to-typescript inlines field types instead of
// emitting one alias per title (they collide across plugins: Name, Blur, ...).
// $defs keep their titles: those become the shared interface names.
export const untitle = (node, keepTitle = false) => {
  if (Array.isArray(node)) return node.map((n) => untitle(n))
  if (!node || typeof node !== 'object') return node
  const out = {}
  for (const [k, v] of Object.entries(node)) {
    if (k === '$schema' || (k === 'title' && !keepTitle)) continue
    if (k === '$defs')
      out[k] = Object.fromEntries(Object.entries(v).map(([dk, dv]) => [dk, untitle(dv, true)]))
    else if (k === 'properties')
      out[k] = Object.fromEntries(Object.entries(v).map(([pk, pv]) => [pk, untitle(pv)]))
    else out[k] = untitle(v)
  }
  return out
}

// Every property any plugin of a kind declares, all optional: the "universal" config.
export const mergedSchema = (entries, typeIds) => {
  const properties = { type: { type: 'string', enum: typeIds } }
  for (const e of entries)
    for (const [k, v] of Object.entries(e.schema.properties || {})) properties[k] ??= v
  return { type: 'object', properties, additionalProperties: true }
}

const OPTS = {
  bannerComment: '',
  format: true,
  declareExternallyReferenced: true,
  additionalProperties: false
}

export const generate = async (schemas) => {
  const parts = []
  parts.push(await compile(untitle(schemas.core.schema), 'CoreConfig', OPTS))
  for (const [kind, suffix] of [
    ['devices', 'DeviceConfig'],
    ['integrations', 'IntegrationConfig'],
    ['effects', 'EffectConfig']
  ]) {
    const ids = Object.keys(schemas[kind]).sort()
    const names = []
    for (const id of ids) {
      const name = `${pascal(id)}${suffix}`
      names.push([id, name])
      // compile() normalises names (digitalrain2d -> Digitalrain2D); keep the exact one
      const ts = await compile(untitle(schemas[kind][id].schema), name, OPTS)
      parts.push(ts.replace(/^export interface \w+/m, `export interface ${name}`))
    }
    const unionType = suffix.replace('Config', 'Type')
    parts.push(`export type ${unionType} = ${ids.map((i) => JSON.stringify(i)).join(' | ')}\n`)
    parts.push(
      `export interface ${suffix}ByType {\n${names.map(([i, n]) => `  ${JSON.stringify(i)}: ${n}`).join('\n')}\n}\n`
    )
    parts.push(
      `export type ${suffix.replace('Config', 'SpecificConfig')} = ${suffix}ByType[${unionType}]\n`
    )
    parts.push(
      await compile(
        untitle(
          mergedSchema(
            ids.map((i) => schemas[kind][i]),
            ids
          )
        ),
        suffix,
        OPTS
      )
    )
  }
  return parts.join('\n')
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const src = process.argv[2] || 'ledfx-schemas.json'
  const out = process.argv[3] || 'src/api/ledfx.config.types.ts'
  const header = `/**\n * AUTO-GENERATED from \`ledfx --dump-schemas\`. Do not edit.\n * Regenerate: yarn generate:types <schemas.json>\n */\n\n/* eslint-disable */\n\n`
  try {
    const schemas = JSON.parse(readFileSync(src, 'utf8'))
    for (const k of ['core', 'devices', 'integrations', 'effects'])
      if (!schemas || typeof schemas[k] !== 'object' || !schemas[k])
        throw new Error(`missing top-level key "${k}"`)
    const ts = await generate(schemas)
    writeFileSync(out, header + ts)
    console.log(`wrote ${out}`)
  } catch (e) {
    console.error(`generate-config-types: cannot read ${src}: ${e.message}`)
    process.exitCode = 1
  }
}
