import { test, expect } from './fixtures'
import { clearDialogs } from './helpers'

/**
 * @title How to: Enable the Background Visualiser
 * @intro
 * The **Background Visualiser** turns the LedFx browser tab into a full-screen
 * animated visualiser driven by your audio input. This guide walks through enabling
 * the required feature flags, surfacing the Visualiser card on the Devices page,
 * and customising the connected client.
 *
 * > **Note:** The Background Visualiser requires **Expert Mode** and **Beta Mode**
 * > to be active, and the **BG Visualiser** feature flag to be enabled in Settings.
 */
test('Visualiser Features and Show Visualiser', async ({ page }) => {
  test.setTimeout(60000)

  await page.goto('/#/')
  await clearDialogs(page)

  /**
   * @doc
   * Open **Settings**, then enable **Expert Mode** and **Beta Mode** using their
   * labelled checkboxes. These unlock the advanced feature flags needed for the
   * visualiser.
   */
  await test.step('1. Enable Expert and Beta Modes', async () => {
    await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Settings' }).click()
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/visualiser-1-settings.png' })

    const expertCheckbox = page.getByLabel('Expert Mode')
    await expertCheckbox.waitFor({ state: 'visible' })
    if (!(await expertCheckbox.isChecked())) {
      await expertCheckbox.click()
      await page.waitForTimeout(500)
    }

    const betaCheckbox = page.getByLabel('Beta Mode')
    if (!(await betaCheckbox.isChecked())) {
      await betaCheckbox.click()
      await page.waitForTimeout(500)
    }
  })

  /**
   * @doc
   * Still in **Settings**, expand the **Features** accordion and enable the
   * **BG Visualiser** toggle. This makes the Visualiser section appear on the
   * Devices page and activates the full-screen background animation.
   */
  await test.step('2. Enable the BG Visualiser Feature Flag', async () => {
    const featuresAccordion = page.getByRole('button', { name: /Features/ })
    await featuresAccordion.click()
    await page.waitForTimeout(500)

    const bgVisualiserRow = page
      .locator('div')
      .filter({ hasText: /^BG Visualiser/ })
      .locator('input[type="checkbox"]')
    await bgVisualiserRow.waitFor({ state: 'visible' })
    if (!(await bgVisualiserRow.isChecked())) {
      await bgVisualiserRow.click()
      await page.waitForTimeout(500)
    }
    await page.screenshot({ path: 'test-results/visualiser-2-feature-flag.png' })
  })

  /**
   * @doc
   * Navigate to **Devices** and open the ⋮ TopBar menu. Choose **Show Visualisers**
   * to reveal the Visualiser section. If it already says **Hide Visualisers** the
   * section is already visible — no action needed.
   */
  await test.step('3. Show Visualisers on the Devices Page', async () => {
    await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
    await page.waitForTimeout(1000)

    await page.getByLabel('display more actions').click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'test-results/visualiser-3-menu.png' })

    const showVisualisersItem = page.getByRole('menuitem', { name: 'Show Visualisers' })
    const hideVisualisersItem = page.getByRole('menuitem', { name: 'Hide Visualisers' })
    if (await showVisualisersItem.isVisible()) {
      await showVisualisersItem.click()
    } else if (await hideVisualisersItem.isVisible()) {
      // already showing
    }
    await page.waitForTimeout(300)
    await page.keyboard.press('Escape')

    const visualiserCard = page
      .locator('span.MuiTypography-overline', { hasText: 'Visualizers' })
      .locator('..')
      .locator('.MuiCard-root')
      .first()
    await expect(visualiserCard).toBeVisible({ timeout: 15000 })
    await page.screenshot({ path: 'test-results/visualiser-4-card-visible.png' })
  })

  /**
   * @doc
   * Click the edit button on the Visualiser card header to open the **Client Edit**
   * popover. Set the **Name** to `Main` and the **Type** to `Controller`, then
   * confirm with the ✓ button. These settings identify the browser client in the
   * LedFx backend.
   */
  await test.step('4. Configure the Visualiser Client', async () => {
    const visualiserCard = page
      .locator('span.MuiTypography-overline', { hasText: 'Visualizers' })
      .locator('..')
      .locator('.MuiCard-root')
      .first()

    await visualiserCard.locator('h6 button').click()
    await page.waitForTimeout(300)

    await page.locator('#client-name-input').clear()
    await page.locator('#client-name-input').fill('Main')

    await page.getByRole('combobox', { name: 'Type' }).click()
    await page.getByRole('option', { name: 'Controller' }).click()

    await page.locator('button:has([data-testid="CheckIcon"])').click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'test-results/visualiser-5-client-edit.png' })
  })

  /**
   * @doc
   * Click the **Next** arrow on the Visualiser card to cycle to the next available
   * visualiser preset. The background animation updates in real time as audio plays.
   */
  await test.step('5. Cycle to the Next Visualiser', async () => {
    const visualiserCard = page
      .locator('span.MuiTypography-overline', { hasText: 'Visualizers' })
      .locator('..')
      .locator('.MuiCard-root')
      .first()

    await visualiserCard.getByRole('button', { name: 'next-visualizer' }).click()
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/visualiser-6-next.png' })
  })
})
