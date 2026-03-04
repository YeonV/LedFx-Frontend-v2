import { test, expect } from './fixtures'
import { clearDialogs } from './helpers'

/**
 * @title How to: Create a Dummy Matrix
 * @intro
 * End-to-end walkthrough for setting up a 64×64 dummy device, configuring it as a
 * 2-D matrix, and viewing the **Equalizer2d** effect in real time.
 *
 * > **Note:** Do not name your device starting with `gap-` — that prefix is reserved
 * > for internal matrix editor placeholders.
 */
test('Dummy Matrix Device Setup', async ({ page }) => {
  test.setTimeout(120000)

  await page.goto('/#/')
  await clearDialogs(page)

  /**
   * @doc
   * Navigate to **Devices**, tap the **+** FAB and choose **Add Device**.
   * Select type `dummy`, name the device `fake64x64`, and set **Pixel Count** to
   * `4096` (= 64 × 64). Click **Add**.
   */
  await test.step('1. Add a Dummy Device', async () => {
    await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
    await page.waitForTimeout(1000)

    await page.locator('.MuiFab-root[aria-label="add"]').click()
    await page.waitForTimeout(500)
    await page.getByRole('menuitem', { name: 'Add Device' }).click()

    const addDialog = page.locator('[aria-labelledby="form-dialog-title"]')
    await addDialog.waitFor({ state: 'visible' })
    await addDialog.getByRole('combobox').click()
    await page.getByRole('option', { name: 'dummy' }).click()
    await page.waitForTimeout(800)
    await addDialog.locator('input').first().waitFor({ state: 'visible', timeout: 10000 })

    await addDialog.locator('.step-effect-0 input').fill('fake64x64')
    await addDialog.locator('input[type="number"]').first().fill('4096')
    await page.screenshot({ path: 'test-results/matrix-1-add-device.png' })

    await page.getByRole('button', { name: 'Add' }).click()
    await page.waitForTimeout(2000)

    await expect(page.getByText('fake64x64').first()).toBeVisible({ timeout: 10000 })
    await page.screenshot({ path: 'test-results/matrix-2-device-created.png' })
  })

  /**
   * @doc
   * Expand the `fake64x64` card with the **›** arrow, then open **Settings**.
   * Set the **Rows** field to `64` and click **Save**.
   */
  await test.step('2. Make it a Matrix', async () => {
    const deviceCard = page.locator('.MuiCard-root').filter({ hasText: 'fake64x64' }).first()
    await deviceCard.getByRole('button', { name: 'show more' }).click()
    await page.waitForTimeout(500)

    await page.getByRole('button', { name: 'Settings' }).click()
    await page.waitForTimeout(500)

    const editDialog = page.locator('[aria-labelledby="form-dialog-title"]')
    await editDialog.waitFor({ state: 'visible' })
    await editDialog.locator('input').first().waitFor({ state: 'visible', timeout: 10000 })

    // Rows is near the bottom of a long form — scroll before accessing
    await editDialog
      .locator('.MuiDialogContent-root')
      .evaluate((el) => (el.scrollTop = el.scrollHeight))
    await page.waitForTimeout(300)

    const rowsInput = editDialog.locator(
      'xpath=//label[normalize-space(text())="Rows"]/..//input[@type="number"]'
    )
    await rowsInput.scrollIntoViewIfNeeded()
    await rowsInput.fill('64')
    await page.screenshot({ path: 'test-results/matrix-3-rows-set.png' })

    await page.getByRole('button', { name: 'Save' }).click()
    await editDialog.waitFor({ state: 'detached', timeout: 10000 })
  })

  /**
   * @doc
   * After saving `rows > 1`, the **"Not enough Pixels"** warning dialog appears
   * automatically. Select `4096` from the **Frontend Pixels** dropdown and click **OK**
   * (the dialog may close on its own once the store updates).
   *
   * This raises the browser-side pixel limit so the backend streams all 4096 pixels
   * to the frontend. The setting can also be adjusted later via **Settings › UI**.
   */
  await test.step('3. Allow the Frontend to Render All Pixels', async () => {
    const pixelWarningDialog = page.locator('[aria-labelledby="about-dialog-title"]')
    const dialogAppeared = await pixelWarningDialog
      .waitFor({ state: 'visible', timeout: 3000 })
      .then(() => true)
      .catch(() => false)

    if (!dialogAppeared) {
      // Frontend pixels already sufficient — dialog did not appear, continue
      await page.screenshot({ path: 'test-results/matrix-4a-pixel-warning-skipped.png' })
      return
    }

    await page.screenshot({ path: 'test-results/matrix-4a-pixel-warning.png' })

    await pixelWarningDialog.locator('[role="combobox"]').click()
    await page.locator('li[role="option"][data-value="4096"]').click()
    await page.waitForTimeout(800)

    try {
      const okBtn = pixelWarningDialog.getByRole('button', { name: 'OK' })
      await okBtn.waitFor({ state: 'visible', timeout: 3000 })
      await okBtn.click()
    } catch {
      // Dialog auto-closed when fPixels updated — that's fine
    }
    await pixelWarningDialog.waitFor({ state: 'detached', timeout: 10000 })
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'test-results/matrix-4b-pixels-set.png' })
  })

  /**
   * @doc
   * Open the `fake64x64` device detail page and click **Choose Effect**.
   * Search for `Equalizer2d`, select it from the **Matrix** category, and wait for
   * the effect to apply. The pixel graph will animate with audio input.
   */
  await test.step('4. Choose the Effect', async () => {
    await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
    await page.waitForTimeout(1000)

    await page.locator('.MuiCard-root').filter({ hasText: 'fake64x64' }).first().click()
    await page.waitForURL(/\/device\//, { timeout: 10000 })
    await page.waitForTimeout(1000)

    await page.locator('text=Choose Effect').click()
    const effectDialog = page.getByRole('dialog')
    await effectDialog.waitFor({ state: 'visible' })
    await effectDialog.locator('input').first().fill('Equalizer2d')
    await page.getByRole('option', { name: 'Equalizer2d' }).click()
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/matrix-5-effect-set.png' })
  })

  /**
   * @doc
   * Return to the **Devices** page and open the ⋮ TopBar menu.
   * Enable **Graphs** (if not already on), then activate **Show Matrix** so that
   * the 2-D pixel graph appears on every device card in the dashboard.
   */
  await test.step('5. Enable Graphs and Show Matrix on the Devices Page', async () => {
    await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
    await page.waitForTimeout(1000)

    await page.getByLabel('display more actions').click()
    await page.waitForTimeout(300)

    const enableGraphsItem = page.getByRole('menuitem', { name: 'Enable Graphs' })
    const disableGraphsItem = page.getByRole('menuitem', { name: 'Disable Graphs' })

    if (await enableGraphsItem.isVisible()) {
      await enableGraphsItem.click()
      await page.waitForTimeout(500)
      await page.getByLabel('display more actions').click()
      await page.waitForTimeout(300)
    } else if (await disableGraphsItem.isVisible()) {
      // already enabled
    }

    const showMatrixItem = page.getByRole('menuitem', { name: 'Show Matrix' })
    const hideMatrixItem = page.getByRole('menuitem', { name: 'Hide Matrix' })

    if (await showMatrixItem.isVisible()) {
      await showMatrixItem.click()
    } else if (await hideMatrixItem.isVisible()) {
      await page.keyboard.press('Escape')
    }

    await page.waitForTimeout(10000)
    await page.screenshot({ path: 'test-results/matrix-7-devices-matrix.png' })
  })
})
