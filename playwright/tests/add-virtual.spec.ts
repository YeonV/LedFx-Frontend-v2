import { test, expect } from '@playwright/test'

test('Add Virtual Device FAB interaction', async ({ page }) => {
  await page.goto('http://localhost:3000/#/')

  // Handle No Host Dialog if it appears
  const hostButton = page.getByRole('button', { name: 'http://localhost:8888' })
  try {
    await hostButton.waitFor({ state: 'visible', timeout: 5000 })
    await hostButton.click()
  } catch (_e) {
    // Already connected
  }

  const connectButton = page.getByRole('button', { name: 'Connect' })
  try {
    await connectButton.waitFor({ state: 'visible', timeout: 5000 })
    await connectButton.click()
    await page.waitForTimeout(1000)
  } catch (_e) {
    // Already gone
  }

  // Handle Intro dialog if it appears
  const skipButton = page.getByRole('button', { name: 'Skip' })
  try {
    await skipButton.waitFor({ state: 'visible', timeout: 5000 })
    await skipButton.click()
    await page.waitForTimeout(1000)
  } catch (_e) {
    // Already gone
  }

  // Click the FAB (+)
  console.log('Clicking FAB (+)')
  await page.locator('.MuiFab-root[aria-label="add"]').click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'playwright/screenshots/fab-opened.png' })

  // Click "Add Virtual" (which has name "Add Virtual" in the menu items I saw earlier)
  // Let's check the exact name in AddButton.tsx again.
  // It was { icon: ..., name: 'Add Virtual', description: 'Segments & Groups', action: ... }
  console.log('Clicking Add Virtual')
  await page.getByRole('menuitem', { name: 'Add Virtual' }).click()

  // Verify Dialog is open
  const dialogTitle = page.getByText('Add Virtual Device')
  await expect(dialogTitle).toBeVisible()

  // Capture the final proof screenshot
  await page.screenshot({ path: 'playwright/screenshots/add-virtual-dialog.png' })
})
