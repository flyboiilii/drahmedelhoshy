"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useClinicGltf } from "../useClinicGltf";
import { DoubleSide, Group, Mesh, MeshStandardMaterial, Plane, Vector3 } from "three";
import type { ProgressRef } from "../SequenceView";
import { COLORS, crownGeometry } from "@/lib/three/tooth";
import { lerp, range, smooth, TWO_PI } from "@/lib/three/motion";

/**
 * Choreography (progress 0 to 1):
 * 0.00 to 0.25  bone block, clipping plane reveals the cross-section
 * 0.25 to 0.55  fixture screws down, four turns bound to progress
 * 0.55 to 0.75  abutment seats
 * 0.75 to 1.00  crown lowers and seats
 */
export function ImplantSequence({ progress, glb }: { progress: ProgressRef; glb: boolean }) {
  return glb ? <ImplantGlb progress={progress} /> : <ImplantProcedural progress={progress} />;
}

const FIXTURE_TOP = 1.9;
const FIXTURE_SEATED = -0.3;
const ABUTMENT_TOP = 1.7;
const ABUTMENT_SEATED = 0.36;
const CROWN_TOP = 2.2;
const CROWN_SEATED = 0.78;

function ImplantProcedural({ progress }: { progress: ProgressRef }) {
  const fixture = useRef<Group>(null);
  const abutment = useRef<Mesh>(null);
  const crown = useRef<Mesh>(null);
  const plane = useMemo(() => new Plane(new Vector3(0, 0, -1), 0.8), []);
  const boneMat = useMemo(() => new MeshStandardMaterial({ color: COLORS.bone, roughness: 0.9, side: DoubleSide, clippingPlanes: [plane] }), [plane]);
  const gumMat = useMemo(() => new MeshStandardMaterial({ color: COLORS.gum, roughness: 0.7, side: DoubleSide, clippingPlanes: [plane] }), [plane]);
  const metalMat = useMemo(() => new MeshStandardMaterial({ color: COLORS.metal, metalness: 0.9, roughness: 0.35 }), []);
  const crownGeo = useMemo(() => crownGeometry(36), []);

  useFrame(() => {
    const p = progress.current ?? 0;
    // 1. reveal the cross-section: plane constant from 0.8 (nothing cut) to 0 (front half removed)
    plane.constant = lerp(0.8, 0, smooth(range(p, 0, 0.25)));

    // 2. fixture screws down with four turns
    if (fixture.current) {
      const t = smooth(range(p, 0.25, 0.55));
      fixture.current.position.y = lerp(FIXTURE_TOP, FIXTURE_SEATED, t);
      fixture.current.rotation.y = t * 4 * TWO_PI;
    }
    // 3. abutment seats
    if (abutment.current) {
      const t = smooth(range(p, 0.55, 0.75));
      abutment.current.position.y = lerp(ABUTMENT_TOP, ABUTMENT_SEATED, t);
      (abutment.current.material as MeshStandardMaterial).opacity = lerp(0, 1, range(p, 0.55, 0.6));
    }
    // 4. crown lowers
    if (crown.current) {
      const t = smooth(range(p, 0.75, 1));
      crown.current.position.y = lerp(CROWN_TOP, CROWN_SEATED, t);
      (crown.current.material as MeshStandardMaterial).opacity = lerp(0, 1, range(p, 0.75, 0.8));
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* bone */}
      <RoundedBox name="bone" args={[2.4, 1.5, 1.3]} radius={0.12} smoothness={4} position={[0, -0.45, 0]} material={boneMat} />
      {/* gum */}
      <RoundedBox name="gum" args={[2.4, 0.22, 1.3]} radius={0.06} smoothness={3} position={[0, 0.41, 0]} material={gumMat} />
      {/* fixture: tapered body + threads */}
      <group ref={fixture} name="fixture" position={[0, FIXTURE_TOP, 0]}>
        <mesh material={metalMat}>
          <cylinderGeometry args={[0.17, 0.1, 1.1, 28]} />
        </mesh>
        {[-0.4, -0.22, -0.04, 0.14, 0.32].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={metalMat}>
            <torusGeometry args={[0.15 - (0.32 - y) * 0.05, 0.022, 10, 32]} />
          </mesh>
        ))}
      </group>
      {/* abutment */}
      <mesh ref={abutment} name="abutment" position={[0, ABUTMENT_TOP, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.36, 24]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.85} roughness={0.4} transparent opacity={0} />
      </mesh>
      {/* crown */}
      <mesh ref={crown} name="crown" geometry={crownGeo} position={[0, CROWN_TOP, 0]} scale={[0.72, 0.62, 0.72]}>
        <meshStandardMaterial color={COLORS.ivory} roughness={0.35} transparent opacity={0} />
      </mesh>
    </group>
  );
}

/** GLB with nodes bone, gum, fixture, abutment, crown. */
function ImplantGlb({ progress }: { progress: ProgressRef }) {
  const { scene, nodes } = useClinicGltf("/models/implant.glb");
  const plane = useMemo(() => new Plane(new Vector3(0, 0, -1), 0.8), []);
  const base = useRef<Record<string, number>>({});

  useMemo(() => {
    for (const name of ["bone", "gum"]) {
      const n = nodes[name] as Mesh | undefined;
      const m = n?.material as MeshStandardMaterial | undefined;
      if (m) {
        m.clippingPlanes = [plane];
        m.side = DoubleSide;
      }
    }
  }, [nodes, plane]);

  useFrame(() => {
    const p = progress.current ?? 0;
    plane.constant = lerp(0.8, 0, smooth(range(p, 0, 0.25)));
    const move = (name: string, a: number, b: number, lift: number, turns = 0) => {
      const n = nodes[name] as Mesh | undefined;
      if (!n) return;
      if (base.current[name] === undefined) base.current[name] = n.position.y;
      const t = smooth(range(p, a, b));
      n.position.y = lerp(base.current[name] + lift, base.current[name], t);
      if (turns) n.rotation.y = t * turns * TWO_PI;
      n.visible = p >= a - 0.02;
    };
    move("fixture", 0.25, 0.55, 2.2, 4);
    move("abutment", 0.55, 0.75, 1.4);
    move("crown", 0.75, 1, 1.4);
  });

  return <primitive object={scene} />;
}
