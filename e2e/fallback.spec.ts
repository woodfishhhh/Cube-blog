import { expect, test } from "@playwright/test";

test("homepage falls back to the static backdrop when WebGL contexts are unavailable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;

    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: function patchedGetContext(
        this: HTMLCanvasElement,
        contextId: string,
        ...args: unknown[]
      ) {
        if (
          contextId === "webgl" ||
          contextId === "webgl2" ||
          contextId === "experimental-webgl"
        ) {
          return null;
        }

        return originalGetContext.call(this, contextId, ...args);
      },
    });
  });

  await page.goto("/");

  const homeMain = page.getByRole("main", { name: /homepage editorial shell/i });
  const sceneHost = page.locator("[data-scene-host='persistent']");
  const blogButton = page.getByRole("button", { name: "博客" });
  const backdrop = page.getByTestId("scene-static-backdrop");

  await expect(homeMain).toHaveAttribute("data-home-mode", "home-hero");
  await expect(sceneHost).toHaveAttribute("data-scene-renderer", "fallback");
  await expect(sceneHost).toHaveAttribute("data-scene-budget-tier", "desktop-default");
  await expect(backdrop).toBeVisible();
  await expect(backdrop).toHaveAttribute("data-scene-fallback-reason", "webgl-context-unavailable");

  await blogButton.click();

  await expect(homeMain).toHaveAttribute("data-home-mode", "home-blog");
  await expect(sceneHost).toHaveAttribute("data-scene-mode", "home-blog");
  await expect(sceneHost).toHaveAttribute("data-scene-renderer", "fallback");
  await expect(page.getByRole("region", { name: /selected writing/i })).toBeVisible();
});
