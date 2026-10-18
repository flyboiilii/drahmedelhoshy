"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, View } from "@react-three/drei";
import { useClinicGltf } from "./useClinicGltf";
import { DoubleSide, Group, Mesh, MeshStandardMaterial, Plane, Vector3 } from "three";
import { sceneStore } from "@/lib/scene-store";
import { Lights } from "./SequenceView";

type Props = { split: RefObject<number>; yaw: RefObject<number> };

/**
 * Proof viewer for the hero once arch.glb exists: two arches (archBefore,
 * archAfter) split by a wipe plane driven by `split` (0 to 1). Orbit is limited
 * to 15 degrees each way through `yaw`. Rendered inside the hero box.
 */
export default function ArchViewer({ split, yaw }: Props) {
  useEffect(() => {
    sceneStore.enable();
    const t = window.setTimeout(() => sceneStore.invalidate(), 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <View className="absolute inset-0" index={1}>
      <PerspectiveCamera makeDefault fov={26} position={[0, 1.2, 5]} onUpdate={(c) => c.lookAt(0, 0, 0)} />
      <Lights />
      <Suspense fallback={null}>
        <Arches split={split} yaw={yaw} />
      </Suspense>
    </View>
  );
}

function Arches({ split, yaw }: Props) {
  const { nodes } = useClinicGltf("/models/arch.glb");
  const group = useRef<Group>(null);
  const before = nodes.archBefore as Mesh | undefined;
  const after = nodes.archAfter as Mesh | undefined;
  const planeBefore = useMemo(() => new Plane(new Vector3(-1, 0, 0), 0), []);
  const planeAfter = useMemo(() => new Plane(new Vector3(1, 0, 0), 0), []);

  useMemo(() => {
    const prep = (m: Mesh | undefined, plane: Plane) => {
      if (!m) return;
      const mat = m.material as MeshStandardMaterial;
      mat.clippingPlanes = [plane];
      mat.side = DoubleSide;
    };
    prep(before, planeBefore);
    prep(after, planeAfter);
  }, [before, after, planeBefore, planeAfter]);

  useFrame(() => {
    const x = (split.current ?? 0.5) * 3 - 1.5;
    planeBefore.constant = x;
    planeAfter.constant = -x;
    if (group.current) group.current.rotation.y = yaw.current ?? 0;
  });

  return (
    <group ref={group}>
      {before && <primitive object={before} />}
      {after && <primitive object={after} />}
    </group>
  );
}
