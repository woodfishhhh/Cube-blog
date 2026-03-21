import { expect, test } from "@playwright/test";

test("home page starter title is visible", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /3d blog starter/i }),
  ).toBeVisible();
});
