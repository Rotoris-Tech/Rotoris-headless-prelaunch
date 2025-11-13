"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface ProductHeroProps {
  videoSrc: string;
  logoSrc: string;
  productName: string;
  subtitle: string;
  ctaText: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export default function ProductHero({
  videoSrc,
  logoSrc,
  productName,
  subtitle,
  ctaText,
  showCloseButton = false,
  onClose,
}: ProductHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;

      // Try to play immediately
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video playing successfully");
          })
          .catch((err) => {
            console.log("Video autoplay failed:", err);
            // Try to play on any user interaction
            const attemptPlay = () => {
              video.play()
                .then(() => {
                  console.log("Video playing after interaction");
                  document.removeEventListener('click', attemptPlay);
                  document.removeEventListener('touchstart', attemptPlay);
                })
                .catch(e => console.log("Retry failed:", e));
            };

            document.addEventListener('click', attemptPlay, { once: true });
            document.addEventListener('touchstart', attemptPlay, { once: true });
          });
      }
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        webkit-playsinline="true"
        x5-playsinline="true"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div
        className="absolute bottom-0 left-0 w-full h-[60%] pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, #141C4F 0%, rgba(20, 28, 79, 0) 100%)'
        }}
      />

      {/* Text Overlays */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between text-white">
        {/* Top: ROTORIS Logo and Close Button */}
        <div className="w-full flex justify-between items-start pt-5 px-5">
          {/* ROTORIS Logo */}
          <div className="flex-1 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="166" height="24" viewBox="0 0 166 24" fill="none" className="opacity-80">
              <g clipPath="url(#clip0_6827_10372)">
                <path d="M38.8496 0.226562C29.7314 0.226562 26.4746 3.27905 26.4746 11.995C26.4746 20.7109 29.7314 23.7634 38.8496 23.7634C47.9677 23.7634 51.2245 20.7109 51.2245 11.995C51.2245 3.27905 48.0021 0.226562 38.8496 0.226562ZM38.8496 19.8639C32.7822 19.8639 31.0337 18.066 31.0337 11.995C31.0337 5.92396 32.7822 4.12602 38.8496 4.12602C44.9169 4.12602 46.6655 5.92396 46.6655 11.995C46.6655 18.066 44.9169 19.8639 38.8496 19.8639Z" fill="white"/>
                <path d="M90.4804 0.226562C81.3623 0.226562 78.1055 3.27905 78.1055 11.995C78.1055 20.7109 81.3623 23.7634 90.4804 23.7634C99.5986 23.7634 102.855 20.7109 102.855 11.995C102.855 3.27905 99.6329 0.226562 90.4804 0.226562ZM90.4804 19.8639C84.4131 19.8639 82.6646 18.066 82.6646 11.995C82.6646 5.92396 84.4131 4.12602 90.4804 4.12602C96.5478 4.12602 98.2963 5.92396 98.2963 11.995C98.2963 18.066 96.5478 19.8639 90.4804 19.8639Z" fill="white"/>
                <path d="M140.479 0.634766H135.223C135.414 1.33314 135.607 1.96359 135.607 3.22874V20.7455C135.607 22.0106 135.416 22.6453 135.223 23.3564H140.479C140.288 22.6475 140.095 22.0128 140.095 20.7455V3.22874C140.095 1.96359 140.286 1.33102 140.479 0.634766Z" fill="white"/>
                <path d="M112.301 23.3201H112.683C112.49 22.6111 112.301 21.9764 112.301 20.707V23.3201Z" fill="white"/>
                <path d="M129.208 21.2684C129.178 21.2154 129.152 21.1708 129.126 21.1305L125.636 14.9066L125.586 14.8451H125.599L125.419 14.5245C128.371 13.6754 129.545 11.6185 129.545 7.82521C129.545 2.60329 127.316 0.601562 121.285 0.601562H107.432C107.625 1.29782 107.814 1.92827 107.814 3.18493V20.708C107.814 21.9774 107.625 22.6121 107.432 23.3211H112.302V14.9788H120.141L124.818 23.3211H130.922C130.77 23.2001 130.633 23.0813 130.5 22.9624C130.161 22.6418 129.671 22.0963 129.206 21.2684H129.208ZM121.761 11.0878L121.776 11.1154H112.302V4.50314H120.909C123.958 4.50314 125.054 5.38194 125.054 7.85705C125.054 10.0265 124.194 10.9329 121.763 11.0878H121.761Z" fill="white"/>
                <path d="M4.87305 23.3201H5.25494C5.06185 22.6111 4.87305 21.9764 4.87305 20.707V23.3201Z" fill="white"/>
                <path d="M21.7785 21.2684C21.7484 21.2154 21.7227 21.1708 21.697 21.1305L18.2063 14.9066L18.157 14.8451H18.1698L17.9896 14.5245C20.9418 13.6754 22.1153 11.6185 22.1153 7.82521C22.1153 2.60329 19.8862 0.601562 13.8532 0.601562H0C0.193091 1.29782 0.38189 1.92827 0.38189 3.18493V20.708C0.38189 21.9774 0.193091 22.6121 0 23.3211H4.87018V14.9788H12.7097L17.3867 23.3211H23.4906C23.3382 23.2001 23.2009 23.0813 23.0679 22.9624C22.7289 22.6418 22.2398 22.0963 21.7742 21.2684H21.7785ZM14.3316 11.0878L14.3466 11.1154H4.87233V4.50314H13.4799C16.5286 4.50314 17.6249 5.38194 17.6249 7.85705C17.6249 10.0265 16.7646 10.9329 14.3338 11.0878H14.3316Z" fill="white"/>
                <path d="M74.8307 1.41805L74.7771 0.634766H53.9619L53.9083 1.41805L53.8954 1.61971L53.6937 4.60214H53.7001L53.668 5.09249C55.5839 4.7104 57.5212 4.61276 59.4628 4.60427L62.1275 4.60214V16.6868H62.1232V21.274C62.1232 21.7729 61.6019 22.8151 61.501 23.3607H67.2487C67.1478 22.8151 66.6265 21.7729 66.6265 21.274V16.6868H66.6158V4.60214H69.2869C71.2285 4.61276 73.1658 4.7104 75.0817 5.09249L74.8393 1.41805H74.8307Z" fill="white"/>
                <path d="M157.993 9.83247L154.108 9.52255C150.255 9.20839 149.628 8.58643 149.628 6.89037C149.628 6.20685 149.736 5.47663 150.229 4.96293C150.81 4.36008 151.727 4.17328 152.527 4.0629C153.469 3.93341 154.4 3.95677 155.346 3.96101C155.799 3.96526 156.251 3.96526 156.704 3.97375C157.526 3.98224 158.208 4.05441 158.764 4.20087C159.926 4.50655 160.703 5.61461 160.581 6.7991C160.572 6.87764 160.564 6.92009 160.564 6.92009H165.432H165.47C165.327 2.01659 162.366 0.239868 157.142 0C156.59 0.00424546 156.043 0.00424312 155.492 0.00424312C154.816 0.00848858 154.142 0.0254681 153.471 0.00848625C152.355 -0.0169865 151.173 0.137972 150.087 0.399067C149.218 0.61134 148.362 0.927632 147.618 1.42647C146.964 1.85739 146.408 2.42415 146.005 3.09281C145.576 3.80605 145.325 4.6042 145.189 5.41932C145.086 6.02218 145.05 6.63352 145.05 7.24062C145.05 11.709 147.079 13.335 153.061 13.819L156.981 14.1331C160.654 14.407 161.426 15.0629 161.426 16.899C161.426 19.285 160.126 20.047 155.262 20.047C155.176 20.047 155.088 20.047 155.007 20.0428L153.587 20.0343C152.75 20.0237 152.061 19.9494 151.497 19.7987C150.326 19.4824 149.549 18.3573 149.673 17.1623C149.682 17.0858 149.688 17.0413 149.688 17.0413H144.82C144.865 18.7649 145.273 20.531 146.517 21.7983C147.843 23.1505 149.787 23.6642 151.617 23.8828C152.814 24.025 154.001 24.0017 155.202 23.9932C163.258 23.9571 166 22.0658 166 16.6528C166 12.0826 164.078 10.3228 157.993 9.8346V9.83247Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0_6827_10372">
                  <rect width="166" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              aria-label="Close"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Bottom Content: Product Logo, Subtitle, and CTA */}
        <div className="flex flex-col items-center pb-10 md:pb-12 gap-[60px] md:gap-[54px]">
          {/* Product Logo and Subtitle Group */}
          <div className="flex flex-col items-center gap-3">
            {/* Product Logo */}
            <Image
              src={logoSrc}
              alt={productName}
              width={400}
              height={80}
              className="w-[222px] h-7 md:w-[400px] md:h-20"
            />

            {/* Subtitle */}
            <p
              className="text-base md:text-xl text-white text-center px-4 font-normal"
              style={{
                fontFamily: 'Rotoris Sans',
                lineHeight: '135%',
                letterSpacing: '-0.6px'
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* CTA Text */}
          <p
            className="text-xs md:text-sm text-white opacity-70 text-center font-normal"
            style={{
              fontFamily: 'Rotoris Sans',
              letterSpacing: '0.2em'
            }}
          >
            {ctaText}
          </p>
        </div>
      </div>
    </section>
  );
}
