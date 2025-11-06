"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ScrollImageSequence - Ultra-smooth scroll-based image sequence animation
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
  const frameRef = useRef(0);
  const rafRef = useRef(null);

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

  // Preload all images
  useEffect(() => {
    if (!isMounted) return;

    const loadImages = async () => {
      const imagePromises = [];
      const images = [];
      let loadedCount = 0;

      for (let i = startFrame; i < startFrame + totalFrames; i++) {
        const img = new Image();
        const imageUrl = getImageFilename(i);

        const promise = new Promise((resolve, reject) => {
          img.onload = () => {
            loadedCount++;
            setLoadProgress((loadedCount / totalFrames) * 100);
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${imageUrl}`);
            reject();
          };
          img.src = imageUrl;
        });

        images.push(img);
        imagePromises.push(promise);
      }

      imagesRef.current = images;

      try {
        await Promise.all(imagePromises);
        setIsLoading(false);
        // Draw first frame
        if (canvasRef.current && images[0]) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d", { alpha: false });
          canvas.width = images[0].width;
          canvas.height = images[0].height;
          ctx.drawImage(images[0], 0, 0);
        }
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, [isMounted, imagePath, totalFrames, imagePrefix, imageExtension, startFrame, zeroPadding, paddingLength]);

  // Ultra-smooth scroll animation
  useEffect(() => {
    if (isLoading || !containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    const container = containerRef.current;

    const render = () => {
      const rect = container.getBoundingClientRect();
      const scrollStart = -rect.top;
      const scrollEnd = rect.height - window.innerHeight;

      // Calculate progress (0 to 1)
      let scrollProgress = scrollStart / scrollEnd;
      scrollProgress = Math.max(0, Math.min(1, scrollProgress));

      // Calculate frame index with smooth interpolation
      const frameIndex = scrollProgress * (totalFrames - 1);
      const targetFrame = Math.round(frameIndex);

      // Clamp frame index
      const frame = Math.max(0, Math.min(totalFrames - 1, targetFrame));

      // Only draw if frame changed
      if (frame !== frameRef.current) {
        frameRef.current = frame;
        const img = imagesRef.current[frame];

        if (img && img.complete) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      }

      // Continue animation loop
      rafRef.current = requestAnimationFrame(render);
    };

    // Start render loop
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isLoading, totalFrames]);

  // Resize canvas to maintain aspect ratio
  useEffect(() => {
    if (isLoading || !canvasRef.current || !imagesRef.current[0]) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      const img = imagesRef.current[0];

      if (img && img.complete) {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.style.width = "100%";
        canvas.style.height = "auto";

        // Redraw current frame
        const ctx = canvas.getContext("2d", { alpha: false });
        const currentImg = imagesRef.current[frameRef.current];
        if (currentImg && currentImg.complete) {
          ctx.drawImage(currentImg, 0, 0);
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
      style={{ height: `${scrollHeight}vh` }}
    >
      <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden">
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
              {totalFrames} frames
            </p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full h-auto object-contain"
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
