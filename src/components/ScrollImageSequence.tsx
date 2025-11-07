"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollImageSequenceProps {
  imagePath: string;
  totalFrames: number;
  imagePrefix: string;
  imageExtension?: string;
  startFrame?: number;
  zeroPadding?: boolean;
  paddingLength?: number;
}

export default function ScrollImageSequence({
  imagePath,
  totalFrames,
  imagePrefix,
  imageExtension = "avif",
  startFrame = 0,
  zeroPadding = true,
  paddingLength = 5,
}: ScrollImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generate image filename
    const currentFrame = (index: number) => {
      const frameNumber = startFrame + index;
      const paddedNumber = zeroPadding
        ? String(frameNumber).padStart(paddingLength, "0")
        : frameNumber;
      return `${imagePath}/${imagePrefix}${paddedNumber}.${imageExtension}`;
    };

    // Load all images
    const images: HTMLImageElement[] = [];
    const airpods = { frame: 0 };

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    // Render function with object-fit: cover
    function render() {
      if (!context || !canvas) return;

      const img = images[airpods.frame];
      if (!img || !img.complete) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate scale to cover viewport (like object-fit: cover)
      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = img.width / img.height;

      let renderWidth, renderHeight, offsetX, offsetY;

      if (canvasAspect > imgAspect) {
        // Canvas is wider - fit to width
        renderWidth = canvas.width;
        renderHeight = canvas.width / imgAspect;
        offsetX = 0;
        offsetY = (canvas.height - renderHeight) / 2;
      } else {
        // Canvas is taller - fit to height
        renderHeight = canvas.height;
        renderWidth = canvas.height * imgAspect;
        offsetX = (canvas.width - renderWidth) / 2;
        offsetY = 0;
      }

      // Draw image covering entire canvas, centered
      context.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
    }

    // GSAP animation with smooth frame transitions
    gsap.to(airpods, {
      frame: totalFrames - 1,
      snap: {
        frame: 1, // Snap to each frame
      },
      ease: "power1.inOut", // Smooth easing between frames
      scrollTrigger: {
        scrub: 1.5, // Higher value = more momentum and smooth transitions
      },
      onUpdate: render,
    });

    images[0].onload = render;

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [imagePath, totalFrames, imagePrefix, imageExtension, startFrame, zeroPadding, paddingLength]);

  return <canvas ref={canvasRef} id="hero-lightpass" />;
}
