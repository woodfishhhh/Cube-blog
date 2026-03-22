import { expect, test } from "@playwright/test";

test("opening an article from the blog panel takes over the route and browser back restores blog mode", async ({
  page,
}) => {
  await page.goto("/");

  const homeMain = page.getByRole("main", { name: /homepage editorial shell/i });
  const sceneHost = page.locator("[data-scene-host='persistent']");
  const blogButton = page.getByRole("button", { name: "博客" });
  const postLink = page.getByRole("link", {
    name: /javascript 学习笔记（1）：基础语法与数据类型/i,
  });

  await blogButton.click();

  await expect(homeMain).toHaveAttribute("data-home-mode", "home-blog");
  await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-blog");
  await expect(page.getByRole("region", { name: /selected writing/i })).toBeVisible();

  await postLink.click();

  await expect(page).toHaveURL(/\/posts\/javascript-basics-and-data-types$/);
  await expect(
    page.getByRole("heading", { name: /javascript 学习笔记（1）：基础语法与数据类型/i }),
  ).toBeVisible();
  await expect(page.getByLabel(/article metadata/i)).toBeVisible();
  await expect(
    page.getByRole("region", {
      name: /javascript 学习笔记（1）：基础语法与数据类型 content/i,
    }),
  ).toBeVisible();
  await expect(sceneHost).toHaveAttribute("data-scene-mode", "article-reading");
  await expect(sceneHost).toHaveAttribute("data-scene-renderer", "deferred");
  await expect(sceneHost).toHaveAttribute("data-scene-budget-tier", "disabled");

  await page.goBack();

  await expect(page).toHaveURL(/\/$/);
  await expect(homeMain).toHaveAttribute("data-home-mode", "home-blog");
  await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-blog");
  await expect(sceneHost).toHaveAttribute("data-scene-renderer", "live");
  await expect(page.getByRole("region", { name: /selected writing/i })).toBeVisible();
  await expect(blogButton).toHaveAttribute("aria-pressed", "true");
});

test("article route renders the curated markdown post with article landmarks", async ({ page }) => {
  await page.goto("/posts/javascript-basics-and-data-types");

  const sceneHost = page.locator("[data-scene-host='persistent']");

  await expect(
    page.getByRole("heading", { name: /javascript 学习笔记（1）：基础语法与数据类型/i }),
  ).toBeVisible();
  await expect(page.getByText(/JavaScript 程序不能独立运行/)).toBeVisible();
  await expect(page.getByLabel(/article metadata/i)).toBeVisible();
  await expect(sceneHost).toHaveAttribute("data-scene-mode", "article-reading");
  await expect(sceneHost).toHaveAttribute("data-scene-renderer", "deferred");
});
