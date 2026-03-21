declare module "three" {
  export class Object3D {
    traverse(callback: (object: Object3D) => void): void;
  }

  export class Scene extends Object3D {}

  export class Vector3 {
    x: number;
    y: number;
    z: number;
  }

  export class PerspectiveCamera extends Object3D {
    aspect: number;
    position: Vector3;
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    updateProjectionMatrix(): void;
  }

  export class Texture {
    dispose(): void;
  }

  export class WebGLRenderer {
    domElement: HTMLCanvasElement;
    constructor(parameters?: {
      alpha?: boolean;
      antialias?: boolean;
      canvas?: HTMLCanvasElement;
      powerPreference?: string;
    });
    dispose(): void;
    render(scene: Scene, camera: PerspectiveCamera): void;
    setPixelRatio(value: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
  }
}
