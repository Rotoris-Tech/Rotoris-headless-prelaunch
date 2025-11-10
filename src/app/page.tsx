"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(31);
  const [activeScene, setActiveScene] = useState(1);
  const [prevScene, setPrevScene] = useState(1);
  const [popupScene, setPopupScene] = useState<number | null>(null);
  const [targetSceneId, setTargetSceneId] = useState<number | null>(null);

  const frameIndex = useRef({ value: 31 });
  const tween = useRef<gsap.core.Tween | null>(null);
  const isAnimating = useRef(false);
  const scrollLock = useRef(false);
  const lastDirection = useRef<"forward" | "backward" | null>(null); // 👈 added

  const FRAME_RATE = 60;
  const SCROLL_LOCK_DELAY = 500; // 👈 reduced for better responsiveness
  gsap.ticker.fps(FRAME_RATE);

  const scenes = [
    { id: 1, start: 31, end: 208, appearAt: 120, label: "DISCOVER" },
    { id: 2, start: 208, end: 331, appearAt: 260, label: "SUSTAINABILITY" },
    { id: 3, start: 331, end: 445, appearAt: 380, label: "TECHNOLOGY" },
    { id: 4, start: 445, end: 635, appearAt: 520, label: "CRAFTSMANSHIP" },
    { id: 5, start: 635, end: 775, appearAt: 700, label: "PASSION" },
    { id: 6, start: 775, end: 839, appearAt: 800, label: "FINALE" },
  ];

  const totalFrames = 839;
  const images = useRef<HTMLImageElement[]>([]);

  const getImagePath = (i: number) =>
    `/assets/Image-testing/cartier testing_${String(i).padStart(5, "0")}.avif`;

  // ---------- load & render ----------
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getImagePath(i);
      images.current[i] = img;
    }

    const render = () => {
      const frame = Math.round(frameIndex.current.value);
      const img = images.current[frame];
      if (!img || !img.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cA = canvas.width / canvas.height;
      const iA = img.width / img.height;
      let w, h, x, y;
      if (cA > iA) {
        w = canvas.width;
        h = canvas.width / iA;
        x = 0;
        y = (canvas.height - h) / 2;
      } else {
        h = canvas.height;
        w = canvas.height * iA;
        x = (canvas.width - w) / 2;
        y = 0;
      }
      ctx.drawImage(img, x, y, w, h);
      setCurrentFrame(frame);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    resize();
    window.addEventListener("resize", resize);
    gsap.ticker.add(render);

    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ---------- playScene (with instant reverse unlock) ----------
  const playScene = (forward: boolean) => {
    if (isAnimating.current) return;

    // 👇 handle direction flip instantly
    const newDirection = forward ? "forward" : "backward";
    if (lastDirection.current && lastDirection.current !== newDirection) {
      scrollLock.current = false;
    }
    lastDirection.current = newDirection;

    if (scrollLock.current) return;
    isAnimating.current = true;
    scrollLock.current = true;

    const current = scenes.find((s) => s.id === activeScene)!;
    const nextScene = scenes.find((s) => s.id === activeScene + 1);
    const prevSceneObj = scenes.find((s) => s.id === activeScene - 1);

    let to = frameIndex.current.value;
    let newSceneId = activeScene;

    if (forward) {
      if (nextScene) {
        to = nextScene.start;
        newSceneId = nextScene.id;
      } else {
        to = current.end;
      }
    } else {
      if (frameIndex.current.value > current.start + 2) {
        to = current.start;
      } else if (prevSceneObj) {
        to = prevSceneObj.end;
        newSceneId = prevSceneObj.id;
      } else {
        to = current.start;
      }
    }

    setPrevScene(activeScene);
    setTargetSceneId(newSceneId);

    const from = frameIndex.current.value;
    const framesToTravel = Math.abs(to - from);
    const SCENE_DURATION = Math.max((framesToTravel / FRAME_RATE) * 1.2, 0.4);

    tween.current?.kill();
    tween.current = gsap.to(frameIndex.current, {
      value: to,
      duration: SCENE_DURATION,
      ease: "power1.inOut",
      onUpdate: () => setCurrentFrame(Math.round(frameIndex.current.value)),
      onComplete: () => {
        frameIndex.current.value = to;
        setCurrentFrame(to);
        setActiveScene(newSceneId);
        setTargetSceneId(null);
        isAnimating.current = false;

        // short lock to prevent rapid triggers
        setTimeout(() => (scrollLock.current = false), SCROLL_LOCK_DELAY);
      },
    });
  };

  // ---------- input ----------
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (popupScene !== null) return;
      if (isAnimating.current || scrollLock.current) return;
      playScene(e.deltaY > 0);
    };
    window.addEventListener("wheel", onWheel, { passive: true });

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => (startY = e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (popupScene !== null) return;
      if (isAnimating.current || scrollLock.current) return;
      const delta = startY - e.touches[0].clientY;
      if (Math.abs(delta) > 30) {
        playScene(delta > 0);
        startY = e.touches[0].clientY;
      }
    };

    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [popupScene, activeScene]);

  // ---------- buttons ----------
  const sceneForUI =
    targetSceneId !== null
      ? scenes.find((s) => s.id === targetSceneId)
      : scenes.find((s) => s.id === activeScene);
  const currentSceneData = sceneForUI!;
  const prevSceneData = scenes.find((s) => s.id === prevScene);

  const shouldShowPrevButton =
    prevSceneData &&
    currentFrame <= prevSceneData.end + 1 &&
    prevSceneData.id !== currentSceneData.id;

  const showButton =
    (currentSceneData &&
      currentFrame >= currentSceneData.appearAt &&
      currentFrame <= currentSceneData.end) ||
    shouldShowPrevButton;

  const buttonScene = shouldShowPrevButton ? prevSceneData! : currentSceneData!;
  const buttonEnabled = buttonScene && currentFrame >= buttonScene.appearAt + 5;

  // ---------- popups ----------
  const popupColors: Record<number, string> = {
    1: "#FFF8F0",
    2: "#E9F7EF",
    3: "#EAF2FF",
    4: "#FFF7E1",
    5: "#FFECEC",
    6: "#F0E8FF",
  };

  const openPopup = (id: number) => {
    if (popupScene) return;
    setPopupScene(id);
  };

  useEffect(() => {
    if (popupScene) {
      gsap.fromTo(
        ".popup",
        { y: "100%" },
        { y: "0%", duration: 0.6, ease: "power3.out" }
      );
    }
  }, [popupScene]);

  const closePopup = () => {
    gsap.to(".popup", {
      y: "100%",
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => setPopupScene(null),
    });
  };

  // ---------- UI ----------
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0"
      />

      <div className="fixed top-4 left-4 bg-black/70 text-white text-sm py-1 px-3 rounded font-mono z-20">
        Frame {currentFrame} / {totalFrames}
      </div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-center py-3 px-6 font-bold text-lg rounded-b-lg z-20">
        SCENE {activeScene} / {scenes.length}
      </div>

      {showButton && buttonScene && (
        <button
          disabled={!buttonEnabled}
          onClick={() => openPopup(buttonScene.id)}
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-30 text-white uppercase tracking-[0.2em] text-sm transition-all ${
            buttonEnabled
              ? "opacity-100 cursor-pointer"
              : "opacity-40 cursor-not-allowed"
          }`}
        >
          {buttonScene.label}
          <span className="block mx-auto mt-1 h-[1px] w-8 bg-white/70" />
        </button>
      )}

      {popupScene && (
        <div
          className="popup fixed inset-0 text-black z-50 overflow-y-auto"
          style={{ background: popupColors[popupScene] }}
        >
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 w-10 h-10 rounded-full border border-black/40 flex items-center justify-center text-lg hover:bg-black/10 cursor-pointer"
          >
            ✕
          </button>

          <div className="p-8 space-y-6">
            {popupScene === 1 && (
              <>
                <h2 className="text-3xl font-bold mb-4">✨ Discover Scene</h2>
                <p className="text-lg text-black/80">
                  Hero reveal and cinematic introduction.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Introduction</p>
                  <p>• Brand story</p>
                  <p>• Ambient mood build-up</p>
                </section>
              </>
            )}
            {popupScene === 2 && (
              <>
                <h2 className="text-3xl font-bold mb-4">
                  🌿 Sustainability Scene
                </h2>
                <p className="text-lg text-black/80">
                  Focus on eco-materials, responsible production and innovation.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Material sourcing</p>
                  <p>• Recycling process</p>
                  <p>• Green partnerships</p>
                </section>
              </>
            )}
            {popupScene === 3 && (
              <>
                <h2 className="text-3xl font-bold mb-4">⚙️ Technology Scene</h2>
                <p className="text-lg text-black/80">
                  Macro transitions highlighting technical precision.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Engineering excellence</p>
                  <p>• 3D modeling visuals</p>
                  <p>• Motion-capture integration</p>
                </section>
              </>
            )}
            {popupScene === 4 && (
              <>
                <h2 className="text-3xl font-bold mb-4">
                  🏆 Craftsmanship Scene
                </h2>
                <p className="text-lg text-black/80">
                  Showcasing artisan details and handcrafted perfection.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Hand finishing</p>
                  <p>• Heritage and legacy</p>
                  <p>• Premium material selection</p>
                </section>
              </>
            )}
            {popupScene === 5 && (
              <>
                <h2 className="text-3xl font-bold mb-4">🔥 Passion Scene</h2>
                <p className="text-lg text-black/80">
                  Emotion-driven segment exploring purpose and drive.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Vision and philosophy</p>
                  <p>• Behind the scenes</p>
                  <p>• Brand personality reveal</p>
                </section>
              </>
            )}
            {popupScene === 6 && (
              <>
                <h2 className="text-3xl font-bold mb-4">💎 Finale Scene</h2>
                <p className="text-lg text-black/80">
                  Cinematic outro with logo reveal and gratitude message.
                </p>
                <section className="space-y-3 mt-4">
                  <p>• Logo fade-in</p>
                  <p>• Closing message</p>
                  <p>• CTA or end transition</p>
                </section>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
