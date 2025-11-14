"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { homeScenes } from "@/app/homeSceneData";

type Props = {
  videoSrc: string;
};

export function CanvasScrollSceneVideo({ videoSrc }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [currentScene, setCurrentScene] = useState(1);
  const [popupScene, setPopupScene] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const isAnimating = useRef(false);
  const scrollLock = useRef(false);
  const lastDirection = useRef<"forward" | "backward" | null>(null);
  const videoSetup = useRef(false);
  const animationTimeoutIds = useRef<NodeJS.Timeout[]>([]);

  const FRAME_INTERVAL = 1000 / 25; // 25fps
  const SCROLL_LOCK_DELAY = 500;

  // Default 1920x1080 inside canvas
  const videoMetaRef = useRef({
    width: 1920,
    height: 1080,
    duration: 0,
  });

  // Use scenes from homeSceneData
  const scenes = homeScenes;
  const timestamps = useMemo(() => scenes.map(s => s.timestamp), [scenes]);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // -------------------------------
  // Setup canvas + maintain aspect
  // -------------------------------
  const setupCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !container || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }, []);

  // --------------------------------
  // Draw frame into canvas (object-fit: cover)
  // --------------------------------
  const drawFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!video || !canvas || !ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const { width: vW, height: vH } = videoMetaRef.current;

    ctx.clearRect(0, 0, width, height);

    const canvasAspect = width / height;
    const videoAspect = vW / vH;

    let drawWidth, drawHeight, dx, dy;

    if (canvasAspect > videoAspect) {
      drawWidth = width;
      drawHeight = width / videoAspect;
      dx = 0;
      dy = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = height * videoAspect;
      dx = (width - drawWidth) / 2;
      dy = 0;
    }

    try {
      ctx.drawImage(video, dx, dy, drawWidth, drawHeight);
    } catch {}
  }, []);

  // ------------------------------
  // Video metadata + initial frame
  // ------------------------------
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || videoSetup.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    videoSetup.current = true;

    video.src = videoSrc;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const handleLoadedMetadata = () => {
      videoMetaRef.current = {
        width: video.videoWidth || 1920,
        height: video.videoHeight || 1080,
        duration: video.duration || 0,
      };
      setupCanvasSize();

      // Set initial time and draw first frame
      const start = timestamps[0] ?? 0;
      video.currentTime = start;
      setCurrentTime(start);

      setTimeout(drawFrame, 50);
    };

    const handleResize = () => {
      setupCanvasSize();
      drawFrame();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    window.addEventListener("resize", handleResize);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      window.removeEventListener("resize", handleResize);
      videoSetup.current = false;
    };
  }, [videoSrc, setupCanvasSize, drawFrame, timestamps]);

  // Cleanup animation timeouts
  const clearTimeouts = useCallback(() => {
    animationTimeoutIds.current.forEach(clearTimeout);
    animationTimeoutIds.current = [];
  }, []);

  // ------------------------------------------------
  // Manual stepping between timestamps (25fps)
  // ------------------------------------------------
  const playScene = useCallback(
    (forward: boolean) => {
      if (isAnimating.current || scrollLock.current) return;

      const direction = forward ? "forward" : "backward";
      if (lastDirection.current && lastDirection.current !== direction) {
        scrollLock.current = false;
      }
      lastDirection.current = direction;

      const video = videoRef.current;
      if (!video) return;

      const current = currentScene;
      let next = current;

      let start = timestamps[current - 1];
      let end = timestamps[current - 1];

      if (forward) {
        if (current < scenes.length) {
          next = current + 1;
          start = timestamps[current - 1];
          end = timestamps[next - 1];
        } else return;
      } else {
        if (current > 1) {
          next = current - 1;
          start = timestamps[current - 1];
          end = timestamps[next - 1];
        } else return;
      }

      clearTimeouts();

      const total = Math.abs(end - start);
      const steps = Math.max(1, Math.round(total * 25));
      const delta = (end - start) / steps;

      let stepIndex = 0;

      isAnimating.current = true;
      scrollLock.current = true;

      const step = () => {
        const newTime = start + stepIndex * delta;
        video.currentTime = newTime;
        setCurrentTime(newTime);
        drawFrame();

        if (stepIndex >= steps) {
          setCurrentScene(next);
          isAnimating.current = false;

          setTimeout(() => {
            scrollLock.current = false;
          }, SCROLL_LOCK_DELAY);

          return;
        }

        stepIndex++;
        const timeoutId = setTimeout(step, FRAME_INTERVAL);
        animationTimeoutIds.current.push(timeoutId);
      };

      step();
    },
    [
      currentScene,
      timestamps,
      scenes.length,
      FRAME_INTERVAL,
      SCROLL_LOCK_DELAY,
      drawFrame,
      clearTimeouts,
    ]
  );

  // ---------------------------
  // Scroll & Touch Navigation
  // ---------------------------
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (popupScene) return;
      if (scrollLock.current || isAnimating.current) return;
      playScene(e.deltaY > 0);
    };

    window.addEventListener("wheel", onWheel, { passive: true });

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => (startY = e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (popupScene) return;
      if (scrollLock.current || isAnimating.current) return;
      const delta = startY - e.touches[0].clientY;
      if (Math.abs(delta) > 30) {
        playScene(delta > 0);
        startY = e.touches[0].clientY;
      }
    };

    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      clearTimeouts();
    };
  }, [popupScene, playScene, clearTimeouts]);

  // ---------------------------
  // Popup logic
  // ---------------------------
  const openPopup = (id: number) => {
    if (popupScene) return;
    setPopupScene(id);
  };

  useEffect(() => {
    if (popupScene) {
      gsap.fromTo(
        ".popup",
        { y: "100%" },
        { y: "0%", duration: 0.6, ease: "power3.out" }
      );
    }
  }, [popupScene]);

  const closePopup = () => {
    gsap.to(".popup", {
      y: "100%",
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => setPopupScene(null),
    });
  };

  const currentProduct = popupScene ? scenes.find(s => s.id === popupScene)?.product : null;

  // ---------------------------
  // UI + Render
  // ---------------------------
  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-0"
      />

      {/* Hidden video */}
      <video ref={videoRef} className="hidden" muted playsInline preload="auto" />

      {/* Time display */}
      <div className="fixed top-4 left-4 text-white bg-black/70 px-3 py-1 z-20 rounded font-mono text-sm">
        Time: {currentTime.toFixed(2)}s
      </div>

      {/* Scene indicator */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-3 text-white z-20 rounded-b-lg border-b border-white/20 font-bold text-lg">
        SCENE {currentScene} / {scenes.length}
      </div>

      {/* Scene label button */}
      {currentScene > 1 && (
        <button
          onClick={() => openPopup(currentScene)}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 text-white uppercase tracking-[0.2em] text-sm z-30 transition-all duration-300 hover:scale-110"
        >
          {scenes[currentScene - 1].label}
          <span className="block mx-auto mt-1 w-8 h-[1px] bg-white/70" />
        </button>
      )}

      {/* Product Popup */}
      {popupScene && currentProduct && (
        <div
          className="popup fixed inset-0 z-50 text-black overflow-y-auto"
          style={{ background: currentProduct.backgroundColor }}
        >
          {/* Close Button */}
          <button
            onClick={closePopup}
            className="absolute top-6 right-6 w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl hover:scale-110 transition-transform z-10"
            style={{ borderColor: currentProduct.accentColor, color: currentProduct.accentColor }}
          >
            ✕
          </button>

          {/* Product Content */}
          <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
            <div className="max-w-4xl w-full space-y-8">

              {/* Product Header */}
              <div className="text-center space-y-4">
                <h2 className="text-5xl md:text-7xl font-bold font-rotoris" style={{ color: currentProduct.accentColor }}>
                  {currentProduct.name}
                </h2>
                <p className="text-2xl md:text-3xl text-black/70 font-light">
                  {currentProduct.tagline}
                </p>
              </div>

              {/* Product Image (if available) */}
              {currentProduct.image && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Product Description */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <p className="text-lg md:text-xl text-black/80 leading-relaxed">
                  {currentProduct.description}
                </p>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentProduct.features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border-2 hover:scale-105 transition-transform"
                    style={{ borderColor: `${currentProduct.accentColor}20` }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: currentProduct.accentColor }}
                      />
                      <p className="text-base md:text-lg text-black/90 font-medium">
                        {feature}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="flex justify-center pt-6">
                <Link
                  href={scenes.find(s => s.id === popupScene)?.productSlug || "/"}
                  className="group relative px-12 py-5 text-lg font-bold rounded-full overflow-hidden transition-all hover:scale-105 shadow-xl"
                  style={{
                    backgroundColor: currentProduct.accentColor,
                    color: 'white'
                  }}
                >
                  <span className="relative z-10">
                    {popupScene === 4 ? "Join Our Newsletter" : "Explore Collection"}
                  </span>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
