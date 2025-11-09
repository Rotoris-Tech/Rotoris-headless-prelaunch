"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [showDiscover, setShowDiscover] = useState(false);
  const [discoverEnabled, setDiscoverEnabled] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const totalFrames = 208;
  const skipFrames = 30;
  const images = useRef<HTMLImageElement[]>([]);
  const frameIndex = useRef({ value: skipFrames });
  const currentTween = useRef<gsap.core.Tween | null>(null);

  const getImagePath = (i: number) =>
    `/assets/Image-testing/cartier testing_${String(i).padStart(5, "0")}.avif`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    gsap.registerPlugin(ScrollTrigger);

    const fps = 120;
    const frameDuration = 1000 / fps;
    let lastRenderTime = 0;

    const render = () => {
      const now = performance.now();
      if (now - lastRenderTime < frameDuration) return;
      lastRenderTime = now;

      const frameNum = Math.min(
        totalFrames - 1,
        Math.max(skipFrames, Math.round(frameIndex.current.value))
      );

      const img = images.current[frameNum];
      if (!img || !img.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cA = canvas.width / canvas.height;
      const iA = img.width / img.height;
      let drawW, drawH, offsetX, offsetY;
      if (cA > iA) {
        drawW = canvas.width;
        drawH = canvas.width / iA;
        offsetX = 0;
        offsetY = (canvas.height - drawH) / 2;
      } else {
        drawH = canvas.height;
        drawW = canvas.height * iA;
        offsetX = (canvas.width - drawW) / 2;
        offsetY = 0;
      }
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      setCurrentFrame(frameNum + 1);

      // 🎯 DISCOVER visibility logic (bidirectional)
      if (frameNum >= 120) {
        if (!showDiscover) setShowDiscover(true);
      } else if (showDiscover) {
        setShowDiscover(false);
      }

      // Enable only at final frame
      setDiscoverEnabled(frameNum >= totalFrames - 1);
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
      images.current[skipFrames].onload = () => render();
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    loadImages();

    const playSequence = (forward: boolean) => {
      if (popupOpen) return;
      if (currentTween.current) currentTween.current.kill();

      const fastDuration = 0.6;
      const normalDuration = 5.0;
      const from = frameIndex.current.value;
      const to = forward ? totalFrames - 1 : skipFrames;
      const duration =
        forward && from === skipFrames
          ? fastDuration + normalDuration
          : normalDuration;

      currentTween.current = gsap.to(frameIndex.current, {
        value: to,
        duration,
        ease: "none",
        snap: { value: 1 },
        onStart: render,
        onUpdate: render,
      });
    };

    const wheelHandler = (e: WheelEvent) => playSequence(e.deltaY > 0);
    window.addEventListener("wheel", wheelHandler);

    // 🖐 Touch logic
    let touchY = 0;
    const touchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY);
    const touchMove = (e: TouchEvent) => {
      if (popupOpen) return;
      const delta = touchY - e.touches[0].clientY;
      if (Math.abs(delta) > 25) {
        playSequence(delta > 0);
        touchY = e.touches[0].clientY;
      }
      e.preventDefault();
    };
    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchmove", touchMove, { passive: false });

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
    });

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [popupOpen, showDiscover]);

  return (
    <div className="relative w-full bg-black h-screen overflow-hidden">
      {/* === Canvas === */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />

      {/* === Frame counter === */}
      <div className="fixed top-4 left-4 bg-black/70 text-white text-sm py-2 px-4 rounded-lg font-mono z-20">
        Frame {currentFrame} / {totalFrames}
      </div>

      {/* === Header === */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-10 bg-blue-600 text-white text-center py-4 px-8 font-bold text-xl rounded-b-lg">
        SCENE 1 – Scroll-Triggered Playback (ScrollTrigger ver.)
      </div>

      {/* === Discover button === */}
      {showDiscover && (
        <button
          disabled={!discoverEnabled}
          onClick={() => setPopupOpen(true)}
          className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-30 text-white uppercase tracking-[0.2em] font-light text-sm transition-all duration-700 opacity-0 animate-[fadeIn_1s_ease_forwards]
            ${discoverEnabled ? "cursor-pointer" : "cursor-not-allowed"}`}
          style={{ background: "transparent" }}
        >
          DISCOVER
          <span className="block mx-auto mt-1 h-[1px] w-8 bg-white/70" />
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
          `}</style>
        </button>
      )}

      {/* === Scroll hint === */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="text-white text-xs font-mono bg-black/70 px-4 py-2 rounded-full">
          Scroll up or down to play animation
        </div>
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>

      {/* === Popup overlay === */}
      {popupOpen && (
        <div
          className="fixed bottom-0 left-0 w-full h-full bg-white text-black z-50 overflow-y-auto animate-[rise_0.4s_ease-out_forwards]"
          onAnimationEnd={(e) => {
            if ((e.target as HTMLElement).classList.contains("closing")) {
              setPopupOpen(false);
            }
          }}
        >
          <style jsx>{`
            @keyframes rise {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
            @keyframes slideDown {
              from {
                transform: translateY(0);
              }
              to {
                transform: translateY(100%);
              }
            }
          `}</style>

          {/* Close button */}
          <button
            onClick={(e) => {
              const el = (e.target as HTMLElement).closest("div");
              if (el) {
                el.classList.add("closing");
                el.classList.remove("animate-[rise_0.4s_ease-out_forwards]");
                el.style.animation = "slideDown 0.4s ease-in forwards";
                setTimeout(() => setPopupOpen(false), 400);
              }
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full border border-black/30 flex items-center justify-center text-lg hover:bg-black/5"
          >
            ✕
          </button>

          {/* Popup content */}
          <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold mb-4">Discover More</h2>
            <p className="text-gray-600 leading-relaxed">
              This is your Discover section. You can add any future sections or
              components here. Scrolling this panel does not affect the
              background animation.
            </p>

            {[...Array(8)].map((_, i) => (
              <p key={i} className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                ut efficitur eros. (Section {i + 1})
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
