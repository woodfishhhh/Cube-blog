import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import RootLayout from "@/app/layout";

vi.mock("next/font/google", () => ({
  Archivo: () => ({ variable: "font-ui" }),
  Source_Serif_4: () => ({ variable: "font-editorial" }),
}));

vi.mock("@/components/layout/AppShell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-shell">{children}</div>
  ),
}));

vi.mock("@/components/scene/SceneViewportSlot", () => ({
  SceneViewportSlot: () => <div data-testid="scene-viewport" />,
}));

vi.mock("@/components/scene/SceneRouteBridge", () => ({
  SceneRouteBridge: () => <div data-testid="scene-route-bridge" />,
}));

describe("RootLayout", () => {
  it("mounts the lazy scene viewport boundary and route bridge around the app shell", () => {
    const markup = renderToStaticMarkup(
      RootLayout({
        children: <main data-testid="page-content">Article</main>,
      }),
    );

    expect(markup).toContain('data-testid="scene-viewport"');
    expect(markup).toContain('data-testid="scene-route-bridge"');
    expect(markup).toContain('data-testid="app-shell"');
    expect(markup).toContain('data-testid="page-content"');
  });
});
