"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ScrollImageSequence - GSAP-powered ultra-smooth scroll-based image sequence animation
 *
 * @param {Object} props
 * @param {string} props.imagePath - Path to images folder (e.g., "/assets/images/sequence")
 * @param {number} props.totalFrames - Total number of images in sequence
 * @param {string} props.imagePrefix - Prefix for image files (e.g., "frame-")
 * @param {string} props.imageExtension - Image file extension (default: "jpg")
 * @param {number} props.startFrame - Starting frame number (default: 0)
 * @param {boolean} props.zeroPadding - Whether frame numbers are zero-padded (default: true)
 * @param {number} props.paddingLength - Length of zero padding (default: 4, e.g., "0001")
 * @param {string} props.className - Additional CSS classes
 */
export default function ScrollImageSequence({
  imagePath,
  totalFrames,
  imagePrefix = "frame-",
  imageExtension = "jpg",
  startFrame = 0,
  zeroPadding = true,
  paddingLength = 4,
  className = "",
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const frameIndexRef = useRef({ frame: 0 });
  const scrollTriggerRef = useRef(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate image filename with optional zero padding
  const getImageFilename = (frameNumber) => {
    const paddedNumber = zeroPadding
      ? String(frameNumber).padStart(paddingLength, "0")
      : frameNumber;
    return `${imagePath}/${imagePrefix}${paddedNumber}.${imageExtension}`;
  };

  // Progressive image loading - load first frames immediately, rest in background
  useEffect(() => {
    if (!isMounted) return;

    const PRIORITY_FRAMES = 30; // Load first 30 frames immediately for instant start
    const BATCH_SIZE = 50; // Load remaining frames in batches of 50

    const loadImages = async () => {
      const images = new Array(totalFrames);
      let loadedCount = 0;

      // Helper to load a single image
      const loadImage = (index) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          const frameNumber = startFrame + index;
          const imageUrl = getImageFilename(frameNumber);

          img.onload = () => {
            loadedCount++;
            setLoadProgress((loadedCount / totalFrames) * 100);
            resolve(img);
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${imageUrl}`);
            // Create a fallback image to prevent gaps
            resolve(img);
          };
          img.src = imageUrl;
        });
      };

      // Phase 1: Load first priority frames IMMEDIATELY
      const priorityPromises = [];
      for (let i = 0; i < Math.min(PRIORITY_FRAMES, totalFrames); i++) {
        priorityPromises.push(
          loadImage(i).then(img => {
            images[i] = img;
          })
        );
      }

      // Wait for priority frames to load
      await Promise.all(priorityPromises);

      // Set images reference and mark as ready
      imagesRef.current = images;
      setIsLoading(false);

      // Draw first frame immediately
      if (canvasRef.current && images[0]) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });
        canvas.width = images[0].width;
        canvas.height = images[0].height;
        ctx.drawImage(images[0], 0, 0);
      }

      // Phase 2: Load remaining frames in background (batched for performance)
      const loadRemainingFrames = async () => {
        for (let i = PRIORITY_FRAMES; i < totalFrames; i += BATCH_SIZE) {
          const batchPromises = [];
          const batchEnd = Math.min(i + BATCH_SIZE, totalFrames);

          for (let j = i; j < batchEnd; j++) {
            batchPromises.push(
              loadImage(j).then(img => {
                images[j] = img;
              })
            );
          }

          // Load batch, then pause briefly to not block UI
          await Promise.all(batchPromises);

          // Small delay between batches to keep UI responsive
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      };

      // Load remaining frames in background (non-blocking)
      loadRemainingFrames().catch(error => {
        console.error("Error loading remaining images:", error);
      });
    };

    loadImages();
  }, [isMounted, imagePath, totalFrames, imagePrefix, imageExtension, startFrame, zeroPadding, paddingLength]);

  // GSAP ScrollTrigger animation
  useEffect(() => {
    if (isLoading || !containerRef.current || !canvasRef.current || !isMounted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    const container = containerRef.current;

    // Function to render frame (with fallback for not-yet-loaded frames)
    const render = () => {
      const frameIndex = Math.round(frameIndexRef.current.frame);
      const frame = Math.max(0, Math.min(totalFrames - 1, frameIndex));
      const img = imagesRef.current[frame];

      if (img && img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else if (img) {
        // Image is loading, wait for it
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      } else {
        // Frame not loaded yet, find nearest loaded frame
        let nearestFrame = frame;
        let distance = 1;

        while (distance < totalFrames / 2) {
          // Check before
          const beforeIndex = frame - distance;
          if (beforeIndex >= 0 && imagesRef.current[beforeIndex]?.complete) {
            nearestFrame = beforeIndex;
            break;
          }

          // Check after
          const afterIndex = frame + distance;
          if (afterIndex < totalFrames && imagesRef.current[afterIndex]?.complete) {
            nearestFrame = afterIndex;
            break;
          }

          distance++;
        }

        // Draw nearest available frame
        const fallbackImg = imagesRef.current[nearestFrame];
        if (fallbackImg && fallbackImg.complete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(fallbackImg, 0, 0, canvas.width, canvas.height);
        }
      }
    };

    // Create GSAP animation with smooth momentum
    const animation = gsap.to(frameIndexRef.current, {
      frame: totalFrames - 1,
      ease: "none",
      onUpdate: render,
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Smooth momentum - animation continues smoothly after scroll stops
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    scrollTriggerRef.current = animation.scrollTrigger;

    // Initial render
    render();

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      animation.kill();
    };
  }, [isLoading, totalFrames, isMounted]);

  // Resize canvas to cover viewport (like object-fit: cover)
  useEffect(() => {
    if (isLoading || !canvasRef.current || !imagesRef.current[0]) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      const img = imagesRef.current[0];

      if (img && img.complete) {
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Get image aspect ratio
        const imgAspect = img.width / img.height;
        const viewportAspect = viewportWidth / viewportHeight;

        let renderWidth, renderHeight;

        // Calculate dimensions to cover viewport (like object-fit: cover)
        if (viewportAspect > imgAspect) {
          // Viewport is wider - fit to width
          renderWidth = viewportWidth;
          renderHeight = viewportWidth / imgAspect;
        } else {
          // Viewport is taller - fit to height
          renderHeight = viewportHeight;
          renderWidth = viewportHeight * imgAspect;
        }

        // Set canvas internal resolution to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Set canvas display size to cover viewport
        canvas.style.width = `${renderWidth}px`;
        canvas.style.height = `${renderHeight}px`;

        // Redraw current frame
        const ctx = canvas.getContext("2d", { alpha: false });
        const frameIndex = Math.round(frameIndexRef.current.frame);
        const currentImg = imagesRef.current[frameIndex];
        if (currentImg && currentImg.complete) {
          ctx.drawImage(currentImg, 0, 0);
        }

        // Refresh ScrollTrigger
        if (scrollTriggerRef.current) {
          ScrollTrigger.refresh();
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoading]);

  // Calculate scroll height based on frame count
  const scrollHeight = Math.max(300, totalFrames * 0.5);

  // Prevent rendering until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <div className={`relative ${className}`} style={{ height: `${scrollHeight}vh` }}>
        <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center justify-center gap-4 px-4">
            <div className="w-full max-w-md h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              Initializing...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: `${scrollHeight}vh`, margin: 0, padding: 0 }}
    >
      <div
        className="sticky left-0 w-full flex items-center justify-center overflow-hidden"
        style={{
          top: 0,
          height: '100vh',
          height: '100dvh', // Dynamic viewport height for mobile
          margin: 0,
          padding: 0
        }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 px-4">
            <div className="w-full max-w-md h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 dark:bg-zinc-50 transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              Loading frames... {Math.round(loadProgress)}%
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              {totalFrames} frames • GSAP Powered
            </p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
            style={{
              imageRendering: "high-quality",
              willChange: "contents"
            }}
          />
        )}
      </div>
    </div>
  );
}
