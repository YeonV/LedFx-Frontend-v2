import type { Page } from '@playwright/test'

/**
 * Dismisses startup dialogs:
 *  1. NoHostDialog  — adds http://localhost:7777 and connects
 *  2. Intro dialog  — clicks Skip
 */
export const clearDialogs = async (page: Page): Promise<void> => {
  // Handle No Host Dialog — add :7777 via + button, then connect
  try {
    await page
      .getByRole('button', { name: 'add' })
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
    await page.getByRole('button', { name: 'add' }).first().click()
    await page.waitForTimeout(300)
    await page.getByRole('textbox', { name: 'IP:Port' }).click()
    await page.getByRole('textbox', { name: 'IP:Port' }).press('End')
    await page.getByRole('textbox', { name: 'IP:Port' }).fill('http://localhost:7777')
    await page.getByRole('button', { name: 'add' }).click()
    await page.waitForTimeout(300)
    console.log('Connecting to http://localhost:7777')
    await page.getByText('http://localhost:7777').click()
    await page.waitForTimeout(1000)
  } catch (_e) {
    console.log('No Host dialog not shown or already connected')
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
