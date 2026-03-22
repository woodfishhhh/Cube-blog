import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run build && npm run start -- --hostname 127.0.0.1 --port 3000",
    timeout: 180000,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: "desktop-chromium",
      testMatch: ["**/home.spec.ts", "**/article.spec.ts"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      testMatch: "**/mobile.spec.ts",
      use: { ...devices["iPhone 13"] },
    },
    {
      name: "reduced-motion",
      testMatch: "**/home.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "no-webgl",
      testMatch: "**/fallback.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
