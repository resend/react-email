"use client";

import { useEffect, useRef, useState } from "react";

interface WebGLSceneProps {
  images: { url: string }[];
  className?: string;
}

const supportsOffscreenCanvas = typeof OffscreenCanvas !== "undefined";
const supportsWorker = typeof Worker !== "undefined";

const imageBitmapCache = new Map<string, Promise<ImageBitmap>>();

async function fetchImageBitmap(url: string): Promise<ImageBitmap> {
  if (!imageBitmapCache.has(url)) {
    imageBitmapCache.set(
      url,
      (async () => {
        const response = await fetch(url);
        const blob = await response.blob();
        return await createImageBitmap(blob);
      })()
    );
  }
  return imageBitmapCache.get(url)!;
}

export function WebGLScene({ images, className = "" }: WebGLSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const lastXRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    lastXRef.current = e.clientX;
    workerRef.current?.postMessage({ type: "pointerDown" });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    workerRef.current?.postMessage({
      type: "pointerMove",
      data: { deltaX },
    });
  };

  const handlePointerUp = () => {
    workerRef.current?.postMessage({ type: "pointerUp" });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !supportsOffscreenCanvas || !supportsWorker) return;

    const initWorker = async () => {
      try {
        const worker = new Worker(
          new URL("./webgl-scene.worker.ts", import.meta.url)
        );
        workerRef.current = worker;

        worker.onmessage = (e: MessageEvent) => {
          if (e.data.type === "ready") {
            setIsReady(true);
            worker.postMessage({ type: "startRender" });
          }
        };

        const offscreenCanvas = canvas.transferControlToOffscreen();
        const dpr = window.devicePixelRatio || 1;

        worker.postMessage(
          {
            type: "init",
            data: {
              canvas: offscreenCanvas,
              dpr,
            },
          },
          [offscreenCanvas]
        );

        const imageBitmaps = await Promise.all(
          images.map(async (img) => {
            try {
              const cachedBitmap = await fetchImageBitmap(img.url);
              const canvas = document.createElement("canvas");
              canvas.width = cachedBitmap.width;
              canvas.height = cachedBitmap.height;
              const ctx = canvas.getContext("2d")!;
              ctx.drawImage(cachedBitmap, 0, 0);
              const newBitmap = await createImageBitmap(canvas);
              return newBitmap;
            } catch (e) {
              throw e;
            }
          })
        );

        worker.postMessage(
          {
            type: "loadTexture",
            data: { images: imageBitmaps },
          },
          imageBitmaps
        );

        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            worker.postMessage({
              type: "resize",
              data: { width, height, dpr },
            });
          }
        });
        resizeObserver.observe(canvas);

        const handleVisibilityChange = () => {
          if (document.hidden) {
            worker.postMessage({ type: "stopRender" });
          } else {
            worker.postMessage({ type: "startRender" });
          }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
          resizeObserver.disconnect();
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange
          );
          worker.postMessage({ type: "stopRender" });
          worker.terminate();
        };
      } catch (error) {
        // No console output
      }
    };

    const timeoutId = setTimeout(initWorker, 100);

    return () => {
      clearTimeout(timeoutId);
      if (workerRef.current) {
        workerRef.current.postMessage({ type: "stopRender" });
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [images]);

  return (
    <canvas
      aria-label="Three cylinders in a row rotating on their own axis"
      ref={canvasRef}
      className={`${className} cursor-grab active:cursor-grabbing transition-opacity duration-300 ${
        isReady ? "opacity-100" : "opacity-0"
      }`}
      style={{
        backgroundColor: "transparent",
        opacity: isReady ? 1 : 0,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}
