import { describe, expect, it, vi } from "vitest";

import { resolveWebGLCapability } from "@/lib/scene/webgl-capability";

describe("resolveWebGLCapability", () => {
  it("reports available when a supported WebGL context is created", () => {
    const canvas = document.createElement("canvas");
    const getContext = vi.fn((contextName: string) =>
      contextName === "webgl" ? ({} as WebGLRenderingContext) : null,
    );

    vi.spyOn(canvas, "getContext").mockImplementation(getContext);

    const documentRef = {
      createElement: () => canvas,
    } as unknown as Document;

    expect(resolveWebGLCapability({ document: documentRef })).toEqual({
      isAvailable: true,
      reason: "available",
    });
    expect(getContext).toHaveBeenNthCalledWith(1, "webgl2");
    expect(getContext).toHaveBeenNthCalledWith(2, "webgl");
  });

  it("reports unavailable when document access is not available", () => {
    vi.stubGlobal("document", undefined);

    try {
      expect(resolveWebGLCapability()).toEqual({
        isAvailable: false,
        reason: "document-unavailable",
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("reports unavailable when createElement does not return a canvas", () => {
    const documentRef = {
      createElement: () => document.createElement("div"),
    } as unknown as Document;

    expect(resolveWebGLCapability({ document: documentRef })).toEqual({
      isAvailable: false,
      reason: "canvas-unavailable",
    });
  });

  it("reports unavailable when no WebGL context can be created", () => {
    const canvas = document.createElement("canvas");
    const getContext = vi.fn(() => null);

    vi.spyOn(canvas, "getContext").mockImplementation(getContext);

    const documentRef = {
      createElement: () => canvas,
    } as unknown as Document;

    expect(resolveWebGLCapability({ document: documentRef })).toEqual({
      isAvailable: false,
      reason: "webgl-context-unavailable",
    });
  });
});
