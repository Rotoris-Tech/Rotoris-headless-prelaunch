"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { gsap } from "gsap";

type CanvasScrollVideoProps = {
  videoSrc: string;
  /** Optional, for future use if you want a taller container; currently full-screen */
  height?: string;
};

export function CanvasScrollVideo({
  videoSrc,
}: CanvasScrollVideoProps) {
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
  const animationTimeoutIds = useRef<number[]>([]);

  const SCROLL_LOCK_DELAY = 500; // ms
  const FRAME_INTERVAL_MS = 1000 / 25; // 25 FPS

  // Video timestamps in seconds
  const timestamps = useMemo(
    () => [0, 16, 31, 35],
    []
  );

  const scenes = [
    { id: 1, timestamp: 0, label: "DISCOVER" },
    { id: 2, timestamp: 16, label: "INNOVATION" },
    { id: 3, timestamp: 31, label: "CRAFTSMANSHIP" },
    { id: 4, timestamp: 35, label: "EXCELLENCE" },
  ];

  // Store video metadata for aspect-ratio correct drawing
  const videoMetaRef = useRef({
    width: 1920,
    height: 1080,
    duration: 0,
  });

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // ---------- canvas helpers ----------
  const setupCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !container || !ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = window.innerHeight * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }, []);

  const drawFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!video || !canvas || !ctx) return;
    if (!videoMetaRef.current.duration) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const { width: vW, height: vH, duration } = videoMetaRef.current;

    ctx.clearRect(0, 0, width, height);

    const videoAspect = vW / vH;
    const canvasAspect = width / height;

    let drawWidth: number;
    let drawHeight: number;
    let dx: number;
    let dy: number;

    if (canvasAspect > videoAspect) {
      // canvas is wider -> full width, crop top/bottom
      drawWidth = width;
      drawHeight = width / videoAspect;
      dx = 0;
      dy = (height - drawHeight) / 2;
    } else {
      // canvas is taller -> full height, crop sides
      drawHeight = height;
      drawWidth = height * videoAspect;
      dx = (width - drawWidth) / 2;
      dy = 0;
    }

    // Slight 3D-ish motion based on global progress
    const progress = duration ? video.currentTime / duration : 0;
    const zoom = 1.05 + progress * 0.08;
    const yOffset = (progress - 0.5) * 40;

    ctx.save();
    ctx.translate(width / 2, height / 2 + yOffset);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    try {
      ctx.drawImage(video, dx, dy, drawWidth, drawHeight);
    } catch {
      // drawImage can throw while seeking; safe to ignore here
    }

    ctx.restore();
  }, []);

  // ---------- video + canvas setup ----------
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!video || !canvas || !container || videoSetup.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    videoSetup.current = true;

    video.src = videoSrc;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.loop = false;

    const handleLoadedMetadata = () => {
      videoMetaRef.current = {
        width: video.videoWidth || 1920,
        height: video.videoHeight || 1080,
        duration: video.duration || 0,
      };

      setupCanvasSize();

      // Start at first scene time
      const start = timestamps[0] ?? 0;
      video.currentTime = start;
      setCurrentTime(start);

      // Wait a bit for the seek to land, then draw first frame
      setTimeout(() => {
        drawFrame();
      }, 50);
    };

    const handleError = (e: any) => {
      console.error("Video error:", e);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);

    const handleResize = () => {
      setupCanvasSize();
      drawFrame();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
      window.removeEventListener("resize", handleResize);
      videoSetup.current = false;
    };
  }, [videoSrc, setupCanvasSize, drawFrame, timestamps]);

  // clear any running timeouts
  const clearAllAnimationTimeouts = useCallback(() => {
    animationTimeoutIds.current.forEach((id) => clearTimeout(id));
    animationTimeoutIds.current = [];
  }, []);

  // ---------- playScene with manual 25 FPS ----------
  const playScene = useCallback(
    (forward: boolean) => {
      if (isAnimating.current) return;

      const newDirection = forward ? "forward" : "backward";
      if (lastDirection.current && lastDirection.current !== newDirection) {
        scrollLock.current = false;
      }
      lastDirection.current = newDirection;

      if (scrollLock.current) return;

      const video = videoRef.current;
      if (!video || !videoMetaRef.current.duration) return;

      isAnimating.current = true;
      scrollLock.current = true;

      let newSceneId = currentScene;
      let startTime = timestamps[currentScene - 1];
      let endTime = timestamps[currentScene - 1];

      if (forward) {
        if (currentScene < scenes.length) {
          newSceneId = currentScene + 1;
          startTime = timestamps[currentScene - 1];
          endTime = timestamps[newSceneId - 1];
        } else {
          isAnimating.current = false;
          scrollLock.current = false;
          return;
        }
      } else {
        if (currentScene > 1) {
          newSceneId = currentScene - 1;
          startTime = timestamps[currentScene - 1];
          endTime = timestamps[newSceneId - 1];
        } else {
          isAnimating.current = false;
          scrollLock.current = false;
          return;
        }
      }

      clearAllAnimationTimeouts();

      const segmentDuration = Math.abs(endTime - startTime);
      const steps = Math.max(1, Math.round(segmentDuration * 25)); // 25fps
      const delta = (endTime - startTime) / steps;

      let currentStep = 0;

      const step = () => {
        const videoEl = videoRef.current;
        if (!videoEl) {
          clearAllAnimationTimeouts();
          isAnimating.current = false;
          scrollLock.current = false;
          return;
        }

        if (currentStep > steps) {
          // Finish on exact end time
          videoEl.currentTime = endTime;
          setCurrentTime(endTime);
          setCurrentScene(newSceneId);
          drawFrame();

          isAnimating.current = false;
          setTimeout(() => {
            scrollLock.current = false;
          }, SCROLL_LOCK_DELAY);

          clearAllAnimationTimeouts();
          return;
        }

        const newTime = startTime + delta * currentStep;
        videoEl.currentTime = newTime;
        setCurrentTime(newTime);
        drawFrame();

        currentStep++;
        const id = window.setTimeout(step, FRAME_INTERVAL_MS);
        animationTimeoutIds.current.push(id);
      };

      // Kick off manual stepping (25fps)
      step();
    },
    [
      currentScene,
      timestamps,
      scenes.length,
      clearAllAnimationTimeouts,
      drawFrame,
      FRAME_INTERVAL_MS,
    ]
  );

  // ---------- scroll & touch input ----------
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (popupScene !== null) return;
      if (isAnimating.current || scrollLock.current) return;
      playScene(e.deltaY > 0);
    };

    window.addEventListener("wheel", onWheel, { passive: true });

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (popupScene !== null) return;
      if (isAnimating.current || scrollLock.current) return;
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
      clearAllAnimationTimeouts();
    };
  }, [popupScene, playScene, clearAllAnimationTimeouts]);

  // ---------- scene / button / popups ----------
  const currentSceneData = scenes.find((s) => s.id === currentScene)!;
  const showButton = currentSceneData && currentScene > 1;
  const buttonEnabled = showButton;

  const popupColors: Record<number, string> = {
    1: "#FFF8F0",
    2: "#E9F7EF",
    3: "#EAF2FF",
    4: "#FFF7E1",
  };

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

  // ---------- UI ----------
  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/* Canvas = visual layer */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full block z-0"
      />

      {/* Hidden video as frame source */}
      <video
        ref={videoRef}
        className="hidden"
        muted
        playsInline
        preload="auto"
      />

      {/* Overlays */}
      <div className="fixed top-4 left-4 bg-black/70 text-white text-sm py-1 px-3 rounded font-mono z-20">
        Time: {currentTime.toFixed(2)}s
      </div>

      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white text-center py-3 px-6 font-bold text-lg rounded-b-lg z-20 border-b border-white/20">
        SCENE {currentScene} / {scenes.length}
      </div>

      {showButton && currentSceneData && (
        <button
          disabled={!buttonEnabled}
          onClick={() => openPopup(currentSceneData.id)}
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-30 text-white uppercase tracking-[0.2em] text-sm transition-all duration-300 ${
            buttonEnabled
              ? "opacity-100 cursor-pointer hover:scale-110"
              : "opacity-40 cursor-not-allowed"
          }`}
        >
          {currentSceneData.label}
          <span className="block mx-auto mt-1 h-[1px] w-8 bg-white/70" />
        </button>
      )}

      {popupScene && (
        <div
          className="popup fixed inset-0 text-black z-50 overflow-y-auto"
          style={{ background: popupColors[popupScene] }}
        >
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 w-10 h-10 rounded-full border border-black/40 flex items-center justify-center text-lg hover:bg-black/10 cursor-pointer"
          >
            ✕
          </button>

          <div className="p-8 space-y-6">
            {popupScene === 1 && (
              <>
                <h2 className="text-3xl font-bold mb-4 font-rotoris">
                  ✨ Discover Rotoris
                </h2>
                <p className="text-lg text-black/80">
                  Introducing the art of precision timekeeping.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Heritage craftsmanship</p>
                  <p>• Swiss precision</p>
                  <p>• Timeless design</p>
                </section>
              </>
            )}
            {popupScene === 2 && (
              <>
                <h2 className="text-3xl font-bold mb-4 font-rotoris">
                  🚀 Innovation
                </h2>
                <p className="text-lg text-black/80">
                  Cutting-edge technology meets traditional watchmaking.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Advanced materials</p>
                  <p>• Precision engineering</p>
                  <p>• Sustainable practices</p>
                </section>
              </>
            )}
            {popupScene === 3 && (
              <>
                <h2 className="text-3xl font-bold mb-4 font-rotoris">
                  🏆 Craftsmanship
                </h2>
                <p className="text-lg text-black/80">
                  Every detail meticulously crafted by master artisans.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Hand-finished components</p>
                  <p>• Premium materials</p>
                  <p>• Quality assurance</p>
                </section>
              </>
            )}
            {popupScene === 4 && (
              <>
                <h2 className="text-3xl font-bold mb-4 font-rotoris">
                  💎 Excellence
                </h2>
                <p className="text-lg text-black/80">
                  Uncompromising standards in every timepiece.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Rigorous testing</p>
                  <p>• Lifetime warranty</p>
                  <p>• Exclusive service</p>
                </section>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
