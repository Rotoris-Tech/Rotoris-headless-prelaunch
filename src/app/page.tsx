"use client";

import { useEffect } from "react";

export default function Home() {
  // Scene 1: Frames 1-204 (204 frames total)
  const scene1Frames = Array.from({ length: 204 }, (_, i) => i + 1);

  // Generate image path with zero-padding
  const getImagePath = (index: number) => {
    const paddedNumber = String(index - 1).padStart(5, "0");
    return `/assets/Image-testing/cartier testing_${paddedNumber}.avif`;
  };

  useEffect(() => {
    // ========================
    // CONFIGURATION
    // ========================
    const EASE = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad
    const AUTO_DURATION_MS = 1000;
    const COOLDOWN_MS = 150;
    const GRACE_PERIOD_MS = 500; // Ignore user input for 500ms after auto-scroll starts
    const INTERSECTION_THRESHOLD = 0.6;

    // ========================
    // STATE
    // ========================
    let currentFrame: HTMLElement | null = null;
    let lastDirection: 'up' | 'down' | null = null;
    let isAutoScrolling = false;
    let autoRAF: number | null = null;
    let lastTriggerTime = 0;
    let autoScrollStartTime = 0;

    // ========================
    // UTILITIES
    // ========================

    // Get frame element by frame number
    function getFrameElement(frameNumber: number): HTMLElement | null {
      return document.querySelector(`[data-frame="${frameNumber}"]`);
    }

    // Cancel auto-scroll
    function cancelAutoScroll(reason = 'user') {
      if (!isAutoScrolling) return;

      console.log(`🛑 Auto-scroll cancelled (${reason})`);
      isAutoScrolling = false;

      if (autoRAF) {
        cancelAnimationFrame(autoRAF);
        autoRAF = null;
      }
    }

    // Auto-scroll to target frame
    function autoScrollToFrame(targetFrameNumber: number, direction: string) {
      // Debounce check
      const now = Date.now();
      if (now - lastTriggerTime < COOLDOWN_MS) {
        console.log('⏸️ Cooldown active, skipping trigger');
        return;
      }

      const targetElement = getFrameElement(targetFrameNumber);
      if (!targetElement) {
        console.error(`Target frame ${targetFrameNumber} not found`);
        return;
      }

      const startY = window.scrollY;
      const targetY = targetElement.offsetTop;

      if (Math.abs(targetY - startY) < 2) return;

      console.log(`🚀 Auto-scroll triggered: Frame ${currentFrame?.dataset.frame} → Frame ${targetFrameNumber} (direction: ${direction})`);

      isAutoScrolling = true;
      lastTriggerTime = now;
      autoScrollStartTime = now;
      const startTime = performance.now();

      const step = (timestamp: number) => {
        if (!isAutoScrolling) return;

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / AUTO_DURATION_MS, 1);
        const eased = EASE(progress);
        const y = startY + (targetY - startY) * eased;

        window.scrollTo(0, y);

        if (progress < 1) {
          autoRAF = requestAnimationFrame(step);
        } else {
          console.log('✅ Auto-scroll complete');
          isAutoScrolling = false;
          autoRAF = null;
        }
      };

      autoRAF = requestAnimationFrame(step);
    }

    // ========================
    // INTERSECTION OBSERVER
    // ========================
    const observer = new IntersectionObserver(
      (entries) => {
        // Don't update current frame during auto-scroll
        if (isAutoScrolling) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= INTERSECTION_THRESHOLD) {
            currentFrame = entry.target as HTMLElement;
            console.log('📍 Current frame:', currentFrame.dataset.frame);
          }
        });
      },
      { threshold: INTERSECTION_THRESHOLD }
    );

    // Observe all frames
    document.querySelectorAll('.frame').forEach((frame) => {
      observer.observe(frame);
    });

    // ========================
    // SCROLL DIRECTION DETECTION
    // ========================
    let lastScrollY = window.scrollY;

    function updateScrollDirection() {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;

      if (Math.abs(delta) > 1) {
        lastDirection = delta > 0 ? 'down' : 'up';
      }

      lastScrollY = currentY;
    }

    window.addEventListener('scroll', updateScrollDirection, { passive: true });

    // ========================
    // USER INPUT HANDLERS
    // ========================

    function handleUserInput(direction: 'up' | 'down' | null = null) {
      // Update direction if provided
      if (direction) {
        lastDirection = direction;
      }

      // If auto-scrolling, check if we're past grace period before cancelling
      if (isAutoScrolling) {
        const now = Date.now();
        const timeSinceStart = now - autoScrollStartTime;

        if (timeSinceStart > GRACE_PERIOD_MS) {
          console.log(`🛑 User input detected after ${timeSinceStart}ms - cancelling auto-scroll`);
          cancelAutoScroll('user');
        } else {
          console.log(`⏳ Grace period active (${timeSinceStart}ms/${GRACE_PERIOD_MS}ms) - ignoring input`);
        }
        return;
      }

      // Check for trigger conditions
      if (!currentFrame || !lastDirection) return;

      const isTrigger = currentFrame.dataset.scrollTrigger === 'true';
      if (!isTrigger) return;

      const triggerDirection = currentFrame.dataset.direction as 'up' | 'down' | 'both';
      const targetFrame = Number(currentFrame.dataset.targetFrame);

      // Check if direction matches
      const directionMatches =
        triggerDirection === 'both' ||
        triggerDirection === lastDirection;

      if (directionMatches && targetFrame) {
        autoScrollToFrame(targetFrame, lastDirection);
      }
    }

    // Wheel events
    window.addEventListener('wheel', (e) => {
      const direction = e.deltaY > 0 ? 'down' : 'up';
      handleUserInput(direction);
    }, { passive: true });

    // Touch events
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      const touchY = e.touches[0].clientY;
      const delta = touchStartY - touchY;
      const direction = delta > 0 ? 'down' : 'up';
      handleUserInput(direction);
      touchStartY = touchY;
    }, { passive: true });

    // Keyboard events
    window.addEventListener('keydown', (e) => {
      const downKeys = ['ArrowDown', 'PageDown', 'Space'];
      const upKeys = ['ArrowUp', 'PageUp'];

      if (downKeys.includes(e.code)) {
        e.preventDefault();
        handleUserInput('down');
      } else if (upKeys.includes(e.code)) {
        e.preventDefault();
        handleUserInput('up');
      }
    });

    // ========================
    // CLEANUP
    // ========================
    return () => {
      observer.disconnect();
      if (autoRAF) cancelAnimationFrame(autoRAF);
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Scene 1 Header */}
      <div className="sticky top-0 z-10 bg-blue-600 text-white text-center py-4 font-bold text-xl">
        SCENE 1 - Frames 1 to 204
      </div>

      {/* All Scene 1 Frames */}
      {scene1Frames.map((num) => (
        <div
          key={num}
          data-frame={num}
          data-scroll-trigger={num === 1 || num === 204 ? 'true' : undefined}
          data-direction={num === 1 ? 'down' : num === 204 ? 'up' : undefined}
          data-target-frame={num === 1 ? '204' : num === 204 ? '1' : undefined}
          className="frame relative w-full h-screen flex items-center justify-center bg-black"
        >
          <img
            src={getImagePath(num)}
            alt={`Frame ${num}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white text-sm py-2 px-4 rounded-lg font-mono">
            Frame {num}
          </div>
        </div>
      ))}
    </div>
  );
}
