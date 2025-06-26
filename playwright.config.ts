import { defineConfig, devices } from '@playwright/test';

require('dotenv').config();


const now = new Date();

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 6 : undefined,
  captureGitInfo: { diff: true, commit: true },

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */

  reporter: [
    ['html', { open: 'on-failure', title: `Playwright Test Report - ${now}` }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: { mode: 'on', fullPage: true },
    viewport: { width: 1600, height: 1200 }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'auth-setup',
      testMatch: /tests\/global\/auth-setup\.ts$/,
      use: {
        headless: false,
        launchOptions: {
          slowMo: 100,
        },
      },
    },
    {
      name: 'cleanup test data',
      testMatch: /clean-up-teardown\.ts/,
      use: {
        headless: false,
        launchOptions: {
          slowMo: 100,
        },
      },
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        //headless: false,
      },
      teardown: 'cleanup test data',
      //dependencies: ['auth-setup'],
    },
  ],

});
