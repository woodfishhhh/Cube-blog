// @ts-nocheck
"use client";

import React, { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, OrbitControls } from "@react-three/drei";
import { Hypercube } from "./Hypercube";
import { StarField } from "./StarField";
import { useStore } from "@/store/store";
import * as THREE from "three";

function CameraRig() {
  const { camera } = useThree();
  const mode = useStore((state) => state.mode);
  const isFocusing = useStore((state) => state.isFocusing);
  const smoothedPointer = React.useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    // If we are in focus mode, DO NOT force the camera back to a hardcoded position!
    // The OrbitControls will handle camera position and rotation.
    if (isFocusing) return;

    // Smooth camera movement
    const targetPos = new THREE.Vector3(0, 0, 10);
    const targetLook = new THREE.Vector3(0, 0, 0);

    if (mode === "home") targetPos.set(0, 0, 10);
    if (mode === "blog") targetPos.set(0, 0, 12);
    if (mode === "author") targetPos.set(0, 0, 12);
    if (mode === "friend") targetPos.set(0, 0, 12);
    if (mode === "reading") targetPos.set(0, 0, 15); // Pull back

    // Gentle parallax sway so the camera follows pointer with subtle motion.
    smoothedPointer.current.lerp(state.pointer, 2.2 * delta);
    targetPos.x += smoothedPointer.current.x * 0.45;
    targetPos.y += smoothedPointer.current.y * 0.25;
    targetLook.x += smoothedPointer.current.x * 0.65;
    targetLook.y += smoothedPointer.current.y * 0.35;

    // Also look at origin so it lerps nicely back if we rotated
    const lookAtVec = new THREE.Vector3();
    camera.getWorldDirection(lookAtVec);
    lookAtVec.add(camera.position);
    lookAtVec.lerp(targetLook, 2 * delta);
    camera.lookAt(lookAtVec);

    camera.position.lerp(targetPos, 2 * delta);
  });
  return null;
}

export default function ThreeScene() {
  const isFocusing = useStore((state) => state.isFocusing);
  const triggerStep = useStore((state) => state.triggerStep);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    if (!isFocusing) {
      setIsDragging(false);
      return;
    }

    const handlePointerUp = () => setIsDragging(false);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isFocusing]);

  return (
    <div
      className={`absolute inset-0 z-0 bg-[#050510] ${isFocusing ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
      onPointerDown={() => {
        if (isFocusing) setIsDragging(true);
      }}
      onPointerLeave={() => setIsDragging(false)}
      onClick={() => triggerStep()} // Click background to rotate cube
    >
      <Canvas gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
        <color attach="background" args={["#050510"]} />

        <Suspense fallback={null}>
          <CameraRig />
          <StarField />

          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, -10, -10]} intensity={0.5} />

          <Hypercube />
        </Suspense>

        {isFocusing && (
          <OrbitControls
            makeDefault
            enableZoom={true}
            enablePan={false}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
            maxDistance={15}
          />
        )}
        <Preload all />
      </Canvas>
    </div>
  );
}
