import { access, mkdir, rm } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve(process.cwd(), 'public');
const outputRoot = path.join(root, 'optimized');

const assets = [
  { file: 'profile-pic.png', width: 560, quality: 78 },
  { file: 'Channel picture.jpg', width: 192, quality: 78 },
  { file: 'TFO thumbnail.png', width: 960, quality: 78 },
  { file: 'KYNETIK thumbnail.png', width: 960, quality: 78 },
  { file: 'GraspXR thumbnail.png', width: 768, quality: 78 },
  { file: 'VR Villas thumbnail.png', width: 1024, quality: 78 },
  { file: '3DS Max logo.png', width: 128, quality: 80 },
  { file: 'Blender logo.png', width: 128, quality: 80 },
  { file: 'Photoshoppng.png', width: 128, quality: 80 },
  { file: 'Substance painter logo.png', width: 128, quality: 80 },
  { file: 'Topaz Gigapixel AI logopng', width: 128, quality: 80 },
  { file: 'Antigravitypng.png', width: 128, quality: 80 },
  { file: 'Codex logo.png', width: 128, quality: 80 },
  { file: 'Unreal Engine 5.png', width: 128, quality: 80 },
];

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

await mkdir(outputRoot, { recursive: true });

for (const asset of assets) {
  const sourceCandidates = [
    path.join(root, asset.file),
    path.join(root, asset.file.match(/\.(png|jpe?g|webp)$/i) ? asset.file.replace(/\.(png|jpe?g)$/i, '.webp') : `${asset.file}.webp`),
  ];
  let sourcePath = null;
  for (const candidate of sourceCandidates) {
    if (await fileExists(candidate)) {
      sourcePath = candidate;
      break;
    }
  }
  const outputName = asset.file.match(/\.(png|jpe?g|webp)$/i) ? asset.file.replace(/\.(png|jpe?g|webp)$/i, '.webp') : `${asset.file}.webp`;
  const outputPath = path.join(outputRoot, outputName);

  if (!sourcePath) {
    console.warn(`Skipping missing asset: ${asset.file}`);
    continue;
  }

  await sharp(sourcePath)
    .resize({ width: asset.width, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: asset.quality, effort: 6 })
    .toFile(outputPath);

  console.log(`Optimized ${asset.file} -> ${path.basename(outputPath)}`);
}

await rm(path.join(root, 'depth-map_depthmap.png'), { force: true });
console.log('Removed unused depth map asset.');
