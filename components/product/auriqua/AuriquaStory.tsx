'use client';

import { useSectionReveal } from '../hooks/useSectionReveal';

interface AuriquaStoryProps {
  story?: string;
  heritage?: string;
}

export function AuriquaStory({
  story = 'The Auriqua collection represents the pinnacle of horological artistry. Each timepiece is meticulously crafted by master watchmakers, combining centuries-old techniques with cutting-edge innovation.',
  heritage = 'Born from a legacy of excellence, Auriqua embodies the spirit of timeless elegance and uncompromising quality.',
}: AuriquaStoryProps) {
  const ref = useSectionReveal();

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-rotoris mb-8 text-center">
            The Auriqua Story
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
            {story}
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic font-decimal">
            {heritage}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6">
            <div className="text-5xl font-bold font-rotoris text-primary mb-2">100+</div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Hours of Craftsmanship
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl font-bold font-rotoris text-primary mb-2">Swiss</div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Movement Excellence
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl font-bold font-rotoris text-primary mb-2">5 ATM</div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Water Resistance
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
