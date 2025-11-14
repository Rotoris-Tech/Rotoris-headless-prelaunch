"use client";

type AuriquaStoryProps = {
  accentColor: string;
};

export function AuriquaStory({ accentColor }: AuriquaStoryProps) {
  return (
    <section className="w-full py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg space-y-6">
          <h2
            className="text-3xl md:text-4xl font-bold font-rotoris text-center"
            style={{ color: accentColor }}
          >
            The Auriqua Story
          </h2>

          <div className="space-y-4 text-lg md:text-xl text-black/80 leading-relaxed">
            <p>
              The Auriqua collection represents the pinnacle of horological artistry. Each timepiece is meticulously crafted by master watchmakers, combining centuries-old techniques with cutting-edge innovation.
            </p>
            <p>
              Born from a vision to create timepieces that transcend mere functionality, Auriqua embodies the perfect marriage of elegance and precision. Every detail, from the hand-finished case to the intricate movement, tells a story of dedication and craftsmanship.
            </p>
            <p>
              The result is not just a watch—it&apos;s a legacy piece that doesn&apos;t just tell time, it tells your story.
            </p>
          </div>

          {/* Key Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold" style={{ color: accentColor }}>
                42h
              </div>
              <div className="text-sm text-black/70">Power Reserve</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold" style={{ color: accentColor }}>
                50m
              </div>
              <div className="text-sm text-black/70">Water Resistance</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold" style={{ color: accentColor }}>
                40mm
              </div>
              <div className="text-sm text-black/70">Case Diameter</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold" style={{ color: accentColor }}>
                Swiss
              </div>
              <div className="text-sm text-black/70">Automatic Movement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
