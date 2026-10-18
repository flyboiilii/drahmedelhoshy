"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { sceneStore, useSceneActive } from "@/lib/scene-store";

function InvalidateBridge() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    sceneStore.setInvalidate(invalidate);
    const on = () => invalidate();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    invalidate();
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      sceneStore.setInvalidate(null);
    };
  }, [invalidate]);
  return null;
}

/**
 * Fixed, transparent, pointer-transparent canvas covering the viewport.
 * frameloop="demand": frames are requested by scroll, resize and the GSAP scrub.
 */
export default function RootCanvas() {
  // Continuous frames only while a sequence is on screen; on demand otherwise.
  const active = useSceneActive();
  return (
    <Canvas
      frameloop={active ? "always" : "demand"}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
        gl.setClearColor(0x000000, 0);
      }}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 20 }}
      aria-hidden="true"
    >
      <InvalidateBridge />
      <View.Port />
    </Canvas>
  );
}
