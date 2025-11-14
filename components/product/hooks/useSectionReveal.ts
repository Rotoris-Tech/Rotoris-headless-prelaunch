'use client';

import { useEffect, useRef } from 'react';

interface UseSectionRevealOptions {
  threshold?: number;
  rootMargin?: string;
  animationClass?: string;
}

/**
 * Lightweight hook for section reveal animations
 * Can be enhanced with GSAP/ScrollTrigger if needed
 */
export function useSectionReveal({
  threshold = 0.1,
  rootMargin = '0px',
  animationClass = 'opacity-0 translate-y-8',
}: UseSectionRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Add initial animation class
    element.classList.add(...animationClass.split(' '));
    element.classList.add('transition-all', 'duration-700', 'ease-out');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Remove animation classes when in view
            element.classList.remove(...animationClass.split(' '));
            element.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, animationClass]);

  return ref;
}
