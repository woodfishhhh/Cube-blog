import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SlideController } from "@/components/dom/SlideController";
import { useStore } from "@/store/store";

describe("SlideController", () => {
  beforeEach(() => {
    useStore.setState({
      mode: "blog",
      isFocusing: false,
      activePostId: null,
      cubeStep: 0,
    });
    document.body.innerHTML = "";
  });

  it("smoothly scrolls recent posts when the wheel event starts outside the list", () => {
    render(
      <SlideController>
        <div>content</div>
      </SlideController>,
    );

    const list = document.createElement("div");
    list.id = "post-list-container";
    list.scrollTop = 24;

    const scrollBy = vi.fn();
    Object.defineProperty(list, "scrollBy", {
      value: scrollBy,
      configurable: true,
    });

    document.body.appendChild(list);

    const outside = document.createElement("div");
    document.body.appendChild(outside);

    const event = new WheelEvent("wheel", { deltaY: 120 });
    Object.defineProperty(event, "composedPath", {
      value: () => [outside, document.body, document, window],
    });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(scrollBy).toHaveBeenCalledWith({ top: 120, behavior: "smooth" });
  });

  it("smoothly scrolls friend links in friend mode", () => {
    useStore.setState({
      mode: "friend",
      isFocusing: false,
      activePostId: null,
      cubeStep: 0,
    });

    render(
      <SlideController>
        <div>content</div>
      </SlideController>,
    );

    const friendLinks = document.createElement("div");
    friendLinks.id = "friend-links-container";

    const scrollBy = vi.fn();
    Object.defineProperty(friendLinks, "scrollBy", {
      value: scrollBy,
      configurable: true,
    });

    document.body.appendChild(friendLinks);

    const event = new WheelEvent("wheel", { deltaY: 96, cancelable: true });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(event.defaultPrevented).toBe(true);
    expect(scrollBy).toHaveBeenCalledWith({ top: 96, behavior: "smooth" });
  });
});
