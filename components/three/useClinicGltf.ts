"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { KTX2Loader, type GLTFLoader } from "three-stdlib";

let ktx2: KTX2Loader | null = null;

/**
 * Loads a clinic GLB from /models with Draco geometry (decoder in /public/draco)
 * and KTX2 textures (transcoder in /public/basis), the two formats the artist
 * brief asks for. Files with plain PNG or JPEG textures load the same way.
 */
export function useClinicGltf(path: string) {
  const gl = useThree((s) => s.gl);
  const extend = useMemo(() => {
    if (!ktx2) ktx2 = new KTX2Loader().setTranscoderPath("/basis/");
    ktx2.detectSupport(gl);
    const loader = ktx2;
    return (gltfLoader: GLTFLoader) => {
      gltfLoader.setKTX2Loader(loader);
    };
  }, [gl]);
  return useGLTF(path, "/draco/", false, extend);
}
