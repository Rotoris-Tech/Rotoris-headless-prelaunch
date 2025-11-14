"use client";

import { ProductPageLayout } from "./shared/ProductPageLayout";
import { AuriquaHero } from "./auriqua/AuriquaHero";
import { AuriquaStory } from "./auriqua/AuriquaStory";
import { WatchPreviewImageSection } from "./shared/WatchPreviewImageSection";
import { KeyMaterialsSection } from "./shared/KeyMaterialsSection";
import { WatchSketchVideoSection } from "./shared/WatchSketchVideoSection";
import { WatchQuotationSection } from "./shared/WatchQuotationSection";
import { ProductNewsletterSection } from "./shared/ProductNewsletterSection";

export function AuriquaProduct() {
  const product = {
    name: "Auriqua",
    images: [
      "/assets/products/auriqua/hero.jpg",
      "/assets/products/auriqua/detail-1.jpg",
      "/assets/products/auriqua/detail-2.jpg",
    ],
    materials: [
      {
        icon: "💎",
        title: "Sapphire Crystal",
        description: "Anti-reflective coating for perfect clarity in any lighting condition",
      },
      {
        icon: "⚙️",
        title: "Swiss Movement",
        description: "Automatic movement with 42-hour power reserve for reliable timekeeping",
      },
      {
        icon: "🎨",
        title: "Italian Leather",
        description: "Hand-stitched Nappa leather strap for supreme comfort and durability",
      },
      {
        icon: "💧",
        title: "Water Resistant",
        description: "50 meters water resistance suitable for everyday wear",
      },
    ],
    specifications: [
      { label: "Case Material", value: "316L Stainless Steel" },
      { label: "Case Diameter", value: "40mm" },
      { label: "Case Thickness", value: "11mm" },
      { label: "Crystal", value: "Sapphire, AR coated" },
      { label: "Movement", value: "Swiss Automatic" },
      { label: "Power Reserve", value: "42 hours" },
      { label: "Water Resistance", value: "50m / 5 ATM" },
      { label: "Strap", value: "Italian Nappa Leather" },
      { label: "Buckle", value: "Deployment clasp" },
    ],
    backgroundColor: "#E9F7EF",
    accentColor: "#4A9B6E",
  };

  return (
    <ProductPageLayout backgroundColor={product.backgroundColor}>
      <AuriquaHero />

      <WatchPreviewImageSection
        images={product.images}
        productName={product.name}
        accentColor={product.accentColor}
      />

      <AuriquaStory accentColor={product.accentColor} />

      <KeyMaterialsSection
        materials={product.materials}
        accentColor={product.accentColor}
      />

      <WatchSketchVideoSection
        videoSrc="/assets/products/auriqua/sketch-video.mp4"
        title="Crafted to Perfection"
        description="Watch our master artisans bring the Auriqua design to life, from initial concept sketches to the final masterpiece."
        accentColor={product.accentColor}
      />

      <WatchQuotationSection
        specifications={product.specifications}
        accentColor={product.accentColor}
      />

      <ProductNewsletterSection accentColor={product.accentColor} />
    </ProductPageLayout>
  );
}
