declare module "three" {
  export class Object3D {
    children: Object3D[];
    parent: Object3D | null;
    position: Vector3;
    rotation: Euler;
    add(...objects: Object3D[]): this;
    lookAt(target: Vector3): void;
    remove(...objects: Object3D[]): this;
    removeFromParent(): this;
    traverse(callback: (object: Object3D) => void): void;
  }

  export class Scene extends Object3D {}

  export class Euler {
    x: number;
    y: number;
    z: number;
  }

  export class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    clone(): Vector3;
    copy(vector: Vector3): this;
    set(x: number, y: number, z: number): this;
    toArray(): number[];
  }

  export class Vector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
  }

  export class Color {
    constructor(value?: number | string);
    getHexString(): string;
  }

  export class PerspectiveCamera extends Object3D {
    aspect: number;
    position: Vector3;
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    updateProjectionMatrix(): void;
  }

  export class Raycaster {
    setFromCamera(coords: Vector2, camera: PerspectiveCamera): void;
    intersectObject(object: Object3D, recursive?: boolean): Array<{ object: Object3D }>;
  }

  export class Texture {
    dispose(): void;
  }

  export class Material {
    dispose(): void;
  }

  export class BufferAttribute {
    count: number;
    constructor(array: ArrayLike<number>, itemSize: number);
  }

  export class BufferGeometry {
    dispose(): void;
    getAttribute(name: string): BufferAttribute;
    setAttribute(name: string, attribute: BufferAttribute): this;
  }

  export class BoxGeometry extends BufferGeometry {
    constructor(width?: number, height?: number, depth?: number);
  }

  export class EdgesGeometry extends BufferGeometry {
    constructor(geometry?: BufferGeometry);
  }

  export class MeshBasicMaterial extends Material {
    constructor(parameters?: {
      color?: number | string;
      opacity?: number;
      transparent?: boolean;
    });
  }

  export class LineBasicMaterial extends Material {
    constructor(parameters?: {
      color?: number | string;
      opacity?: number;
      transparent?: boolean;
    });
  }

  export class PointsMaterial extends Material {
    color: Color;
    constructor(parameters?: {
      color?: number | string;
      depthWrite?: boolean;
      opacity?: number;
      size?: number;
      sizeAttenuation?: boolean;
      transparent?: boolean;
    });
  }

  export class Mesh<
    TGeometry extends BufferGeometry = BufferGeometry,
    TMaterial extends Material = Material,
  > extends Object3D {
    geometry: TGeometry;
    material: TMaterial;
    constructor(geometry?: TGeometry, material?: TMaterial);
  }

  export class LineSegments<
    TGeometry extends BufferGeometry = BufferGeometry,
    TMaterial extends Material = Material,
  > extends Object3D {
    geometry: TGeometry;
    material: TMaterial;
    constructor(geometry?: TGeometry, material?: TMaterial);
  }

  export class Points<
    TGeometry extends BufferGeometry = BufferGeometry,
    TMaterial extends Material = Material,
  > extends Object3D {
    geometry: TGeometry;
    material: TMaterial;
    constructor(geometry?: TGeometry, material?: TMaterial);
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
