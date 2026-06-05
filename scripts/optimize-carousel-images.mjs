import { mkdir, readdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const sourceRoot = path.resolve(process.cwd(), 'source-images', 'Carousal images');
const outputRoot = path.resolve(process.cwd(), 'public', 'carousel');
const thumbRoot = path.join(outputRoot, 'thumbs');
const fullRoot = path.join(outputRoot, 'full');

await mkdir(thumbRoot, { recursive: true });
await mkdir(fullRoot, { recursive: true });

const images = (await readdir(sourceRoot))
  .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
  .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));

for (const file of images) {
  const id = path.parse(file).name;
  const source = path.join(sourceRoot, file);

  await sharp(source)
    .rotate()
    .resize({ width: 760, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile(path.join(thumbRoot, `${id}.webp`));

  await sharp(source)
    .rotate()
    .resize({ width: 1800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88, effort: 6 })
    .toFile(path.join(fullRoot, `${id}.webp`));

  console.log(`Optimized carousel image ${id}`);
}
