import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";
import { NavBar } from "@/components/home/NavBar";
import { SceneViewport } from "@/components/scene/SceneViewport";

describe("HomePage", () => {
  it("renders the editorial hero and curated homepage panels", async () => {
    render(await HomePage());

    expect(
      screen.getByRole("heading", {
        name: /woodfish immersive notes/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /selected writing/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /author profile/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /javascript 学习笔记（1）：基础语法与数据类型/i }),
    ).toBeInTheDocument();
  });
});

describe("NavBar", () => {
  it("renders the woodfish navigation labels", () => {
    render(<NavBar activeMode="home-hero" />);

    expect(screen.getByText("WOODFISH")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "博客" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "作者" })).toBeInTheDocument();
  });
});

describe("SceneViewport", () => {
  it("renders the persistent scene host mount point", () => {
    const engineFactory = vi.fn(() => ({
      mount: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      resize: vi.fn(),
      applyState: vi.fn(),
      dispose: vi.fn(),
    }));

    render(<SceneViewport engineFactory={engineFactory} />);

    expect(document.querySelector("[data-scene-host='persistent']")).not.toBeNull();
    expect(document.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);
  });
});
