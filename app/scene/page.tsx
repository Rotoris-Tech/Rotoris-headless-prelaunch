"use client";

import React, { useEffect, useRef, useState } from "react";

// ---------- CONFIG ----------
const FRAME_COUNT = 231;

/**
 * IMPORTANT: this must match your actual files in /public.
 *
 * This expects files like:
 *   public/assets/threed-scene/Ascendus-opening-scene/scene-1-001.avif
 *   public/assets/threed-scene/Ascendus-opening-scene/scene-1-002.avif
 *   ...
 *   public/assets/threed-scene/Ascendus-opening-scene/scene-1-231.avif
 */
function currentFrame(index: number) {
  const frameNumber = index.toString().padStart(3, "0");
  return `/assets/threed-scene/Ascendus-opening-scene/scene-1-${frameNumber}.avif`;
}

// ---------- PAGE ----------
export default function ScenePage() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedCountRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastWheelTimeRef = useRef(0);
  const lastTouchYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Cache for preloaded images
    const imageCache: HTMLImageElement[] = [];

    // Preload all images and store in cache
    const preloadImages = () => {
      Array.from({ length: FRAME_COUNT }, (_, i) => {
        const preloadImg = new Image();
        preloadImg.src = currentFrame(i + 1);

        preloadImg.onload = () => {
          imageCache[i] = preloadImg;
          loadedCountRef.current += 1;
          const progress = Math.round((loadedCountRef.current / FRAME_COUNT) * 100);
          setLoadingProgress(progress);

          if (loadedCountRef.current === FRAME_COUNT) {
            setIsPreloading(false);
            // Draw first frame after all images loaded
            currentFrameRef.current = 0;
            renderFrame(0);
          }
        };

        preloadImg.onerror = () => {
          console.error("Failed to load frame:", preloadImg.src);
          loadedCountRef.current += 1;
          const progress = Math.round((loadedCountRef.current / FRAME_COUNT) * 100);
          setLoadingProgress(progress);

          if (loadedCountRef.current === FRAME_COUNT) {
            setIsPreloading(false);
          }
        };
      });
    };

    // Render frame on canvas
    const renderFrame = (index: number) => {
      const clampedIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(index)));
      const img = imageCache[clampedIndex];
      if (!img) return;

      // Calculate dimensions for object-cover behavior
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = canvas.width / canvas.height;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasAspect > imgAspect) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgAspect;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgAspect;
        offsetX = (canvas.width - drawWidth) / 2;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Physics-based animation loop with momentum
    const animateFrame = () => {
      const FRICTION = 0.93; // Vacuum-like minimal friction (higher = less friction, smoother glide)
      const MIN_VELOCITY = 0.02; // Minimum velocity before stopping

      // Apply friction to velocity (simulates vacuum environment with momentum)
      velocityRef.current *= FRICTION;

      // Add velocity to current frame position
      currentFrameRef.current += velocityRef.current;

      // Clamp to valid frame range (0 to 230)
      if (currentFrameRef.current < 0) {
        currentFrameRef.current = 0;
        velocityRef.current = 0;
      } else if (currentFrameRef.current >= FRAME_COUNT - 1) {
        currentFrameRef.current = FRAME_COUNT - 1;
        velocityRef.current = 0;
      }

      // Render current frame
      renderFrame(currentFrameRef.current);

      // Continue animating if there's velocity
      if (Math.abs(velocityRef.current) > MIN_VELOCITY) {
        rafRef.current = requestAnimationFrame(animateFrame);
      } else {
        velocityRef.current = 0;
      }
    };

    // Start continuous animation loop
    const startAnimation = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(animateFrame);
    };

    // Handle mouse wheel events (no page scroll)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Prevent page scroll

      const currentTime = performance.now();
      const deltaY = e.deltaY;

      // Wheel threshold - minimum wheel delta to register
      const WHEEL_THRESHOLD = 1;

      if (Math.abs(deltaY) >= WHEEL_THRESHOLD) {
        // Convert wheel delta to frame velocity
        const WHEEL_SENSITIVITY = 0.015; // How responsive (0.01-0.03 recommended)
        const wheelVelocity = deltaY * WHEEL_SENSITIVITY;

        // Add wheel velocity to current velocity (momentum accumulation)
        // Wheel down = positive velocity = forward frames
        // Wheel up = negative velocity = backward frames
        velocityRef.current += wheelVelocity;

        // Clamp velocity to prevent too fast/jarring scrolling
        const MAX_VELOCITY = 2.5; // Maximum frames per animation tick
        velocityRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocityRef.current));

        // Update last wheel time
        lastWheelTimeRef.current = currentTime;

        // Start/continue animation
        startAnimation();
      }
    };

    // Handle touch events (mobile)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        lastTouchYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent page scroll

      if (e.touches.length === 0) return;

      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchYRef.current - currentY;

      // Touch threshold
      const TOUCH_THRESHOLD = 2;

      if (Math.abs(deltaY) >= TOUCH_THRESHOLD) {
        // Convert touch delta to frame velocity
        const TOUCH_SENSITIVITY = 0.08; // How responsive
        const touchVelocity = deltaY * TOUCH_SENSITIVITY;

        // Add touch velocity to current velocity
        // Swipe up = positive velocity = forward frames
        // Swipe down = negative velocity = backward frames
        velocityRef.current += touchVelocity;

        // Clamp velocity
        const MAX_VELOCITY = 2.5;
        velocityRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocityRef.current));

        // Update last touch position
        lastTouchYRef.current = currentY;

        // Start/continue animation
        startAnimation();
      }
    };

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Redraw current frame
      renderFrame(Math.round(currentFrameRef.current));
    };

    // Start preloading
    preloadImages();

    // Add event listeners
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden">
      {/* Loading Overlay */}
      {isPreloading && (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50">
          <h1 className="text-4xl tracking-[0.4em] mb-6 font-rotoris">
            ROTORIS
          </h1>
          <div className="w-64 h-1 bg-white/20 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="mt-4 text-white/70">{loadingProgress}%</p>
        </div>
      )}

      {/* Canvas Container - Fixed, no scrolling */}
      <div className="w-full h-full relative bg-black">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            display: "block",
            backgroundColor: "#000",
            willChange: "transform",
            touchAction: "none"
          }}
        />
      </div>

      {/* Debug HUD */}
      {!isPreloading && (
        <div className="fixed bottom-4 left-4 bg-black/70 text-white px-3 py-2 text-xs rounded z-20 transition-all duration-300 ease-in-out">
          Wheel/Swipe to animate • {FRAME_COUNT} frames
        </div>
      )}
    </div>
  );
}
