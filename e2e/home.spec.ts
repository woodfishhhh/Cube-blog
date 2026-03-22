import { expect, test, type Page } from "@playwright/test";

async function clickHeroCube(page: Page) {
  const heroHeading = page.getByRole("heading", { name: /woodfish immersive notes/i });
  const heroBox = await heroHeading.boundingBox();

  if (heroBox === null) {
    throw new Error("Expected the hero heading to have a bounding box.");
  }

  await page.mouse.click(heroBox.x + heroBox.width / 2, heroBox.y + heroBox.height / 2);
}

test.describe("desktop homepage journey", () => {
  test("progresses hero to blog to author, enters cube focus, tracks drag ownership, and exits back to author", async ({
    page,
  }) => {
    test.skip(test.info().project.name !== "desktop-chromium", "Desktop-only homepage flow.");

    await page.goto("/");

    const homeMain = page.getByRole("main", { name: /homepage editorial shell/i });
    const panelRail = page.getByLabel(/homepage overview panels/i);
    const blogButton = page.getByRole("button", { name: "博客" });
    const authorButton = page.getByRole("button", { name: "作者" });
    const sceneHost = page.locator("[data-scene-host='persistent']");

    await expect(page.getByRole("heading", { name: /woodfish immersive notes/i })).toBeVisible();
    await expect(homeMain).toHaveAttribute("data-home-mode", "home-hero");
    await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-hero");
    await expect(panelRail).toHaveAttribute("data-home-visibility", "tucked");

    await blogButton.click();

    await expect(blogButton).toHaveAttribute("aria-pressed", "true");
    await expect(homeMain).toHaveAttribute("data-home-mode", "home-blog");
    await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-blog");
    await expect(panelRail).toHaveAttribute("data-home-visibility", "visible");
    await expect(page.getByRole("region", { name: /selected writing/i })).toBeVisible();

    await authorButton.click();

    await expect(authorButton).toHaveAttribute("aria-pressed", "true");
    await expect(homeMain).toHaveAttribute("data-home-mode", "home-author");
    await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-author");
    await expect(page.getByRole("region", { name: /selected writing/i })).not.toBeVisible();
    await expect(page.getByRole("region", { name: /author profile/i })).toBeVisible();

    await clickHeroCube(page);

    const exitFocusButton = page.getByRole("button", { name: /exit focus/i });

    await expect(exitFocusButton).toBeVisible();
    await expect(exitFocusButton).toBeFocused();
    await expect(homeMain).toHaveAttribute("data-scene-mode", "home-cube-focus");
    await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-cube-focus");
    await expect(panelRail).toHaveAttribute("data-home-visibility", "hidden");
    await expect(sceneHost).toHaveAttribute("data-scene-input-owner", "none");
    await expect(sceneHost).toHaveAttribute("data-scene-active-pointer", "none");

    const sceneBox = await sceneHost.boundingBox();

    if (sceneBox === null) {
      throw new Error("Expected the persistent scene host to have a bounding box.");
    }

    const dragStartX = sceneBox.x + sceneBox.width / 2;
    const dragStartY = sceneBox.y + sceneBox.height / 2;

    await page.mouse.move(dragStartX, dragStartY);
    await page.mouse.down();
    await page.mouse.move(dragStartX + 40, dragStartY - 28);

    await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-cube-focus");
    await expect(sceneHost).toHaveAttribute("data-scene-input-owner", "scene-focus-drag");
    await expect(sceneHost).not.toHaveAttribute("data-scene-active-pointer", "none");

    await page.mouse.up();

    await expect(sceneHost).toHaveAttribute("data-scene-input-owner", "none");
    await expect(sceneHost).toHaveAttribute("data-scene-active-pointer", "none");
    await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-cube-focus");

    await exitFocusButton.click();

    await expect(homeMain).toHaveAttribute("data-home-mode", "home-author");
    await expect(homeMain).toHaveAttribute("data-scene-mode", "home-author");
    await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-author");
    await expect(panelRail).toHaveAttribute("data-home-visibility", "visible");
    await expect(authorButton).toHaveAttribute("aria-pressed", "true");
  });
});

test("home page renders the curated hero and content panels", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop-chromium", "Desktop-only homepage shell.");

  await page.goto("/");

  await expect(page.getByRole("heading", { name: /woodfish immersive notes/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /selected writing/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /javascript 学习笔记（1）：基础语法与数据类型/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /author profile/i })).not.toBeVisible();

  await page.getByRole("button", { name: "作者" }).click();

  await expect(page.getByRole("heading", { name: /author profile/i })).toBeVisible();
  await expect(page.getByRole("region", { name: /selected writing/i })).not.toBeVisible();
});

test("focused post card link opens the article route on Enter", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop-chromium", "Desktop keyboard coverage only.");

  await page.goto("/");

  await page.getByRole("button", { name: "博客" }).press("Enter");

  const postLink = page.getByRole("link", {
    name: /javascript 学习笔记（1）：基础语法与数据类型/i,
  });

  await postLink.focus();
  await postLink.press("Enter");

  await expect(page).toHaveURL(/\/posts\/javascript-basics-and-data-types$/);
});

test("reduced-motion project advertises calmer scene motion without changing homepage content access", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "reduced-motion", "Reduced-motion project only.");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const sceneHost = page.locator("[data-scene-host='persistent']");

  await expect(page.getByRole("main", { name: /homepage editorial shell/i })).toHaveAttribute(
    "data-home-mode",
    "home-hero",
  );
  await expect(sceneHost).toHaveAttribute("data-scene-motion", "reduced");
  await expect(sceneHost).toHaveAttribute("data-scene-budget-tier", "reduced-motion");
  await expect(sceneHost).toHaveAttribute("data-scene-renderer", "live");

  await page.getByRole("button", { name: "博客" }).click();

  await expect(page.getByRole("region", { name: /selected writing/i })).toBeVisible();
  await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-blog");
  await expect(sceneHost).toHaveAttribute("data-scene-motion", "reduced");
});
