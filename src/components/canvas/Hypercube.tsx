// @ts-nocheck
"use client";

import { useMemo, useRef, useState } from "react";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/store/store";

function generateHypercubeData() {
  const vertices = [];
  for (let i = 0; i < 16; i++) {
    const x = i & 1 ? 1 : -1;
    const y = i & 2 ? 1 : -1;
    const z = i & 4 ? 1 : -1;
    const w = i & 8 ? 1 : -1;
    vertices.push([x, y, z, w]);
  }

  const edges = [];
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 4; j++) {
      const neighbor = i ^ (1 << j);
      if (i < neighbor) {
        edges.push(i, neighbor);
      }
    }
  }

  return { vertices, edges };
}

export function Hypercube(props: any) {
  const { vertices, edges } = useMemo(() => generateHypercubeData(), []);
  const { camera, size } = useThree();

  const meshRef = useRef<any>(null);
  const lineRef = useRef<any>(null);
  const [focusRotation, setFocusRotation] = useState<[number, number, number]>([
    0.5,
    0.5,
    0,
  ]);

  // State from store
  const isFocusing = useStore((state) => state.isFocusing);
  const mode = useStore((state) => state.mode);
  const setFocusing = useStore((state) => state.setFocusing);

  const [hovered, setHover] = useState(false);

  const splitCenterOffset = useMemo(() => {
    if (size.width < 768) return 0;

    if (!(camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      return 3.25;
    }

    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    const distance = 12;
    const halfScreenCenterNdc = 0.5;
    const halfFovRad = THREE.MathUtils.degToRad(perspectiveCamera.fov / 2);

    return halfScreenCenterNdc * distance * Math.tan(halfFovRad) * aspect;
  }, [camera, size.width, size.height]);

  const inwardOffset = splitCenterOffset * 0.9;
  const isMobile = size.width < 768;

  const { position, rotation, scale } = useSpring({
    position: isFocusing
      ? [0, 0, 2]
      : mode === "home"
        ? [0, 0, 0]
        : mode === "blog"
          ? (isMobile ? [0, 3, 0] : [inwardOffset, 0, 0])
          : mode === "author"
            ? (isMobile ? [0, 3, 0] : [-inwardOffset, 0, 0])
            : mode === "friend"
              ? [0, 2.4, 0]
            : mode === "reading"
              ? (isMobile ? [0, 3.5, 0] : [5, 0, 0])
              : [0, 0, 0],
    rotation: isFocusing ? focusRotation : [0.5, 0.5, 0],
    scale: mode === "reading" ? 0.5 : (isMobile ? 0.75 : 1),
    config: { mass: 1, tension: 170, friction: 26 },
  });

  // 4D Rotation Angles
  const alphaRef = useRef(0);
  const betaRef = useRef(0);

  // Use geometry reference to update positions buffer
  const geomRef = useRef<any>(null);

  const indices = useMemo(() => new Uint16Array(edges), [edges]);
  const basePositions = useMemo(() => new Float32Array(16 * 3), []);

  useFrame((state, delta) => {
    // Increment 4D rotation angles
    alphaRef.current += delta * 0.5;
    betaRef.current += delta * 0.3;

    const alpha = alphaRef.current;
    const beta = betaRef.current;

    if (geomRef.current) {
      const positions = (geomRef.current as any).attributes.position.array;

      for (let i = 0; i < 16; i++) {
        const [x, y, z, w] = vertices[i];

        // Rotate in XY plane? No, let's rotate in XW and YW to make it look truly 4D
        // Rotation in XW
        const cosA = Math.cos(alpha);
        const sinA = Math.sin(alpha);
        const x1 = x * cosA - w * sinA;
        const w1 = x * sinA + w * cosA;

        // Rotation in ZW
        const cosB = Math.cos(beta);
        const sinB = Math.sin(beta);
        const z1 = z * cosB - w1 * sinB;
        const w2 = z * sinB + w1 * cosB;

        // Stereographic Projection exactly like shadow casting
        const distance = 2.5;
        const wZ = 1 / (distance - w2);

        // Scale up the hypercube by multiplying by 4
        positions[i * 3] = x1 * wZ * 4;
        positions[i * 3 + 1] = y * wZ * 4;
        positions[i * 3 + 2] = z1 * wZ * 4;
      }

      (geomRef.current as any).attributes.position.needsUpdate = true;
    }

    if (meshRef.current && !isFocusing) {
      // Also add some slow 3D rotation for extra vibe
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!isFocusing) {
      if (meshRef.current) {
        setFocusRotation([
          meshRef.current.rotation.x,
          meshRef.current.rotation.y,
          meshRef.current.rotation.z,
        ]);
      }
      useStore.getState().goHome();
      setFocusing(true);
    }
  };

  const AnimatedGroup = animated.group as any;

  return (
    <AnimatedGroup
      ref={meshRef}
      position={position as any}
      rotation={rotation as any}
      scale={scale as any}
      onClick={handleClick}
      onPointerOver={(e) => {
        if (e.pointerType === "mouse") {
          if (!isFocusing) {
            document.body.style.cursor = "pointer";
          }
          setHover(true);
        }
      }}
      onPointerOut={(e) => {
        if (e.pointerType === "mouse") {
          if (!isFocusing) {
            document.body.style.cursor = "auto";
          }
          setHover(false);
        }
      }}
      dispose={null}
      {...props}>
      {/* Invisible hit box for easier clicking */}
      <mesh visible={false}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial />
      </mesh>

      <lineSegments ref={lineRef}>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[basePositions, 3]}
            usage={THREE.DynamicDrawUsage as any}
          />
          <bufferAttribute attach="index" args={[indices, 1]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={hovered ? "#00ffff" : "#ffffff"}
          linewidth={2}
          transparent
          opacity={0.8}
        />
      </lineSegments>

      {/* Small nodes at vertices for styling */}
      {vertices.map((_, i) => (
        <PointNode key={i} index={i} geomRef={geomRef} hovered={hovered} />
      ))}
    </AnimatedGroup>
  );
}

function PointNode({
  index,
  geomRef,
  hovered,
}: {
  index: number;
  geomRef: React.RefObject<THREE.BufferGeometry | null>;
  hovered: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (geomRef.current && ref.current) {
      // @ts-expect-error
      const arr = geomRef.current.attributes.position.array;
      ref.current.position.set(
        arr[index * 3],
        arr[index * 3 + 1],
        arr[index * 3 + 2],
      );
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={hovered ? "#00ffff" : "#ffffff"} />
    </mesh>
  );
}
