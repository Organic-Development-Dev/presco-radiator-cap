const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

console.log('Optimizing LCP image...');

// Path to banner images
const bannerImages = [
  {
    source: '../../public/img/banner1.webp',
    target: '../../public/img/optimized/banner1-lcp.webp',
    width: 1200,
    priority: true
  },
  {
    source: '../../public/img/banner2.webp',
    target: '../../public/img/optimized/banner2-lcp.webp',
    width: 1200,
    priority: false
  },
  {
    source: '../../public/img/banner3.webp',
    target: '../../public/img/optimized/banner3-lcp.webp',
    width: 1200,
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
          withoutEnlargement: true
        })
        .webp({ 
          quality: quality,  // Control quality based on priority
          effort: effort,    // Lower effort = faster encoding
          reductionEffort: 3 // Medium reduction effort for good balance
        })
        .toFile(targetPath);
      
      console.log(`✓ Optimized ${path.basename(sourcePath)} to ${path.basename(targetPath)}`);
      
      // Create a blurDataURL placeholder for the first image
      if (image.priority) {
        const placeholderPath = path.resolve(__dirname, image.target.replace('.webp', '-placeholder.webp'));
        
        // Create a tiny placeholder for blur effect
        await sharp(sourcePath)
          .resize({ 
            width: 20, 
            height: 10
          })
          .webp({ 
            quality: 20
          })
          .toFile(placeholderPath);
        
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