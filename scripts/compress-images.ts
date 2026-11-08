import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// -------------------------------------------------------------------
// Configuration – adjust to your needs
// -------------------------------------------------------------------
const SOURCE_DIR = path.resolve(__dirname, '..', 'public', 'assets'); // folder with original images
const DEST_DIR = path.resolve(__dirname, '..', 'public', 'assets-compressed'); // temporary output folder
const QUALITY = 80; // JPEG/PNG/WebP quality (0‑100)
const AVIF_QUALITY = 50; // AVIF quality (0‑100)
// -------------------------------------------------------------------

async function compress() {
  console.log('🔧 Compressing images…');
  // Ensure destination exists
  fs.mkdirSync(DEST_DIR, { recursive: true });

  const files = fs.readdirSync(SOURCE_DIR).filter(file => /\.(jpe?g|png)$/i.test(file));

  for (const file of files) {
    const inputPath = path.join(SOURCE_DIR, file);
    const parsed = path.parse(file);
    const ext = parsed.ext.toLowerCase();

    // Optimize JPEG & PNG (same format)
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(inputPath)
        .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
        .toFile(path.join(DEST_DIR, file));
    } else if (ext === '.png') {
      await sharp(inputPath)
        .png({ quality: QUALITY, compressionLevel: 9 })
        .toFile(path.join(DEST_DIR, file));
    }

    // Convert to WebP (lossy)
    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(path.join(DEST_DIR, `${parsed.name}.webp`));

    // Convert to AVIF (lossy)
    await sharp(inputPath)
      .avif({ quality: AVIF_QUALITY })
      .toFile(path.join(DEST_DIR, `${parsed.name}.avif`));
  }

  console.log('✅ Compression complete. Files written to:', DEST_DIR);

  // ---- Post‑compression cleanup ----
  // 1️⃣ Delete original uncompressed JPEG/PNG assets
  console.log('🗑️ Removing original uncompressed assets…');
  const originalFiles = fs.readdirSync(SOURCE_DIR);
  for (const file of originalFiles) {
    if (/\.(jpe?g|png)$/i.test(file)) {
      fs.unlinkSync(path.join(SOURCE_DIR, file));
    }
  }

  // 2️⃣ Move compressed files back into the original assets folder
  console.log('📦 Moving compressed assets into public/assets…');
  const compressedFiles = fs.readdirSync(DEST_DIR);
  for (const file of compressedFiles) {
    const srcPath = path.join(DEST_DIR, file);
    const destPath = path.join(SOURCE_DIR, file);
    fs.renameSync(srcPath, destPath);
  }

  // 3️⃣ Remove the temporary folder
  fs.rmSync(DEST_DIR, { recursive: true, force: true });

  console.log('🎉 Cleanup finished. All assets are now compressed in public/assets.');
}

if (require.main === module) {
  compress().catch(err => {
    console.error('❌ Compression failed:', err);
    process.exit(1);
  });
}
