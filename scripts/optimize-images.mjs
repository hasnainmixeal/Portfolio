import { access, rm } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve(process.cwd(), 'public');

const assets = [
  { file: 'profile-pic.png', width: 720, quality: 84 },
  { file: 'Channel picture.jpg', width: 320, quality: 82 },
  { file: 'TFO thumbnail.png', width: 1200, quality: 82 },
  { file: 'KYNETIK thumbnail.png', width: 1200, quality: 82 },
  { file: 'GraspXR thumbnail.png', width: 900, quality: 82 },
  { file: 'VR Villas thumbnail.png', width: 1280, quality: 82 },
  { file: '3DS Max logo.png', width: 256, quality: 82 },
  { file: 'Blender logo.png', width: 256, quality: 82 },
  { file: 'Photoshoppng.png', width: 256, quality: 82 },
  { file: 'Substance painter logo.png', width: 256, quality: 82 },
  { file: 'Topaz Gigapixel AI logopng', width: 256, quality: 82 },
  { file: 'Antigravitypng.png', width: 256, quality: 82 },
  { file: 'Codex logo.png', width: 256, quality: 82 },
  { file: 'Unreal Engine 5.png', width: 256, quality: 82 },
];

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

for (const asset of assets) {
  const sourcePath = path.join(root, asset.file);
  const outputName = asset.file.match(/\.(png|jpe?g)$/i) ? asset.file.replace(/\.(png|jpe?g)$/i, '.webp') : `${asset.file}.webp`;
  const outputPath = path.join(root, outputName);

  if (!(await fileExists(sourcePath))) {
    console.warn(`Skipping missing asset: ${asset.file}`);
    continue;
  }

  await sharp(sourcePath)
    .resize({ width: asset.width, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: asset.quality, effort: 6 })
    .toFile(outputPath);

  await rm(sourcePath, { force: true });
  console.log(`Optimized ${asset.file} -> ${path.basename(outputPath)}`);
}

await rm(path.join(root, 'depth-map_depthmap.png'), { force: true });
console.log('Removed unused depth map asset.');
