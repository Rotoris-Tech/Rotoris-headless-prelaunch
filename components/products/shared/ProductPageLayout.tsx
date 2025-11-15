"use client";

import { ReactNode } from "react";

type ProductPageLayoutProps = {
  backgroundColor?: string;
  backgroundImage?: string;
  children: ReactNode;
};

export function ProductPageLayout({
  backgroundColor,
  backgroundImage,
  children,
}: ProductPageLayoutProps) {
  return (
    <div
      className="w-full min-h-screen overflow-y-auto"
      style={{ backgroundColor, backgroundImage }}
    >
      <div className="w-full space-y-0">{children}</div>
    </div>
  );
}
