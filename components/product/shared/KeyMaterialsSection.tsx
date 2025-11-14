'use client';

import { useSectionReveal } from '../hooks/useSectionReveal';

interface Material {
  name: string;
  description: string;
  icon?: string;
}

interface KeyMaterialsSectionProps {
  materials: Material[];
  title?: string;
  subtitle?: string;
}

export function KeyMaterialsSection({
  materials,
  title = 'Premium Materials',
  subtitle = 'Crafted with the finest components',
}: KeyMaterialsSectionProps) {
  const ref = useSectionReveal();

  return (
    <div ref={ref} className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-rotoris mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {materials.map((material, index) => (
          <div
            key={index}
            className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
          >
            {material.icon && (
              <div className="text-4xl mb-4">{material.icon}</div>
            )}
            <h3 className="text-xl font-semibold font-rotoris mb-2">{material.name}</h3>
            <p className="text-muted-foreground">{material.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
