# Scroll Animation Implementation Guide

## Overview

This project includes a high-performance scroll-based image sequence animation component that displays 300+ frames smoothly as users scroll.

## Component: ScrollImageSequence

Location: `src/components/ScrollImageSequence.jsx`

### Features
- ✅ Smooth 60fps animation
- ✅ Preloads all images for seamless playback
- ✅ Loading progress indicator
- ✅ Responsive canvas sizing
- ✅ Performance optimized with requestAnimationFrame
- ✅ Dark mode support
- ✅ Configurable naming conventions

## Quick Usage Example

### Basic Implementation

```jsx
import ScrollImageSequence from "@/components/ScrollImageSequence";

export default function ProductPage() {
  return (
    <div>
      <ScrollImageSequence
        imagePath="/assets/images/auriqua"
        totalFrames={300}
        imagePrefix="frame-"
        imageExtension="jpg"
        startFrame={1}
        zeroPadding={true}
        paddingLength={4}
      />
    </div>
  );
}
```

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imagePath` | string | Required | Path to image folder (e.g., "/assets/images/sequence") |
| `totalFrames` | number | Required | Total number of frames in sequence |
| `imagePrefix` | string | "frame-" | Prefix for image filenames |
| `imageExtension` | string | "jpg" | Image file extension (jpg, png, webp) |
| `startFrame` | number | 0 | Starting frame number |
| `zeroPadding` | boolean | true | Whether frame numbers are zero-padded |
| `paddingLength` | number | 4 | Length of zero padding (e.g., 4 = "0001") |
| `className` | string | "" | Additional CSS classes |
| `scrollMultiplier` | number | 1 | Scroll sensitivity (higher = faster) |

## Implementation Steps

### Step 1: Prepare Your Images

1. Place images in `public/assets/images/[product-name]/`
2. Name them with consistent pattern:
   - `frame-0001.jpg`
   - `frame-0002.jpg`
   - `frame-0300.jpg`

### Step 2: Add Component to Page

Example for Auriqua product page:

**File:** `src/app/products/auriqua/page.js`

```jsx
import ScrollImageSequence from "@/components/ScrollImageSequence";
import Link from "next/link";

export const metadata = {
  title: "Auriqua - Rotoris",
  description: "Discover Auriqua by Rotoris",
};

export default function Auriqua() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section with Scroll Animation */}
      <ScrollImageSequence
        imagePath="/assets/images/auriqua"
        totalFrames={300}
        imagePrefix="frame-"
        imageExtension="jpg"
        startFrame={1}
        zeroPadding={true}
        paddingLength={4}
        className="w-full"
      />

      {/* Content Below Animation */}
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to Home
        </Link>

        <div className="mt-12">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Auriqua
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Your product description here...
          </p>
        </div>
      </main>
    </div>
  );
}
```

### Step 3: Customize Scroll Behavior

#### Slower Scrolling (More control)
```jsx
<ScrollImageSequence
  scrollMultiplier={0.5}
  // ... other props
/>
```

#### Faster Scrolling (Quicker animation)
```jsx
<ScrollImageSequence
  scrollMultiplier={1.5}
  // ... other props
/>
```

#### Adjust Scroll Height
Modify the component's internal height calculation by editing line 164:
```jsx
style={{ height: `${totalFrames * 3}vh` }}
// Increase multiplier (e.g., 5) for longer scroll
// Decrease multiplier (e.g., 2) for shorter scroll
```

## Advanced Usage Examples

### Example 1: Different Naming Convention

If your files are named: `img_001.png`, `img_002.png`, etc.

```jsx
<ScrollImageSequence
  imagePath="/assets/images/product"
  totalFrames={250}
  imagePrefix="img_"
  imageExtension="png"
  startFrame={1}
  zeroPadding={true}
  paddingLength={3}
/>
```

### Example 2: No Zero Padding

If your files are named: `frame-1.jpg`, `frame-2.jpg`, etc.

```jsx
<ScrollImageSequence
  imagePath="/assets/images/product"
  totalFrames={300}
  imagePrefix="frame-"
  imageExtension="jpg"
  startFrame={1}
  zeroPadding={false}
/>
```

### Example 3: Full-Width Hero Section

```jsx
<div className="w-full min-h-screen">
  <ScrollImageSequence
    imagePath="/assets/images/hero"
    totalFrames={300}
    imagePrefix="frame-"
    imageExtension="jpg"
    className="w-full"
  />
</div>
```

## Performance Optimization

### 1. Image Optimization
- Compress images before upload (target: 50-150KB each)
- Use JPG for photos, PNG only if transparency needed
- Keep resolution reasonable (1920px width max)

### 2. Lazy Loading Strategy
The component automatically:
- Preloads all images before showing animation
- Shows loading progress
- Uses canvas for efficient rendering
- Employs requestAnimationFrame for smooth updates

### 3. Production Build
Always build for production to enable Next.js optimizations:
```bash
npm run build
npm start
```

## Troubleshooting

### Images Not Loading
1. Check file paths match exactly (case-sensitive)
2. Verify images are in `public/` directory
3. Check browser console for 404 errors
4. Ensure image naming matches props

### Stuttering Animation
1. Reduce image file sizes
2. Check browser performance tab
3. Ensure images are fully loaded before scrolling
4. Consider reducing total frames

### Scroll Too Fast/Slow
Adjust `scrollMultiplier` prop:
- Default: 1
- Slower: 0.5 - 0.8
- Faster: 1.2 - 2

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS/Android)

## File Structure After Setup

```
public/
└── assets/
    └── images/
        ├── auriqua/
        │   ├── frame-0001.jpg
        │   ├── frame-0002.jpg
        │   └── ... (300 frames)
        ├── manifesta/
        │   └── ... (300 frames)
        ├── monarch/
        │   └── ... (300 frames)
        ├── astonia/
        │   └── ... (300 frames)
        └── arvion/
            └── ... (300 frames)

src/
├── components/
│   └── ScrollImageSequence.jsx
└── app/
    └── products/
        ├── auriqua/page.js (uses ScrollImageSequence)
        ├── manifesta/page.js (uses ScrollImageSequence)
        └── ... (other products)
```

## Next Steps

1. ✅ Assets folder created: `public/assets/images/`
2. ✅ Component created: `src/components/ScrollImageSequence.jsx`
3. ⏳ **YOUR TASK**: Add your 300+ images to appropriate folders
4. ⏳ **YOUR TASK**: Update product pages to use the component
5. ⏳ Test on development server
6. ⏳ Build and deploy to production

## Need Help?

- Check the component source code for detailed comments
- See `public/assets/images/README.md` for image preparation guide
- Test with a small number of frames first (10-20) before full sequence
