import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";

const { headersMock } = vi.hoisted(() => ({
  headersMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

import HomePage from "@/app/page";
import { AppShell } from "@/components/layout/AppShell";
import { NavBar } from "@/components/home/NavBar";
import { resetHomeSceneController } from "@/components/home/use-home-scene-controller";
import { PostCard } from "@/components/home/PostCard";
import { SceneViewport } from "@/components/scene/SceneViewport";
import { getHomeData } from "@/lib/content/home-data";
import type { WebGLCapability } from "@/lib/scene/webgl-capability";

type EngineDouble = {
  applyState: ReturnType<typeof vi.fn>;
  dispose: ReturnType<typeof vi.fn>;
  hitTestCube: ReturnType<typeof vi.fn>;
  mount: ReturnType<typeof vi.fn>;
  resize: ReturnType<typeof vi.fn>;
  setBudget: ReturnType<typeof vi.fn>;
  setFocusDragOffset: ReturnType<typeof vi.fn>;
  setReducedMotion: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stepCube: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
};

function createRequestHeaders(entries: Record<string, string> = {}) {
  return new Headers(entries);
}

function createEngineDouble(): EngineDouble {
  return {
    applyState: vi.fn(),
    dispose: vi.fn(),
    hitTestCube: vi.fn(() => false),
    mount: vi.fn(),
    resize: vi.fn(),
    setBudget: vi.fn(),
    setFocusDragOffset: vi.fn(),
    setReducedMotion: vi.fn(),
    start: vi.fn(),
    stepCube: vi.fn(() => 0),
    stop: vi.fn(),
  };
}

function createLiveCapability(): WebGLCapability {
  return {
    isAvailable: true,
    reason: "available",
  };
}

async function renderComposedHomeShell(
  options: {
    resolveCapability?: () => WebGLCapability;
  } = {},
) {
  const engine = createEngineDouble();
  const page = await HomePage();

  render(
    <>
      <SceneViewport
        engineFactory={() => engine}
        resolveCapability={options.resolveCapability ?? createLiveCapability}
      />
      <AppShell>{page as ReactElement}</AppShell>
    </>,
  );

  return { engine };
}

beforeEach(() => {
  resetHomeSceneController();
  headersMock.mockResolvedValue(
    createRequestHeaders({
      "sec-ch-ua-mobile": "?0",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    }),
  );
});

describe("HomePage", () => {
  it("routes mobile requests into the stacked mobile shell with direct blog and author links", async () => {
    headersMock.mockResolvedValue(
      createRequestHeaders({
        "sec-ch-ua-mobile": "?1",
        "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      }),
    );

    render(await HomePage());

    const mobileMain = screen.getByRole("main", {
      name: /mobile homepage editorial shell/i,
    });
    const sectionNav = within(mobileMain).getByRole("navigation", {
      name: /mobile homepage sections/i,
    });

    expect(mobileMain).toHaveAttribute("data-mobile-home-layout", "stacked");
    expect(within(sectionNav).getByRole("link", { name: "博客" })).toHaveAttribute(
      "href",
      "#selected-writing",
    );
    expect(within(sectionNav).getByRole("link", { name: "作者" })).toHaveAttribute(
      "href",
      "#author-profile",
    );
    expect(
      screen.queryByRole("main", {
        name: /^homepage editorial shell$/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("keeps ordinary taps on the stacked mobile homepage from entering cube focus", async () => {
    headersMock.mockResolvedValue(
      createRequestHeaders({
        "sec-ch-ua-mobile": "?1",
        "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      }),
    );

    const { engine } = await renderComposedHomeShell();

    const heroHeading = screen.getByRole("heading", {
      name: /woodfish immersive notes/i,
    });
    const sceneHost = document.querySelector("[data-scene-host='persistent']");

    engine.hitTestCube.mockReturnValue(true);

    fireEvent.pointerDown(heroHeading, {
      clientX: 260,
      clientY: 160,
      pointerId: 31,
    });
    fireEvent.pointerUp(heroHeading, {
      clientX: 260,
      clientY: 160,
      pointerId: 31,
    });

    await waitFor(() => {
      expect(sceneHost).toHaveAttribute("data-scene-mode", "home-hero");
    });

    expect(screen.queryByRole("button", { name: /exit focus/i })).not.toBeInTheDocument();
    expect(engine.stepCube).not.toHaveBeenCalled();
  });

  it("keeps desktop requests on the immersive homepage shell", async () => {
    render(await HomePage());

    expect(
      screen.getByRole("main", {
        name: /homepage editorial shell/i,
      }),
    ).toHaveAttribute("data-home-mode", "home-hero");
    expect(
      screen.queryByRole("main", {
        name: /mobile homepage editorial shell/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("renders the editorial shell with labeled blog metadata and restrained author profile", async () => {
    const data = await getHomeData();

    render(await HomePage());

    const homeMain = screen.getByRole("main");
    const panelRail = screen.getByLabelText(/homepage overview panels/i);

    expect(homeMain).toHaveAttribute("data-home-mode", "home-hero");
    expect(homeMain).toHaveAccessibleName(/homepage editorial shell/i);
    expect(panelRail).toHaveAttribute("data-home-visibility", "tucked");

    expect(
      screen.getByRole("heading", {
        name: /woodfish immersive notes/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /selected writing/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /author profile/i })).toBeInTheDocument();

    const firstCard = screen.getByRole("article", {
      name: new RegExp(data.posts[0].title, "i"),
    });
    const firstCardMetadata = firstCard.querySelector(".post-card__meta");
    const firstCardTaxonomy = within(firstCard).getByLabelText(`${data.posts[0].title} taxonomy`);

    expect(firstCardMetadata).not.toBeNull();
    expect(firstCardMetadata).toHaveTextContent(data.posts[0].publishedLabel);
    expect(firstCardMetadata).toHaveTextContent(data.posts[0].categories[0]);
    expect(firstCardTaxonomy).toHaveTextContent(data.posts[0].categories[0]);
    expect(firstCardTaxonomy).toHaveTextContent(data.posts[0].tags[0]);
    expect(within(firstCard).queryByText("Published")).not.toBeInTheDocument();
    expect(within(firstCard).queryByText("Taxonomy")).not.toBeInTheDocument();

    const authorPanel = screen.getByRole("region", { name: /author profile/i });
    expect(
      within(authorPanel).getByRole("img", { name: new RegExp(`${data.author.displayName} portrait`) }),
    ).toBeInTheDocument();
    expect(within(authorPanel).getByText(data.author.location ?? "China")).toBeInTheDocument();
    expect(within(authorPanel).getByText(data.author.occupation ?? "Student")).toBeInTheDocument();
    expect(
      within(authorPanel).getByText([data.author.university, data.author.major].filter(Boolean).join(" · ")),
    ).toBeInTheDocument();
  });

  it("keeps nav, homepage shell, and scene host subscribed to one home state source", async () => {
    const { engine } = await renderComposedHomeShell();

    const homeMain = screen.getByRole("main", {
      name: /homepage editorial shell/i,
    });
    const sceneHost = document.querySelector("[data-scene-host='persistent']");

    expect(homeMain).toHaveAttribute("data-home-mode", "home-hero");
    expect(sceneHost).toHaveAttribute("data-scene-mode", "home-hero");
    expect(sceneHost).toHaveAttribute("data-scene-renderer", "live");
    expect(sceneHost).toHaveAttribute("data-scene-budget-state", "home");
    expect(sceneHost).toHaveAttribute("data-scene-budget-tier", "desktop-default");

    fireEvent.click(screen.getByRole("button", { name: "博客" }));

    expect(homeMain).toHaveAttribute("data-home-mode", "home-blog");
    expect(homeMain).toHaveAttribute("data-home-visibility", "visible");
    expect(sceneHost).toHaveAttribute("data-scene-mode", "home-blog");
    expect(engine.stepCube).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "作者" }));

    expect(homeMain).toHaveAttribute("data-home-mode", "home-author");
    expect(sceneHost).toHaveAttribute("data-scene-mode", "home-author");
    expect(engine.stepCube).not.toHaveBeenCalled();
  });

  it("snaps between hero, blog, and author on desktop wheel input", async () => {
    const { engine } = await renderComposedHomeShell();

    const homeMain = screen.getByRole("main", {
      name: /homepage editorial shell/i,
    });
    const sceneHost = document.querySelector("[data-scene-host='persistent']");

    fireEvent.wheel(homeMain, { deltaY: 140 });

    expect(homeMain).toHaveAttribute("data-home-mode", "home-blog");
    expect(sceneHost).toHaveAttribute("data-scene-mode", "home-blog");

    fireEvent.wheel(homeMain, { deltaY: 140 });

    expect(homeMain).toHaveAttribute("data-home-mode", "home-author");
    expect(sceneHost).toHaveAttribute("data-scene-mode", "home-author");

    fireEvent.wheel(homeMain, { deltaY: -140 });

    expect(homeMain).toHaveAttribute("data-home-mode", "home-blog");
    expect(sceneHost).toHaveAttribute("data-scene-mode", "home-blog");
    expect(engine.stepCube).toHaveBeenCalledTimes(3);
  });

  it("registers a non-passive wheel listener for root homepage snapping", async () => {
    const addEventListener = vi.spyOn(HTMLElement.prototype, "addEventListener");

    await renderComposedHomeShell();

    expect(addEventListener).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function),
      expect.objectContaining({ passive: false }),
    );
  });

  it("hands wheel ownership back to the scene only when a panel reaches the relevant scroll boundary", async () => {
    const { engine } = await renderComposedHomeShell();

    fireEvent.click(screen.getByRole("button", { name: "博客" }));

    const homeMain = screen.getByRole("main", {
      name: /homepage editorial shell/i,
    });
    const blogPanel = screen.getByRole("region", { name: /selected writing/i });

    Object.defineProperty(blogPanel, "clientHeight", {
      configurable: true,
      value: 240,
    });
    Object.defineProperty(blogPanel, "scrollHeight", {
      configurable: true,
      value: 720,
    });
    Object.defineProperty(blogPanel, "scrollTop", {
      configurable: true,
      writable: true,
      value: 180,
    });

    fireEvent.wheel(blogPanel, { deltaY: 120 });

    expect(homeMain).toHaveAttribute("data-home-mode", "home-blog");
    expect(engine.stepCube).not.toHaveBeenCalled();

    Object.defineProperty(blogPanel, "scrollTop", {
      configurable: true,
      writable: true,
      value: 480,
    });

    fireEvent.wheel(blogPanel, { deltaY: 120 });

    expect(homeMain).toHaveAttribute("data-home-mode", "home-author");
    expect(engine.stepCube).toHaveBeenCalledTimes(1);
  });

  it("hides the home panels in focus mode and lets the close affordance restore the previous home state", async () => {
    const { engine } = await renderComposedHomeShell();

    fireEvent.click(screen.getByRole("button", { name: "作者" }));

    const homeMain = screen.getByRole("main", {
      name: /homepage editorial shell/i,
    });
    const panelRail = screen.getByLabelText(/homepage overview panels/i);
    const sceneHost = document.querySelector("[data-scene-host='persistent']");

    engine.hitTestCube.mockReturnValue(true);

    fireEvent.pointerDown(sceneHost as HTMLElement, {
      clientX: 320,
      clientY: 240,
      pointerId: 14,
    });
    fireEvent.pointerUp(sceneHost as HTMLElement, {
      clientX: 320,
      clientY: 240,
      pointerId: 14,
    });

    expect(sceneHost).toHaveAttribute("data-scene-mode", "home-cube-focus");
    expect(homeMain).toHaveAttribute("data-scene-mode", "home-cube-focus");
    expect(panelRail).toHaveAttribute("data-home-visibility", "hidden");
    expect(screen.getByRole("button", { name: /exit focus/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /exit focus/i }));

    expect(sceneHost).toHaveAttribute("data-scene-mode", "home-author");
    expect(homeMain).toHaveAttribute("data-scene-mode", "home-author");
    expect(panelRail).toHaveAttribute("data-home-visibility", "visible");
  });

  it("keeps post-link text-node clicks owned by UI even when scene hit-testing says the cube is nearby", async () => {
    const { engine } = await renderComposedHomeShell();

    fireEvent.click(screen.getByRole("button", { name: "博客" }));

    const homeMain = screen.getByRole("main", {
      name: /homepage editorial shell/i,
    });
    const sceneHost = document.querySelector("[data-scene-host='persistent']");
    const firstPostLink = screen.getByRole("link", {
      name: /javascript 学习笔记（1）：基础语法与数据类型/i,
    });
    const firstPostTextNode = firstPostLink.firstChild;

    expect(firstPostTextNode).not.toBeNull();

    engine.hitTestCube.mockReturnValue(true);

    fireEvent.pointerDown(firstPostTextNode as ChildNode, {
      clientX: 860,
      clientY: 600,
      pointerId: 22,
    });
    fireEvent.pointerUp(firstPostTextNode as ChildNode, {
      clientX: 860,
      clientY: 600,
      pointerId: 22,
    });

    expect(homeMain).toHaveAttribute("data-scene-mode", "home-blog");
    expect(sceneHost).toHaveAttribute("data-scene-mode", "home-blog");
    expect(engine.stepCube).not.toHaveBeenCalled();
  });

  it("enters focus when the visible cube is clicked through the hero overlay in the live homepage layout", async () => {
    const { engine } = await renderComposedHomeShell();

    const heroHeading = screen.getByRole("heading", {
      name: /woodfish immersive notes/i,
    });
    const sceneHost = document.querySelector("[data-scene-host='persistent']");

    engine.hitTestCube.mockReturnValue(true);

    fireEvent.pointerDown(heroHeading, {
      clientX: 512,
      clientY: 310,
      pointerId: 21,
    });
    fireEvent.pointerUp(heroHeading, {
      clientX: 512,
      clientY: 310,
      pointerId: 21,
    });

    expect(sceneHost).toHaveAttribute("data-scene-mode", "home-cube-focus");
  });
});

describe("PostCard", () => {
  it("falls back gracefully when optional excerpt and taxonomy metadata are missing", () => {
    render(
      <PostCard
        post={{
          slug: "fallback-post",
          title: "Fallback Post",
          excerpt: "",
          publishedAt: "2026-01-01",
          publishedLabel: "January 1, 2026",
          categories: [],
          tags: [],
        }}
      />,
    );

    const card = screen.getByRole("article", { name: /fallback post/i });
    const metadata = card.querySelector(".post-card__meta");
    const taxonomy = within(card).getByLabelText("Fallback Post taxonomy");

    expect(metadata).not.toBeNull();
    expect(metadata).toHaveTextContent("January 1, 2026");
    expect(metadata).toHaveTextContent("Notes");
    expect(taxonomy).toHaveTextContent("Notes");
    expect(within(card).getByText(/excerpt unavailable/i)).toBeInTheDocument();
    expect(within(card).queryByText("Published")).not.toBeInTheDocument();
    expect(within(card).queryByText("Taxonomy")).not.toBeInTheDocument();
  });
});

describe("NavBar", () => {
  it("renders the woodfish navigation labels", () => {
    render(<NavBar activeMode="home-hero" />);

    expect(screen.getByText("WOODFISH")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "博客" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "作者" })).toBeInTheDocument();
  });

  it("announces the active desktop section with pressed-button semantics", () => {
    render(<NavBar activeMode="home-blog" />);

    expect(screen.getByRole("button", { name: "博客" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "作者" })).toHaveAttribute("aria-pressed", "false");
  });

  it("switches into direct section links when the stacked mobile home is present", async () => {
    render(
      <>
        <NavBar activeMode="home-hero" />
        <main aria-label="Mobile homepage editorial shell" data-mobile-home-layout="stacked" />
      </>,
    );

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "博客" })).toHaveAttribute(
        "href",
        "#selected-writing",
      );
    });

    expect(screen.getByRole("link", { name: "作者" })).toHaveAttribute(
      "href",
      "#author-profile",
    );
    expect(screen.queryByRole("button", { name: "博客" })).not.toBeInTheDocument();
  });

  it("announces the active stacked-mobile section with current-link semantics", async () => {
    render(
      <>
        <NavBar activeMode="home-author" />
        <main aria-label="Mobile homepage editorial shell" data-mobile-home-layout="stacked" />
      </>,
    );

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "作者" })).toHaveAttribute(
        "aria-current",
        "location",
      );
    });

    expect(screen.getByRole("link", { name: "博客" })).not.toHaveAttribute("aria-current");
  });
});

describe("SceneViewport", () => {
  it("renders the persistent scene host with fallback markers when WebGL capability is unavailable", () => {
    const engineFactory = vi.fn(() => ({
      applyState: vi.fn(),
      dispose: vi.fn(),
      hitTestCube: vi.fn(() => false),
      mount: vi.fn(),
      resize: vi.fn(),
      setBudget: vi.fn(),
      setFocusDragOffset: vi.fn(),
      setReducedMotion: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      stepCube: vi.fn(),
    }));

    render(<SceneViewport engineFactory={engineFactory} />);

    const host = document.querySelector("[data-scene-host='persistent']");

    expect(host).not.toBeNull();
    expect(host).toHaveAttribute("data-scene-renderer", "fallback");
    expect(host).toHaveAttribute("data-scene-budget-state", "home");
    expect(host).toHaveAttribute("data-scene-budget-tier", "desktop-default");
    expect(document.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(0);
    expect(screen.getByTestId("scene-static-backdrop")).toBeInTheDocument();
  });
});
