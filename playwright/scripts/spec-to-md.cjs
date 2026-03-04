#!/usr/bin/env node
'use strict'

/**
 * spec-to-md.cjs — Generate a Markdown how-to from an annotated Playwright spec.
 *
 * Annotations used in spec files:
 *
 *   /** @title <Title>          — document title (H1)
 *    * @intro                  — intro prose below H1 (until next @tag or end of block)
 *    *\/
 *
 *   /** @doc                   — prose for the immediately following test.step()
 *    * ...text...
 *    *\/
 *   await test.step('N. Heading', async () => {
 *     ...
 *     await page.screenshot({ path: 'test-results/foo.png' })  ← embedded as images
 *   })
 *
 * Usage:
 *   node playwright/scripts/spec-to-md.cjs <spec.ts>            → stdout (image paths kept as-is)
 *   node playwright/scripts/spec-to-md.cjs <spec.ts> <out.md>   → write file + copy screenshots
 *
 * When an output file is given the script:
 *   - rewrites image paths to  /_static/howto/<mdBaseName>/<file>.png
 *   - copies the actual PNGs from test-results/ to
 *       <outDir>/_static/howto/<mdBaseName>/
 */

const fs   = require('fs')
const path = require('path')

// ─── CLI ────────────────────────────────────────────────────────────────────

const [,, specArg, outArg] = process.argv
if (!specArg) {
  console.error('Usage: node spec-to-md.cjs <spec.ts> [output.md]')
  process.exit(1)
}

const specPath = path.resolve(specArg)
const src      = fs.readFileSync(specPath, 'utf8')
const lines    = src.split('\n')

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strip leading " * " from a JSDoc line and trim trailing whitespace. */
function stripJsdoc(line) {
  return line.replace(/^\s*\*\s?/, '').trimEnd()
}

/**
 * Given a source string and the index of the opening `{` of a block,
 * return the index of the matching closing `}`.
 */
function findMatchingBrace(src, openIdx) {
  let depth = 0
  for (let i = openIdx; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

// ─── Parse top-level @title / @intro ────────────────────────────────────────

let docTitle = ''
let docIntro = ''

// The file-level JSDoc appears before the first `test(` call — find the last /** */ block there
const firstTestIdx = src.indexOf('\ntest(')
const headerSrc    = firstTestIdx > 0 ? src.slice(0, firstTestIdx) : src

// Find the last /** ... */ block in the header section
const headerBlockMatch = [...headerSrc.matchAll(/\/\*\*([\s\S]*?)\*\//g)].pop()
if (headerBlockMatch) {
  const blockLines = headerBlockMatch[1].split('\n').map(stripJsdoc)
  let mode = null
  const introLines = []

  for (const line of blockLines) {
    if (line.startsWith('@title')) {
      docTitle = line.replace(/^@title\s*/, '').trim()
      mode = 'title'
    } else if (line.startsWith('@intro')) {
      mode = 'intro'
    } else if (/^@\w/.test(line)) {
      mode = null
    } else if (mode === 'intro') {
      introLines.push(line)
    }
  }
  docIntro = introLines.join('\n').trim()
}

// ─── Parse @doc blocks + test.step sections ──────────────────────────────────

const sections = []

// Regex: capture JSDoc block containing @doc, then the following test.step call
const docStepRe = /\/\*\*([\s\S]*?)\*\/\s*\n\s*await test\.step\('([^']+)'/g
let m

while ((m = docStepRe.exec(src)) !== null) {
  const blockLines = m[1].split('\n').map(stripJsdoc)
  let inDoc = false
  const docLines = []

  for (const line of blockLines) {
    if (line.startsWith('@doc')) {
      inDoc = true
    } else if (/^@\w/.test(line)) {
      inDoc = false
    } else if (inDoc) {
      docLines.push(line)
    }
  }

  const prose = docLines.join('\n').trim()
  const stepTitle = m[2].trim()

  // Find the opening brace of the step body (the async () => { ... })
  // Start searching from the end of the matched string
  const searchFrom = m.index + m[0].length
  const braceIdx   = src.indexOf('{', searchFrom)
  const stepBody   = braceIdx >= 0 ? src.slice(braceIdx, findMatchingBrace(src, braceIdx) + 1) : ''

  // Collect screenshot paths in order
  const screenshots = []
  const shotRe = /page\.screenshot\(\{\s*path:\s*['"]([^'"]+)['"]/g
  let s
  while ((s = shotRe.exec(stepBody)) !== null) {
    screenshots.push(s[1])
  }

  sections.push({ title: stepTitle, prose, screenshots })
}

// ─── Render Markdown ─────────────────────────────────────────────────────────

const out = []

out.push(`# ${docTitle || 'How-to'}`)
out.push('')

if (docIntro) {
  out.push(docIntro)
  out.push('')
}

// ─── Resolve output paths ────────────────────────────────────────────────────

const outPath     = outArg ? path.resolve(outArg) : null
const mdBaseName  = outPath ? path.basename(outPath, '.md') : null  // e.g. "dummy_matrix"
const staticBase  = `/_static/howto/${mdBaseName}`                  // e.g. "/_static/howto/dummy_matrix"
// Absolute destination folder for copied images — _static lives one level above the .md
// e.g. docs/howto/dummy_matrix.md  →  docs/_static/howto/dummy_matrix/
const imgDestDir  = outPath
  ? path.join(path.dirname(outPath), '..', '_static', 'howto', mdBaseName)
  : null

// ─── Render Markdown ─────────────────────────────────────────────────────────

for (const { title, prose, screenshots } of sections) {
  out.push(`## ${title}`)
  out.push('')
  if (prose) {
    out.push(prose)
    out.push('')
  }
  for (const shot of screenshots) {
    const basename = path.basename(shot)
    const alt      = path.basename(shot, path.extname(shot)).replace(/-/g, ' ')
    // When writing to a file use the canonical docs-site path; otherwise keep original
    const imgRef   = outPath ? `..${staticBase}/${basename}` : shot
    out.push(`![${alt}](${imgRef})`)
    out.push('')
  }
}

// ─── Find matching animated webps ────────────────────────────────────────────

const ANIMATED_DIR = 'playwright/animated'
const specStem     = path.basename(specPath, path.extname(specPath)).replace(/\.spec$/, '')

const animatedWebps = fs.existsSync(ANIMATED_DIR)
  ? fs.readdirSync(ANIMATED_DIR)
      .filter((f) => f.startsWith(specStem) && f.endsWith('.webp'))
      .map((f) => path.join(ANIMATED_DIR, f))
  : []

if (animatedWebps.length > 0) {
  out.push('---')
  out.push('')
  out.push('## Recording')
  out.push('')
  for (const webp of animatedWebps) {
    const basename = path.basename(webp)
    const alt      = specStem.replace(/-/g, ' ')
    const imgRef   = outPath ? `..${staticBase}/${basename}` : webp
    out.push(`![${alt}](${imgRef})`)
    out.push('')
  }
}

const md = out.join('\n')

// ─── Write + copy ─────────────────────────────────────────────────────────────

if (outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, md)
  console.log(`Written:  ${outPath}`)

  // Collect all unique screenshot source paths (relative to cwd)
  const allScreenshots = sections.flatMap((s) => s.screenshots)
  if (allScreenshots.length > 0) {
    fs.mkdirSync(imgDestDir, { recursive: true })
    for (const shot of allScreenshots) {
      const src  = path.resolve(shot)          // e.g. <cwd>/test-results/matrix-1-add-device.png
      const dest = path.join(imgDestDir, path.basename(shot))
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest)
        console.log(`Copied:   ${path.basename(shot)} → ${dest}`)
      } else {
        console.warn(`Missing:  ${src} (run tests first)`)
      }
    }
  }

  // Copy animated webps
  for (const webp of animatedWebps) {
    const src  = path.resolve(webp)
    const dest = path.join(imgDestDir, path.basename(webp))
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest)
      console.log(`Copied:   ${path.basename(webp)} → ${dest}`)
    } else {
      console.warn(`Missing:  ${src} (run tests first)`)
    }
  }
} else {
  process.stdout.write(md)
}
