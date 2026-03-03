import { test as base } from '@playwright/test'

/**
 * Extended test fixture that clears localStorage before each test.
 * The test environment is fully isolated (dedicated pwtest/ config dir, torn down after the suite),
 * so there is no state worth preserving between tests.
 */
export const test = base.extend<{ page: import('@playwright/test').Page }>({
  page: async ({ page }, use) => {
    // Navigate to establish the correct origin, then wipe any state from a previous test
    await page.goto('/#/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await use(page)
  }
})

export { expect } from '@playwright/test'
