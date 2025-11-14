"use client";

export function AuriquaHero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/assets/products/auriqua/Auriqua.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-12 px-6">
        {/* Top Logo */}
        <div className="text-center pt-8">
          <h1 className="text-6xl md:text-8xl font-bold font-rotoris text-white tracking-widest">
            ROTORIS
          </h1>
        </div>

        {/* Center Content */}
        <div className="text-center space-y-6">
          <h2 className="text-7xl md:text-9xl font-bold font-rotoris text-white tracking-wider">
            AURIQUA
          </h2>
          <p className="text-2xl md:text-4xl text-white font-light tracking-wide">
            For the men who navigate
            <br />
            their own course
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="pb-12">
          <button className="px-10 py-4 text-lg font-semibold rounded-full bg-white/20 backdrop-blur-md text-white border-2 border-white/40 hover:bg-white/30 transition-all">
            BEGIN THE JOURNEY
          </button>
        </div>
      </div>
    </section>
  );
}
