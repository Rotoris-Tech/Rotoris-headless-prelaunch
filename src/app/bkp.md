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
  const currentTween = useRef<gsap.core.Tween | null>(null);

  const getImagePath = (index: number) => {
    const padded = String(index).padStart(5, "0");
    return `/assets/Image-testing/cartier testing_${padded}.avif`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    gsap.registerPlugin(ScrollTrigger);

    // 🎞 FPS CONTROL =======================================================
    const fps = 60; // #===== CHANGE FPS HERE =====
    const frameDuration = 1000 / fps; // (ms per frame)
    // ======================================================================
    let lastRenderTime = 0;

    const render = () => {
      const now = performance.now();
      if (now - lastRenderTime < frameDuration) return;
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

    const playSequence = (forward: boolean) => {
      if (currentTween.current) currentTween.current.kill();

      const currentVal = frameIndex.current.value;
      const targetVal = forward ? totalFrames - 1 : 0;

      // 🎬 Split-speed logic ======================================
      // 1 → 50 very quick (~1s)
      // 50 → 208 cinematic (~5s)
      const fastThreshold = 50;
      const fastDuration = 1.0; // seconds for first part #===== FAST INTRO SPEED =====
      const normalDuration = 5.0; // seconds for rest #===== NORMAL PLAYBACK SPEED =====
      // ===========================================================

      // if starting before 50 → first jump to 50 quickly
      if (forward && currentVal < fastThreshold) {
        currentTween.current = gsap.to(frameIndex.current, {
          value: fastThreshold,
          duration: fastDuration,
          ease: "power1.inOut",
          snap: { value: 1 },
          onUpdate: render,
          onComplete: () => {
            // then smooth glide to end
            gsap.to(frameIndex.current, {
              value: totalFrames - 1,
              duration: normalDuration,
              ease: "none",
              snap: { value: 1 },
              onUpdate: render,
            });
          },
        });
      }
      // going backward and above 50 → go smooth back
      else if (!forward && currentVal > fastThreshold) {
        currentTween.current = gsap.to(frameIndex.current, {
          value: fastThreshold,
          duration: normalDuration,
          ease: "none",
          snap: { value: 1 },
          onUpdate: render,
          onComplete: () => {
            // then quick rewind to start
            gsap.to(frameIndex.current, {
              value: 0,
              duration: fastDuration,
              ease: "power1.inOut",
              snap: { value: 1 },
              onUpdate: render,
            });
          },
        });
      } else {
        // already past 50 or near ends → single tween
        currentTween.current = gsap.to(frameIndex.current, {
          value: targetVal,
          duration: normalDuration,
          ease: "none",
          snap: { value: 1 },
          onUpdate: render,
        });
      }
    };

    // 🖱️ desktop scroll / trackpad
    window.addEventListener("wheel", (e) => {
      if (e.deltaY > 0) playSequence(true);
      else if (e.deltaY < 0) playSequence(false);
    });

    // 📱 mobile touch gestures
    let touchStartY = 0;
    window.addEventListener(
      "touchstart",
      (e) => (touchStartY = e.touches[0].clientY),
      { passive: true }
    );
    window.addEventListener(
      "touchmove",
      (e) => {
        const touchEndY = e.touches[0].clientY;
        const delta = touchStartY - touchEndY;
        if (Math.abs(delta) > 25) {
          playSequence(delta > 0);
          touchStartY = touchEndY;
        }
        e.preventDefault();
      },
      { passive: false }
    );

    // keep scrolltrigger initialized
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: false,
    });

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="relative w-full bg-black h-screen overflow-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />

      {/* Frame counter */}
      <div className="fixed top-4 left-4 bg-black/70 text-white text-sm py-2 px-4 rounded-lg font-mono z-20">
        Frame {currentFrame} / {totalFrames}
      </div>

      {/* Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-10 bg-blue-600 text-white text-center py-4 px-8 font-bold text-xl rounded-b-lg">
        SCENE 1 – Scroll-Triggered Playback (ScrollTrigger ver.)
      </div>

      {/* Spacer */}
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
