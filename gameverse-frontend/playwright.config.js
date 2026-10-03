import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: false,
  retries: 1,
  workers: 1,
  timeout: 30000,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  projects: [
    {
      name: 'frontend',
      testDir: './tests/frontend',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173',
      },
    },
    {
      name: 'backend',
      testDir: './tests/backend',
      use: {
        baseURL: 'http://localhost:8081',
        extraHTTPHeaders: {
          'Accept': 'application/json',
        }
      },
    },
  ],
});
