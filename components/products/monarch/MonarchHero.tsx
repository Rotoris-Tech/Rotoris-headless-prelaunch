"use client";
import React, { useEffect, useRef, useState } from "react";

const MonarchHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const reverseAnimationId = useRef<number | null>(null);

  const FPS = 25; // Video fps
  const FRAME_DURATION = 1 / FPS; // Seconds per frame

  // Reverse playback function using requestAnimationFrame
  const startReversePlayback = () => {
    const video = videoRef.current;
    if (!video || !video.duration) {
      return;
    }


    // Stop any existing animation
    if (reverseAnimationId.current) {
      cancelAnimationFrame(reverseAnimationId.current);
      reverseAnimationId.current = null;
    }

    let lastTimestamp: number | null = null;
    let accumulator = 0; // Seconds accumulated since last frame step

    const step = (now: number) => {
      const v = videoRef.current;
      if (!v) return; // Safety check

      if (lastTimestamp === null) {
        lastTimestamp = now;
        reverseAnimationId.current = requestAnimationFrame(step);
        return;
      }

      const deltaSec = (now - lastTimestamp) / 1000;
      lastTimestamp = now;
      accumulator += deltaSec;

      // Move one frame for each FRAME_DURATION
      while (accumulator >= FRAME_DURATION) {
        accumulator -= FRAME_DURATION;

        const nextTime = v.currentTime - FRAME_DURATION;

        // Stepping backward through video frames

        if (nextTime <= FRAME_DURATION / 4) {
          // Reached start
          v.currentTime = 0;
          setIsPlaying(false);
          setIsReversing(false);
          setVideoStarted(false);
          stopReversePlayback();
          return;
        }

        v.currentTime = nextTime;
      }

      reverseAnimationId.current = requestAnimationFrame(step);
    };

    reverseAnimationId.current = requestAnimationFrame(step);
  };

  const stopReversePlayback = () => {
    if (reverseAnimationId.current) {
      cancelAnimationFrame(reverseAnimationId.current);
      reverseAnimationId.current = null;
    }
  };

  // Disable scroll on popup while video is playing
  useEffect(() => {
    const popupContainer = document.querySelector('.popup') as HTMLElement;

    if (isPlaying && popupContainer) {
      popupContainer.style.overflow = 'hidden';
    } else if (popupContainer) {
      popupContainer.style.overflow = 'auto';
    }

    return () => {
      if (popupContainer) {
        popupContainer.style.overflow = 'auto';
      }
      stopReversePlayback();
    };
  }, [isPlaying]);

  // Cancel any running reverse animation on unmount
  useEffect(() => {
    return () => {
      if (reverseAnimationId.current) {
        cancelAnimationFrame(reverseAnimationId.current);
        reverseAnimationId.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = (event?: Event) => {
      const scrollContainer = event?.target as Element;
      let scrollY = 0;

      if (scrollContainer) {
        scrollY = scrollContainer.scrollTop;
      } else {
        scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      }

      // Start video when scrolling down past 50px
      if (scrollY > 50 && !videoStarted && !videoEnded && videoRef.current) {
        setVideoStarted(true);
        setIsPlaying(true);
        videoRef.current.play();
      }

      // Play video in reverse when scrolling back from parallax
      if (scrollY < 50 && videoEnded && !isReversing) {
        setVideoEnded(false);
        setVideoStarted(true);
        setIsPlaying(true);
        setIsReversing(true);

        if (videoRef.current) {
          // Start reverse playback from the end
          videoRef.current.currentTime = videoRef.current.duration;
          startReversePlayback();
        }
      }
    };

    // Listen to popup scroll specifically
    const popupContainer = document.querySelector('.popup');

    window.addEventListener("scroll", handleScroll);
    if (popupContainer) {
      popupContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (popupContainer) {
        popupContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [videoStarted, videoEnded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnded = () => {
      if (!isReversing) {
        // Forward playback ended
        setIsPlaying(false);
        setVideoEnded(true);
      }
    };

    const handleLoadedMetadata = () => {
      // Video metadata loaded
    };

    const handleCanPlayThrough = () => {
      // Video ready for playback
    };

    video.addEventListener("ended", handleVideoEnded);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplaythrough", handleCanPlayThrough);

    return () => {
      video.removeEventListener("ended", handleVideoEnded);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [isReversing]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${videoEnded ? 'h-0' : 'min-h-[200vh]'} bg-black transition-all duration-500`}
    >
      <div className={`${isPlaying ? 'fixed' : 'sticky'} ${videoEnded ? 'hidden' : ''} top-0 w-full h-screen bg-black z-50`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        >
          <source src="/assets/products/monarch/Monarch Hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay to indicate scroll behavior */}
        {!videoStarted && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
            <p className="text-sm opacity-70">Scroll down to begin</p>
            <div className="mt-2 w-6 h-10 border border-white rounded-full mx-auto">
              <div className="w-1 h-3 bg-white rounded-full mx-auto mt-2 animate-bounce"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonarchHero;