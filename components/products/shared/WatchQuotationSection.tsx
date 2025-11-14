"use client";

type Specification = {
  label: string;
  value: string;
};

type WatchQuotationSectionProps = {
  specifications: Specification[];
  accentColor: string;
};

export function WatchQuotationSection({
  specifications,
  accentColor,
}: WatchQuotationSectionProps) {
  return (
    <section className="w-full py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2
          className="text-4xl md:text-5xl font-bold font-rotoris text-center mb-12"
          style={{ color: accentColor }}
        >
          Technical Specifications
        </h2>

        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-8 space-y-4 shadow-lg">
          {specifications.map((spec, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-3 border-b border-black/10 last:border-0"
            >
              <span className="font-semibold text-black/70">{spec.label}</span>
              <span className="font-medium" style={{ color: accentColor }}>
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
