import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  globalSetup: './tests/global.setup.ts',
  globalTeardown: './tests/global.teardown.ts',
  testDir: './tests',
  outputDir: './videos',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:2000',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on' // Required for animated webp/gif generation
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
