import { test, expect } from './fixtures'
import { clearDialogs } from './helpers'

/**
 * @title How to: Use Venues with Color Override Pads
 * @intro
 * **Venues** group one or more Virtuals together and expose a grid of **color
 * override pads**. Tapping a pad tints every virtual in the venue with that
 * pad's color/gradient — without interrupting the running effect's animation.
 * Tapping the active pad again clears the override and restores normal
 * playback.
 */
test('Venues: create venue, add virtual, activate and clear color override', async ({ page }) => {
  test.setTimeout(90000)

  await page.goto('/#/')
  await clearDialogs(page)

  const virtualName = 'Venue Test Virtual'
  const venueName = 'Test Venue'

  /**
   * @doc
   * Create a Virtual Device from the **Devices** page FAB so there is something
   * to add to the venue.
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
    await page.screenshot({ path: 'test-results/venues-1-virtual-created.png' })
  })

  /**
   * @doc
   * Navigate to the **Venues** tab in the bottom bar and click **New Venue**.
   * Give it a name and confirm the default 4×4 override pad grid with
   * **Create**.
   */
  await test.step('2. Create a Venue', async () => {
    await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Venues' }).click()
    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: 'New Venue' }).click()
    const dialog = page.getByRole('dialog')
    await dialog.waitFor({ state: 'visible' })
    await dialog.getByLabel('Venue name').fill(venueName)
    await page.screenshot({ path: 'test-results/venues-2-create-dialog.png' })

    await dialog.getByRole('button', { name: 'Create' }).click()
    await dialog.waitFor({ state: 'detached', timeout: 10000 })

    await expect(page.getByText(venueName).first()).toBeVisible({ timeout: 10000 })
    await page.screenshot({ path: 'test-results/venues-3-venue-created.png' })
  })

  /**
   * @doc
   * Click **Enter** on the venue card to open its detail page.
   */
  await test.step('3. Enter the Venue', async () => {
    const venueCard = page.locator('.MuiCard-root').filter({ hasText: venueName }).first()
    await venueCard.getByRole('button', { name: 'Enter' }).click()
    await page.waitForURL(/\/venues\//, { timeout: 10000 })
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/venues-4-venue-view.png' })
  })

  /**
   * @doc
   * Use the **Add virtual to venue** autocomplete to add the Virtual created
   * in step 1. Once added, it appears both as a removable chip under
   * "Virtuals in this venue" and with a live preview pixel graph.
   */
  await test.step('4. Add the Virtual to the Venue', async () => {
    const addVirtualInput = page.getByRole('combobox', { name: 'Add virtual to venue' })
    await addVirtualInput.click()
    await addVirtualInput.fill(virtualName)
    await page.getByRole('option', { name: virtualName }).click()
    await page.waitForTimeout(1000)

    await expect(page.locator('.MuiChip-root').filter({ hasText: virtualName })).toBeVisible({
      timeout: 10000
    })
    await page.screenshot({ path: 'test-results/venues-5-virtual-added.png' })
  })

  /**
   * @doc
   * Tap the first color override pad. This activates the override: the pad
   * shows an **ON** badge and an **Override Active** chip appears above the
   * live preview, confirming the tint was applied without freezing the
   * running effect's animation.
   */
  await test.step('5. Activate a Color Override Pad', async () => {
    const firstPad = page.getByTestId('color-pad-0')
    await firstPad.click()
    await page.waitForTimeout(1000)

    await expect(firstPad.getByText('ON')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Override Active')).toBeVisible({ timeout: 10000 })
    await page.screenshot({ path: 'test-results/venues-6-override-active.png' })
    await page.screenshot({ path: 'playwright/screenshots/venues-override.png', fullPage: true })
  })

  /**
   * @doc
   * Tap the same pad again to clear the override. The **ON** badge and the
   * **Override Active** chip both disappear, confirming normal playback
   * resumed.
   */
  await test.step('6. Clear the Color Override', async () => {
    const firstPad = page.getByTestId('color-pad-0')
    await firstPad.click()
    await page.waitForTimeout(1000)

    await expect(firstPad.getByText('ON')).not.toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Override Active')).not.toBeVisible({ timeout: 10000 })
    await page.screenshot({ path: 'test-results/venues-7-override-cleared.png' })
  })

  /**
   * @doc
   * Map the venue's virtual as a DMX Input Fixture target (via the
   * Integrations page), which marks this venue as **DMX-mapped**. Only
   * DMX-mapped venues show a pause control on the Venues list.
   */
  await test.step('7. Map the Venue Virtual via a DMX Input Integration', async () => {
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

    const featuresRegion = page.getByRole('region', { name: 'Features' })
    const integrationsRow = featuresRegion.locator('input[type="checkbox"]').first()
    await integrationsRow.waitFor({ state: 'visible' })
    if (!(await integrationsRow.isChecked())) {
      await integrationsRow.click()
      await page.waitForTimeout(500)
    }

    await page
      .locator('.MuiBottomNavigationAction-root')
      .filter({ hasText: 'Integrations' })
      .click()
    await page.waitForTimeout(1000)

    await page.locator('.MuiFab-root[aria-label="add"]').click()
    await page.waitForTimeout(500)
    await page.getByRole('menuitem', { name: 'Add Integration' }).click()

    const addDialog = page.getByRole('dialog')
    await addDialog.waitFor({ state: 'visible' })
    await addDialog.getByRole('combobox').first().click()
    await page.getByRole('option', { name: 'DMX Input' }).click()
    await page.waitForTimeout(500)
    await addDialog.getByRole('button', { name: 'Add' }).click()
    await addDialog.waitFor({ state: 'detached', timeout: 10000 })
    await expect(page.getByText('DMX Input').first()).toBeVisible({ timeout: 10000 })

    const integrationCard = page.locator('.MuiCard-root').filter({ hasText: 'DMX Input' }).last()
    await integrationCard.getByRole('switch', { name: 'status' }).click()
    await expect(async () => {
      await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
      await page.waitForTimeout(300)
      await page
        .locator('.MuiBottomNavigationAction-root')
        .filter({ hasText: 'Integrations' })
        .click()
      await expect(integrationCard.getByText('Current Status: Listening')).toBeVisible({
        timeout: 3000
      })
    }).toPass({ timeout: 20000 })

    await integrationCard.getByRole('button', { name: 'DMX Input settings' }).click()
    const screen = page.getByRole('dialog').filter({ hasText: 'DMX Input Mappings' })
    await screen.waitFor({ state: 'visible' })

    await screen.getByRole('button', { name: 'Add Mapping' }).click()
    const mappingDialog = page.getByRole('dialog').filter({ hasText: 'Add DMX Mapping' })
    await mappingDialog.waitFor({ state: 'visible' })
    await mappingDialog.getByLabel('Name').fill('Venue Fixture Mapping')
    await mappingDialog.getByLabel('Type').click()
    await page.getByRole('option', { name: 'Fixture (wash)' }).click()
    await page.waitForTimeout(500)

    // The Virtual dropdown defaults to the first virtual in the backend's
    // list (by creation order), which may not be the venue's own virtual if
    // other specs ran earlier in the same suite and created virtuals first.
    // Explicitly select the venue's virtual by name.
    await mappingDialog.getByLabel('Virtual').click()
    await page.getByRole('option', { name: virtualName }).click()
    await page.waitForTimeout(500)

    const saveButton = mappingDialog.getByRole('button', { name: 'Save' })
    await expect(saveButton).toBeEnabled({ timeout: 10000 })
    await saveButton.click()
    await mappingDialog.waitFor({ state: 'detached', timeout: 10000 })

    await screen.getByRole('button', { name: 'back' }).click()
    await screen.waitFor({ state: 'detached', timeout: 10000 })
  })

  /**
   * @doc
   * Back on the Venues list, the venue now shows a pause icon-button
   * (it's DMX-mapped via its member virtual). Use it to mute, then resume,
   * DMX Input takeover for the whole venue.
   */
  await test.step('8. Pause and Resume DMX Input on the Venue', async () => {
    await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Venues' }).click()
    await page.waitForTimeout(1000)

    const venueCard = page.locator('.MuiCard-root').filter({ hasText: venueName }).first()
    const pauseButton = venueCard.getByRole('button', { name: 'pause-dmx' })
    await expect(pauseButton).toBeVisible({ timeout: 10000 })
    await page.screenshot({ path: 'test-results/venues-8-pause-button.png' })

    await pauseButton.click()
    await expect(venueCard.getByRole('button', { name: 'resume-dmx' })).toBeVisible({
      timeout: 10000
    })
    await page.screenshot({ path: 'test-results/venues-9-venue-paused.png' })

    await venueCard.getByRole('button', { name: 'resume-dmx' }).click()
    await expect(venueCard.getByRole('button', { name: 'pause-dmx' })).toBeVisible({
      timeout: 10000
    })
  })
})
