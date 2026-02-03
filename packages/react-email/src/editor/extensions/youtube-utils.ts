import { loadImage } from '@/utils/load-image';

export function extractYouTubeVideoId(url = ''): string | null {
  // Regular expressions for different YouTube URL formats
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)/,
    /(?:https?:\/\/)?youtu\.be\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export async function createPreview({
  canvas,
  videoId,
  includePlayButton,
}: {
  videoId: string;
  includePlayButton: boolean;
  canvas: HTMLCanvasElement;
}) {
  const ctx = canvas.getContext('2d');

  if (ctx === null) {
    return;
  }

  canvas.width = 800;
  canvas.height = 600;

  await loadYouTubeThumbnail(videoId, canvas, {
    includePlayButton,
  });
}

interface ThumbnailQuality {
  quality: string;
  width: number;
  height: number;
}

const THUMBNAIL_QUALITIES: readonly ThumbnailQuality[] = [
  { quality: 'maxresdefault', width: 1280, height: 720 },
  { quality: 'hqdefault', width: 480, height: 360 },
] as const;

async function tryLoadingImage(
  videoId: string,
  quality: string,
): Promise<HTMLImageElement | null> {
  try {
    const baseUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    const url = `/api/proxy-image?url=${encodeURIComponent(baseUrl)}`;

    return await loadImage(url);
  } catch (error) {
    console.error(`Failed to load ${quality}.jpg:`, error);
    return null;
  }
}

interface ThumbnailOptions {
  includePlayButton?: boolean;
}

async function loadYouTubeThumbnail(
  videoId: string,
  canvas: HTMLCanvasElement,
  options: ThumbnailOptions = {},
): Promise<boolean> {
  const { includePlayButton = true } = options;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas 2d context');
  }

  for (const { quality, width, height } of THUMBNAIL_QUALITIES) {
    const image = await tryLoadingImage(videoId, quality);

    if (image) {
      canvas.width = image.width || width;
      canvas.height = image.height || height;
      ctx.drawImage(image, 0, 0);

      if (includePlayButton) {
        drawYouTubeLogo(ctx);
      }

      return true;
    }
  }

  return false;
}

const drawYouTubeLogo = (ctx: CanvasRenderingContext2D) => {
  // Save the current context state
  ctx.save();

  // SVG viewBox dimensions
  const svgWidth = 68;
  const svgHeight = 48;

  // Calculate scaling factor to make SVG reasonably sized on the canvas
  const scaleFactor =
    Math.min(ctx.canvas.width / svgWidth, ctx.canvas.height / svgHeight) * 0.2;

  // Calculate center point
  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;

  // Move the context to the center of the canvas
  ctx.translate(centerX, centerY);

  // Scale the drawing
  ctx.scale(scaleFactor, scaleFactor);

  // Adjust position to truly center the SVG
  ctx.translate(-svgWidth / 2, -svgHeight / 2);

  // Draw the red background shape
  ctx.beginPath();
  ctx.moveTo(66.52, 7.74);
  ctx.bezierCurveTo(65.74, 4.81, 64.03, 2.33, 61.1, 1.55);
  ctx.bezierCurveTo(55.79, 0.13, 34, 0, 34, 0);
  ctx.bezierCurveTo(34, 0, 12.21, 0.13, 6.9, 1.55);
  ctx.bezierCurveTo(3.97, 2.33, 2.27, 4.81, 1.48, 7.74);
  ctx.bezierCurveTo(0.06, 13.05, 0, 24, 0, 24);
  ctx.bezierCurveTo(0, 24, 0.06, 34.95, 1.48, 40.26);
  ctx.bezierCurveTo(2.26, 43.19, 3.97, 45.67, 6.9, 46.45);
  ctx.bezierCurveTo(12.21, 47.87, 34, 48, 34, 48);
  ctx.bezierCurveTo(34, 48, 55.79, 47.87, 61.1, 46.45);
  ctx.bezierCurveTo(64.03, 45.67, 65.74, 43.19, 66.52, 40.26);
  ctx.bezierCurveTo(67.94, 34.95, 68, 24, 68, 24);
  ctx.bezierCurveTo(68, 24, 67.94, 13.05, 66.52, 7.74);
  ctx.closePath();
  ctx.fillStyle = '#f00';
  ctx.fill();

  // Draw the white play triangle
  ctx.beginPath();
  ctx.moveTo(45, 24);
  ctx.lineTo(27, 14);
  ctx.lineTo(27, 34);
  ctx.closePath();
  ctx.fillStyle = '#fff';
  ctx.fill();

  // Restore the context state
  ctx.restore();
};
