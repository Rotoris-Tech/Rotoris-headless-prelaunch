"use client";
import React from "react";
import { ProductPageLayout } from "./shared/ProductPageLayout";
import Image from "next/image";
import ParallaxRoman from "./monarch/ParallaxRoman";

const MonarchProduct = () => {
  const product = {
    backgroundImage: "linear-gradient(180deg,#002B48 0%, #286E93 100%)",
  };
  return (
    <ProductPageLayout backgroundImage={product.backgroundImage}>
      <ParallaxRoman />
    </ProductPageLayout>
  );
};

export default MonarchProduct;
