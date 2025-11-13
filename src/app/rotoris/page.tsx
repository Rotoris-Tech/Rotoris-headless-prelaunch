"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import gsap from "gsap";
import { sceneProductMap } from "../data/products";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentScene, setCurrentScene] = useState(1);
  const [prevScene, setPrevScene] = useState(1);
  const [popupScene, setPopupScene] = useState<number | null>(null);
  const [targetSceneId, setTargetSceneId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSceneButton, setShowSceneButton] = useState(false);

  const tween = useRef<gsap.core.Tween | null>(null);
  const isAnimating = useRef(false);
  const scrollLock = useRef(false);
  const lastDirection = useRef<"forward" | "backward" | null>(null);
  const videoSetup = useRef(false);
  const currentTimeUpdateHandler = useRef<((e: Event) => void) | null>(null);
  const reverseAnimationId = useRef<number | null>(null);
  const reverseTimeoutIds = useRef<NodeJS.Timeout[]>([]);

  const SCROLL_LOCK_DELAY = 500; // Longer delay to prevent multiple triggers

  // Video timestamps in seconds (converted from 60 FPS frames)
  const timestamps = useMemo(() => [0, 5.830, 13.20], []); // Frames: 0, 185, 334, 472, 636, 745, 840

  const scenes = [
    { id: 1, timestamp: 0, label: "DISCOVER" },
    { id: 2, timestamp: 5.830, label: "SUSTAINABILITY" },
    { id: 3, timestamp: 13.20, label: "TECHNOLOGY" },
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
      setCurrentTime(video.currentTime);
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

    return () => {
      if (videoSetup.current) {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("error", handleError);
        videoSetup.current = false;
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

      isAnimating.current = true;
      scrollLock.current = true;
      setShowSceneButton(false); // Hide button during transition

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
      tween.current?.kill();
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

              // Show button when scene is reached (not for scene 1)
              if (newSceneId > 1) {
                setShowSceneButton(true);
              }

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

          // Monitor reverse playback using requestAnimationFrame (same as forward)
          const monitorReversePlayback = () => {
            if (video.currentTime <= endTime + 0.02) {
              // Same buffer as forward for consistency
              video.pause();
              video.playbackRate = 1; // Reset to normal
              video.currentTime = endTime;
              setCurrentTime(endTime);
              setCurrentScene(newSceneId);
              isAnimating.current = false;

              // Show button when scene is reached (not for scene 1)
              if (newSceneId > 1) {
                setShowSceneButton(true);
              }

              // Same delay as forward
              setTimeout(() => {
                scrollLock.current = false;
              }, SCROLL_LOCK_DELAY);
              return; // Stop monitoring
            }

            // Continue monitoring if still playing
            if (!video.paused) {
              requestAnimationFrame(monitorReversePlayback);
            }
          };

          // Start monitoring with same delay as forward
          setTimeout(() => {
            requestAnimationFrame(monitorReversePlayback);
          }, 50);
        } catch (error) {
          // Fallback: If reverse playback not supported, use requestAnimationFrame
          console.log(
            "Reverse playback not supported, using smooth reverse simulation"
          );

          video.currentTime = startTime;
          const segmentDuration = Math.abs(endTime - startTime);

          // Calculate frame rate to match video's native frame rate
          const targetFPS = 75; // 75 FPS for smoother animation
          const frameDuration = 1000 / targetFPS; // ~13.33ms per frame
          const totalFrames = Math.ceil(segmentDuration * targetFPS);
          const timePerFrame = (endTime - startTime) / totalFrames;

          let frameCount = 0;
          let lastFrameTime = performance.now();

          const reverseStep = () => {
            const now = performance.now();
            const elapsed = now - lastFrameTime;

            // Only update if enough time has passed (maintain FPS)
            if (elapsed >= frameDuration) {
              frameCount++;
              lastFrameTime = now;

              if (frameCount >= totalFrames) {
                video.currentTime = endTime;
                setCurrentTime(endTime);
                setCurrentScene(newSceneId);
                isAnimating.current = false;

                // Show button when scene is reached (not for scene 1)
                if (newSceneId > 1) {
                  setShowSceneButton(true);
                }

                // Same delay as forward
                setTimeout(() => {
                  scrollLock.current = false;
                }, SCROLL_LOCK_DELAY);
                return;
              }

              const newTime = startTime + timePerFrame * frameCount;
              video.currentTime = newTime;
              setCurrentTime(newTime);
            }

            // Use requestAnimationFrame for smooth animation (same as forward)
            reverseAnimationId.current = requestAnimationFrame(reverseStep);
          };

          reverseStep();
        }
      }
    },
    [currentScene, timestamps, scenes.length]
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
  const sceneForUI =
    targetSceneId !== null
      ? scenes.find((s) => s.id === targetSceneId)
      : scenes.find((s) => s.id === currentScene);
  const currentSceneData = sceneForUI!;

  const showButton = currentSceneData && currentScene > 1 && showSceneButton; // Show button after first scene and when animation complete
  const buttonEnabled = showButton;

  // ---------- popups ----------
  const openPopup = (id: number) => {
    if (popupScene) return;
    setPopupScene(id);
  };

  useEffect(() => {
    if (popupScene) {
      // Slide up from bottom animation
      gsap.fromTo(
        ".popup-fullscreen",
        { y: "100%" },
        { y: "0%", duration: 0.6, ease: "power3.out" }
      );
    }
  }, [popupScene]);

  const closePopup = () => {
    // Slide down to bottom animation
    gsap.to(".popup-fullscreen", {
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
          src="/assets/video-sequence/pre.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="fixed top-4 left-4 bg-black/70 text-white text-sm py-1 px-3 rounded font-mono z-20">
        Time: {currentTime.toFixed(2)}s
      </div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-center py-3 px-6 font-bold text-lg rounded-b-lg z-20">
        SCENE {currentScene} / {scenes.length}
      </div>

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

      {popupScene && (() => {
        const productId = sceneProductMap[popupScene];
        const productUrl = productId ? `/products/${productId}` : null;

        return (
          <div className="popup-fullscreen fixed inset-0 z-50 bg-black">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="fixed top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-xl md:text-2xl font-light shadow-lg hover:shadow-xl transition-colors cursor-pointer z-[100]"
              aria-label="Close popup"
            >
              <span className="inline-block hover:rotate-90 transition-transform duration-300">
                ✕
              </span>
            </button>

            {/* Full-screen Iframe */}
            {productUrl ? (
              <iframe
                src={productUrl}
                className="w-full h-full"
                title="Product Details"
                style={{
                  border: "none",
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-lg text-white/80">
                  Product information not available
                </p>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
