import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  testMatch: '**/*.e2e.js',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npx serve .',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
