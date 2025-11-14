'use client';

import Image from 'next/image';
import { useSectionReveal } from '../hooks/useSectionReveal';

interface WatchPreviewSectionProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  reverse?: boolean;
}

export function WatchPreviewSection({
  imageSrc,
  imageAlt,
  title,
  description,
  reverse = false,
}: WatchPreviewSectionProps) {
  const ref = useSectionReveal();

  return (
    <div ref={ref} className="py-16">
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
          reverse ? 'lg:flex-row-reverse' : ''
        }`}
      >
        <div className={`relative h-[400px] lg:h-[600px] ${reverse ? 'lg:order-2' : ''}`}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className={reverse ? 'lg:order-1' : ''}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-rotoris mb-6">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
