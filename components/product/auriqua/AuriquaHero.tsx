'use client';

import { useEffect, useRef } from 'react';

interface AuriquaHeroProps {
  title?: string;
  subtitle?: string;
  videoSrc?: string;
}

export function AuriquaHero({
  title = 'Auriqua',
  subtitle = 'Where elegance meets precision',
  videoSrc,
}: AuriquaHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Add any GSAP or advanced animations here if needed
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay might be blocked, that's okay
      });
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-rotoris text-white mb-6 animate-fade-in">
          {title}
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl font-switzer text-white/90 max-w-2xl animate-fade-in-delay">
          {subtitle}
        </p>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  );
}
