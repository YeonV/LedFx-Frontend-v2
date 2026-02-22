import { test, expect } from '@playwright/test';
import fs from 'fs';

test('initial page load and click settings', async ({ page }) => {
  // Ensure screenshots directory exists
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  // 1. Initial page load
  await page.goto('/');

  // Handle Host Selection Dialog if it appears
  const hostButton = page.locator('button, div').filter({ hasText: 'http://localhost:8888' }).first();
  try {
    await hostButton.waitFor({ state: 'visible', timeout: 5000 });
    await hostButton.click();
    console.log('Clicked host button');
  } catch (e) {
    console.log('Host button not found or already connected');
  }

  // Handle Intro Dialog (Setup Assistant) if it appears
  const skipButton = page.locator('button, span, div').filter({ hasText: /^Skip$/ }).first();
  try {
    await skipButton.waitFor({ state: 'visible', timeout: 5000 });
    await skipButton.click();
    console.log('Clicked skip button');
    // Wait for the modal to be removed from DOM
    await expect(skipButton).not.toBeVisible();
  } catch (e) {
    console.log('Skip button not found');
  }

  // Wait for the main UI (bottom navigation) to be visible and stable
  const bottomNav = page.locator('.MuiBottomNavigation-root');
  await expect(bottomNav).toBeVisible({ timeout: 30000 });

  // Wait for network to be idle to ensure icons and data are loaded
  await page.waitForLoadState('networkidle');

  // Take screenshot of initial page load
  await page.screenshot({ path: 'screenshots/initial-load.png', fullPage: true });

  // 2. Click Settings button
  const settingsButton = page.locator('.MuiBottomNavigationAction-root').filter({ hasText: 'Settings' });
  await settingsButton.click();

  // Wait for URL change (HashRouter uses #)
  await page.waitForURL(url => url.hash.toLowerCase().includes('settings'), { timeout: 10000 });

  // Wait for settings page content to be visible
  await expect(page.locator('text=Expert Mode')).toBeVisible();

  // Take screenshot after clicking settings
  await page.screenshot({ path: 'screenshots/settings-page.png', fullPage: true });
});
