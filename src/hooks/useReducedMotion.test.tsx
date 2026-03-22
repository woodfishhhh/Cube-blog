import { render, screen, waitFor } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useReducedMotion } from "@/hooks/useReducedMotion";

type MatchMediaChangeListener = (event: MediaQueryListEvent) => void;

function createMatchMediaController(initialMatches: boolean) {
  const listeners = new Set<MatchMediaChangeListener>();
  let matches = initialMatches;

  const matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: (_event: string, listener: MatchMediaChangeListener) => {
      listeners.add(listener);
    },
    removeEventListener: (_event: string, listener: MatchMediaChangeListener) => {
      listeners.delete(listener);
    },
    dispatchEvent: () => true,
  }));

  return {
    matchMedia,
    setMatches(nextMatches: boolean) {
      matches = nextMatches;

      for (const listener of listeners) {
        listener({ matches } as MediaQueryListEvent);
      }
    },
  };
}

function ReducedMotionProbe() {
  const prefersReducedMotion = useReducedMotion();

  return <span data-testid="reduced-motion-state">{String(prefersReducedMotion)}</span>;
}

describe("useReducedMotion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("tracks prefers-reduced-motion changes through one hook boundary", async () => {
    const mediaQuery = createMatchMediaController(false);

    vi.stubGlobal("matchMedia", mediaQuery.matchMedia);

    render(<ReducedMotionProbe />);

    expect(screen.getByTestId("reduced-motion-state")).toHaveTextContent("false");

    mediaQuery.setMatches(true);

    await waitFor(() => {
      expect(screen.getByTestId("reduced-motion-state")).toHaveTextContent("true");
    });
  });

  it("keeps the first client render aligned with server HTML before reduced motion activates", async () => {
    const mediaQuery = createMatchMediaController(true);
    const serverHtml = renderToString(<ReducedMotionProbe />);
    const container = document.createElement("div");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.stubGlobal("matchMedia", mediaQuery.matchMedia);
    container.innerHTML = serverHtml;

    hydrateRoot(container, <ReducedMotionProbe />);

    expect(container.querySelector("[data-testid='reduced-motion-state']")?.textContent).toBe("false");

    await waitFor(() => {
      expect(container.querySelector("[data-testid='reduced-motion-state']")?.textContent).toBe("true");
    });

    expect(consoleError).not.toHaveBeenCalled();
  });
});
