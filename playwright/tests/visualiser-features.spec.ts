/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '@playwright/test'

test('Visualiser Features and Show Visualiser', async ({ page }) => {
  // Increase timeout for this complex test
  test.setTimeout(60000)

  await page.goto('http://localhost:3000/#/')

  // Function to handle known dialogs
  const clearDialogs = async () => {
    // Handle No Host Dialog
    const connectButton = page.getByRole('button', { name: 'Connect' })
    try {
      await connectButton.waitFor({ state: 'visible', timeout: 5000 })
      console.log('Clicking Connect button')
      await connectButton.click()
      await page.waitForTimeout(1000)
    } catch (_e) {
      console.log('Connect button not found or already gone')
    }

    // Handle Intro dialog if it appears
    const skipButton = page.getByRole('button', { name: 'Skip' })
    try {
      await skipButton.waitFor({ state: 'visible', timeout: 5000 })
      console.log('Clicking Skip button')
      await skipButton.click()
      await page.waitForTimeout(1000)
    } catch (_e) {
      console.log('Skip button not found or already gone')
    }
  }

  await clearDialogs()

  console.log('Navigating to Settings')
  // Go to Settings
  const settingsTab = page
    .locator('.MuiBottomNavigationAction-root')
    .filter({ hasText: 'Settings' })
  await settingsTab.click()
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'test-results/settings-page.png' })

  console.log('Enabling Expert and Beta modes')
  // Enable Expert Mode - use label
  const expertCheckbox = page.getByLabel('Expert Mode')
  await expertCheckbox.waitFor({ state: 'visible' })
  if (!(await expertCheckbox.isChecked())) {
    await expertCheckbox.click()
    await page.waitForTimeout(500)
  }

  // Enable Beta Mode - use label
  const betaCheckbox = page.getByLabel('Beta Mode')
  if (!(await betaCheckbox.isChecked())) {
    await betaCheckbox.click()
    await page.waitForTimeout(500)
  }

  // Open Features accordion
  console.log('Opening Features accordion')
  const featuresAccordion = page.getByRole('button', { name: /Features/ })
  await featuresAccordion.click()
  await page.waitForTimeout(500)

  // Enable Background Visualiser
  console.log('Enabling Background Visualiser')
  const bgVisualiserRow = page
    .locator('div')
    .filter({ hasText: /^BG Visualiser/ })
    .locator('input[type="checkbox"]')
  await bgVisualiserRow.waitFor({ state: 'visible' })
  if (!(await bgVisualiserRow.isChecked())) {
    await bgVisualiserRow.click()
    await page.waitForTimeout(500)
  }

  console.log('Navigating to Devices')
  // Go to Devices page
  await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
  await page.waitForTimeout(1000)

  // Create a Virtual Device
  console.log('Creating Virtual Device')
  await page.locator('.MuiFab-root[aria-label="add"]').click()
  await page.getByRole('menuitem', { name: 'Add Virtual Device' }).click()
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(2000)

  // Open TopBar menu
  console.log('Opening TopBar menu')
  await page.getByLabel('menu').click()
  await page.screenshot({ path: 'test-results/show-visualisers-menu-item.png' })

  console.log('Toggling Show Visualisers')
  await page.getByRole('menuitem', { name: 'Show Visualisers' }).click()

  console.log('Waiting for Visualiser Card')
  const visualiserCard = page.locator('.MuiCard-root').filter({ hasText: 'Visualiser' })
  await expect(visualiserCard).toBeVisible({ timeout: 15000 })

  await page.screenshot({ path: 'test-results/show-visualisers.png' })

  console.log('Clicking Next on Visualiser Card')
  await visualiserCard.getByRole('button').filter({ hasText: 'Next' }).click()
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'test-results/visualiser-next.png' })
})
