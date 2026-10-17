"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Group, Mesh, MeshStandardMaterial } from "three";
import type { ProgressRef } from "../SequenceView";
import { archSlots, COLORS, crownGeometry } from "@/lib/three/tooth";
import { lerp, range, smooth } from "@/lib/three/motion";

/**
 * Choreography (progress 0 to 1):
 * 0.00 to 0.60  old crowns replaced one by one, left to right
 * 0.60 to 1.00  bite height restores, the arch turns to show the profile
 */
export function FullMouthSequence({ progress, glb }: { progress: ProgressRef; glb: boolean }) {
  return glb ? <FullMouthGlb progress={progress} /> : <FullMouthProcedural progress={progress} />;
}

const OLD = [1, 3, 6, 8];
const WINDOW = 0.12;
const windowFor = (k: number) => 0.06 + k * 0.13;

function FullMouthProcedural({ progress }: { progress: ProgressRef }) {
  const group = useRef<Group>(null);
  const healthy = useRef<(Mesh | null)[]>([]);
  const olds = useRef<(Mesh | null)[]>([]);
  const news = useRef<(Mesh | null)[]>([]);
  const slots = useMemo(() => archSlots(10, 1.25), []);
  const geo = useMemo(() => crownGeometry(32), []);
  const ivory = useMemo(() => new MeshStandardMaterial({ color: COLORS.ivory, roughness: 0.35 }), []);

  useFrame(() => {
    const p = progress.current ?? 0;
    // 1. replace old crowns one by one
    OLD.forEach((idx, k) => {
      const start = windowFor(k);
      const t = smooth(range(p, start, start + WINDOW));
      const oldMesh = olds.current[k];
      const newMesh = news.current[k];
      if (oldMesh) {
        oldMesh.position.y = lerp(0, 0.6, t);
        (oldMesh.material as MeshStandardMaterial).opacity = 1 - t;
        oldMesh.visible = t < 1;
      }
      if (newMesh) {
        newMesh.position.y = lerp(0.9, 0, t);
        (newMesh.material as MeshStandardMaterial).opacity = t;
        newMesh.visible = t > 0;
      }
      void idx;
    });
    // 2. bite height restores and the arch turns
    const restore = smooth(range(p, 0.6, 1));
    const yScale = lerp(0.9, 1, restore);
    healthy.current.forEach((m) => m && m.scale.set(0.27, 0.3 * yScale, 0.17));
    news.current.forEach((m) => m && m.scale.set(0.27, 0.3 * yScale, 0.17));
    if (group.current) group.current.rotation.y = lerp(0, -0.9, restore);
  });

  return (
    <group ref={group} position={[0, 0, 0.1]}>
      {slots.map((s, i) => {
        const k = OLD.indexOf(i);
        if (k === -1) {
          return (
            <mesh
              key={i}
              ref={(el) => {
                healthy.current[i] = el;
              }}
              geometry={geo}
              material={ivory}
              position={[s.x, 0, s.z]}
              rotation={[0, s.angle, 0]}
              scale={[0.27, 0.27, 0.17]}
            />
          );
        }
        return (
          <group key={i} position={[s.x, 0, s.z]} rotation={[0, s.angle, 0]}>
            <mesh
              name={`crown_old_${k}`}
              ref={(el) => {
                olds.current[k] = el;
              }}
              geometry={geo}
              scale={[0.27, 0.22, 0.17]}
            >
              <meshStandardMaterial color={COLORS.oldCrown} roughness={0.5} transparent opacity={1} />
            </mesh>
            <mesh
              name={`crown_${String(k + 1).padStart(2, "0")}`}
              ref={(el) => {
                news.current[k] = el;
              }}
              geometry={geo}
              position={[0, 0.9, 0]}
              scale={[0.27, 0.27, 0.17]}
              visible={false}
            >
              <meshStandardMaterial color={COLORS.ivoryBright} roughness={0.3} transparent opacity={0} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** GLB with node arch (morph worn -> restored) and crown_01 to crown_10. */
function FullMouthGlb({ progress }: { progress: ProgressRef }) {
  const { scene, nodes } = useGLTF("/models/fullmouth.glb", "/draco/");
  const group = useRef<Group>(null);
  const arch = nodes.arch as Mesh | undefined;
  const crowns = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => nodes[`crown_${String(i + 1).padStart(2, "0")}`] as Mesh | undefined).filter(
        (m): m is Mesh => Boolean(m),
      ),
    [nodes],
  );

  useFrame(() => {
    const p = progress.current ?? 0;
    crowns.forEach((c, k) => {
      const start = 0.02 + (0.56 / Math.max(1, crowns.length)) * k;
      const t = smooth(range(p, start, start + 0.08));
      const m = c.material as MeshStandardMaterial;
      m.transparent = true;
      m.opacity = t;
      c.visible = t > 0;
    });
    if (arch?.morphTargetInfluences && arch.morphTargetDictionary && arch.morphTargetDictionary.restored !== undefined) {
      arch.morphTargetInfluences[arch.morphTargetDictionary.restored] = smooth(range(p, 0.6, 1));
    }
    if (group.current) group.current.rotation.y = lerp(0, -0.9, smooth(range(p, 0.6, 1)));
  });

  return <primitive ref={group} object={scene} />;
}
