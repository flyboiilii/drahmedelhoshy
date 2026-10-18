"use client";

import { Suspense, useEffect, type RefObject } from "react";
import { sceneStore } from "@/lib/scene-store";
import { Environment, PerspectiveCamera, View } from "@react-three/drei";
import { BackSide, DoubleSide } from "three";
import type { SequenceKind } from "@/lib/sequences";
import models from "@/content/models.json";
import { VeneerSequence } from "./sequences/VeneerSequence";
import { ImplantSequence } from "./sequences/ImplantSequence";
import { AlignerSequence } from "./sequences/AlignerSequence";
import { FullMouthSequence } from "./sequences/FullMouthSequence";

export type ProgressRef = RefObject<number>;

const CAMERA: Record<SequenceKind, { position: [number, number, number]; look: [number, number, number]; fov: number }> = {
  veneer: { position: [0.6, 0.5, 4.4], look: [0, 0, 0], fov: 28 },
  implant: { position: [0.3, 1.2, 4.6], look: [0, 0.3, 0], fov: 30 },
  aligner: { position: [0, 2.2, 4.0], look: [0, -0.1, 0], fov: 30 },
  fullmouth: { position: [0, 1.6, 4.2], look: [0, 0, 0], fov: 30 },
};

/** Requests one frame after mount so the view is not blank until the first scroll tick. */
function Wake() {
  // Root-level invalidate: a View portal's own invalidate does not reach the demand loop.
  useEffect(() => {
    sceneStore.invalidate();
    const t = window.setTimeout(() => sceneStore.invalidate(), 250);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}

/** Fires once the model (or the procedural stand-in) has mounted, i.e. the view is drawing. */
function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
    sceneStore.invalidate();
  }, [onReady]);
  return null;
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <hemisphereLight args={["#fbf8f3", "#d9cfc2", 0.25]} />
      <directionalLight position={[3, 5, 4]} intensity={1.3} />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#f4ead9" />
      <directionalLight position={[0, 3, -4]} intensity={0.35} />
      {/* A plain warm studio to reflect: with no environment, glossy porcelain and ceramic render grey. */}
      <Environment resolution={32} frames={1} environmentIntensity={0.35}>
        <mesh scale={50}>
          <sphereGeometry args={[1, 16, 8]} />
          <meshBasicMaterial color="#e4ddd1" side={BackSide} />
        </mesh>
        <mesh position={[0, 6, 5]} scale={[10, 5, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#ffffff" side={DoubleSide} />
        </mesh>
      </Environment>
    </>
  );
}

/**
 * A drei View. Outside the Canvas, View renders a div and the root canvas
 * draws into that div's rectangle, so this element is positioned to fill the
 * poster box it is rendered in. Each sequence picks the GLB version when
 * content/models.json says the file exists, else the procedural stand-in.
 */
export function SequenceView({ kind, progress, onReady }: { kind: SequenceKind; progress: ProgressRef; onReady?: () => void }) {
  const cam = CAMERA[kind];
  const hasGlb = models[kind];
  return (
    <View className="absolute inset-0" index={1}>
      <PerspectiveCamera makeDefault fov={cam.fov} position={cam.position} onUpdate={(c) => c.lookAt(...cam.look)} />
      <Lights />
      <Wake />
      <Suspense fallback={null}>
        {kind === "veneer" && <VeneerSequence progress={progress} glb={hasGlb} />}
        {kind === "implant" && <ImplantSequence progress={progress} glb={hasGlb} />}
        {kind === "aligner" && <AlignerSequence progress={progress} glb={hasGlb} />}
        {kind === "fullmouth" && <FullMouthSequence progress={progress} glb={hasGlb} />}
        <Ready onReady={onReady} />
      </Suspense>
    </View>
  );
}
