import fs from 'fs';
import path from 'path';
import imagemin from 'imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import webp from 'imagemin-webp';
import avif from 'imagemin-avif';

// -------------------------------------------------------------------
// Configuration – adjust to your needs
// -------------------------------------------------------------------
const SOURCE_DIR = path.resolve(__dirname, '..', 'public', 'assets'); // folder with original images
const DEST_DIR = path.resolve(__dirname, '..', 'public', 'assets-compressed'); // temporary output folder
const QUALITY = 80; // JPEG/PNG quality (0‑100)
const AVIF_QUALITY = 50; // AVIF quality (0‑100)
// -------------------------------------------------------------------

async function compress() {
  console.log('🔧 Compressing images…');
  // Ensure destination exists
  fs.mkdirSync(DEST_DIR, { recursive: true });

  // Optimize JPEG & PNG (same format)
  await imagemin([`${SOURCE_DIR}/*.{jpg,jpeg,png}`], {
    destination: DEST_DIR,
    plugins: [
      mozjpeg({ quality: QUALITY, progressive: true }),
      pngquant({ quality: [0.6, 0.8] })
    ]
  });

  // Convert to WebP (lossy)
  await imagemin([`${SOURCE_DIR}/*.{jpg,jpeg,png}`], {
    destination: DEST_DIR,
    plugins: [webp({ quality: QUALITY })]
  });

  // Convert to AVIF (lossy)
  await imagemin([`${SOURCE_DIR}/*.{jpg,jpeg,png}`], {
    destination: DEST_DIR,
    plugins: [avif({ quality: AVIF_QUALITY })]
  });

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
  fs.rmdirSync(DEST_DIR, { recursive: true });

  console.log('🎉 Cleanup finished. All assets are now compressed in public/assets.');
}

if (require.main === module) {
  compress().catch(err => {
    console.error('❌ Compression failed:', err);
    process.exit(1);
  });
}
