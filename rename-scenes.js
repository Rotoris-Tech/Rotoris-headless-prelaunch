const fs = require('fs');
const path = require('path');

const sourceDir = './public/assets/threed-scene/Ascendus opening scene';

function renameSequentially() {
  console.log('🔄 Starting sequential rename...\n');

  // Read all AVIF files
  const files = fs.readdirSync(sourceDir)
    .filter(file => file.endsWith('.avif'))
    .sort((a, b) => {
      // Extract numbers from filenames for proper sorting
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

  console.log(`Found ${files.length} AVIF files\n`);

  // Rename files to temporary names first to avoid conflicts
  const tempRenames = [];
  files.forEach((file, index) => {
    const oldPath = path.join(sourceDir, file);
    const tempName = `temp_${index.toString().padStart(3, '0')}.avif`;
    const tempPath = path.join(sourceDir, tempName);

    fs.renameSync(oldPath, tempPath);
    tempRenames.push({ tempPath, index });
  });

  console.log('✓ Temporary rename complete\n');

  // Rename from temporary to final names
  tempRenames.forEach(({ tempPath, index }) => {
    const finalName = `scene-1-${(index + 1).toString().padStart(3, '0')}.avif`;
    const finalPath = path.join(sourceDir, finalName);

    fs.renameSync(tempPath, finalPath);

    if ((index + 1) % 50 === 0 || index === tempRenames.length - 1) {
      console.log(`✓ Renamed ${index + 1}/${tempRenames.length} files...`);
    }
  });

  console.log(`\n✅ Rename complete!`);
  console.log(`   All ${files.length} files renamed to scene-1-001 through scene-1-${files.length.toString().padStart(3, '0')}`);

  // Show first and last few filenames
  const finalFiles = fs.readdirSync(sourceDir)
    .filter(file => file.endsWith('.avif'))
    .sort();

  console.log('\nFirst 5 files:');
  finalFiles.slice(0, 5).forEach(file => console.log(`  - ${file}`));
  console.log('\nLast 5 files:');
  finalFiles.slice(-5).forEach(file => console.log(`  - ${file}`));
}

renameSequentially();
