"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/**
 * MonarchImageSequence — robust, mounts safely
 *
 * Fixes a race where scroll handlers ran before the container ref was available.
 * Approach:
 * - Use a callback ref to detect when the container DOM node is actually mounted and set `isMounted` state.
 * - Only initialize IntersectionObserver and scroll listeners after `isMounted` is true.
 * - Keep defensive guards inside handlers (double-safety).
 * - Smooth easing loop, lazy preload, and sticky CSS retained.
 */

type Props = {
  totalFrames?: number;
  scrollHeight?: number; // px height of the scroll container
  preloadRadius?: number; // how many frames before/after current to preload
};

const defaultProps = {
  totalFrames: 100,
  scrollHeight: 5000,
  preloadRadius: 6,
};

const MonarchImageSequence: React.FC<Props> = ({
  totalFrames = defaultProps.totalFrames,
  scrollHeight = defaultProps.scrollHeight,
  preloadRadius = defaultProps.preloadRadius,
}) => {
  // We'll use a callback ref so we know exactly when the DOM node is mounted.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const containerRefCallback = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    setIsMounted(!!el);
  };

  const [targetFrame, setTargetFrame] = useState(1); // frame derived directly from scroll (discrete)
  const [shouldBeFixed, setShouldBeFixed] = useState(false);
  const [showBackground, setShowBackground] = useState(false);

  // displayedFrame is smoothed toward targetFrame using rAF and easing
  const displayedFrameRef = useRef<number>(1);
  const [, setVisualTick] = useState(0); // used to force re-render when displayed frame updates

  // Simple easing function (lerp)
  const ease = (from: number, to: number, easeFactor = 0.15) =>
    from + (to - from) * easeFactor;

  // Helpers for frame pathing and URLs
  const frameToSrc = (i: number) =>
    `/assets/products/monarch/monarch-sequence/ezgif-frame-${i
      .toString()
      .padStart(3, "0")}.jpg`;

  // Keep a set of preloaded Image objects so GC doesn't drop them
  const preloaded = useRef<Record<number, HTMLImageElement | undefined>>({});

  // Lazy preload a range around `center` (inclusive)
  const preloadRange = (center: number, radius = preloadRadius) => {
    const start = Math.max(1, Math.floor(center) - radius);
    const end = Math.min(totalFrames, Math.ceil(center) + radius);
    for (let i = start; i <= end; i++) {
      if (!preloaded.current[i]) {
        const img = new window.Image();
        img.src = frameToSrc(i);
        preloaded.current[i] = img;
      }
    }
  };

  // Preload initial small set (1..N) so early frames appear snappy
  useEffect(() => {
    if (typeof window === "undefined") return;
    const initial = Math.min(12, totalFrames);
    for (let i = 1; i <= initial; i++) {
      if (!preloaded.current[i]) {
        const img = new window.Image();
        img.src = frameToSrc(i);
        preloaded.current[i] = img;
      }
    }
  }, [totalFrames]);

  // Warn developer if ancestor transforms may break sticky (run once on mount)
  useEffect(() => {
    if (!isMounted) return;
    if (typeof window === "undefined") return;

    const el = containerRef.current;
    if (!el) return;

    try {
      let ancestor = el.parentElement;
      while (ancestor) {
        const s = getComputedStyle(ancestor);
        const problematic = [
          "transform",
          "filter",
          "backdrop-filter",
          "perspective",
        ].some(
          (p) => s.getPropertyValue(p) && s.getPropertyValue(p) !== "none"
        );
        if (problematic) {
          console.warn(
            "MonarchImageSequence: ancestor has a CSS property (transform/filter/perspective/backdrop-filter) that can break position:sticky:",
            ancestor,
            s
          );
          break; // one warning is enough
        }
        ancestor = ancestor.parentElement;
      }
    } catch (err) {
      console.warn(
        "MonarchImageSequence: error while checking ancestor styles",
        err
      );
    }
  }, [isMounted]);

  // Attach scroll handlers only after the container is mounted.
  useEffect(() => {
    if (!isMounted) return;
    if (typeof window === "undefined") return;

    let rafId: number | null = null;
    let mounted = true; // will be false on cleanup

    const onScroll = () => {
      if (rafId !== null) return; // already queued
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!mounted) return;
        const container = containerRef.current;
        if (!container) return; // guard: exit if ref isn't ready

        const rect = container.getBoundingClientRect();

        // Calculate scroll progress based on the full container height
        const scrolledDistance = Math.max(0, -rect.top);
        const maxScrollDistance = container.offsetHeight - window.innerHeight;

        // Reserve space for sequence up to frame 85, then transition to background
        const maxFrame = 85; // Stop at frame 85
        const sequenceScrollDistance = maxScrollDistance * 0.7; // Use 70% for sequence

        // Progress should go from 0 to 1 over the sequence distance
        const progress = Math.min(scrolledDistance / sequenceScrollDistance, 1);

        // Map progress to frame (1..85)
        const frameFloat = progress * (maxFrame - 1) + 1;
        const clampedFrame = Math.max(
          1,
          Math.min(maxFrame, Math.round(frameFloat))
        );

        setTargetFrame(clampedFrame);

        // Determine if we should be fixed - stay fixed longer for background transition
        const containerTop = rect.top;
        const containerBottom = rect.bottom;
        const inScrollRange = containerTop <= 0 && containerBottom > 0; // Only while container is in view
        setShouldBeFixed(inScrollRange);

        // Calculate if we should show background instead of image
        const shouldShowBackground = progress >= 1; // Show background when sequence is complete
        setShowBackground(shouldShowBackground);

        try {
          preloadRange(clampedFrame);
        } catch (e) {
          console.warn("MonarchImageSequence: preloadRange failed", e);
        }
      });
    };

    // Attach listeners
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // If there's a popup or custom scroll container, observe its scroll too
    const popup =
      typeof document !== "undefined" ? document.querySelector(".popup") : null;
    if (popup && popup.addEventListener)
      popup.addEventListener("scroll", onScroll, { passive: true });

    // Now that we're mounted, run an initial calculation once
    onScroll();

    return () => {
      mounted = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (popup && popup.removeEventListener)
        popup.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMounted, totalFrames]);

  // Animation loop to smoothly ease displayedFrame -> targetFrame
  useEffect(() => {
    let rafId: number | null = null;
    let mounted = true;

    const tick = () => {
      if (!mounted) return;
      const displayed = displayedFrameRef.current ?? 1;
      const next = ease(displayed, targetFrame, 0.18); // tweak easing factor for snappier/slower

      if (Math.abs(next - targetFrame) < 0.01) {
        displayedFrameRef.current = targetFrame;
      } else {
        displayedFrameRef.current = next;
      }

      const rounded = Math.max(
        1,
        Math.min(totalFrames, Math.round(displayedFrameRef.current))
      );
      if (rounded !== Math.round(displayed)) setVisualTick((t) => t + 1);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      mounted = false;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [targetFrame, totalFrames]);

  const displayedInt = Math.max(
    1,
    Math.min(totalFrames, Math.round(displayedFrameRef.current ?? 1))
  );
  const alt = `Monarch sequence frame ${displayedInt} of ${totalFrames}`;

  return (
    <>
      {/* Scroll container - remains in normal document flow */}
      <div
        ref={containerRefCallback}
        className="relative w-full bg-transparent"
        style={{ height: `${scrollHeight}px` }}
        aria-hidden={false}
        data-monarch-container="true"
      />

      {/* Fixed image container - rendered via portal outside popup context */}
      {isMounted &&
        shouldBeFixed &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed top-0 left-0 w-full h-screen overflow-hidden"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 9999,
              pointerEvents: "none",
              backgroundColor: showBackground ? "#206084" : "black",
            }}
          >
            {!showBackground && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Next.js Image. We use `priority` for first few frames only. */}
                <Image
                  src={frameToSrc(displayedInt)}
                  alt={alt}
                  fill
                  className="object-cover"
                  priority={displayedInt <= 6}
                  sizes="100vw"
                  style={{
                    objectPosition: "48% 50%",
                  }}
                />

                {/* Progress indicator */}
                {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center z-10">
                <div className="w-64 h-1 bg-white/20 rounded-full">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-100"
                    style={{ width: `${(displayedInt / 85) * 100}%` }}
                  />
                </div>
                <p className="text-xs opacity-70 mt-2">
                  {displayedInt} / 85
                </p>
              </div> */}
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default MonarchImageSequence;
