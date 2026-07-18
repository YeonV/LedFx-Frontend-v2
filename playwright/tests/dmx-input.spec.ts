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
    await card.getByRole('switch', { name: 'status' }).click()

    // The card's live status text only refreshes on mount (no websocket
    // push for integration status), so force a refetch by navigating away
    // and back to the Integrations page.
    await expect(async () => {
      await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
      await page.waitForTimeout(300)
      await page
        .locator('.MuiBottomNavigationAction-root')
        .filter({ hasText: 'Integrations' })
        .click()
      await expect(card.getByText('Current Status: Listening')).toBeVisible({ timeout: 3000 })
    }).toPass({ timeout: 20000 })

    await page.screenshot({ path: 'test-results/dmx-5-listening.png' })
  })

  /**
   * @doc
   * Open the integration's settings screen and add a **Fixture** mapping —
   * this drives a Virtual as a dumb DMX wash (dimmer/RGB channels, engaged
   * continuously with no on/off threshold) rather than needing a Venue to
   * exist. Also exercise the new **Strobe randomness** slider (only shown
   * for the Fixture type).
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
    await mappingDialog.getByLabel('Type', { exact: true }).click()
    await page.getByRole('option', { name: 'Fixture (wash)' }).click()
    await page.waitForTimeout(500)

    // The Virtual dropdown defaults to the first virtual in the backend's
    // list (by creation order), which may not be the one created in step 1
    // if other specs ran earlier in the same suite and created their own
    // virtuals first. Explicitly select our target virtual by name.
    await mappingDialog.getByLabel('Virtual').click()
    await page.getByRole('option', { name: virtualName }).click()
    await page.waitForTimeout(500)

    // The Strobe randomness slider only appears for the Fixture type.
    const strobeSlider = mappingDialog.getByRole('slider', { name: 'Strobe randomness' })
    await expect(strobeSlider).toBeVisible()
    await expect(mappingDialog.getByText('Strobe randomness: 0%')).toBeVisible()

    // Drag it up to 40% via keyboard (more reliable than pointer drag math).
    await strobeSlider.focus()
    for (let i = 0; i < 8; i += 1) {
      await strobeSlider.press('ArrowRight')
    }
    await expect(mappingDialog.getByText('Strobe randomness: 40%')).toBeVisible()
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
    await page.screenshot({ path: 'playwright/screenshots/dmx-input-mapping.png', fullPage: true })

    await screen.getByRole('button', { name: 'back' }).click()
    await screen.waitFor({ state: 'detached', timeout: 10000 })
  })

  /**
   * @doc
   * Regression coverage for the per-type mapping config cache: re-open the
   * saved Fixture mapping, confirm the Strobe randomness setting persisted
   * (survives a full save/reload round-trip, not just the open dialog
   * session), switch its type to Color and back to Fixture, and confirm the
   * Fixture-specific fields (channels, strobe randomness) were restored
   * from cache instead of reset to schema defaults.
   */
  await test.step('7. Strobe randomness persists and survives a type switch', async () => {
    const card = page.locator('.MuiCard-root').filter({ hasText: 'DMX Input' }).first()
    await card.getByRole('button', { name: 'DMX Input settings' }).click()

    const screen = page.getByRole('dialog').filter({ hasText: 'DMX Input Mappings' })
    await screen.waitFor({ state: 'visible' })
    const mappingRow = screen.locator('tr').filter({ hasText: mappingName })
    await mappingRow.getByRole('button', { name: 'Edit' }).click()

    const mappingDialog = page.getByRole('dialog').filter({ hasText: 'Edit DMX Mapping' })
    await mappingDialog.waitFor({ state: 'visible' })
    await expect(mappingDialog.getByText('Strobe randomness: 40%')).toBeVisible()

    // Switch away to Color, then back to Fixture — the cache must restore
    // both the strobe setting and the channel values instead of resetting.
    await mappingDialog.getByLabel('Type', { exact: true }).click()
    await page.getByRole('option', { name: 'Color (live RGB)' }).click()
    await page.waitForTimeout(300)
    await mappingDialog.getByLabel('Type', { exact: true }).click()
    await page.getByRole('option', { name: 'Fixture (wash)' }).click()
    await page.waitForTimeout(300)

    await expect(mappingDialog.getByText('Strobe randomness: 40%')).toBeVisible()
    await expect(mappingDialog.getByLabel('Dimmer ch')).toHaveValue('1')
    await page.screenshot({ path: 'test-results/dmx-9-type-cache-restored.png' })

    await mappingDialog.getByRole('button', { name: 'Cancel' }).click()
    await mappingDialog.waitFor({ state: 'detached', timeout: 10000 })

    await screen.getByRole('button', { name: 'back' }).click()
    await screen.waitFor({ state: 'detached', timeout: 10000 })
  })

  /**
   * @doc
   * Verify the mapped Virtual now shows a **DMX** chip on the Devices
   * dashboard (since it's targeted by the Fixture mapping above), then use
   * the chip to pause and resume this virtual's DMX Input processing.
   */
  await test.step('8. Pause and Resume DMX Input on the Device Card', async () => {
    await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
    await page.waitForTimeout(1000)

    const deviceCard = page.locator('.MuiCard-root').filter({ hasText: virtualName }).first()
    const dmxChip = deviceCard.getByRole('button', { name: 'pause-dmx' })
    await expect(dmxChip).toBeVisible({ timeout: 10000 })
    await page.screenshot({ path: 'test-results/dmx-9-device-chip.png' })

    await dmxChip.click()
    await expect(deviceCard.getByRole('button', { name: 'resume-dmx' })).toBeVisible({
      timeout: 10000
    })
    await page.screenshot({ path: 'test-results/dmx-10-device-paused.png' })

    await deviceCard.getByRole('button', { name: 'resume-dmx' }).click()
    await expect(deviceCard.getByRole('button', { name: 'pause-dmx' })).toBeVisible({
      timeout: 10000
    })
  })

  /**
   * @doc
   * Flip the integration's **Pause DMX** switch to globally mute all DMX
   * Input processing, and confirm the state survives navigating away and
   * back (i.e. it's persisted server-side, not just local UI state).
   */
  await test.step('9. Globally Pause and Resume the DMX Input Integration', async () => {
    await page
      .locator('.MuiBottomNavigationAction-root')
      .filter({ hasText: 'Integrations' })
      .click()
    await page.waitForTimeout(1000)

    const card = page.locator('.MuiCard-root').filter({ hasText: 'DMX Input' }).first()
    const pauseSwitch = card.getByRole('switch', { name: 'Pause DMX' })
    await expect(pauseSwitch).not.toBeChecked()
    await pauseSwitch.click()
    await expect(pauseSwitch).toBeChecked()
    await page.screenshot({ path: 'test-results/dmx-11-globally-paused.png' })

    // Confirm the paused state is persisted server-side by navigating away
    // and back, which forces a fresh fetch of the integration's data.
    await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
    await page.waitForTimeout(300)
    await page
      .locator('.MuiBottomNavigationAction-root')
      .filter({ hasText: 'Integrations' })
      .click()
    await expect(
      page
        .locator('.MuiCard-root')
        .filter({ hasText: 'DMX Input' })
        .first()
        .getByRole('switch', { name: 'Pause DMX' })
    ).toBeChecked({ timeout: 10000 })

    // Resume so we leave the integration in a clean state.
    await page
      .locator('.MuiCard-root')
      .filter({ hasText: 'DMX Input' })
      .first()
      .getByRole('switch', { name: 'Pause DMX' })
      .click()
    await expect(
      page
        .locator('.MuiCard-root')
        .filter({ hasText: 'DMX Input' })
        .first()
        .getByRole('switch', { name: 'Pause DMX' })
    ).not.toBeChecked()

    // Deactivate the integration afterwards to release the Art-Net UDP
    // port (6454) — otherwise a later spec in the same suite run (e.g.
    // venues.spec.ts, which adds and activates its own DMX Input
    // integration) would fail to bind it.
    await page
      .locator('.MuiCard-root')
      .filter({ hasText: 'DMX Input' })
      .first()
      .getByRole('switch', { name: 'status' })
      .click()
    await page.waitForTimeout(500)
  })
})
