"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/use-media-query";

const WebGLScene = dynamic(
  () => import("@/webgl/webgl-scene").then((mod) => mod.WebGLScene),
  {
    ssr: false,
    loading: () => null,
  }
);

const BILLBOARD_IMAGES = [
  { url: "/static/components/0.jpeg" },
  { url: "/static/components/1.jpeg" },
  { url: "/static/components/2.jpeg" },
  { url: "/static/components/3.jpeg" },
  { url: "/static/components/4.jpeg" },
  { url: "/static/components/0.jpeg" },
  { url: "/static/components/1.jpeg" },
  { url: "/static/components/2.jpeg" },
  { url: "/static/components/3.jpeg" },
  { url: "/static/components/4.jpeg" },
];

export function HeroCanvas() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (!isDesktop) return null;

  return (
    <div className="w-[100dvw] h-[100dvh] z-[0] absolute right-0 top-0">
      <div className="w-full h-full">
        <WebGLScene images={BILLBOARD_IMAGES} className="w-full h-full" />
      </div>
    </div>
  );
}
