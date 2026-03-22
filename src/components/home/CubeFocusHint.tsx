import type { HomeDisplayMode } from "@/lib/scene/state-types";

type CubeFocusHintProps = {
  onExit: () => void;
  previousMode: HomeDisplayMode;
};

const previousModeLabels: Record<HomeDisplayMode, string> = {
  "home-author": "author overview",
  "home-blog": "blog overview",
  "home-hero": "hero overview",
};

export function CubeFocusHint({ onExit, previousMode }: CubeFocusHintProps) {
  return (
    <aside
      aria-label="Cube focus controls"
      className="cube-focus-hint shell-panel"
      data-scene-interaction-block="true"
    >
      <p className="shell-panel__label">Cube focus</p>
      <p className="cube-focus-hint__title">Drag the scene to shift the camera around the cube.</p>
      <p className="shell-panel__body">
        Tap the cube for a discrete step, or return to the {previousModeLabels[previousMode]} when
        you are ready to leave focus mode.
      </p>
      <p className="cube-focus-hint__return">Returns to {previousModeLabels[previousMode]}.</p>
      <div className="cube-focus-hint__actions">
        <button className="cube-focus-hint__close" type="button" onClick={onExit}>
          Exit focus
        </button>
        <span className="cube-focus-hint__escape">Esc</span>
      </div>
    </aside>
  );
}
