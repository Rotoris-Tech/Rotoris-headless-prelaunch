import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ParallaxRoman = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ideationRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [ideationVisible, setIdeationVisible] = useState(false);

  useEffect(() => {
    const updateScrollY = (scrollContainer?: Element) => {
      let newScrollY = 0;

      if (scrollContainer) {
        newScrollY = scrollContainer.scrollTop;
      } else {
        newScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      }

      setScrollY(newScrollY);
    };

    const handleScroll = (event?: Event) => {
      const scrollContainer = event?.target as Element;
      updateScrollY(scrollContainer);

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerTop = rect.top;
        const windowHeight = window.innerHeight;

        // Show moons when section enters viewport
        if (containerTop < windowHeight && !sectionVisible) {
          setSectionVisible(true);
        }
      }
    };

    // Find all scrollable containers
    const scrollableContainers = document.querySelectorAll('[style*="overflow"]');
    const bodyContainer = document.body;
    const htmlContainer = document.documentElement;

    // Add listeners to potential scroll containers
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("scroll", handleScroll);
    bodyContainer.addEventListener("scroll", handleScroll);
    htmlContainer.addEventListener("scroll", handleScroll);

    // Add to any other scrollable containers
    scrollableContainers.forEach(container => {
      container.addEventListener("scroll", handleScroll);
    });

    // Also listen to any parent containers that might be scrollable
    if (containerRef.current) {
      let parent = containerRef.current.parentElement;
      while (parent && parent !== document.body) {
        parent.addEventListener("scroll", handleScroll);
        parent = parent.parentElement;
      }
    }

    // Initial update
    updateScrollY();
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      bodyContainer.removeEventListener("scroll", handleScroll);
      htmlContainer.removeEventListener("scroll", handleScroll);

      scrollableContainers.forEach(container => {
        container.removeEventListener("scroll", handleScroll);
      });
    };
  }, [sectionVisible]);

  // Separate useEffect for Intersection Observer
  useEffect(() => {
    if (!ideationRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !ideationVisible) {
            setIdeationVisible(true);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -10% 0px' // Trigger slightly before element fully enters
      }
    );

    observer.observe(ideationRef.current);

    return () => observer.disconnect();
  }, [ideationVisible]);

  const moonSizes = [
    { width: 110, height: 110 }, // moon-1 (smallest)
    { width: 300, height: 300 }, // moon-2 (bigger - matches moon-4)
    { width: 400, height: 400 }, // moon-3 (biggest - center)
    { width: 240, height: 240 }, // moon-4 (bigger - matches moon-2)
    { width: 90, height: 90 }, // moon-5 (smallest)
  ];

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full min-h-[100vh] overflow-hidden"
      >
        {/* Foreground Parallax Clouds - Starting further down, moving up slowly */}
        <Image
          src="/assets/products/monarch/Cloud.svg"
          alt="cloud-1"
          width={250}
          height={100}
          style={{
            transform: `translateY(${scrollY * -0.3}px)`,
            mixBlendMode: "screen",
            top: "200px",
            left: "-10px",
          }}
          className="absolute"
        />
        <Image
          src="/assets/products/monarch/Cloud (1).svg"
          alt="cloud-2"
          width={162}
          height={68}
          style={{
            transform: `translateY(${scrollY * -0.5}px)`,
            mixBlendMode: "screen",
            top: "250px",
            right: "-20px",
          }}
          className="absolute"
        />
        <Image
          src="/assets/products/monarch/Cloud (2).svg"
          alt="cloud-3"
          width={210}
          height={100}
          style={{
            transform: `translateY(${scrollY * -0.4}px)`,
            mixBlendMode: "screen",
            top: "500px",
            left: "-10px",
            zIndex: 0,
          }}
          className="absolute"
        />
        <Image
          src="/assets/products/monarch/Cloud (3).svg"
          alt="cloud-4"
          width={400}
          height={229}
          style={{
            transform: `translateY(${scrollY * -0.6}px)`,
            mixBlendMode: "screen",
            top: "600px",
            right: "-20px",
            zIndex: 0,
          }}
          className="absolute"
        />

        {/* Sequential Moon Images */}
        <div style={{ top: "220px", zIndex: 1 }} className="absolute w-full">
          <div
            className="flex items-end justify-center"
            style={{ gap: "20px" }}
          >
            {[1, 2, 3, 4, 5].map((moonIndex) => (
              <div
                key={moonIndex}
                className={`transition-all duration-1200 ease-out ${
                  sectionVisible
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-50"
                }`}
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
                  transitionDelay: `${(moonIndex - 1) * 250}ms`,
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
              sectionVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              maskImage: sectionVisible
                ? "linear-gradient(to bottom, black 0%, black 100%)"
                : "linear-gradient(to bottom, transparent 0%, transparent 50%, black 100%)",
              WebkitMaskImage: sectionVisible
                ? "linear-gradient(to bottom, black 0%, black 100%)"
                : "linear-gradient(to bottom, transparent 0%, transparent 50%, black 100%)",
              transitionDelay: "1250ms",
            }}
          >
            <p className="text-white text-lg md:text-xl lg:text-2xl font-light leading-relaxed max-w-2xl mx-auto px-4">
              "A reminder that everything, even time, moves in phases. Yet only
              the enduring are remembered."
            </p>
          </div>
        </div>
      </div>

      {/* IDEATION Tag and Title - After 100vh section */}
      <div ref={ideationRef} className="w-full py-16 text-center">
        <div
          className={`transition-all duration-1000 ease-out ${
            ideationVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "135%",
            letterSpacing: "0%",
            textAlign: "center",
            textTransform: "uppercase",
            transitionDelay: "400ms",
          }}
        >
          <span className="text-[#fff] opacity-30">IDEATION</span>
        </div>
        <div
          className={`mt-4 transition-all duration-1200 w-[80%] m-auto ease-out ${
            ideationVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            fontWeight: 600,
            fontSize: "32px",
            lineHeight: "120%",
            letterSpacing: "-3%",
            textAlign: "center",
            transitionDelay: "800ms",
          }}
        >
          <h2 className="text-white">
            The Mind Behind <br /> Monarch
          </h2>
        </div>

        {/* Roman Number SVG */}
        <div
          className={`mt-8 flex justify-center transition-all duration-1400 ease-out ${
            ideationVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: "1200ms",
          }}
        >
          <Image
            src="/assets/products/monarch/Roman Number.svg"
            alt="Roman Number"
            width={100}
            height={100}
            className="drop-shadow-lg w-full h-auto"
          />
        </div>

        {/* Background Image */}
        <div
          className={`mt-8 w-full transition-all duration-1600 ease-out ${
            ideationVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: "1600ms",
          }}
        >
          <Image
            src="/assets/products/monarch/Background Image.svg"
            alt="Background Image"
            width={1200}
            height={600}
            className="w-full h-auto"
          />
        </div>
      </div>
    </>
  );
};

export default ParallaxRoman;
