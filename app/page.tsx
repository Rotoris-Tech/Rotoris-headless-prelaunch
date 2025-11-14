"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import gsap from "gsap";

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
  const currentTimeUpdateHandler = useRef<((e: Event) => void) | null>(null);
  const reverseAnimationId = useRef<number | null>(null);
  const reverseTimeoutIds = useRef<NodeJS.Timeout[]>([]);
  const introPlayed = useRef(false);

  const SCROLL_LOCK_DELAY = 500; // Longer delay to prevent multiple triggers

  // Video timestamps in seconds
  // Intro plays from 0 to 7.12s, then scene 1 starts at 7.12s and ends at 15.8s
  const timestamps = useMemo(() => [0, 7.12, 17.95, 31.1, 35], []);

  const scenes = [
    // 7.12s to 15.8s (scene 1)
    { id: 1, timestamp: 0 },
    { id: 2, timestamp: 7.12 },
    { id: 3, timestamp: 17.95, label: "Auriqua" },
    { id: 4, timestamp: 31.1, label: "Monarch" },
    { id: 5, timestamp: 35},
  ];

  // ---------- video setup ----------
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoSetup.current) return;

    videoSetup.current = true;

    // Set up video properties
    video.muted = true;
    video.playsInline = true;
    video.pause();

    const handleLoadedMetadata = () => {
      console.log("Video loaded, duration:", video.duration);
      video.currentTime = 0;
      setCurrentTime(0);

      // Autoplay intro (first 5 seconds)
      if (!introPlayed.current) {
        introPlayed.current = true;
        playIntroSequence();
      }
    };

    const playIntroSequence = async () => {
      const FIRST_SCENE_END = timestamps[1]; // End of first scene (7.12s)
      const TEXT_START = 5; // Show text at 5 seconds
      const TEXT_END = 7; // Text becomes visible at 5s, stays until user scrolls

      try {
        // Play video from 0 to end of first scene
        video.currentTime = 0;
        scrollLock.current = true; // Lock scroll during autoscroll
        await video.play();

        // Monitor playback
        const checkTime = () => {
          const currentTime = video.currentTime;

          // Show brand text at 5 seconds and keep it visible
          if (currentTime >= TEXT_START && currentTime < TEXT_END && !showBrandText) {
            setShowBrandText(true);
          }

          // Check if we've reached the end of first scene
          if (currentTime >= FIRST_SCENE_END) {
            video.pause();
            video.currentTime = FIRST_SCENE_END; // Set exact position

            // Remove intro overlay and unlock scroll
            setShowIntro(false);
            setCurrentScene(2); // Move to scene 2
            setCurrentTime(FIRST_SCENE_END);
            scrollLock.current = false; // Unlock scroll at end of first scene
            // Keep brand text visible until user scrolls

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

    // Trigger load
    video.load();

    return () => {
      if (videoSetup.current) {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("error", handleError);
        videoSetup.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Hide brand text when user starts scrolling from scene 2
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
          startTime = timestamps[currentScene - 1]; // Current scene timestamp
          endTime = timestamps[newSceneId - 1]; // Next scene timestamp
        } else {
          // Already at last scene, no change
          isAnimating.current = false;
          scrollLock.current = false;
          return;
        }
      } else {
        if (currentScene > 1) {
          newSceneId = currentScene - 1;
          startTime = timestamps[currentScene - 1]; // Current scene timestamp
          endTime = timestamps[newSceneId - 1]; // Previous scene timestamp
        } else {
          // Already at first scene, no change
          isAnimating.current = false;
          scrollLock.current = false;
          return;
        }
      }

      // Stop any existing animations and cleanup
      video.pause();

      // Remove any existing timeupdate handler
      if (currentTimeUpdateHandler.current) {
        video.removeEventListener(
          "timeupdate",
          currentTimeUpdateHandler.current
        );
        currentTimeUpdateHandler.current = null;
      }

      // Cancel any running reverse animation
      if (reverseAnimationId.current) {
        cancelAnimationFrame(reverseAnimationId.current);
        reverseAnimationId.current = null;
      }

      // Clear all pending reverse timeouts
      reverseTimeoutIds.current.forEach((timeoutId) => clearTimeout(timeoutId));
      reverseTimeoutIds.current = [];

      if (forward) {
        // Set start position precisely
        video.currentTime = startTime;
        video.playbackRate = 1.0;

        // Small delay to ensure currentTime is set
        setTimeout(() => {
          video.play();

          // Use requestAnimationFrame for more precise monitoring
          const monitorPlayback = () => {
            if (video.currentTime >= endTime - 0.02) {
              // Very small buffer for precise stopping
              video.pause();
              video.currentTime = endTime; // Set exact position
              setCurrentTime(endTime);
              setCurrentScene(newSceneId);
              isAnimating.current = false;

              // Consistent delay for forward scroll too
              setTimeout(() => {
                scrollLock.current = false;
              }, SCROLL_LOCK_DELAY);
              return; // Stop monitoring
            }

            // Continue monitoring if still playing
            if (!video.paused) {
              requestAnimationFrame(monitorPlayback);
            }
          };

          // Start monitoring
          requestAnimationFrame(monitorPlayback);
        }, 50);
      } else {
        // For backward, try using actual reverse playback
        video.currentTime = startTime;

        // Try setting negative playback rate for true reverse playback
        try {
          video.playbackRate = -1;
          video.play();

          // Monitor reverse playback
          const onReverseTimeUpdate = () => {
            if (video.currentTime <= endTime + 0.05) {
              // Small buffer
              video.pause();
              video.playbackRate = 1; // Reset to normal
              video.currentTime = endTime;
              setCurrentTime(endTime);
              setCurrentScene(newSceneId);
              video.removeEventListener("timeupdate", onReverseTimeUpdate);
              currentTimeUpdateHandler.current = null;
              isAnimating.current = false;

              // Consistent delay for native reverse too
              setTimeout(() => {
                scrollLock.current = false;
              }, SCROLL_LOCK_DELAY);
            }
          };

          currentTimeUpdateHandler.current = onReverseTimeUpdate;
          video.addEventListener("timeupdate", onReverseTimeUpdate);
        } catch (error) {
          // Fallback: If reverse playback not supported, use slow native playback in reverse direction
          console.log(
            "Reverse playback not supported, using slow reverse simulation"
          );

          // Create a smoother, faster animation with optimal balance
          video.currentTime = startTime;
          const segmentDuration = Math.abs(endTime - startTime);
          const steps = Math.ceil(segmentDuration * 20); // Fewer steps for smoother animation
          const stepTime = (endTime - startTime) / steps;
          let currentStep = 0;

          const reverseStep = () => {
            if (currentStep >= steps) {
              video.currentTime = endTime;
              setCurrentTime(endTime);
              setCurrentScene(newSceneId);
              // Clear all timeouts when animation completes
              reverseTimeoutIds.current = [];
              isAnimating.current = false;

              // Longer delay before allowing next scroll for reverse
              setTimeout(() => {
                scrollLock.current = false;
              }, SCROLL_LOCK_DELAY);
              return;
            }

            const newTime = startTime + stepTime * currentStep;
            video.currentTime = newTime;

            // Balanced timing for smoothness
            const timeoutId = setTimeout(() => {
              setCurrentTime(newTime);
              currentStep++;
              reverseStep();
            }, 40); // ~40fps, good balance of speed and smoothness

            // Track timeout for cleanup
            reverseTimeoutIds.current.push(timeoutId);
          };

          reverseStep();
        }
      }
    },
    [currentScene, timestamps, scenes.length, showBrandText]
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
  }, [popupScene, currentScene, playScene]);

  // ---------- buttons ----------
  const currentSceneData = scenes.find((s) => s.id === currentScene)!;

  const showButton = currentSceneData && currentScene >= 2; // Show button starting from scene 2 (DISCOVER)
  const buttonEnabled = showButton;

  // ---------- popups ----------
  const popupColors: Record<number, string> = {
    2: "#FFF8F0", // DISCOVER
    3: "#E9F7EF", // SUSTAINABILITY
    4: "#EAF2FF", // TECHNOLOGY
    5: "#FFF7E1", // CRAFTSMANSHIP
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
        <source
          src="/assets/home/rotoris-hero.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Intro Overlay - blocks interaction during intro */}
      {showIntro && (
        <div className="fixed inset-0 z-50 pointer-events-auto" />
      )}

      {/* Brand Text - shows from 5-7s and stays until user scrolls */}
      {showBrandText && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <h1
            className="text-8xl md:text-9xl font-bold text-white tracking-wider animate-fade-in"
            style={{
              fontFamily: 'serif',
              textShadow: '0 0 40px rgba(255,255,255,0.5)',
              animation: 'fadeInScale 2s ease-out forwards'
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
            className="absolute top-4 right-4 w-10 h-10 rounded-full border border-black/40 flex items-center justify-center text-lg hover:bg-black/10 cursor-pointer"
          >
            ✕
          </button>

          <div className="p-8 space-y-6">
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
            {popupScene === 3 && (
              <>
                <h2 className="text-3xl font-bold mb-4">
                  🌿 Sustainability Scene
                </h2>
                <p className="text-lg text-black/80">
                  Focus on eco-materials, responsible production and innovation.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Material sourcing</p>
                  <p>• Recycling process</p>
                  <p>• Green partnerships</p>
                </section>
              </>
            )}
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
