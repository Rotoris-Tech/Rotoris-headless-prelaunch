import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ParallaxRoman = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [visibleMoons, setVisibleMoons] = useState<number[]>([]);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerTop = rect.top;
        const containerHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate scroll progress for this container
        const scrollProgress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - containerTop) / (windowHeight + containerHeight)
          )
        );
        setScrollY(scrollProgress);

        // Show moons sequentially based on scroll progress
        const moonThresholds = [0.2, 0.35, 0.5, 0.65, 0.8];
        const newVisibleMoons: number[] = [];

        moonThresholds.forEach((threshold, index) => {
          if (scrollProgress >= threshold) {
            newVisibleMoons.push(index + 1);
          }
        });

        setVisibleMoons(newVisibleMoons);

        // Show text after all moons are visible
        setTextVisible(scrollProgress >= 0.6);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const moonSizes = [
    { width: 110, height: 110 }, // moon-1 (smallest)
    { width: 300, height: 300 }, // moon-2 (bigger - matches moon-4)
    { width: 400, height: 400 }, // moon-3 (biggest - center)
    { width: 240, height: 240 }, // moon-4 (bigger - matches moon-2)
    { width: 90, height: 90 }, // moon-5 (smallest)
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[100vh] overflow-hidden"
    >
      {/* Floating Clouds with Simple Parallax - Start from original positions, move up at different speeds */}
      <Image
        src="/assets/products/monarch/Cloud.svg"
        alt="cloud-1"
        width={250}
        height={100}
        style={{
          transform: `translateY(-${scrollY * 20}px) translateX(${
            Math.sin(scrollY * 3) * 15
          }px)`,
          mixBlendMode: "screen",
          top: "100px",
        }}
        className="absolute left-[-10px] transition-transform duration-100 ease-out"
      />
      <Image
        src="/assets/products/monarch/Cloud (1).svg"
        alt="cloud-2"
        width={162}
        height={68}
        style={{
          transform: `translateY(-${scrollY * 60}px) translateX(${
            Math.sin(scrollY * 2.5) * -20
          }px)`,
          mixBlendMode: "screen",
          top: "150px",
        }}
        className="absolute right-[-20px] transition-transform duration-80 ease-out"
      />
      <Image
        src="/assets/products/monarch/Cloud (2).svg"
        alt="cloud-3"
        width={210}
        height={100}
        style={{
          transform: `translateY(-${scrollY * 40}px) translateX(${
            Math.sin(scrollY * 1.8) * 12
          }px)`,
          mixBlendMode: "screen",
          top: "500px",
        }}
        className="absolute left-[-10px] transition-transform duration-120 ease-out"
      />
      <Image
        src="/assets/products/monarch/Cloud (3).svg"
        alt="cloud-4"
        width={400}
        height={229}
        style={{
          transform: `translateY(-${scrollY * 80}px) translateX(${
            Math.sin(scrollY * 2.8) * -18
          }px)`,
          mixBlendMode: "screen",
          top: "500px",
        }}
        className="absolute right-[-20px] transition-transform duration-100 ease-out"
      />

      {/* Sequential Moon Images */}
      <div style={{ top: "220px" }} className="absolute w-full">
        <div className="flex items-end justify-center" style={{ gap: "20px" }}>
          {[1, 2, 3, 4, 5].map((moonIndex) => (
            <div
              key={moonIndex}
              style={{
                transform: `translateY(${
                  moonIndex === 3
                    ? "70px"
                    : moonIndex === 2
                    ? "30px"
                    : moonIndex === 4
                    ? "15px"
                    : moonIndex === 1
                    ? "-10px"
                    : "-20px"
                })`,
                marginLeft:
                  moonIndex === 2
                    ? "-30px"
                    : moonIndex === 3
                    ? "-25px"
                    : moonIndex === 4
                    ? "-15px"
                    : "0px",
                marginRight:
                  moonIndex === 2
                    ? "-15px"
                    : moonIndex === 3
                    ? "-15px"
                    : moonIndex === 4
                    ? "-10px"
                    : "0px",
              }}
            >
              <Image
                src={`/assets/products/monarch/moon-${moonIndex}.svg`}
                alt={`moon-${moonIndex}`}
                width={moonSizes[moonIndex - 1].width}
                height={moonSizes[moonIndex - 1].height}
                className="drop-shadow-lg"
              />
            </div>
          ))}
        </div>

        {/* Masked Slide-up Text Animation */}
        <div
          className={`mt-16 text-center transition-all duration-1500 ease-out ${
            textVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{
            maskImage: textVisible
              ? "linear-gradient(to bottom, black 0%, black 100%)"
              : "linear-gradient(to bottom, transparent 0%, transparent 50%, black 100%)",
            WebkitMaskImage: textVisible
              ? "linear-gradient(to bottom, black 0%, black 100%)"
              : "linear-gradient(to bottom, transparent 0%, transparent 50%, black 100%)",
            transitionDelay: "800ms",
          }}
        >
          <p className="text-white text-lg md:text-xl lg:text-2xl font-light leading-relaxed max-w-2xl mx-auto px-4">
            "A reminder that everything, even time, moves in phases. Yet only
            the enduring are remembered."
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParallaxRoman;
