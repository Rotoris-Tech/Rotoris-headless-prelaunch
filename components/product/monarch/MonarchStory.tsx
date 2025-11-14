'use client';

import { useSectionReveal } from '../hooks/useSectionReveal';

interface MonarchStoryProps {
  story?: string;
  heritage?: string;
}

export function MonarchStory({
  story = 'The Monarch collection is designed for those who lead. Bold, sophisticated, and unapologetically distinctive, each piece makes a statement of power and refinement.',
  heritage = 'Crafted for the modern leader, Monarch represents authority, precision, and unwavering confidence.',
}: MonarchStoryProps) {
  const ref = useSectionReveal();

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-rotoris mb-8 text-center">
            The Monarch Legacy
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
            <div className="text-5xl font-bold font-rotoris text-primary mb-2">316L</div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Surgical-Grade Steel
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl font-bold font-rotoris text-primary mb-2">42mm</div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Bold Case Diameter
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl font-bold font-rotoris text-primary mb-2">10 ATM</div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Water Resistance
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
