/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from './fixtures'
import { clearDialogs } from './helpers'

test('Add Virtual Device FAB interaction', async ({ page }) => {
  // Increase timeout for this complex test
  test.setTimeout(60000)

  await page.goto('/#/')

  await clearDialogs(page)

  console.log('Navigating to Devices')
  // Go to Devices page
  await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
  await page.waitForTimeout(1000)

  // Create a Virtual Device
  console.log('Creating Virtual Device')
  await page.locator('.MuiFab-root[aria-label="add"]').click()
  await page.waitForTimeout(500) // wait for FAB menu animation
  await page.getByRole('menuitem', { name: 'Add Virtual' }).click()

  // Wait for dialog AND its schema form to fully load
  // (schema is fetched async from /api/schema/virtuals — fixed timeout is not enough)
  const dialog = page.getByRole('dialog')
  await dialog.waitFor({ state: 'visible' })
  const nameInput = dialog.locator('input').first()
  await nameInput.waitFor({ state: 'visible', timeout: 10000 })
  await nameInput.fill('Test Virtual')

  await page.getByRole('button', { name: 'Add & Setup Segments' }).click()
  await page.waitForTimeout(2000)

  // "Add & Setup Segments" opens the full-screen segment editor — go Back first
  console.log('Closing segment editor (Back)')
  await page.getByRole('button', { name: 'Back' }).click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'test-results/virtual-created.png' })
})

test('Add Virtual shows field errors from a 400 and stays open', async ({ page }) => {
  test.setTimeout(60000)
  await page.goto('/#/')
  await clearDialogs(page)

  // The virtual form clamps every input, so no real invalid value reaches the
  // backend: answer the add with the backend's validation_error body instead.
  await page.route('**/api/virtuals', (route) =>
    route.request().method() === 'POST'
      ? route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'failed',
            payload: { type: 'error', reason: '1 invalid value(s)' },
            errors: [
              {
                type: 'string_too_long',
                loc: ['name'],
                msg: 'String should have at most 64 characters',
                input: 'Invalid Virtual'
              }
            ]
          })
        })
      : route.continue()
  )

  await page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Devices' }).click()
  await page.waitForTimeout(1000)
  await page.locator('.MuiFab-root[aria-label="add"]').click()
  await page.waitForTimeout(500)
  await page.getByRole('menuitem', { name: 'Add Virtual' }).click()

  const dialog = page.getByRole('dialog')
  await dialog.waitFor({ state: 'visible' })
  const nameInput = dialog.locator('input').first()
  await nameInput.waitFor({ state: 'visible', timeout: 10000 })
  await nameInput.fill('Invalid Virtual')
  await page.getByRole('button', { name: 'Add & Setup Segments' }).click()

  await expect(dialog.getByText('String should have at most 64 characters')).toBeVisible()
  await expect(dialog).toBeVisible()
})
