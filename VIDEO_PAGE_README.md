# Video Page - Scroll-Based Video Scrubbing

## Overview

A separate page that provides the same scroll-driven experience as the image-based animation, but using HTML5 video instead of sequential frames.

## Location

**URL:** `/video`
**File:** `src/app/video/page.tsx`

## Features

- Scroll/swipe to scrub through video
- 6 interactive scenes with popup overlays
- Same UI/UX as the image-based version
- Smooth GSAP-powered transitions
- Mobile-friendly touch support
- Scene-based navigation with labels

## Setup Instructions

### 1. Add Your Video File

Place your video file(s) in the public directory:

```
public/assets/video/
├── main.mp4       # Primary video format (required)
└── main.webm      # Optional fallback format
```

### 2. Configure Scene Timestamps

Edit the `scenes` array in `src/app/video/page.tsx` (line 24) to match your video content:

```typescript
const scenes = [
  { id: 1, start: 0, end: 10, appearAt: 5, label: "DISCOVER" },
  { id: 2, start: 10, end: 20, appearAt: 15, label: "SUSTAINABILITY" },
  // ... adjust based on your video duration and content
];
```

**Parameters:**
- `start`: Scene start time in seconds
- `end`: Scene end time in seconds
- `appearAt`: When the scene button appears (in seconds)
- `label`: Scene button text (uppercase)

### 3. Customize Popup Content

Edit the popup content starting at line 264 to match your brand story:

```typescript
{popupScene === 1 && (
  <>
    <h2 className="text-3xl font-bold mb-4">Your Scene Title</h2>
    <p className="text-lg text-black/80">Your scene description...</p>
    {/* Add your custom content */}
  </>
)}
```

### 4. Adjust Popup Colors (Optional)

Modify the `popupColors` object at line 167 to match your brand colors:

```typescript
const popupColors: Record<number, string> = {
  1: "#FFF8F0",  // Scene 1 background
  2: "#E9F7EF",  // Scene 2 background
  // ...
};
```

## Video Format Recommendations

### Optimal Settings

- **Container:** MP4 (H.264) or WebM (VP9)
- **Resolution:** 1920x1080 or higher
- **Frame Rate:** 30 fps or 60 fps
- **Bitrate:** 5-10 Mbps for good quality
- **Duration:** Adjust scene timestamps to match

### Browser Compatibility

- **MP4 (H.264):** Supported by all modern browsers
- **WebM (VP9):** Optional fallback for browsers that prefer it

### Video Optimization Tips

1. **Compress your video** to reduce file size while maintaining quality
2. Use tools like **FFmpeg** or **HandBrake** for encoding
3. Consider **adaptive bitrate** for different network conditions
4. Add **poster image** for better initial loading experience

Example FFmpeg command:
```bash
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 128k public/assets/video/main.mp4
```

## How It Works

### Video Scrubbing Mechanism

1. **Scroll/Touch Input** → Detects forward/backward gestures
2. **GSAP Animation** → Smoothly tweens `video.currentTime`
3. **Scene Detection** → Updates UI based on current timestamp
4. **Popup Triggers** → Shows overlays at specific timestamps

### Key Differences from Image Version

| Feature | Image Version | Video Version |
|---------|--------------|---------------|
| **Asset Type** | 840 AVIF frames | Single video file |
| **File Size** | ~31MB (all frames) | Varies (typically smaller) |
| **Loading** | Preload all images | Stream/progressive load |
| **Scrubbing** | Frame index | Video currentTime |
| **Performance** | More memory usage | More efficient |

## Usage

### Development

```bash
npm run dev
```

Visit: `http://localhost:3000/video`

### Production

```bash
npm run build
npm run start
```

## Customization Options

### Change Scroll Speed

Adjust `SCENE_DURATION` calculation at line 103:

```typescript
const SCENE_DURATION = Math.max(timeToTravel * 0.8, 0.4);
//                                            ↑ Lower = faster, Higher = slower
```

### Change Scroll Lock Delay

Modify `SCROLL_LOCK_DELAY` at line 22:

```typescript
const SCROLL_LOCK_DELAY = 500; // milliseconds
```

### Add Navigation Link

To navigate from homepage to video page, add a button in `src/app/page.tsx`:

```tsx
import Link from 'next/link';

<Link href="/video">
  <button className="fixed top-4 right-4 z-20 bg-white text-black px-4 py-2 rounded">
    View Video Version
  </button>
</Link>
```

## Troubleshooting

### Video Not Playing

1. Check video file path is correct
2. Ensure video format is supported (MP4/WebM)
3. Verify video is placed in `public/assets/video/`
4. Check browser console for errors

### Scenes Not Appearing

1. Verify scene timestamps match video duration
2. Check `appearAt` values are within scene bounds
3. Ensure video has loaded (check `isLoaded` state)

### Laggy Scrubbing

1. Reduce video resolution
2. Compress video file size
3. Use lower bitrate encoding
4. Consider shorter video duration

## Technical Details

- **Framework:** Next.js 16 + React 19
- **Animation:** GSAP 3.13.0
- **Styling:** Tailwind CSS 4.0
- **Video Element:** HTML5 `<video>` with `playsInline` and `muted`

## Browser Support

- Chrome/Edge: Full support
- Safari: Full support (requires `playsInline`)
- Firefox: Full support
- Mobile Safari: Full support
- Android Chrome: Full support

## Performance Notes

- Video scrubbing works best with **keyframes** in the video encoding
- For ultra-smooth scrubbing, use higher keyframe frequency
- Modern browsers buffer video efficiently for scrubbing
- Mobile devices may have limitations with very large videos

---

**Need help?** Check the main page implementation in `src/app/page.tsx` for reference patterns.
