"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);

  const totalFrames = 208;
  const images = useRef<HTMLImageElement[]>([]);
  const frameIndex = useRef({ value: 0 });

  const getImagePath = (index: number) => {
    const padded = String(index).padStart(5, "0");
    return `/assets/Image-testing/cartier testing_${padded}.avif`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ⚙️ Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // 🎞 FPS CONTROL  =======================================================
    // Each frame will be drawn at this FPS cap.
    // Increase to 60 for ultra-smooth or lower to 30/24 for slower render cadence.
    const fps = 60; // #===== CHANGE FPS HERE =====
    const frameDuration = 1000 / fps; // (ms per frame)
    // =======================================================================
    let lastRenderTime = 0;

    const render = () => {
      const now = performance.now();
      if (now - lastRenderTime < frameDuration) return; // throttle to FPS
      lastRenderTime = now;

      const frameNum = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(frameIndex.current.value))
      );

      const img = images.current[frameNum];
      if (!img || !img.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;
      if (canvasAspect > imgAspect) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgAspect;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgAspect;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      setCurrentFrame(frameNum + 1);
    };

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    const loadImages = () => {
      for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.src = getImagePath(i);
        images.current[i] = img;
      }
      images.current[0].onload = () => render();
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    loadImages();

    // ⚡ Scroll direction logic (trigger full playback)
    let lastScroll = window.scrollY;
    let animating = false;

    const playSequence = (forward: boolean) => {
      if (animating) return;
      animating = true;

      gsap.to(frameIndex.current, {
        value: forward ? totalFrames - 1 : 0,
        // 🎬 DURATION CONTROL  ==============================================
        // This controls how long (in seconds) the 1→204 or 204→1 animation lasts.
        // Increase this number for slower, more cinematic playback.
        duration: 5.0, // #===== CHANGE PLAYBACK DURATION HERE =====
        // ================================================================
        ease: "none",
        snap: { value: 1 },
        onUpdate: render,
        onComplete: () => {
          frameIndex.current.value = forward ? totalFrames - 1 : 0;
          render();
          setTimeout(() => (animating = false), 100);
        },
      });
    };

    // 👇 ScrollTrigger replaces manual scroll listener
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const current = self.scroll();
        const delta = current - lastScroll;

        if (Math.abs(delta) > 10) {
          if (delta > 0) playSequence(true);
          else playSequence(false);
        }

        lastScroll = current;
      },
    });

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="relative w-full bg-black">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />

      {/* Frame counter */}
      <div className="fixed top-4 left-4 bg-black/70 text-white text-sm py-2 px-4 rounded-lg font-mono z-20">
        Frame {currentFrame} / {totalFrames}
      </div>

      {/* Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-10 bg-blue-600 text-white text-center py-4 px-8 font-bold text-xl rounded-b-lg">
        SCENE 1 – Scroll-Triggered Playback (ScrollTrigger ver.)
      </div>

      {/* Scroll area (creates scroll gesture space) */}
      <div style={{ height: "300vh" }} />

      {/* Scroll hint */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="text-white text-xs font-mono bg-black/70 px-4 py-2 rounded-full">
          Scroll up or down to play animation
        </div>
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
