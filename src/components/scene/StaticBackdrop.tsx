import type { WebGLCapabilityReason } from "@/lib/scene/webgl-capability";

type StaticBackdropProps = {
  reason?: WebGLCapabilityReason;
};

export function StaticBackdrop({ reason }: StaticBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className="scene-layer__static-backdrop"
      data-scene-fallback-reason={reason}
      data-testid="scene-static-backdrop"
    >
      <div className="scene-layer__static-glow scene-layer__static-glow--primary" />
      <div className="scene-layer__static-glow scene-layer__static-glow--secondary" />
      <div className="scene-layer__static-vignette" />
    </div>
  );
}
