"use client";

import Image from "next/image";
import { useState } from "react";

type WatchPreviewImageSectionProps = {
  images: string[];
  productName: string;
  accentColor: string;
};

export function WatchPreviewImageSection({
  images,
  productName,
  accentColor,
}: WatchPreviewImageSectionProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <section className="w-full py-16">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        {/* Main Image Display */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm">
          <Image
            src={images[selectedImage]}
            alt={`${productName} view ${selectedImage + 1}`}
            fill
            className="object-cover"
            priority={selectedImage === 0}
          />
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-md transition-all hover:scale-105 ${
                  selectedImage === index
                    ? "ring-4 ring-offset-2"
                    : "opacity-60 hover:opacity-100"
                }`}
                style={{
                  ...(selectedImage === index && {
                    "--tw-ring-color": accentColor,
                  } as React.CSSProperties),
                }}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
