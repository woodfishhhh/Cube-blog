export type NormalizedPointerState = {
  x: number;
  y: number;
};

type PointerEventLike = {
  clientX: number;
  clientY: number;
};

type PointerViewportLike = {
  innerHeight: number;
  innerWidth: number;
};

type PointerTargetLike = PointerViewportLike & {
  addEventListener: (
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions,
  ) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
};

type CreatePointerTrackerOptions = {
  eventName?: string;
  target?: PointerTargetLike;
};

export type PointerTracker = {
  dispose: () => void;
  state: NormalizedPointerState;
  update: (event: PointerEventLike) => void;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function normalizePointerPosition(
  event: PointerEventLike,
  viewport: PointerViewportLike,
): NormalizedPointerState {
  const width = Math.max(1, viewport.innerWidth);
  const height = Math.max(1, viewport.innerHeight);

  return {
    x: clamp((event.clientX / width) * 2 - 1, -1, 1),
    y: clamp(1 - (event.clientY / height) * 2, -1, 1),
  };
}

export function createPointerTracker({
  eventName = "pointermove",
  target = window,
}: CreatePointerTrackerOptions = {}): PointerTracker {
  const state: NormalizedPointerState = { x: 0, y: 0 };

  const update = (event: PointerEventLike) => {
    const next = normalizePointerPosition(event, target);

    state.x = next.x;
    state.y = next.y;
  };

  const handleEvent: EventListener = (event) => {
    update(event as unknown as PointerEventLike);
  };

  target.addEventListener(eventName, handleEvent, { passive: true });

  return {
    dispose() {
      target.removeEventListener(eventName, handleEvent);
    },
    state,
    update,
  };
}
