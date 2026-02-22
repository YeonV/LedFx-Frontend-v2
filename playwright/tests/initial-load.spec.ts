import { test, expect } from '@playwright/test'

test('Initial page load and navigation to Settings', async ({ page }) => {
  await page.goto('http://localhost:3000/#/')

  // Handle No Host Dialog if it appears
  const hostButton = page.getByRole('button', { name: 'http://localhost:8888' })
  try {
    await hostButton.waitFor({ state: 'visible', timeout: 5000 })
    await hostButton.click()
    console.log('Clicked host button')
  } catch (_e) {
    console.log('Host button not found or already connected')
  }

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

  // Capture dashboard
  await page.screenshot({ path: 'test-results/dashboard.png' })

  // Click on Settings button in the bottom navigation bar
  const settingsTab = page
    .locator('.MuiBottomNavigationAction-root')
    .filter({ hasText: 'Settings' })
  await settingsTab.click()

  // Verify navigation to Settings
  await expect(page).toHaveURL(/.*Settings/)

  // Capture settings page
  await page.screenshot({ path: 'test-results/settings.png' })
})
