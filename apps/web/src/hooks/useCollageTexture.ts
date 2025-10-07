import { useState, useEffect, useCallback } from 'react';
import { getCanvasTexture } from '@/components/webgl/getCanvasTexture';

interface CollageImage {
  url: string;
}

interface CollageOptions {
  gap?: number;
  canvasHeight?: number;
  canvasWidth?: number;
  axis?: 'x' | 'y';
}

interface TextureResult {
  texture: any;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: number;
  };
}

export function useCollageTexture(
  images: CollageImage[],
  options: CollageOptions = {},
) {
  const [textureResults, setTextureResults] = useState<TextureResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    gap = 0,
    canvasHeight = 512,
    canvasWidth = 512,
    axis = 'x',
  } = options;

  const createTexture = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getCanvasTexture({
        images,
        gap,
        canvasHeight,
        canvasWidth,
        canvas: undefined,
        ctx: undefined,
        axis,
      });
      setTextureResults(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to create texture'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [images, gap, canvasHeight, canvasWidth, axis]);

  useEffect(() => {
    if (images.length > 0) createTexture();
  }, [images.length, createTexture]);

  return {
    texture: textureResults?.texture || null,
    dimensions: textureResults?.dimensions || null,
    isLoading,
    error,
  };
}
