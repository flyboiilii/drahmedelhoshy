"use client";

import { Suspense, useEffect, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import { PerspectiveCamera, View } from "@react-three/drei";
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
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
    const t = window.setTimeout(() => invalidate(), 250);
    return () => window.clearTimeout(t);
  }, [invalidate]);
  return null;
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#fbf8f3", "#d9cfc2", 0.5]} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#f4ead9" />
      <directionalLight position={[0, 3, -4]} intensity={0.35} />
    </>
  );
}

/**
 * A drei View. Outside the Canvas, View renders a div and the root canvas
 * draws into that div's rectangle, so this element is positioned to fill the
 * poster box it is rendered in. Each sequence picks the GLB version when
 * content/models.json says the file exists, else the procedural stand-in.
 */
export function SequenceView({ kind, progress }: { kind: SequenceKind; progress: ProgressRef }) {
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
      </Suspense>
    </View>
  );
}
