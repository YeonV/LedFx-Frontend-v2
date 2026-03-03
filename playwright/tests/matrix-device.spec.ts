import { test, expect } from './fixtures'
import { clearDialogs } from './helpers'

test('Dummy Matrix Device Setup', async ({ page }) => {
  test.setTimeout(120000)

  await page.goto('/#/')

  // ── Startup dialogs ────────────────────────────────────────────
  await clearDialogs(page)

  // ── 1. Add Dummy Device ─────────────────────────────────────────

  console.log('Navigating to Devices')
  await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
  await page.waitForTimeout(1000)

  console.log('FAB → Add Device')
  await page.locator('.MuiFab-root[aria-label="add"]').click()
  await page.waitForTimeout(500)
  await page.getByRole('menuitem', { name: 'Add Device' }).click()

  // Use aria-labelledby to pin to the specific form dialog — page.getByRole('dialog') is a live
  // locator that could re-resolve to any open dialog (e.g. the background about-dialog)
  const addDialog = page.locator('[aria-labelledby="form-dialog-title"]')
  await addDialog.waitFor({ state: 'visible' })

  console.log('Selecting device type: dummy')
  await addDialog.getByRole('combobox').click()
  await page.getByRole('option', { name: 'dummy' }).click()
  await page.waitForTimeout(800)

  // Wait for SchemaForm fields to appear
  await addDialog.locator('input').first().waitFor({ state: 'visible', timeout: 10000 })

  console.log('Filling name=fake64x64, pixel_count=4096')
  // Labels have no `for` attr in SchemaForm — target by step class and input type instead
  await addDialog.locator('.step-effect-0 input').fill('fake64x64')
  await addDialog.locator('input[type="number"]').first().fill('4096')

  await page.screenshot({ path: 'test-results/matrix-1-add-device.png' })
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(2000)

  console.log('Verifying device card appeared')
  await expect(page.getByText('fake64x64').first()).toBeVisible({ timeout: 10000 })
  await page.screenshot({ path: 'test-results/matrix-2-device-created.png' })

  // ── 2. Set rows = 64 ────────────────────────────────────────────

  console.log('Expanding device card')
  const deviceCard = page.locator('.MuiCard-root').filter({ hasText: 'fake64x64' }).first()
  await deviceCard.getByRole('button', { name: 'show more' }).click()
  await page.waitForTimeout(500)

  console.log('Opening Edit Device dialog')
  await page.getByRole('button', { name: 'Settings' }).click()
  await page.waitForTimeout(500)

  const editDialog = page.locator('[aria-labelledby="form-dialog-title"]')
  await editDialog.waitFor({ state: 'visible' })
  await editDialog.locator('input').first().waitFor({ state: 'visible', timeout: 10000 })

  console.log('Setting rows to 64')
  // Rows is near the bottom of a long SchemaForm — scroll to bottom first
  await editDialog
    .locator('.MuiDialogContent-root')
    .evaluate((el) => (el.scrollTop = el.scrollHeight))
  await page.waitForTimeout(300)
  // XPath: find the "Rows" label, go up to its parent div, then find the number input inside it
  // (IDs like _r_5d_ are React-generated and unstable — never use them)
  const rowsInput = editDialog.locator(
    'xpath=//label[normalize-space(text())="Rows"]/..//input[@type="number"]'
  )
  await rowsInput.scrollIntoViewIfNeeded()
  await rowsInput.fill('64')
  await page.getByRole('button', { name: 'Save' }).click()
  // Wait for the form dialog to be fully removed from DOM.
  // We use a specific aria-labelledby selector above so this won't accidentally
  // re-resolve to other open dialogs (e.g. the background about-dialog).
  await editDialog.waitFor({ state: 'detached', timeout: 10000 })

  // ── 3. Frontend Pixels → 4K ────────────────────────────────────
  // After setting rows > 1, the FrontendPixelsTooSmall dialog auto-opens because:
  //   - showMatrix === true (the default)
  //   - virtual.rows > 1 (just set to 64)
  //   - virtual.pixel_count (4096) > fPixels (default ~256)
  //   - fPixels < 4096
  // It re-opens on EVERY route change (has `location` in its effect deps) until
  // fPixels >= 4096. So the correct fix is to use its built-in pixel selector
  // instead of navigating to Settings separately.
  //
  // Note: this dialog uses aria-labelledby="about-dialog-title" — same as AboutDialog.
  //       FrontendPixelsTooSmall title: "Not enough Pixels"
  //       AboutDialog title: "About LedFx"

  console.log('Waiting for FrontendPixelsTooSmall dialog')
  const pixelWarningDialog = page.locator('[aria-labelledby="about-dialog-title"]')
  await pixelWarningDialog.waitFor({ state: 'visible', timeout: 10000 })
  await page.screenshot({ path: 'test-results/matrix-3a-pixel-warning.png' })

  console.log('Setting Frontend Pixels to 4K via dialog pixel selector')
  // The dialog has a standard MUI Select for "Frontend Pixels"
  await pixelWarningDialog.locator('[role="combobox"]').click()
  await page.locator('li[role="option"][data-value="4096"]').click()
  await page.waitForTimeout(800)

  // After selecting 4096 the store updates fPixels → the useEffect in FrontendPixelsTooSmall
  // may auto-call setDialogOpenLessPixels(false) before we can click OK.
  // Handle both cases: auto-closed (catch) or still open (click OK).
  console.log('Closing FrontendPixelsTooSmall dialog')
  try {
    const okBtn = pixelWarningDialog.getByRole('button', { name: 'OK' })
    await okBtn.waitFor({ state: 'visible', timeout: 3000 })
    await okBtn.click()
  } catch {
    // Dialog already auto-closed when fPixels updated — that's fine
  }
  await pixelWarningDialog.waitFor({ state: 'detached', timeout: 10000 })
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'test-results/matrix-3b-pixels-set.png' })

  // ── 4. Device page: set effect Matrix / Equalizer2d ────────────

  console.log('Navigating back to Devices')
  await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
  await page.waitForTimeout(1000)

  console.log('Clicking device card → device page')
  await page.locator('.MuiCard-root').filter({ hasText: 'fake64x64' }).first().click()
  await page.waitForURL(/\/device\//, { timeout: 10000 })
  await page.waitForTimeout(1000)

  console.log('Opening effect type selector')
  await page.locator('text=Choose Effect').click()

  const effectDialog = page.getByRole('dialog')
  await effectDialog.waitFor({ state: 'visible' })

  console.log('Selecting Equalizer2d')
  await effectDialog.locator('input').first().fill('Equalizer2d')
  await page.getByRole('option', { name: 'Equalizer2d' }).click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'test-results/matrix-5-effect-set.png' })

  // ── 5. Toggle matrix view on device page ───────────────────────

  // showMatrix=true by default → matrix state initialises to true → button shows GridOff.
  // Accept either icon so the test works regardless of initial store state.
  // console.log('Clicking matrix display button (GridOn or GridOff)')
  // const matrixBtn = page.locator(
  //   'button:has([data-testid="GridOnIcon"]), button:has([data-testid="GridOffIcon"])'
  // )
  // await matrixBtn.first().waitFor({ state: 'visible', timeout: 15000 })
  // await matrixBtn.first().click()
  // await page.waitForTimeout(1000)
  // await page.screenshot({ path: 'test-results/matrix-6-device-matrix-view.png' })

  // ── 6. Devices page: Enable Graphs + Show Matrix ───────────────

  console.log('Navigating back to Devices')
  await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
  await page.waitForTimeout(1000)

  console.log('Opening TopBar menu to enable Graphs')
  await page.getByLabel('display more actions').click()
  await page.waitForTimeout(300)

  const enableGraphsItem = page.getByRole('menuitem', { name: 'Enable Graphs' })
  const disableGraphsItem = page.getByRole('menuitem', { name: 'Disable Graphs' })

  if (await enableGraphsItem.isVisible()) {
    console.log('Enabling Graphs (required for matrix toggle)')
    await enableGraphsItem.click()
    await page.waitForTimeout(500)
    // Reopen menu for matrix toggle
    await page.getByLabel('display more actions').click()
    await page.waitForTimeout(300)
  } else if (await disableGraphsItem.isVisible()) {
    console.log('Graphs already enabled')
    // stay in open menu, proceed to matrix
  }

  console.log('Toggling Show Matrix on Devices page')
  const showMatrixItem = page.getByRole('menuitem', { name: 'Show Matrix' })
  const hideMatrixItem = page.getByRole('menuitem', { name: 'Hide Matrix' })

  if (await showMatrixItem.isVisible()) {
    await showMatrixItem.click()
  } else if (await hideMatrixItem.isVisible()) {
    console.log('Matrix already showing on Devices page')
    await page.keyboard.press('Escape')
  }

  await page.waitForTimeout(10000)
  await page.screenshot({ path: 'test-results/matrix-7-devices-page-matrix.png' })
})
