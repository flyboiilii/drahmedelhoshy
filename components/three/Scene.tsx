"use client";

import dynamic from "next/dynamic";
import { useSceneEnabled } from "@/lib/scene-store";

const RootCanvas = dynamic(() => import("./RootCanvas"), { ssr: false });

/**
 * The single root canvas. Nothing from three.js is downloaded until a capable
 * device scrolls near a sequence and calls sceneStore.enable().
 */
export function Scene() {
  const enabled = useSceneEnabled();
  if (!enabled) return null;
  return <RootCanvas />;
}
