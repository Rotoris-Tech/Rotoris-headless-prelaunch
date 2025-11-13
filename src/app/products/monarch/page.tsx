import ProductHero from "./ProductHero";

export default function Monarch() {
  return (
    <div className="relative w-full min-h-screen bg-black">
      <ProductHero
        videoSrc="/assets/products/Auriqua.mp4"
        logoSrc="/assets/products/auriqua.svg"
        productName="AURIQUA"
        subtitle="For the men who navigate their own course"
        ctaText="BEGIN THE JOURNEY"
      />

      {/* Section 2: Additional content */}
      <section className="relative w-full min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
        {/* Future sections */}
      </section>
    </div>
  );
}
