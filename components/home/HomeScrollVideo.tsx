'use client';

import { useEffect, useRef, useState } from 'react';
import { HomeSceneOverlay } from './HomeSceneOverlay';
import { getSceneAtTime, type HomeScene } from './homeScenes';

interface HomeScrollVideoProps {
  videoSrc: string;
  videoDuration?: number; // in seconds
  className?: string;
}

export function HomeScrollVideo({
  videoSrc,
  videoDuration = 12,
  className = '',
}: HomeScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentScene, setCurrentScene] = useState<HomeScene | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    // Ensure video is loaded and ready
    const handleLoadedMetadata = () => {
      video.pause();
      video.currentTime = 0;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Scroll-driven video scrubbing
    const handleScroll = () => {
      if (!video || !container) return;

      const rect = container.getBoundingClientRect();
      const scrollProgress = Math.max(
        0,
        Math.min(1, -rect.top / (rect.height - window.innerHeight))
      );

      // Map scroll progress to video time
      const targetTime = scrollProgress * videoDuration;
      video.currentTime = targetTime;

      // Update scene based on current time
      const scene = getSceneAtTime(targetTime);
      setCurrentScene(scene);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [videoDuration]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: '300vh' }} // 3x viewport height for scroll range
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
        <HomeSceneOverlay scene={currentScene} />
      </div>
    </div>
  );
}
