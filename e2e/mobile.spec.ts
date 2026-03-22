import { expect, test } from "@playwright/test";

test("mobile home uses the stacked touch-static flow and direct section links", async ({ page }) => {
  test.slow();

  await page.goto("/", { waitUntil: "domcontentloaded" });

  const mobileMain = page.getByRole("main", { name: /mobile homepage editorial shell/i });
  const sceneHost = page.locator("[data-scene-host='persistent']");
  const primaryNav = page.getByRole("navigation", { name: /primary/i });
  const sectionNav = page.getByRole("navigation", { name: /mobile homepage sections/i });
  const heroHeading = page.getByRole("heading", { name: /woodfish immersive notes/i });

  await expect(mobileMain).toHaveAttribute("data-home-interaction-mode", "touch-static");
  await expect(mobileMain).toHaveAttribute("data-mobile-home-layout", "stacked");
  await expect(primaryNav.getByRole("link", { name: "博客" })).toHaveAttribute(
    "href",
    "#selected-writing",
    { timeout: 15000 },
  );
  await expect(primaryNav.getByRole("link", { name: "作者" })).toHaveAttribute(
    "href",
    "#author-profile",
    { timeout: 15000 },
  );
  await sceneHost.waitFor({ state: "attached", timeout: 15000 });
  await expect(sceneHost).toHaveAttribute("data-scene-budget-tier", "mobile");
  await expect(sceneHost).toHaveAttribute("data-scene-input-owner", "none");

  const blogLink = sectionNav.getByRole("link", { name: "博客" });
  const authorLink = sectionNav.getByRole("link", { name: "作者" });

  await blogLink.click({ force: true });

  await expect(page).toHaveURL(/#selected-writing$/);
  await expect(page.getByRole("region", { name: /selected writing/i })).toBeVisible({
    timeout: 15000,
  });
  await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-blog");
  await expect(primaryNav.getByRole("link", { name: "博客" })).toHaveAttribute(
    "aria-current",
    "location",
  );

  await authorLink.click({ force: true });

  await expect(page).toHaveURL(/#author-profile$/);
  await expect(page.getByRole("region", { name: /author profile/i })).toBeVisible({
    timeout: 15000,
  });
  await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-author");
  await expect(primaryNav.getByRole("link", { name: "作者" })).toHaveAttribute(
    "aria-current",
    "location",
  );

  await heroHeading.click();

  await expect(page.getByRole("button", { name: /exit focus/i })).toHaveCount(0);
  await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-author");
  await expect(sceneHost).toHaveAttribute("data-scene-input-owner", "none");
});
