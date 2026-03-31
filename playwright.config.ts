import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 90 * 1000,
  // globalSetup: require.resolve('./utils/global_setup.ts'),
  expect: { timeout: 40 * 1000 },
  use: {
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    browserName: 'chromium',
    headless: false,
    screenshot: 'only-on-failure', // 'on' if you want screenshots for passed tests too
    trace: 'retain-on-failure',
  }, 

  /* Configure projects for major browsers */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
