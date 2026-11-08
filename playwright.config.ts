import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';

const PORT = process.env.PORT || 2000;
const BASE_URL = `http://localhost:${PORT}`;

function resolveLocalChromium(): string | undefined {
  if (process.env.CI) return undefined;
  const cacheDir = path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
  const candidate = path.join(
    cacheDir,
    'chromium-1243',
    'chrome-mac-arm64',
    'Google Chrome for Testing.app',
    'Contents',
    'MacOS',
    'Google Chrome for Testing'
  );
  return fs.existsSync(candidate) ? candidate : undefined;
}

const localChrome = resolveLocalChromium();

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    ...(localChrome ? { launchOptions: { executablePath: localChrome } } : {}),
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'iPhone 15',
      use: { ...devices['iPhone 15'] },
    },
    {
      name: 'iPhone SE',
      use: { ...devices['iPhone SE'] },
    },
  ],
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
