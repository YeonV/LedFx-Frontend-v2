import { test, expect } from './fixtures'
import { clearDialogs } from './helpers'

test('Visualiser Features and Show Visualiser', async ({ page }) => {
  // Increase timeout for this complex test
  test.setTimeout(60000)

  await page.goto('/#/')

  await clearDialogs(page)

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

  // Open TopBar context menu
  console.log('Opening TopBar menu')
  await page.getByLabel('display more actions').click()
  await page.waitForTimeout(300) // wait for menu animation
  await page.screenshot({ path: 'test-results/show-visualisers-menu-item.png' })

  console.log('Toggling Show Visualisers')
  const showVisualisersItem = page.getByRole('menuitem', { name: 'Show Visualisers' })
  const hideVisualisersItem = page.getByRole('menuitem', { name: 'Hide Visualisers' })
  if (await showVisualisersItem.isVisible()) {
    await showVisualisersItem.click()
  } else if (await hideVisualisersItem.isVisible()) {
    // Already showing — close the menu without toggling off
    console.log('Visualisers already showing')
  }
  await page.waitForTimeout(300)
  await page.keyboard.press('Escape')

  console.log('Waiting for Visualiser Card')
  // The section heading is an overline Typography "Visualizers"; walk up to its Stack parent
  // then find the MuiCard-root within it — avoids relying on the auto-generated client name
  const visualiserCard = page
    .locator('span.MuiTypography-overline', { hasText: 'Visualizers' })
    .locator('..')
    .locator('.MuiCard-root')
    .first()
  await expect(visualiserCard).toBeVisible({ timeout: 15000 })

  await page.screenshot({ path: 'test-results/show-visualisers.png' })

  console.log('Opening ClientEdit popover')
  await visualiserCard.locator('h6 button').click()
  await page.waitForTimeout(300)

  await page.locator('#client-name-input').clear()
  await page.locator('#client-name-input').fill('Main')

  await page.getByRole('combobox', { name: 'Type' }).click()
  await page.getByRole('option', { name: 'Controller' }).click()

  await page.locator('button:has([data-testid="CheckIcon"])').click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'test-results/client-edit.png' })

  console.log('Clicking Next on Visualiser Card')
  await visualiserCard.getByRole('button', { name: 'next-visualizer' }).click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'test-results/visualiser-next.png' })
})
