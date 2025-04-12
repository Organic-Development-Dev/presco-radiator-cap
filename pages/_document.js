import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Feature detection for modern optimizations
  const featureDetection = `
    (function() {
      // Create feature detection flags for modern browser capabilities
      window.__features = {
        supportsWebP: false,
        supportsIntersectionObserver: 'IntersectionObserver' in window,
        supportsModules: 'noModule' in document.createElement('script'),
        supportsAvif: false,
        supportsFetchPriority: 'fetchPriority' in document.createElement('img')
      };
      
      // Test for WebP support
      var webP = new Image();
      webP.onload = function() { window.__features.supportsWebP = (webP.width === 1); };
      webP.onerror = function() { window.__features.supportsWebP = false; };
      webP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
      
      // Test for AVIF support
      var avif = new Image();
      avif.onload = function() { window.__features.supportsAvif = (avif.width === 1); };
      avif.onerror = function() { window.__features.supportsAvif = false; };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      
      // Preload the LCP image based on best format support
      var preferredFormat = window.__features.supportsAvif ? 'avif' : 
                          window.__features.supportsWebP ? 'webp' : 'png';
      
      // Mark start time for performance measurement
      if (window.performance && window.performance.mark) {
        window.performance.mark('app-init');
      }
      
      // Preload LCP image immediately 
      if (window.__features.supportsFetchPriority) {
        var preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = '/img/optimized/banner1-lcp.webp';
        preloadLink.type = 'image/webp';
        preloadLink.fetchPriority = 'high';
        document.head.appendChild(preloadLink);
      }
    })();
  `;

  // LCP optimization - eager load optimized banner image
  const preloadBanner = `
    window.addEventListener('load', function() {
      // Mark page load complete for performance measurement
      if (window.performance && window.performance.mark) {
        window.performance.mark('page-loaded');
        // Measure and report to analytics if needed
        window.performance.measure('page-load-time', 'app-init', 'page-loaded');
      }

      // Preload the rest of the banner images after page load
      ['/img/banner2.webp', '/img/banner3.webp'].forEach(function(src) {
        var img = new Image();
        img.src = src;
      });
    });
  `;

  return (
    <Html lang='en'>
      <Head>
        {/* Preconnect to critical origins as early as possible */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin="anonymous" />
        
        {/* Feature detection script - execute as early as possible */}
        <script dangerouslySetInnerHTML={{ __html: featureDetection }} />
        
        {/* Load critical fonts first, other weights later - using the display=swap pattern */}
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
          rel='stylesheet'
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
            rel='stylesheet'
          />
        </noscript>
        
        {/* Non-critical font weights loaded with low priority */}
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600&display=optional'
          rel='stylesheet' 
          media="print"
          onLoad="this.media='all'"
          fetchpriority="low"
        />
        
        {/* Core web vitals optimization - preload critical resources with highest priority */}
        <link 
          rel="preload" 
          as="image" 
          href="/img/optimized/banner1-lcp.webp" 
          type="image/webp" 
          media="(min-width: 641px)"
          fetchpriority="high" 
        />
        <link 
          rel="preload" 
          as="image" 
          href="/img/optimized/banner1-lcp-sm.webp" 
          type="image/webp"
          media="(max-width: 640px)" 
          fetchpriority="high" 
        />
        <link rel="preload" as="image" href="/img/logo.png" fetchpriority="high" />
        
        {/* Add resource hints for domains we'll connect to */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <link rel="dns-prefetch" href="https://www.presco-radiator-caps.com" />
                
        {/* Inline critical CSS and LCP image for faster render */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical CSS for initial render - keep minimal */
          :root {
            --primary-color: #A11A36;
            --secondary-color: #4C4C4C;
          }
          body {
            font-family: 'Montserrat', sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          /* Critical styles for banner with inlined image */
          .banner-placeholder {
            position: relative;
            width: 100%;
            padding-top: 30%;
            background-color: #f5f5f5;
            overflow: hidden;
            /* Inline the LCP image directly in CSS for instant rendering */
            background-image: url('data:image/webp;base64,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');
            background-size: cover;
            background-position: center;
          }
          .banner-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
          }
          .banner-image.active {
            opacity: 1;
          }
          /* Initial banner dots for visual feedback */
          .banner-dots {
            position: absolute;
            bottom: 16px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            z-index: 10;
          }
          .banner-dot {
            width: 10px;
            height: 10px;
            margin: 0 5px;
            border-radius: 50%;
            background-color: rgba(255,255,255,0.5);
            cursor: pointer;
            border: none;
          }
          .banner-dot.active {
            background-color: #A11A36;
          }
          /* Hide content flash while loading */
          .js-banner-loading {
            opacity: 0.01;
            transition: opacity 0.5s ease-in-out;
          }
          .js-banner-loaded {
            opacity: 1;
          }
        `}} />
        
        {/* Preload script */}
        <script dangerouslySetInnerHTML={{ __html: preloadBanner }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
