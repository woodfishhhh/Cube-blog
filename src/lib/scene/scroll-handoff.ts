import type { ScrollBoundary, WheelDirection } from "@/lib/scene/state-types";

const scrollPanelSelector = "[data-home-scroll-panel='true']";

export function findScrollPanel(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest<HTMLElement>(scrollPanelSelector);
}

export function resolveScrollBoundary(
  panel: HTMLElement,
  direction: WheelDirection,
): ScrollBoundary {
  const maxScrollTop = Math.max(0, panel.scrollHeight - panel.clientHeight);

  if (maxScrollTop <= 0) {
    return direction === "forward" ? "end" : "start";
  }

  if (panel.scrollTop <= 0) {
    return "start";
  }

  if (panel.scrollTop >= maxScrollTop) {
    return "end";
  }

  return "middle";
}
