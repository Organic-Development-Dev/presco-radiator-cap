const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { execFile } = require('child_process');
const execFilePromise = promisify(execFile);

// Install these packages before running:
// npm install sharp imagemin imagemin-mozjpeg imagemin-pngquant imagemin-webp imagemin-avif

async function optimizeImage(inputPath, outputPath, options = {}) {
  const sharp = require('sharp');
  const imagemin = require('imagemin');
  const imageminMozjpeg = require('imagemin-mozjpeg');
  const imageminPngquant = require('imagemin-pngquant');
  const imageminWebp = require('imagemin-webp');
  const imageminAvif = require('imagemin-avif');

  const { width, height, quality = 80, format } = options;
  
  // Process with sharp for resizing
  let sharpInstance = sharp(inputPath);
  
  // Resize if dimensions provided
  if (width || height) {
    sharpInstance = sharpInstance.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }
  
  // Convert format if specified
  if (format) {
    sharpInstance = sharpInstance.toFormat(format);
  }
  
  // Save the processed image
  await sharpInstance.toFile(outputPath);
  
  // Further optimize with imagemin
  const plugins = [];
  const ext = path.extname(outputPath).toLowerCase();
  
  if (ext === '.jpg' || ext === '.jpeg') {
    plugins.push(imageminMozjpeg({ quality }));
  } else if (ext === '.png') {
    plugins.push(imageminPngquant({ quality: [quality / 100, Math.min(1, (quality + 10) / 100)] }));
  } else if (ext === '.webp') {
    plugins.push(imageminWebp({ quality }));
  } else if (ext === '.avif') {
    plugins.push(imageminAvif({ quality }));
  }
  
  if (plugins.length) {
    await imagemin([outputPath], {
      destination: path.dirname(outputPath),
      plugins
    });
  }
  
  console.log(`Optimized: ${inputPath} → ${outputPath}`);
}

async function convertToWebP(inputPath) {
  const outputPath = inputPath.replace(/\.(jpe?g|png)$/i, '.webp');
  
  // Don't convert if WebP already exists and is newer
  if (fs.existsSync(outputPath)) {
    const inputStat = fs.statSync(inputPath);
    const outputStat = fs.statSync(outputPath);
    if (outputStat.mtime > inputStat.mtime) {
      console.log(`Skipping ${inputPath} (WebP already exists and is newer)`);
      return;
    }
  }
  
  await optimizeImage(inputPath, outputPath, { format: 'webp', quality: 85 });
}

async function convertToAvif(inputPath) {
  const outputPath = inputPath.replace(/\.(jpe?g|png)$/i, '.avif');
  
  // Don't convert if AVIF already exists and is newer
  if (fs.existsSync(outputPath)) {
    const inputStat = fs.statSync(inputPath);
    const outputStat = fs.statSync(outputPath);
    if (outputStat.mtime > inputStat.mtime) {
      console.log(`Skipping ${inputPath} (AVIF already exists and is newer)`);
      return;
    }
  }
  
  try {
    await optimizeImage(inputPath, outputPath, { format: 'avif', quality: 75 });
  } catch (error) {
    console.error(`Error converting ${inputPath} to AVIF:`, error.message);
  }
}

async function processAllImages() {
  const imageDir = path.join(__dirname, '../public/img');
  
  // Get all jpg, jpeg, and png files
  const files = fs.readdirSync(imageDir)
    .filter(file => /\.(jpe?g|png)$/i.test(file))
    .map(file => path.join(imageDir, file));
  
  // Optimize original files and create WebP versions in parallel
  await Promise.all([
    ...files.map(file => optimizeImage(file, file)),
    ...files.map(file => convertToWebP(file)),
    ...files.map(file => convertToAvif(file))
  ]);
  
  console.log('All images optimized successfully!');
}

processAllImages().catch(console.error);