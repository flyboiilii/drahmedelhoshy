"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useClinicGltf } from "../useClinicGltf";
import { CatmullRomCurve3, DoubleSide, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Plane, TubeGeometry, Vector3 } from "three";
import type { ProgressRef } from "../SequenceView";
import { archSlots, COLORS, crownGeometry } from "@/lib/three/tooth";
import { easeOutBack, lerp, range, smooth } from "@/lib/three/motion";

/**
 * Choreography (progress 0 to 1):
 * 0.00 to 0.40  tray drops onto the arch and snaps (small overshoot, then settle)
 * 0.40 to 1.00  crowded arch morphs to aligned, month label 0 to 12
 */
export function AlignerSequence({ progress, glb }: { progress: ProgressRef; glb: boolean }) {
  return glb ? <AlignerGlb progress={progress} /> : <AlignerProcedural progress={progress} />;
}

const JITTER_ROT = [0.3, -0.24, 0.36, -0.3, 0.2, -0.26, 0.34, -0.22, 0.26, -0.32];
const JITTER_X = [0.05, -0.04, 0.06, -0.05, 0.03, -0.03, 0.05, -0.04, 0.04, -0.05];
const JITTER_Z = [0.08, -0.06, 0.09, -0.07, 0.05, -0.05, 0.08, -0.06, 0.06, -0.08];
const JITTER_TILT = [0.12, -0.1, 0.14, -0.12, 0.08, -0.09, 0.13, -0.1, 0.1, -0.12];
const TRAY_TOP = 1.5;

function AlignerProcedural({ progress }: { progress: ProgressRef }) {
  const teeth = useRef<(Mesh | null)[]>([]);
  const tray = useRef<Mesh>(null);
  const slots = useMemo(() => archSlots(10, 1.25), []);
  const geo = useMemo(() => crownGeometry(32), []);
  const toothMat = useMemo(() => new MeshStandardMaterial({ color: COLORS.ivory, roughness: 0.35 }), []);
  const clip = useMemo(() => new Plane(new Vector3(0, 1, 0), 0.06), []);
  const trayGeo = useMemo(() => {
    const pts = slots.map((s) => new Vector3(s.x, 0.08, s.z));
    const curve = new CatmullRomCurve3(pts, false, "catmullrom", 0.5);
    return new TubeGeometry(curve, 64, 0.32, 24, false);
  }, [slots]);
  const trayMat = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#ffffff",
        transmission: 0.9,
        thickness: 0.2,
        roughness: 0.05,
        ior: 1.45,
        transparent: true,
        opacity: 0.9,
        side: DoubleSide,
        clippingPlanes: [clip],
      }),
    [clip],
  );

  useFrame(() => {
    const p = progress.current ?? 0;
    // 1. tray drops and snaps
    if (tray.current) {
      const t = range(p, 0, 0.4);
      tray.current.position.y = lerp(TRAY_TOP, 0, easeOutBack(t, 1.2));
    }
    // 2. crowded -> aligned
    const align = smooth(range(p, 0.4, 1));
    teeth.current.forEach((m, i) => {
      if (!m) return;
      const s = slots[i];
      m.position.set(s.x + JITTER_X[i] * (1 - align), 0, s.z + JITTER_Z[i] * (1 - align));
      m.rotation.set(JITTER_TILT[i] * (1 - align), s.angle + JITTER_ROT[i] * (1 - align), 0);
    });
  });

  return (
    <group position={[0, 0, 0.1]}>
      {slots.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => {
            teeth.current[i] = el;
          }}
          geometry={geo}
          material={toothMat}
          position={[s.x, 0, s.z]}
          rotation={[0, s.angle, 0]}
          scale={[0.27, 0.3, 0.17]}
        />
      ))}
      <mesh ref={tray} name="tray" geometry={trayGeo} material={trayMat} position={[0, TRAY_TOP, 0]} />
    </group>
  );
}

/** GLB with node arch (morph targets m0, m6, m12) and tray. */
function AlignerGlb({ progress }: { progress: ProgressRef }) {
  const { scene, nodes } = useClinicGltf("/models/aligner.glb");
  const arch = nodes.arch as Mesh | undefined;
  const tray = nodes.tray as Mesh | undefined;
  const trayBase = useRef<number | null>(null);
  const group = useRef<Group>(null);

  useFrame(() => {
    const p = progress.current ?? 0;
    if (tray) {
      if (trayBase.current === null) trayBase.current = tray.position.y;
      tray.position.y = lerp(trayBase.current + TRAY_TOP, trayBase.current, easeOutBack(range(p, 0, 0.4), 1.2));
    }
    if (arch?.morphTargetInfluences && arch.morphTargetDictionary) {
      const dict = arch.morphTargetDictionary;
      const inf = arch.morphTargetInfluences;
      const m = smooth(range(p, 0.4, 1)) * 12;
      // m0 is the crowded base shape; blend through m6 to m12
      if (dict.m6 !== undefined) inf[dict.m6] = m <= 6 ? m / 6 : 1 - (m - 6) / 6;
      if (dict.m12 !== undefined) inf[dict.m12] = m <= 6 ? 0 : (m - 6) / 6;
    }
  });

  return <primitive ref={group} object={scene} />;
}
