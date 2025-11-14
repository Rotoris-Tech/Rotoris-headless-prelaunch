'use client';

import { useSectionReveal } from '../hooks/useSectionReveal';

interface WatchQuoteSectionProps {
  quote: string;
  author?: string;
  className?: string;
}

export function WatchQuoteSection({
  quote,
  author,
  className = '',
}: WatchQuoteSectionProps) {
  const ref = useSectionReveal();

  return (
    <div ref={ref} className={`py-20 bg-muted/30 ${className}`}>
      <div className="max-w-4xl mx-auto text-center px-4">
        <blockquote className="text-2xl md:text-3xl lg:text-4xl font-decimal italic text-foreground/90 mb-6">
          &quot;{quote}&quot;
        </blockquote>
        {author && (
          <cite className="text-lg text-muted-foreground not-italic">— {author}</cite>
        )}
      </div>
    </div>
  );
}
