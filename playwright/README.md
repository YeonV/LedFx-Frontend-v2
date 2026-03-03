# 🎭 Playwright Testing Guide

End-to-end tests for the LedFx Frontend. This document is written to be self-contained — a complete reference for writing, running and debugging tests without reading the rest of the codebase.

---

## 🗂 File Structure

```
playwright/
├── playwright.config.ts       # Playwright config (baseURL :2000, video on, global setup/teardown)
├── README.md                  # This file
├── videos/                    # Raw .webm recordings per test
├── animated/                  # Post-processed animated .webp exports
└── tests/
    ├── fixtures.ts            # Extended `test` fixture — clears localStorage before each test
    ├── helpers.ts             # Shared helpers: clearDialogs(page)
    ├── global.setup.ts        # Starts backend (:7777) + frontend (:2000) before the suite
    ├── global.teardown.ts     # Kills both processes, deletes pwtest/ config folder
    ├── add-virtual.spec.ts    # Test: Add Virtual Device via FAB
    ├── visualiser-features.spec.ts  # Test: Visualiser toggle (Expert+Beta+BG required)
    └── matrix-device.spec.ts  # Test: Full dummy 64×64 matrix device setup
```

---

## 🚀 Running Tests

Tests spin up an isolated backend and frontend automatically — no manual preparation needed.

### Run all tests

```bash
yarn test:pw
```

This will:
1. Start the LedFx backend (`uv run ledfx --offline -p 7777 -c pwtest`) — polls `:7777/api/info`
2. Start the React dev server on `:2000` — polls `/manifest.json`
3. Run all `.spec.ts` tests
4. Trim the first 7s from recorded videos and convert to animated `.webp`
5. Kill both processes and delete the `pwtest/` config folder

### Debug with UI mode

```bash
npx playwright test -c playwright/playwright.config.ts --ui
```

### Run a single test file

```bash
npx playwright test -c playwright/playwright.config.ts tests/matrix-device.spec.ts
```

### Record new selectors with codegen

```bash
yarn playwright codegen http://localhost:2000
```

> ⚠️ `global.setup.ts` must not be run directly with `node` — it is invoked automatically by Playwright via `globalSetup` in `playwright.config.ts`.

---

## 🎥 Video & Animated Media

All tests record video globally. After `yarn test:pw`, `video-to-webp.cjs` runs automatically (`posttest:pw`) and:

- Trims the first 7s (startup/connection noise) from `.webm` files in `playwright/videos/` and `playwright-report/data/`
- Converts trimmed videos → animated `.webp` in `playwright/animated/`

Run manually after adjusting `SKIP_SECONDS`:

```bash
yarn test:video-to-webp
```

> ⚠️ Trim is applied **in place**. Running twice cuts another 7s. Always re-run full tests before re-running this script.

---

## 📝 Writing New Tests — Quick Template

```typescript
/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from './fixtures'    // ← NOT '@playwright/test' directly
import { clearDialogs } from './helpers'

test('My test name', async ({ page }) => {
  test.setTimeout(60000)
  await page.goto('/#/')
  await clearDialogs(page)   // always first — handles NoHost + Intro dialogs

  // ... your test steps
})
```

**Rules:**
- Always import `test`/`expect` from `./fixtures`, not `@playwright/test` — the fixture clears localStorage before each test.
- Always call `await clearDialogs(page)` immediately after `goto` — it handles two startup dialogs (see below).
- Screenshot to `test-results/<name>.png` at meaningful checkpoints.
- Default timeout is 30s; set `test.setTimeout(120000)` for longer flows.

---

## 🧠 UI Structure & Navigation

### Bottom navigation tabs

```typescript
await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Settings' }).click()
```

Available tabs: **Devices**, **Settings**, (others may exist)

### FAB (Floating Action Button) — Devices page

```typescript
await page.locator('.MuiFab-root[aria-label="add"]').click()
await page.getByRole('menuitem', { name: 'Add Device' }).click()
await page.getByRole('menuitem', { name: 'Add Virtual' }).click()
```

### TopBar overflow menu

```typescript
await page.getByLabel('display more actions').click()
await page.getByRole('menuitem', { name: 'Enable Graphs' }).click()
await page.getByRole('menuitem', { name: 'Show Matrix' }).click()
```

> Menu items toggle (e.g. "Enable Graphs" ↔ "Disable Graphs") — always check `isVisible()` before clicking:
> ```typescript
> if (await page.getByRole('menuitem', { name: 'Enable Graphs' }).isVisible()) { ... }
> ```

### Device cards — Devices page

```typescript
// Expand card to show more actions
const card = page.locator('.MuiCard-root').filter({ hasText: 'mydevice' }).first()
await card.getByRole('button', { name: 'show more' }).click()
await page.getByRole('button', { name: 'Edit Device' }).click()

// Navigate to device detail page
await card.click()
await page.waitForURL(/\/device\//, { timeout: 10000 })
```

### Settings tiles (widgets)

Settings items are grouped in collapsible tile widgets. To access a setting inside a tile, expand it first:

```typescript
await page.getByRole('button', { name: /Pixel Graphs/i }).click()
// now interact with contents
await page.locator('button:has([data-testid="CloseIcon"])').click() // close widget
```

---

## ⚠️ Selector Gotchas

These are non-obvious issues discovered through testing — read before writing selectors.

### SchemaForm inputs (Add Device / Edit Device dialogs)

The backend's JSON Schema is rendered by a custom `SchemaForm` component. Its inputs:

- Have `type="unset"` (not `type="text"`) → `input[type="text"]` will **not match**
- Labels have **no `for`/`id` association** → `getByLabel('Name')` will **not match**
- Input `id` attributes (e.g. `_r_2k_`, `_r_5d_`) are **React-generated and change every run** → never use `[id="..."]`
- Fields are indexed by CSS class: `.step-effect-0`, `.step-effect-1`, `.step-effect-2`, ...

```typescript
// ✅ Correct — first text-ish field (e.g. Name)
await dialog.locator('.step-effect-0 input').fill('myvalue')

// ✅ Correct — number fields (by position)
await dialog.locator('input[type="number"]').first().fill('4096')

// ✅ Correct — named number field (e.g. "Rows") using label text as anchor
const rowsField = dialog.locator('div').filter({ has: page.locator('label', { hasText: /^Rows$/ }) })
await rowsField.locator('input[type="number"]').fill('64')

// ❌ Wrong — will timeout
await dialog.getByLabel('Name').fill('myvalue')
await dialog.locator('input[type="text"]').fill('myvalue')

// ❌ Wrong — id is unstable, changes every render
await page.locator('[id="_r_2k_"]').fill('64')
```

> In **Edit** mode, `name` and `icon_name` are filtered from the form — the first `input[type="number"]` is typically `rows`.

### MUI Select options (portaled outside dialog)

MUI Select renders its dropdown as a portal **outside** the dialog's DOM scope:

```typescript
// ✅ Correct — query from page, not dialog
await dialog.getByRole('combobox').click()
await page.locator('li[role="option"][data-value="4096"]').click()

// ❌ Wrong — options aren't inside the dialog
await dialog.getByRole('option', { name: '4K' }).click()
```

### Device type autocomplete (Add Device dialog)

This combobox uses standard `role="option"` and can be queried from `page`:

```typescript
await dialog.getByRole('combobox').click()
await page.getByRole('option', { name: 'dummy' }).click()
```

### Effect type selector (Device detail page)

```typescript
await page.locator('text=Choose Effect').click()
const dialog = page.getByRole('dialog')
await dialog.locator('input').first().fill('Equalizer2d')
await page.getByRole('option', { name: 'Equalizer2d' }).click()
```

### Icon buttons (data-testid based)

MUI icon buttons are best targeted by their inner icon's `data-testid`:

```typescript
// ⚠️ showMatrix=true by default → matrix starts ON → button shows GridOff, not GridOn.
// Always accept either icon when targeting the matrix toggle:
await page.locator('button:has([data-testid="GridOnIcon"]), button:has([data-testid="GridOffIcon"])').first().click()
await page.locator('button:has([data-testid="CloseIcon"])').click()    // close widget
```

---

## 🔌 Startup Dialogs — `clearDialogs(page)`

On a fresh localStorage, two dialogs appear before the app is usable:

1. **NoHostDialog** — prompts to add/select a backend host
2. **Intro/Setup Assistant** — a "Skip" button appears

`clearDialogs` from `helpers.ts` handles both with try/catch (safe on repeat calls):

```typescript
import { clearDialogs } from './helpers'
await clearDialogs(page)
```

What it does internally:
1. Clicks the `add` (AddIcon) button in NoHostDialog
2. Fills the `IP:Port` textbox with `http://localhost:7777`
3. Clicks `add` to save the host
4. Clicks the host text `http://localhost:7777` to connect
5. Clicks "Skip" if the intro dialog appears

> If the backend is already connected (e.g. in `--ui` mode after a previous run), both steps are safely swallowed by `catch`.

---

## 🧪 Test Environment Details

| Concern | Value |
|---|---|
| Frontend URL | `http://localhost:2000` |
| Backend URL | `http://localhost:7777` |
| Backend config dir | `pwtest/` (deleted by teardown) |
| Backend start command | `uv run ledfx --offline -vv -p 7777 -c pwtest` |
| Normal dev frontend | `:3000` (separate, never used in tests) |
| Normal dev backend | `:8888` (separate, never used in tests) |
| localStorage | Cleared before each test by `fixtures.ts` (isolated env — no restore needed) |
| Videos | Recorded for all tests; stored in `playwright/videos/` |

---

## 🎥 Recording & Animated Media

All tests record video globally. After `yarn test:pw`, `video-to-webp.cjs` runs automatically (`posttest:pw`) and:

- Trims the first 7s (startup/connection noise) from `.webm` files in `playwright/videos/` and `playwright-report/data/`
- Converts trimmed videos → animated `.webp` in `playwright/animated/`

Run manually after adjusting `SKIP_SECONDS`:

```bash
yarn test:video-to-webp
```

> ⚠️ Trim is **in place**. Running twice cuts another 7s. Always re-run tests before re-running this script.
> Implementation detail: uses output-side `-ss` with VP9 re-encode for frame accuracy; falls back to keyframe-aligned stream copy for VP8 (report data) files.
