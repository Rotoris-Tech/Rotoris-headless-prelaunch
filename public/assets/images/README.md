# Image Sequence Setup Guide

## Directory Structure

Place your image sequences in this directory. Each product can have its own subfolder.

### Example Structure:
```
public/assets/images/
├── auriqua/
│   ├── frame-0001.jpg
│   ├── frame-0002.jpg
│   ├── frame-0003.jpg
│   └── ... (300+ frames)
├── manifesta/
│   ├── frame-0001.jpg
│   └── ...
└── README.md (this file)
```

## Image Naming Convention

### Option 1: Zero-Padded Numbers (Recommended)
```
frame-0001.jpg
frame-0002.jpg
frame-0003.jpg
...
frame-0300.jpg
```

### Option 2: Simple Numbers
```
frame-1.jpg
frame-2.jpg
frame-3.jpg
...
frame-300.jpg
```

## Image Requirements

### Format
- **Recommended**: JPG for best balance of quality and file size
- **Alternative**: PNG for transparency (larger files)
- **Not recommended**: GIF (limited colors)

### Resolution
- **Recommended**: 1920x1080 or 2560x1440
- Keep aspect ratio consistent across all frames
- Higher resolution = better quality but larger files

### File Size
- **Target**: 50-150KB per image (after compression)
- **Maximum**: 300KB per image
- Use image compression tools before uploading

### Optimization Tips
1. **Use TinyPNG or similar** to compress images
2. **Keep dimensions reasonable** - 1920px width is usually sufficient
3. **Maintain consistent quality** across all frames
4. **Test loading time** with actual assets

## Total File Size Calculation

With 300 images at ~100KB each:
- Total: ~30MB per sequence
- 5 sequences: ~150MB total

**Important**: Users will download these as they scroll, so optimize well!

## Recommended Tools

### For Creating Sequences
- Adobe After Effects
- Blender
- Cinema 4D
- DaVinci Resolve

### For Optimizing
- TinyPNG (tinypng.com)
- ImageOptim (Mac)
- Squoosh (squoosh.app)

### For Batch Renaming
- Bulk Rename Utility (Windows)
- Renamer (Mac)
- Command line: `for i in *.jpg; do mv "$i" "frame-$(printf '%04d' ${i%.jpg}).jpg"; done`

## Quick Start

1. Export your animation as image sequence
2. Name files with zero-padded numbers
3. Compress all images
4. Place in appropriate subfolder
5. Update component props to match your naming convention
