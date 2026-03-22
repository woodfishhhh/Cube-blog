export type WebGLCapabilityReason =
  | "available"
  | "canvas-unavailable"
  | "document-unavailable"
  | "webgl-context-unavailable";

export type WebGLCapability = {
  isAvailable: boolean;
  reason: WebGLCapabilityReason;
};

type WebGLCapabilityOptions = {
  document?: Pick<Document, "createElement"> | undefined;
};

const availableCapability: WebGLCapability = {
  isAvailable: true,
  reason: "available",
};

export function resolveWebGLCapability(
  options: WebGLCapabilityOptions = {},
): WebGLCapability {
  const documentRef = options.document ?? globalThis.document;

  if (documentRef === undefined) {
    return {
      isAvailable: false,
      reason: "document-unavailable",
    };
  }

  const canvas = documentRef.createElement("canvas");

  if (!(canvas instanceof HTMLCanvasElement)) {
    return {
      isAvailable: false,
      reason: "canvas-unavailable",
    };
  }

  const contextNames: Array<"webgl2" | "webgl" | "experimental-webgl"> = [
    "webgl2",
    "webgl",
    "experimental-webgl",
  ];

  for (const contextName of contextNames) {
    const context = canvas.getContext(contextName);

    if (context !== null) {
      return availableCapability;
    }
  }

  return {
    isAvailable: false,
    reason: "webgl-context-unavailable",
  };
}
