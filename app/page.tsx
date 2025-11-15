"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import gsap from "gsap";
import { AuriquaProduct } from "@/components/products/AuriquaProduct";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentScene, setCurrentScene] = useState(1);
  const [popupScene, setPopupScene] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showBrandText, setShowBrandText] = useState(false);

  const isAnimating = useRef(false);
  const scrollLock = useRef(false);
  const lastDirection = useRef<"forward" | "backward" | null>(null);
  const videoSetup = useRef(false);
  const introPlayed = useRef(false);

  const reverseAnimationId = useRef<number | null>(null);

  const SCROLL_LOCK_DELAY = 400;
  const FPS = 25; // your video fps
  const FRAME_DURATION = 1 / FPS; // seconds per frame

  // Video timestamps in seconds
  const timestamps = useMemo(() => [0, 7.12, 17.35, 30.5, 43], []);

  const scenes = [
    { id: 1, timestamp: 0 },
    { id: 2, timestamp: 7.12 },
    { id: 3, timestamp: 17.35, label: "Auriqua" },
    { id: 4, timestamp: 30.5, label: "Monarch" },
    { id: 5, timestamp: 43, label: "Arvion" },
  ];

  // ---------- video setup ----------
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoSetup.current) return;

    videoSetup.current = true;

    video.muted = true;
    video.playsInline = true;
    video.pause();

    const handleLoadedMetadata = () => {
      console.log("Video loaded, duration:", video.duration);
      video.currentTime = 0;
      setCurrentTime(0);

      if (!introPlayed.current) {
        introPlayed.current = true;
        playIntroSequence();
      }
    };

    const playIntroSequence = async () => {
      const FIRST_SCENE_END = timestamps[1]; // 7.12s
      const TEXT_START = 5;
      const TEXT_END = 7;

      try {
        video.currentTime = 0;
        scrollLock.current = true;
        await video.play();

        const checkTime = () => {
          const t = video.currentTime;

          if (t >= TEXT_START && t < TEXT_END && !showBrandText) {
            setShowBrandText(true);
          }

          if (t >= FIRST_SCENE_END) {
            video.pause();
            video.currentTime = FIRST_SCENE_END;
            setShowIntro(false);
            setCurrentScene(2);
            setCurrentTime(FIRST_SCENE_END);
            scrollLock.current = false;
            return;
          }

          if (!video.paused) {
            requestAnimationFrame(checkTime);
          }
        };

        requestAnimationFrame(checkTime);
      } catch (error) {
        console.error("Autoplay failed:", error);
        setShowIntro(false);
        scrollLock.current = false;
      }
    };

    const handleError = (e: any) => {
      console.error("Video error:", e);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("error", handleError);

    video.load();

    return () => {
      if (videoSetup.current) {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("error", handleError);
        videoSetup.current = false;
      }
      if (reverseAnimationId.current) {
        cancelAnimationFrame(reverseAnimationId.current);
        reverseAnimationId.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // cancel any running reverse animation on unmount
  useEffect(() => {
    return () => {
      if (reverseAnimationId.current) {
        cancelAnimationFrame(reverseAnimationId.current);
        reverseAnimationId.current = null;
      }
    };
  }, []);

  // ---------- playScene (video-based) ----------
  const playScene = useCallback(
    (forward: boolean) => {
      if (isAnimating.current) return;

      const newDirection = forward ? "forward" : "backward";
      if (lastDirection.current && lastDirection.current !== newDirection) {
        scrollLock.current = false;
      }
      lastDirection.current = newDirection;

      if (scrollLock.current) return;

      // Hide brand text when user scrolls from scene 2
      if (currentScene === 2 && showBrandText) {
        setShowBrandText(false);
      }

      isAnimating.current = true;
      scrollLock.current = true;

      const video = videoRef.current;
      if (!video || !video.duration) {
        isAnimating.current = false;
        scrollLock.current = false;
        return;
      }

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

      // stop any existing reverse animation
      if (reverseAnimationId.current) {
        cancelAnimationFrame(reverseAnimationId.current);
        reverseAnimationId.current = null;
      }

      video.pause();
      video.playbackRate = 1;

      if (forward) {
        // ---------- FORWARD: use native playback between startTime and endTime ----------
        video.currentTime = startTime;

        setTimeout(() => {
          video.play();

          const monitorPlayback = () => {
            if (video.currentTime >= endTime - 0.02) {
              video.pause();
              video.currentTime = endTime;
              setCurrentTime(endTime);
              setCurrentScene(newSceneId);
              isAnimating.current = false;

              setTimeout(() => {
                scrollLock.current = false;
              }, SCROLL_LOCK_DELAY);
              return;
            }

            if (!video.paused) {
              requestAnimationFrame(monitorPlayback);
            }
          };

          requestAnimationFrame(monitorPlayback);
        }, 40);
      } else {
        // ---------- BACKWARD: frame-locked reverse at 25fps ----------
        video.currentTime = startTime;

        const totalSegmentSeconds = Math.abs(startTime - endTime);
        // Optional: defensively clamp too-tiny segments
        if (totalSegmentSeconds < FRAME_DURATION / 2) {
          video.currentTime = endTime;
          setCurrentTime(endTime);
          setCurrentScene(newSceneId);
          isAnimating.current = false;
          setTimeout(() => {
            scrollLock.current = false;
          }, SCROLL_LOCK_DELAY);
          return;
        }

        let lastTimestamp: number | null = null;
        let accumulator = 0; // seconds accumulated since last frame step

        const step = (now: number) => {
          if (!videoRef.current) return; // safety
          const v = videoRef.current;

          if (lastTimestamp === null) {
            lastTimestamp = now;
            reverseAnimationId.current = requestAnimationFrame(step);
            return;
          }

          const deltaSec = (now - lastTimestamp) / 1000;
          lastTimestamp = now;
          accumulator += deltaSec;

          // Move one frame (or multiple if slow) for each FRAME_DURATION
          while (accumulator >= FRAME_DURATION) {
            accumulator -= FRAME_DURATION;

            const nextTime = v.currentTime - FRAME_DURATION;

            if (nextTime <= endTime + FRAME_DURATION / 4) {
              // reached or overshot target
              v.currentTime = endTime;
              setCurrentTime(endTime);
              setCurrentScene(newSceneId);
              isAnimating.current = false;

              if (reverseAnimationId.current) {
                cancelAnimationFrame(reverseAnimationId.current);
                reverseAnimationId.current = null;
              }

              setTimeout(() => {
                scrollLock.current = false;
              }, SCROLL_LOCK_DELAY);
              return;
            }

            v.currentTime = nextTime;
            setCurrentTime(nextTime);
          }

          reverseAnimationId.current = requestAnimationFrame(step);
        };

        reverseAnimationId.current = requestAnimationFrame(step);
      }
    },
    [currentScene, timestamps, scenes.length, showBrandText, FRAME_DURATION]
  );

  // ---------- input ----------
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (popupScene !== null) return;
      if (isAnimating.current || scrollLock.current) return;
      playScene(e.deltaY > 0);
    };
    window.addEventListener("wheel", onWheel, { passive: true });

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => (startY = e.touches[0].clientY);
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
    };
  }, [popupScene, playScene]);

  // ---------- buttons ----------
  const currentSceneData = scenes.find((s) => s.id === currentScene)!;

  const showButton = currentSceneData && currentScene >= 2;
  const buttonEnabled = showButton;

  // ---------- popups ----------
  const popupColors: Record<number, string> = {
    2: "#FFF8F0", // DISCOVER
    3: "#E9F7EF", // AURIQUA
    4: "#EAF2FF", // MONARCH
    5: "#FFF7E1", // EXCELLENCE
    6: "#FFECEC", // PASSION
    7: "#F0E8FF", // FINALE
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
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        muted
        playsInline
        preload="metadata"
        controls={false}
        loop={false}
        autoPlay={false}
      >
        <source src="/assets/home/rotoris-hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Intro Overlay - blocks interaction during intro */}
      {showIntro && <div className="fixed inset-0 z-50 pointer-events-auto" />}

      {/* Brand Text - shows from 5-7s and stays until user scrolls */}
      {showBrandText && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <h1
            className="text-8xl md:text-9xl font-bold text-white tracking-wider animate-fade-in"
            style={{
              fontFamily: "serif",
              textShadow: "0 0 40px rgba(255,255,255,0.5)",
              animation: "fadeInScale 2s ease-out forwards",
            }}
          >
            ROTORIS
          </h1>
        </div>
      )}

      <div className="fixed top-4 left-4 bg-black/70 text-white text-sm py-1 px-3 rounded font-mono z-20">
        Time: {currentTime.toFixed(2)}s
      </div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-center py-3 px-6 font-bold text-lg rounded-b-lg z-20">
        SCENE {currentScene} / {scenes.length}
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {showButton && currentSceneData && (
        <button
          disabled={!buttonEnabled}
          onClick={() => openPopup(currentSceneData.id)}
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-30 text-white uppercase tracking-[0.2em] text-sm transition-all ${
            buttonEnabled
              ? "opacity-100 cursor-pointer"
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
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full border border-black/40 flex items-center justify-center text-lg hover:bg-black/10 cursor-pointer"
          >
            ✕
          </button>

          <div className="space-y-6 p-6 md:p-10">
            {popupScene === 2 && (
              <>
                <h2 className="text-3xl font-bold mb-4">✨ Discover Scene</h2>
                <p className="text-lg text-black/80">
                  Hero reveal and cinematic introduction.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Introduction</p>
                  <p>• Brand story</p>
                  <p>• Ambient mood build-up</p>
                </section>
              </>
            )}
            {popupScene === 3 && <AuriquaProduct />}
            {popupScene === 4 && (
              <>
                <h2 className="text-3xl font-bold mb-4">⚙️ Technology Scene</h2>
                <p className="text-lg text-black/80">
                  Macro transitions highlighting technical precision.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Engineering excellence</p>
                  <p>• 3D modeling visuals</p>
                  <p>• Motion-capture integration</p>
                </section>
              </>
            )}
            {popupScene === 5 && (
              <>
                <h2 className="text-3xl font-bold mb-4">
                  🏆 Craftsmanship Scene
                </h2>
                <p className="text-lg text-black/80">
                  Showcasing artisan details and handcrafted perfection.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Hand finishing</p>
                  <p>• Heritage and legacy</p>
                  <p>• Premium material selection</p>
                </section>
              </>
            )}
            {popupScene === 6 && (
              <>
                <h2 className="text-3xl font-bold mb-4">🔥 Passion Scene</h2>
                <p className="text-lg text-black/80">
                  Emotion-driven segment exploring purpose and drive.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Vision and philosophy</p>
                  <p>• Behind the scenes</p>
                  <p>• Brand personality reveal</p>
                </section>
              </>
            )}
            {popupScene === 7 && (
              <>
                <h2 className="text-3xl font-bold mb-4">💎 Finale Scene</h2>
                <p className="text-lg text-black/80">
                  Cinematic outro with logo reveal and gratitude message.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Logo fade-in</p>
                  <p>• Closing message</p>
                  <p>• CTA or end transition</p>
                </section>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
