import { describe, expect, it, vi } from "vitest";

function createPointerTarget(width = 1280, height = 720) {
  let listener: EventListener | null = null;

  return {
    addEventListener: vi.fn((type: string, nextListener: EventListener) => {
      if (type === "pointermove") {
        listener = nextListener;
      }
    }),
    dispatch(event: { clientX: number; clientY: number }) {
      listener?.(event as unknown as Event);
    },
    innerHeight: height,
    innerWidth: width,
    removeEventListener: vi.fn((type: string, nextListener: EventListener) => {
      if (type === "pointermove" && listener === nextListener) {
        listener = null;
      }
    }),
  };
}

describe("createPointerTracker", () => {
  it("normalizes pointer movement and removes the registered listener on dispose", async () => {
    const { createPointerTracker } = await import("@/lib/scene/modules/pointer");
    const target = createPointerTarget();
    const tracker = createPointerTracker({ target });

    expect(target.addEventListener).toHaveBeenCalledWith(
      "pointermove",
      expect.any(Function),
      { passive: true },
    );
    expect(tracker.state).toEqual({ x: 0, y: 0 });

    target.dispatch({ clientX: 1280, clientY: 0 });

    expect(tracker.state.x).toBeCloseTo(1);
    expect(tracker.state.y).toBeCloseTo(1);

    tracker.dispose();

    expect(target.removeEventListener).toHaveBeenCalledWith(
      "pointermove",
      expect.any(Function),
    );
  });
});
