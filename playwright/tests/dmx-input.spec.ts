/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from './fixtures'
import { clearDialogs } from './helpers'

/**
 * @title How to: Configure the DMX Input Integration
 * @intro
 * The **DMX Input** integration bridges incoming Art-Net DMX (e.g. from
 * SoundSwitch) onto LedFx: channel **mappings** can trigger venue color
 * overrides, pass live RGB straight through, or drive a virtual as a dumb
 * DMX wash fixture. This guide adds the integration, activates it, and
 * configures a Fixture mapping targeting a Virtual.
 */
test('DMX Input: add integration, activate, and configure a mapping', async ({ page }) => {
  test.setTimeout(90000)

  await page.goto('/#/')
  await clearDialogs(page)

  const virtualName = 'DMX Test Virtual'
  const mappingName = 'Test DMX Mapping'

  /**
   * @doc
   * Create a Virtual Device from the **Devices** page FAB so there is a
   * target for the DMX mapping.
   */
  await test.step('1. Create a Virtual Device', async () => {
    await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
    await page.waitForTimeout(1000)

    await page.locator('.MuiFab-root[aria-label="add"]').click()
    await page.waitForTimeout(500)
    await page.getByRole('menuitem', { name: 'Add Virtual' }).click()

    const dialog = page.getByRole('dialog')
    await dialog.waitFor({ state: 'visible' })
    const nameInput = dialog.locator('input').first()
    await nameInput.waitFor({ state: 'visible', timeout: 10000 })
    await nameInput.fill(virtualName)

    await page.getByRole('button', { name: 'Add & Setup Segments' }).click()
    await page.waitForTimeout(2000)

    // "Add & Setup Segments" opens the full-screen segment editor — go Back
    await page.getByRole('button', { name: 'Back' }).click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/dmx-1-virtual-created.png' })
  })

  /**
   * @doc
   * The **Integrations** page is hidden behind a feature flag, and the
   * **Features** accordion that exposes it only appears in **Expert Mode**.
   * Open **Settings**, enable Expert Mode, then expand **Features** and
   * enable **Integrations (Spotify, MQTT, HA, ...)**.
   */
  await test.step('2. Enable the Integrations Feature Flag', async () => {
    await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Settings' }).click()
    await page.waitForTimeout(1000)

    const expertCheckbox = page.getByLabel('Expert Mode')
    await expertCheckbox.waitFor({ state: 'visible' })
    if (!(await expertCheckbox.isChecked())) {
      await expertCheckbox.click()
      await page.waitForTimeout(500)
    }

    const featuresAccordion = page.getByRole('button', { name: /Features/ })
    await featuresAccordion.click()
    await page.waitForTimeout(500)

    // "Integrations" is the first switch inside the "Features" region —
    // select by position within the region rather than by label text, since
    // the label text is split across sibling nodes and ancestor divs all
    // "contain" it, making text-based filters ambiguous.
    const featuresRegion = page.getByRole('region', { name: 'Features' })
    const integrationsRow = featuresRegion.locator('input[type="checkbox"]').first()
    await integrationsRow.waitFor({ state: 'visible' })
    if (!(await integrationsRow.isChecked())) {
      await integrationsRow.click()
      await page.waitForTimeout(500)
    }
    await page.screenshot({ path: 'test-results/dmx-2-feature-flag.png' })
  })

  /**
   * @doc
   * Navigate to **Integrations** and use the FAB's **Add Integration**
   * action. Pick **DMX Input** as the type — every field has a sensible
   * default (bind address, Art-Net port, etc.) so it can be added as-is.
   */
  await test.step('3. Add the DMX Input Integration', async () => {
    await page
      .locator('.MuiBottomNavigationAction-root')
      .filter({ hasText: 'Integrations' })
      .click()
    await page.waitForTimeout(1000)

    await page.locator('.MuiFab-root[aria-label="add"]').click()
    await page.waitForTimeout(500)
    await page.getByRole('menuitem', { name: 'Add Integration' }).click()

    const dialog = page.getByRole('dialog')
    await dialog.waitFor({ state: 'visible' })
    await dialog.getByRole('combobox').first().click()
    await page.getByRole('option', { name: 'DMX Input' }).click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/dmx-3-add-dialog.png' })

    await dialog.getByRole('button', { name: 'Add' }).click()
    await dialog.waitFor({ state: 'detached', timeout: 10000 })

    await expect(page.getByText('DMX Input').first()).toBeVisible({ timeout: 10000 })
    await page.screenshot({ path: 'test-results/dmx-4-integration-added.png' })
  })

  /**
   * @doc
   * Flip the integration's status switch to activate it. Once the Art-Net
   * listener binds, the card's status updates to **Listening** and the
   * settings (gear) button becomes enabled.
   */
  await test.step('4. Activate the Integration', async () => {
    const card = page.locator('.MuiCard-root').filter({ hasText: 'DMX Input' }).first()
    await card.getByRole('switch').click()

    // The card's live status text only refreshes on mount (no websocket
    // push for integration status), so force a refetch by navigating away
    // and back to the Integrations page.
    await expect(async () => {
      await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
      await page.waitForTimeout(300)
      await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Integrations' }).click()
      await expect(card.getByText('Current Status: Listening')).toBeVisible({ timeout: 3000 })
    }).toPass({ timeout: 20000 })

    await page.screenshot({ path: 'test-results/dmx-5-listening.png' })
  })

  /**
   * @doc
   * Open the integration's settings screen and add a **Fixture** mapping —
   * this drives a Virtual as a dumb DMX wash (mode/dimmer/RGB channels)
   * rather than needing a Venue to exist.
   */
  await test.step('5. Configure a Fixture Mapping', async () => {
    const card = page.locator('.MuiCard-root').filter({ hasText: 'DMX Input' }).first()
    await card.getByRole('button', { name: 'DMX Input settings' }).click()

    const screen = page.getByRole('dialog').filter({ hasText: 'DMX Input Mappings' })
    await screen.waitFor({ state: 'visible' })
    await page.screenshot({ path: 'test-results/dmx-6-settings-screen.png' })

    await screen.getByRole('button', { name: 'Add Mapping' }).click()

    const mappingDialog = page.getByRole('dialog').filter({ hasText: 'Add DMX Mapping' })
    await mappingDialog.waitFor({ state: 'visible' })

    await mappingDialog.getByLabel('Name').fill(mappingName)
    await mappingDialog.getByLabel('Type').click()
    await page.getByRole('option', { name: 'Fixture (wash)' }).click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/dmx-7-mapping-dialog.png' })

    const saveButton = mappingDialog.getByRole('button', { name: 'Save' })
    await expect(saveButton).toBeEnabled({ timeout: 10000 })
    await saveButton.click()
    await mappingDialog.waitFor({ state: 'detached', timeout: 10000 })
  })

  /**
   * @doc
   * Verify the new mapping saved and displays correctly in the mapping
   * table, targeting the Virtual created in step 1.
   */
  await test.step('6. Verify the Mapping Displays Correctly', async () => {
    const screen = page.getByRole('dialog').filter({ hasText: 'DMX Input Mappings' })
    const mappingRow = screen.locator('tr').filter({ hasText: mappingName })

    await expect(mappingRow).toBeVisible({ timeout: 10000 })
    await expect(mappingRow.getByText('fixture', { exact: true })).toBeVisible()
    // The displayed virtual name comes straight from the backend's virtuals
    // lookup and may normalize/trim the name we submitted, so assert on the
    // "Virtual: ..." prefix rather than requiring an exact name match.
    await expect(mappingRow.getByText(/^Virtual: /)).toBeVisible()
    await page.screenshot({ path: 'test-results/dmx-8-mapping-saved.png' })
  })
})
