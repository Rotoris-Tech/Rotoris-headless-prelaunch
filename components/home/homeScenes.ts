export interface HomeScene {
  id: string;
  label: string;
  startTime: number;  // seconds
  endTime: number;    // seconds
  overlayTitle?: string;
  overlaySubtitle?: string;
  overlayPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export const homeScenes: HomeScene[] = [
  {
    id: 'intro',
    label: 'Introduction',
    startTime: 0,
    endTime: 3,
    overlayTitle: 'Rotoris',
    overlaySubtitle: 'Crafted for Excellence',
    overlayPosition: 'center',
  },
  {
    id: 'craftsmanship',
    label: 'Craftsmanship',
    startTime: 3,
    endTime: 6,
    overlayTitle: 'Precision Engineering',
    overlaySubtitle: 'Every detail matters',
    overlayPosition: 'bottom-left',
  },
  {
    id: 'materials',
    label: 'Premium Materials',
    startTime: 6,
    endTime: 9,
    overlayTitle: 'Finest Materials',
    overlaySubtitle: 'Sourced from around the world',
    overlayPosition: 'top-right',
  },
  {
    id: 'collection',
    label: 'Our Collection',
    startTime: 9,
    endTime: 12,
    overlayTitle: 'Discover Our Collection',
    overlaySubtitle: 'Timeless luxury watches',
    overlayPosition: 'center',
  },
];

export function getSceneAtTime(currentTime: number): HomeScene | null {
  return homeScenes.find(
    scene => currentTime >= scene.startTime && currentTime <= scene.endTime
  ) || null;
}
