import React, { useRef, useEffect } from 'react';
import { getCachedFrame, renderFrameToCanvas, TOTAL_FRAMES } from '../utils/sequenceLoader';

export const ScrollyCanvas = ({ scrollProgress, selectedColor }) => {
  const canvasRef = useRef(null);
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const animFrameIdRef = useRef(null);
  const lastRenderedFrameRef = useRef(-1);

  // Update target frame smoothly from scroll progress
  useEffect(() => {
    const calculatedFrame = 1 + scrollProgress * (TOTAL_FRAMES - 1);
    targetFrameRef.current = Math.max(1, Math.min(TOTAL_FRAMES, calculatedFrame));
  }, [scrollProgress]);

  // Main Render Loop with Jitter-Free Lerp & High-DPI Sharpness
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Immediate redraw on resize
      const img = getCachedFrame(currentFrameRef.current);
      if (img && img.complete) {
        renderFrameToCanvas(canvas, ctx, img, selectedColor);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const renderLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      
      if (Math.abs(diff) > 0.001) {
        const speed = Math.abs(diff) > 5 ? 0.18 : 0.10;
        currentFrameRef.current += diff * speed;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const frameToDraw = Math.round(currentFrameRef.current);
      
      if (frameToDraw !== lastRenderedFrameRef.current || selectedColor) {
        const img = getCachedFrame(frameToDraw);
        if (img && img.complete) {
          renderFrameToCanvas(canvas, ctx, img, selectedColor);
          lastRenderedFrameRef.current = frameToDraw;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [selectedColor]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
