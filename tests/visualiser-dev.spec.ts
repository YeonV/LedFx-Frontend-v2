import { test, expect } from '@playwright/test';
import fs from 'fs';

test('audio visualiser dev screenshot', async ({ page }) => {
  // 1. Go to the visualiser dev server
  await page.goto('http://localhost:3001');

  // 2. Wait 5 seconds as requested
  await page.waitForTimeout(5000);

  // Ensure screenshots directory exists
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  // 3. Take screenshot
  await page.screenshot({ path: 'screenshots/visualiser-dev.png', fullPage: true });
});
