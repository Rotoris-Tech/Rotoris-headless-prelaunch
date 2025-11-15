"use client";
import React from "react";
import { ProductPageLayout } from "./shared/ProductPageLayout";
import MonarchHero from "./monarch/MonarchHero";
import MonarchImageSequence from "./monarch/MonarchImageSequence";
import ParallaxRoman from "./monarch/ParallaxRoman";

const MonarchProduct = () => {
  const product = {
    backgroundImage: "linear-gradient(180deg,#002B48 0%, #286E93 100%)",
  };
  return (
    <ProductPageLayout backgroundImage={product.backgroundImage}>
      {/* <MonarchImageSequence /> */}
      <MonarchHero />
      {/* Spacer section with same gradient as background */}
      <div
        className="w-full h-screen"
        style={{
          background: "#206084",
        }}
      />
      {/* <div
        className="w-full h-screen"
        style={{
          background: "#206084",
        }}
      /> */}
      <ParallaxRoman />
    </ProductPageLayout>
  );
};

export default MonarchProduct;
