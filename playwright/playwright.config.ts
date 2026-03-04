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
      use: {
        ...devices['Desktop Chrome'],
        // Try enabling SwiftShader/software GL and ignore GPU blocklist on macOS
        launchOptions: {
          args: [
            '--use-gl=swiftshader',
            '--ignore-gpu-blocklist',
            '--enable-accelerated-2d-canvas',
            '--enable-webgl',
            '--enable-webgl2-compute-context'
          ],
          headless: true
        }
      }
    }
  ]
})
