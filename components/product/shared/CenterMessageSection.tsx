'use client';

import { useSectionReveal } from '../hooks/useSectionReveal';

interface CenterMessageSectionProps {
  title: string;
  message: string;
  className?: string;
}

export function CenterMessageSection({
  title,
  message,
  className = '',
}: CenterMessageSectionProps) {
  const ref = useSectionReveal();

  return (
    <div ref={ref} className={`py-24 text-center ${className}`}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-rotoris mb-6">
          {title}
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
