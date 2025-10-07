import * as THREE from "three";

/**
 * Preloads an image and calculates its dimensions
 */
async function preloadImage(imageUrl, axis, canvasHeight, canvasWidth) {
  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    img.src = imageUrl;
  });

  const aspectRatio = img.naturalWidth / img.naturalHeight;

  let calculatedWidth;
  let calculatedHeight;

  if (axis === "x") {
    // Horizontal layout: scale to fit canvasHeight
    calculatedHeight = canvasHeight;
    calculatedWidth = canvasHeight * aspectRatio;
  } else {
    // Vertical layout: scale to fit canvasWidth
    calculatedWidth = canvasWidth;
    calculatedHeight = canvasWidth / aspectRatio;
  }

  return { img, width: calculatedWidth, height: calculatedHeight };
}

function calculateCanvasDimensions(
  imageData,
  axis,
  gap,
  canvasHeight,
  canvasWidth
) {
  if (axis === "x") {
    const totalWidth = imageData.reduce(
      (sum, data, index) => sum + data.width + (index > 0 ? gap : 0),
      0
    );
    return { totalWidth, totalHeight: canvasHeight };
  } else {
    const totalHeight = imageData.reduce(
      (sum, data, index) => sum + data.height + (index > 0 ? gap : 0),
      0
    );
    return { totalWidth: canvasWidth, totalHeight };
  }
}

function setupCanvas(canvasElement, context, dimensions) {
  const { totalWidth, totalHeight } = dimensions;

  const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  canvasElement.width = totalWidth * devicePixelRatio;
  canvasElement.height = totalHeight * devicePixelRatio;

  if (devicePixelRatio !== 1) context.scale(devicePixelRatio, devicePixelRatio);

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, totalWidth, totalHeight);
}

function drawImages(context, imageData, axis, gap) {
  let currentX = 0;
  let currentY = 0;

  context.save();

  for (const data of imageData) {
    context.drawImage(data.img, currentX, currentY, data.width, data.height);

    if (axis === "x") currentX += data.width + gap;
    else currentY += data.height + gap;
  }

  context.restore();
}

function createTextureResult(canvasElement, dimensions) {
  const texture = new THREE.CanvasTexture(canvasElement);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return {
    texture,
    dimensions: {
      width: dimensions.totalWidth,
      height: dimensions.totalHeight,
      aspectRatio: dimensions.totalWidth / dimensions.totalHeight,
    },
  };
}

export async function getCanvasTexture({
  images,
  gap = 10,
  canvasHeight = 512,
  canvasWidth = 512,
  canvas,
  ctx,
  axis = "x",
}) {
  if (!images.length) throw new Error("No images");

  // Create canvas and context if not provided
  const canvasElement = canvas || document.createElement("canvas");
  const context = ctx || canvasElement.getContext("2d");

  if (!context) throw new Error("No context");

  // Preload all images in parallel
  const imageData = await Promise.all(
    images.map((image) =>
      preloadImage(image.url, axis, canvasHeight, canvasWidth)
    )
  );

  // Calculate total canvas dimensions
  const dimensions = calculateCanvasDimensions(
    imageData,
    axis,
    gap,
    canvasHeight,
    canvasWidth
  );

  // Setup canvas
  setupCanvas(canvasElement, context, dimensions);

  // Draw all images
  drawImages(context, imageData, axis, gap);

  // Create and return texture result
  return createTextureResult(canvasElement, dimensions);
}
