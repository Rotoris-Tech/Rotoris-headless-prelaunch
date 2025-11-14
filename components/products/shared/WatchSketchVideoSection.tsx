"use client";

type WatchSketchVideoSectionProps = {
  videoSrc: string;
  title: string;
  description: string;
  accentColor: string;
};

export function WatchSketchVideoSection({
  videoSrc,
  title,
  description,
  accentColor,
}: WatchSketchVideoSectionProps) {
  return (
    <section className="w-full py-16 bg-white/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-4">
          <h2
            className="text-4xl md:text-5xl font-bold font-rotoris"
            style={{ color: accentColor }}
          >
            {title}
          </h2>
          <p className="text-lg md:text-xl text-black/70 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <video
            className="w-full h-full object-cover"
            controls
            playsInline
            poster="/assets/products/sketch-thumbnail.jpg"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
