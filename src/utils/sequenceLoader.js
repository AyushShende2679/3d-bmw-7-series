/**
 * Sequence Loader and Canvas Engine Utilities
 * Handles 240-frame preloading, caching, DPR scaling, and razor-sharp automotive rendering.
 */

export const TOTAL_FRAMES = 240;

export const getFrameUrl = (index) => {
  const padded = String(index).padStart(3, '0');
  return `/frames/ezgif-frame-${padded}.jpg`;
};

// Global in-memory image cache
const imageCache = new Array(TOTAL_FRAMES + 1);

// Offscreen buffer for full-resolution razor-sharp paint shading
let offscreenCanvas = null;
let offscreenCtx = null;

const getOffscreen = (w, h) => {
  if (!offscreenCanvas) {
    offscreenCanvas = document.createElement('canvas');
    offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
  }
  if (offscreenCanvas.width !== w || offscreenCanvas.height !== h) {
    offscreenCanvas.width = w;
    offscreenCanvas.height = h;
  }
  return { canvas: offscreenCanvas, ctx: offscreenCtx };
};

/**
 * Preload frames with progressive feedback and concurrency control
 */
export const preloadSequence = (onProgress) => {
  return new Promise((resolve) => {
    let loadedCount = 0;
    const total = TOTAL_FRAMES;

    const priorityIndices = [];
    for (let i = 1; i <= Math.min(45, total); i++) priorityIndices.push(i);
    for (let i = 46; i <= total; i += 4) priorityIndices.push(i);
    for (let i = 1; i <= total; i++) {
      if (!priorityIndices.includes(i)) priorityIndices.push(i);
    }

    let currentIndex = 0;
    const MAX_CONCURRENT = 16;
    let activeWorkers = 0;

    const loadNext = () => {
      if (currentIndex >= priorityIndices.length) {
        if (activeWorkers === 0) {
          resolve(imageCache);
        }
        return;
      }

      const frameIdx = priorityIndices[currentIndex++];
      activeWorkers++;

      if (imageCache[frameIdx] && imageCache[frameIdx].complete) {
        loadedCount++;
        onProgress(Math.min(100, Math.round((loadedCount / total) * 100)));
        activeWorkers--;
        loadNext();
        return;
      }

      const img = new Image();
      img.src = getFrameUrl(frameIdx);
      
      img.onload = () => {
        imageCache[frameIdx] = img;
        loadedCount++;
        onProgress(Math.min(100, Math.round((loadedCount / total) * 100)));
        activeWorkers--;
        loadNext();
      };

      img.onerror = () => {
        imageCache[frameIdx] = imageCache[1] || img;
        loadedCount++;
        onProgress(Math.min(100, Math.round((loadedCount / total) * 100)));
        activeWorkers--;
        loadNext();
      };
    };

    for (let i = 0; i < MAX_CONCURRENT; i++) {
      loadNext();
    }
  });
};

export const getCachedFrame = (frameIndex) => {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIndex)));
  return imageCache[clamped] || imageCache[1] || null;
};

export const calculateCoverBounds = (width, height, imgWidth, imgHeight) => {
  const imgAspect = imgWidth / imgHeight;
  const canvasAspect = width / height;

  let drawW, drawH, drawX, drawY;

  if (canvasAspect > imgAspect) {
    drawW = width;
    drawH = width / imgAspect;
    drawX = 0;
    drawY = (height - drawH) / 2;
  } else {
    drawH = height;
    drawW = height * imgAspect;
    drawX = (width - drawW) / 2;
    drawY = 0;
  }

  return {
    drawX: Math.round(drawX),
    drawY: Math.round(drawY),
    drawW: Math.round(drawW),
    drawH: Math.round(drawH)
  };
};

// Helper: parse hex color to RGB
const hexToRgb = (hex) => {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
};

/**
 * Apply razor-sharp 1:1 full-resolution selective paint shader to vehicle body
 */
const applySelectivePaintShader = (ctx, drawX, drawY, drawW, drawH, colorTint) => {
  if (!colorTint || colorTint.id === 'black-sapphire' || !colorTint.hex) return;

  const targetRgb = hexToRgb(colorTint.hex);
  const intensity = colorTint.intensity || 0.75;

  // 1:1 Full native resolution — zero downscale blur
  const bufW = drawW;
  const bufH = drawH;

  const { canvas: offCanvas, ctx: offCtx } = getOffscreen(bufW, bufH);

  // Copy crisp vehicle region to offscreen buffer
  offCtx.imageSmoothingEnabled = true;
  offCtx.imageSmoothingQuality = 'high';
  offCtx.drawImage(ctx.canvas, drawX, drawY, drawW, drawH, 0, 0, bufW, bufH);

  const imgData = offCtx.getImageData(0, 0, bufW, bufH);
  const data = imgData.data;
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // High-precision perceptual luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // ISOLATION MASK:
    // Background is near pitch black (lum <= 20).
    // Car body panels have luminance between 22 and 185.
    // Extremely bright chrome/reflections (lum > 185) preserve specular clarity.
    if (lum > 20 && lum < 225) {
      let mask = 0;
      if (lum < 48) {
        mask = (lum - 20) / 28;
      } else if (lum > 170) {
        mask = 1 - (lum - 170) / 55;
      } else {
        mask = 1.0;
      }

      const blend = mask * intensity;
      const targetFactor = lum / 128;

      data[i] = Math.min(255, Math.round(r * (1 - blend) + (targetRgb.r * targetFactor) * blend));
      data[i + 1] = Math.min(255, Math.round(g * (1 - blend) + (targetRgb.g * targetFactor) * blend));
      data[i + 2] = Math.min(255, Math.round(b * (1 - blend) + (targetRgb.b * targetFactor) * blend));
    }
  }

  offCtx.putImageData(imgData, 0, 0);

  // Draw shaded vehicle back to main canvas with 1:1 pixel sharpness
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(offCanvas, 0, 0, bufW, bufH, drawX, drawY, drawW, drawH);
  ctx.restore();
};

/**
 * Draw frame on canvas with full-bleed cover scaling, zero edge seams,
 * razor-sharp smoothing, and selective body-only paint shading.
 */
export const renderFrameToCanvas = (canvas, ctx, img, colorTint = null) => {
  if (!canvas || !ctx || !img || !img.complete) return;

  const width = canvas.width;
  const height = canvas.height;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const { drawX, drawY, drawW, drawH } = calculateCoverBounds(
    width,
    height,
    img.naturalWidth || 1920,
    img.naturalHeight || 1080
  );

  // 1. Draw base photo frame with high smoothing quality
  ctx.drawImage(img, drawX, drawY, drawW, drawH);

  // 2. Apply selective vehicle-only paint shader at full 1:1 resolution
  if (colorTint && colorTint.id !== 'black-sapphire') {
    applySelectivePaintShader(ctx, drawX, drawY, drawW, drawH, colorTint);
  }

  // 3. Seamless bottom-right watermark cleanup mask
  const wmSize = Math.max(120, width * 0.09);
  const wmX = width - wmSize;
  const wmY = height - wmSize;
  
  const cornerMask = ctx.createRadialGradient(
    width, height, 0,
    width, height, wmSize * 1.6
  );
  cornerMask.addColorStop(0, '#000000');
  cornerMask.addColorStop(0.5, 'rgba(0, 0, 0, 0.95)');
  cornerMask.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = cornerMask;
  ctx.fillRect(wmX - 60, wmY - 60, wmSize + 60, wmSize + 60);

  // 4. Subtle perimeter vignette
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.45,
    width / 2, height / 2, Math.max(width, height) * 0.78
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(0.85, 'rgba(3, 3, 4, 0.25)');
  vignette.addColorStop(1, 'rgba(2, 2, 3, 0.65)');

  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
};
