const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

console.log('Optimizing LCP image...');

// Path to banner images with optimized sizes
// The first image is the most important for LCP
const bannerImages = [
  {
    source: '../../public/img/banner1.webp',
    target: '../../public/img/optimized/banner1-lcp.webp',
    // Create a smaller image for faster loading on first paint
    // Width is constrained for better initial load time
    width: 960, // Optimal size for most desktop viewports while loading fast
    priority: true
  },
  // Optimized size for smaller screens
  {
    source: '../../public/img/banner1.webp',
    target: '../../public/img/optimized/banner1-lcp-sm.webp',
    width: 640, // For mobile devices
    priority: true
  },
  {
    source: '../../public/img/banner2.webp',
    target: '../../public/img/optimized/banner2-lcp.webp',
    width: 960,
    priority: false
  },
  {
    source: '../../public/img/banner3.webp',
    target: '../../public/img/optimized/banner3-lcp.webp',
    width: 960,
    priority: false
  }
];

// Create optimized directory if it doesn't exist
const optimizedDir = path.resolve(__dirname, '../../public/img/optimized');
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Optimize all banner images
async function optimizeImages() {
  try {
    for (const image of bannerImages) {
      const sourcePath = path.resolve(__dirname, image.source);
      const targetPath = path.resolve(__dirname, image.target);
      
      // Different optimization settings based on priority
      // First banner (LCP) gets higher quality but still optimized
      const quality = image.priority ? 75 : 65;
      const effort = image.priority ? 4 : 2;
      
      console.log(`Optimizing ${sourcePath}...`);
      
      await sharp(sourcePath)
        .resize({ 
          width: image.width,
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3, // Higher quality downsampling
          fit: 'cover'
        })
        .webp({ 
          quality: quality,      // Control quality based on priority
          effort: effort,        // Lower effort = faster encoding
          reductionEffort: 4,    // Higher reduction effort for better compression
          lossless: false,       // Lossy compression for smaller file size
          nearLossless: false,   // Lossy compression for smaller file size
          smartSubsample: true,  // Intelligent chroma subsampling
          mixed: true            // Allow mixed compression modes for better quality/size
        })
        .toFile(targetPath);
      
      console.log(`✓ Optimized ${path.basename(sourcePath)} to ${path.basename(targetPath)}`);
      
      // Create a blurDataURL placeholder for the first image
      if (image.priority) {
        const placeholderPath = path.resolve(__dirname, image.target.replace('.webp', '-placeholder.webp'));
        
        // Create an ultra-tiny placeholder for blur effect (optimized for inline Base64)
        await sharp(sourcePath)
          .resize({ 
            width: 16, 
            height: 8,
            fit: 'cover',
            kernel: sharp.kernel.nearest // Use nearest neighbor for tiny image
          })
          .webp({ 
            quality: 20,
            reductionEffort: 6, // Maximum compression for tiny placeholder
            smartSubsample: true,
            mixed: true
          })
          .toFile(placeholderPath);
          
        // Generate and print base64 data for easier embedding
        const placeholderBuffer = await sharp(placeholderPath).toBuffer();
        const base64Placeholder = `data:image/webp;base64,${placeholderBuffer.toString('base64')}`;
        console.log(`✓ Generated base64 placeholder (${placeholderBuffer.length} bytes)`);
        // Uncomment to log base64 string: console.log(base64Placeholder);
        
        console.log(`✓ Created blur placeholder for ${path.basename(sourcePath)}`);
      }
    }
    
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

// Run the optimization
optimizeImages();