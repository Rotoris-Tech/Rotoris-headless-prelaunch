'use client';

import { HomeScene } from './homeScenes';

interface HomeSceneOverlayProps {
  scene: HomeScene | null;
}

const positionClasses = {
  'top-left': 'top-8 left-8 items-start text-left',
  'top-right': 'top-8 right-8 items-end text-right',
  'bottom-left': 'bottom-8 left-8 items-start text-left',
  'bottom-right': 'bottom-8 right-8 items-end text-right',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center text-center',
};

export function HomeSceneOverlay({ scene }: HomeSceneOverlayProps) {
  if (!scene || (!scene.overlayTitle && !scene.overlaySubtitle)) {
    return null;
  }

  const position = scene.overlayPosition || 'center';
  const positionClass = positionClasses[position];

  return (
    <div
      className={`absolute z-10 flex flex-col ${positionClass} transition-opacity duration-500`}
    >
      {scene.overlayTitle && (
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-rotoris text-white drop-shadow-lg mb-4">
          {scene.overlayTitle}
        </h1>
      )}
      {scene.overlaySubtitle && (
        <p className="text-lg md:text-xl lg:text-2xl font-switzer text-white/90 drop-shadow-md">
          {scene.overlaySubtitle}
        </p>
      )}
    </div>
  );
}
