"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Monarch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rotorisLogoRef = useRef<HTMLImageElement>(null);
  const auriquaLogoRef = useRef<HTMLImageElement>(null);
  const scrollY = useRef<number>(0);
  const animationFrameId = useRef<number>();

  // ROTORIS logo SVG as data URL
  const rotorisLogoSVG = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="166" height="24" viewBox="0 0 166 24" fill="none">
  <g clip-path="url(#clip0_6827_10372)">
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
</svg>`)}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const video = videoRef.current;
    const rotorisLogo = rotorisLogoRef.current;
    const auriquaLogo = auriquaLogoRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Setup video
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.play().catch((err) => console.log("Video autoplay failed:", err));
    }

    // Smooth scroll handler
    const handleScroll = () => {
      scrollY.current = container.scrollTop;
    };

    container.addEventListener("scroll", handleScroll);

    // Render function
    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scroll = scrollY.current;

      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      // Section 1: Video Section (0 - 1000px)
      if (scroll < 1200 && video && video.readyState >= 2) {
        // Draw video at full opacity (no fade)
        ctx.globalAlpha = 1;

        // Calculate video dimensions to cover canvas
        const videoAspect = video.videoWidth / video.videoHeight;
        const canvasAspect = w / h;
        let drawWidth, drawHeight, drawX, drawY;

        if (canvasAspect > videoAspect) {
          drawWidth = w;
          drawHeight = w / videoAspect;
          drawX = 0;
          drawY = (h - drawHeight) / 2;
        } else {
          drawHeight = h;
          drawWidth = h * videoAspect;
          drawX = (w - drawWidth) / 2;
          drawY = 0;
        }

        ctx.drawImage(video, drawX, drawY, drawWidth, drawHeight);

        // Draw gradient overlay at bottom (upright direction - dark at bottom to transparent at top)
        const gradientHeight = h * 0.6; // Cover bottom 60% of screen
        const gradient = ctx.createLinearGradient(0, h - gradientHeight, 0, h);
        gradient.addColorStop(0, "rgba(20, 28, 79, 0)"); // Transparent at top
        gradient.addColorStop(1, "#141C4F"); // Solid at bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(0, h - gradientHeight, w, gradientHeight);

        // ROTORIS logo at top (reduced spacing) - using SVG/Image
        const rotorisY = 40 - scroll * 0.2;
        if (rotorisY > -50 && rotorisY < h + 50 && rotorisLogo && rotorisLogo.complete) {
          ctx.globalAlpha = 0.8;
          // Original SVG dimensions: 166x24, maintain aspect ratio
          const logoHeight = 24;
          const logoWidth = 166;
          ctx.drawImage(rotorisLogo, w / 2 - logoWidth / 2, rotorisY - logoHeight / 2, logoWidth, logoHeight);
        }

        // Check if mobile or desktop
        const isMobile = w < 768;

        // Calculate positions from bottom of viewport
        const bottomPadding = isMobile ? 40 : 50;
        const spaceBetweenSubtitleAndBottom = isMobile ? 60 : 54;
        const spaceBetweenLogoAndSubtitle = 12; // Same for both mobile and desktop

        // Bottom text position
        const bottomTextY = h - bottomPadding;

        // Subtitle position (accounting for 2 lines and line height)
        const subtitleLineHeight = isMobile ? 22 : 27; // 135% line height
        const subtitleLine2Y = bottomTextY - spaceBetweenSubtitleAndBottom;
        const subtitleLine1Y = subtitleLine2Y - subtitleLineHeight;

        // AURIQUA logo position
        const auriquaLogoHeight = isMobile ? 28 : 80;
        const auriquaLogoY = subtitleLine1Y - spaceBetweenLogoAndSubtitle - auriquaLogoHeight;

        // Draw AURIQUA logo SVG
        if (auriquaLogo && auriquaLogo.complete) {
          ctx.globalAlpha = 1;
          const auriquaLogoWidth = isMobile ? 222 : 400;
          ctx.drawImage(
            auriquaLogo,
            w / 2 - auriquaLogoWidth / 2,
            auriquaLogoY,
            auriquaLogoWidth,
            auriquaLogoHeight
          );
        }

        // Subtitle - match the image styling
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#FFF";
        ctx.font = isMobile ? "400 16px 'Rotoris Sans'" : "400 20px 'Rotoris Sans'";
        ctx.textAlign = "center";
        ctx.letterSpacing = "-0.6px";

        // Multi-line text for subtitle
        const line1 = "For the men who navigate";
        const line2 = "their own course";
        ctx.fillText(line1, w / 2, subtitleLine1Y);
        ctx.fillText(line2, w / 2, subtitleLine2Y);

        // Bottom text - BEGIN THE JOURNEY
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "#ffffff";
        ctx.font = isMobile ? "400 12px 'Rotoris Sans'" : "400 14px 'Rotoris Sans'";
        ctx.letterSpacing = "0.2em";
        ctx.textAlign = "center";
        ctx.fillText("BEGIN THE JOURNEY", w / 2, bottomTextY);
      }

      ctx.globalAlpha = 1;

      // Continue animation loop
      animationFrameId.current = requestAnimationFrame(render);
    };

    // Start render loop
    render();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      container.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Hidden video element for canvas rendering */}
      <video
        ref={videoRef}
        className="hidden"
        muted
        loop
        playsInline
        autoPlay
      >
        <source src="/assets/products/Auriqua.mov" type="video/mp4" />
      </video>

      {/* Hidden ROTORIS logo for canvas rendering */}
      <img
        ref={rotorisLogoRef}
        src={rotorisLogoSVG}
        alt="ROTORIS"
        className="hidden"
      />

      {/* Hidden AURIQUA logo for canvas rendering */}
      <img
        ref={auriquaLogoRef}
        src="/assets/products/auriqua.svg"
        alt="AURIQUA"
        className="hidden"
      />

      {/* Canvas for rendering */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Spacer for scroll height */}
        <div style={{ height: "7000px" }} />
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
