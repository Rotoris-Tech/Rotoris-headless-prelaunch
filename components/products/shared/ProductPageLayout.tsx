"use client";

import { ReactNode } from "react";

type ProductPageLayoutProps = {
  backgroundColor: string;
  children: ReactNode;
};

export function ProductPageLayout({ backgroundColor, children }: ProductPageLayoutProps) {
  return (
    <div
      className="w-full min-h-screen overflow-y-auto"
      style={{ backgroundColor }}
    >
      <div className="w-full space-y-0">
        {children}
      </div>
    </div>
  );
}
