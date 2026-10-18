"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useClinicGltf } from "../useClinicGltf";
import { Color, DoubleSide, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, SphereGeometry } from "three";
import type { ProgressRef } from "../SequenceView";
import { COLORS, toothGeometry } from "@/lib/three/tooth";
import { lerp, range, smooth } from "@/lib/three/motion";

/**
 * Choreography (progress 0 to 1):
 * 0.00 to 0.30  tooth whole, turning 20 degrees
 * 0.30 to 0.55  enamel face fades to reveal the 0.4 mm prep layer
 * 0.55 to 0.85  veneer slides in from +x and seats
 * 0.85 to 1.00  shade warms from A3 to BL2
 */
const A3 = new Color(COLORS.shadeA3);
const BL2 = new Color(COLORS.shadeBL2);
const tmp = new Color();

export function VeneerSequence({ progress, glb }: { progress: ProgressRef; glb: boolean }) {
  return glb ? <VeneerGlb progress={progress} /> : <VeneerProcedural progress={progress} />;
}

function VeneerProcedural({ progress }: { progress: ProgressRef }) {
  const group = useRef<Group>(null);
  const veneer = useRef<Mesh>(null);
  const geo = useMemo(() => toothGeometry(48), []);
  const shell = useMemo(() => new SphereGeometry(0.43, 48, 32, Math.PI / 2 - 0.55, 1.1, Math.PI / 2 - 0.95, 1.75), []);

  const enamelMat = useMemo(
    () => new MeshPhysicalMaterial({ color: COLORS.shadeA3, roughness: 0.32, clearcoat: 0.35, clearcoatRoughness: 0.4, transparent: true, opacity: 1 }),
    [],
  );
  const prepMat = useMemo(() => new MeshStandardMaterial({ color: COLORS.dentine, roughness: 0.6 }), []);
  const veneerMat = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: COLORS.shadeA3,
        transmission: 0.6,
        thickness: 0.4,
        roughness: 0.15,
        ior: 1.5,
        side: DoubleSide,
        transparent: true,
      }),
    [],
  );

  useFrame(() => {
    const p = progress.current ?? 0;
    if (!group.current || !veneer.current) return;

    // 1. turn
    group.current.rotation.y = lerp(0, (20 * Math.PI) / 180, smooth(range(p, 0, 0.3)));

    // 2. enamel fades to reveal prep layer
    enamelMat.opacity = lerp(1, 0.12, smooth(range(p, 0.3, 0.55)));

    // 3. veneer slides in from +x
    const seat = smooth(range(p, 0.55, 0.85));
    veneer.current.position.x = lerp(1.6, 0, seat);
    veneer.current.position.z = lerp(0.3, 0.02, seat);
    veneerMat.opacity = lerp(0, 1, range(p, 0.55, 0.62));

    // 4. shade warms A3 -> BL2
    tmp.copy(A3).lerp(BL2, smooth(range(p, 0.85, 1)));
    veneerMat.color.copy(tmp);
    enamelMat.color.copy(tmp);
  });

  return (
    <group ref={group} position={[0, 0.05, 0]}>
      <mesh name="tooth" geometry={geo} material={enamelMat} scale={[1, 1, 0.6]} />
      <mesh name="prepLayer" geometry={geo} material={prepMat} scale={[0.955, 0.985, 0.57]} />
      <mesh ref={veneer} name="veneer" geometry={shell} material={veneerMat} scale={[0.95, 1.08, 0.62]} position={[1.6, 0.02, 0.3]} />
    </group>
  );
}

/**
 * Blender GLB with nodes tooth, prepLayer, veneer (vertex coloured, see blender/veneer.py).
 * The enamel fades out and is then hidden, so nothing fights the veneer's outer surface; the
 * prepared tooth sits a hair inside the veneer's fitting surface. The veneer arrives in the
 * tooth's own A3 shade and warms to BL2 in the last step. Materials are opaque unless fading.
 */
function VeneerGlb({ progress }: { progress: ProgressRef }) {
  const { scene, nodes } = useClinicGltf("/models/veneer.glb");
  const group = useRef<Group>(null);
  const tooth = nodes.tooth as Mesh | undefined;
  const veneer = nodes.veneer as Mesh | undefined;

  useFrame(() => {
    const p = progress.current ?? 0;
    // 1. turn
    if (group.current) group.current.rotation.y = lerp(0, (20 * Math.PI) / 180, smooth(range(p, 0, 0.3)));

    // 2. enamel fades to reveal the prepared tooth, then leaves the scene
    if (tooth) {
      const m = tooth.material as MeshStandardMaterial;
      const o = lerp(1, 0, smooth(range(p, 0.3, 0.55)));
      m.transparent = o < 1;
      m.depthWrite = o >= 1;
      m.opacity = o;
      tooth.visible = o > 0.01;
    }

    // 3. veneer slides in from +x and seats, 4. shade warms A3 -> BL2
    if (veneer) {
      // The loaded scene is cached across mounts, so the rest position is kept on the node itself.
      const rest = (veneer.userData.restX ??= veneer.position.x) as number;
      const seat = smooth(range(p, 0.55, 0.85));
      veneer.position.x = lerp(rest + 1.6, rest, seat);
      const vm = veneer.material as MeshStandardMaterial;
      const o = range(p, 0.55, 0.62);
      vm.transparent = o < 1;
      vm.depthWrite = o >= 1;
      vm.opacity = o;
      veneer.visible = o > 0;
      vm.color.copy(tmp.copy(A3).lerp(BL2, smooth(range(p, 0.85, 1))));
    }
  });

  return <primitive ref={group} object={scene} />;
}
