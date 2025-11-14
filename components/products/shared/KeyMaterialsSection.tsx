"use client";

type Material = {
  icon: string;
  title: string;
  description: string;
};

type KeyMaterialsSectionProps = {
  materials: Material[];
  accentColor: string;
};

export function KeyMaterialsSection({ materials, accentColor }: KeyMaterialsSectionProps) {
  return (
    <section className="w-full py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2
          className="text-4xl md:text-5xl font-bold font-rotoris text-center mb-12"
          style={{ color: accentColor }}
        >
          Key Materials
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {materials.map((material, index) => (
            <div
              key={index}
              className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border-2 hover:scale-105 transition-transform"
              style={{ borderColor: `${accentColor}20` }}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{material.icon}</span>
                <div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: accentColor }}
                  >
                    {material.title}
                  </h3>
                  <p className="text-black/80">{material.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
