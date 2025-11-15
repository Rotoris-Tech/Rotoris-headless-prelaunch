const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = './public/assets/threed-scene';

async function convertToAvif(imagePath) {
  try {
    const parsedPath = path.parse(imagePath);
    const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.avif`);

    await sharp(imagePath)
      .avif({
        quality: 80,
        effort: 4,
        chromaSubsampling: '4:2:0'
      })
      .toFile(outputPath);

    console.log(`✓ Converted: ${path.basename(imagePath)} -> ${path.basename(outputPath)}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to convert ${imagePath}:`, error.message);
    return false;
  }
}

async function findAndConvertImages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const conversions = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const subConversions = await findAndConvertImages(fullPath);
      conversions.push(...subConversions);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        // Skip macOS resource fork files
        if (!entry.name.startsWith('._')) {
          conversions.push(convertToAvif(fullPath));
        }
      }
    }
  }

  return conversions;
}

async function main() {
  console.log('🔄 Starting AVIF conversion...\n');
  console.log(`Source directory: ${sourceDir}\n`);

  const startTime = Date.now();
  const conversions = await findAndConvertImages(sourceDir);
  const results = await Promise.all(conversions);

  const successful = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n✅ Conversion complete!`);
  console.log(`   Successful: ${successful}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Time: ${duration}s`);
}

main().catch(console.error);
