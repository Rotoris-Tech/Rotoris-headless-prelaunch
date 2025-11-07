"use client";

import { useEffect } from "react";
import ScrollImageSequence from "@/components/ScrollImageSequence";

export default function Home() {
  useEffect(() => {
    // Force scroll to top on mount
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <ScrollImageSequence
      imagePath="/assets/Image-testing"
      totalFrames={840}
      imagePrefix="cartier testing_"
      imageExtension="jpg"
      startFrame={0}
      zeroPadding={true}
      paddingLength={5}
    />
  );
}
